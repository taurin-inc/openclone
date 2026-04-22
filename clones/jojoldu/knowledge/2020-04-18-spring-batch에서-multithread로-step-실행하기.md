---
topic: "Spring Batch에서 Multithread로 Step 실행하기"
source_type: other
source_url: "https://jojoldu.tistory.com/493"
authorship: self
published_at: 2020-04-18
---
# Spring Batch에서 Multithread로 Step 실행하기

**Author:** 향로 (기억보단 기록을)
**Date:** 2020. 4. 18.

일반적으로 Spring Batch는 단일 쓰레드에서 실행됩니다.

즉, 모든 것이 순차적으로 실행되는 것을 의미하는데요.

Spring Batch에서는 이를 병렬로 실행할 수 있는 방법을 여러가지 지원합니다.

이번 시간에는 그 중 하나인 멀티스레드로 Step을 실행하는 방법에 대해서 알아보겠습니다.

## 1. 소개

Spring Batch의 멀티쓰레드 Step은 Spring의 `TaskExecutor`를 이용하여 **각 쓰레드가 Chunk 단위로 실행되게** 하는 방식입니다.

> Spring Batch Chunk에 대한 내용은 [이전 포스팅](https://jojoldu.tistory.com/331) 에 소개되어있습니다.

![intro](https://t1.daumcdn.net/cfile/tistory/9975AC495E9CEA2F26)

여기서 어떤 `TaskExecutor` 를 선택하냐에 따라 모든 Chunk 단위별로 쓰레드가 계속 새로 생성될 수도 있으며 (`SimpleAsyncTaskExecutor`) 혹은 쓰레드풀 내에서 지정된 갯수의 쓰레드만을 재사용하면서 실행 될 수도 있습니다. (`ThreadPoolTaskExecutor`)

Spring Batch에서 멀티쓰레드 환경을 구성하기 위해서 가장 먼저 해야할 일은 사용하고자 하는 **Reader와 Writer가 멀티쓰레드를 지원하는지** 확인하는 것 입니다.

![javadoc](https://t1.daumcdn.net/cfile/tistory/994DDA365E9CEA2F22)

(`JpaPagingItemReader`의 Javadoc)

각 Reader와 Writer의 Javadoc에 항상 저 **thread-safe** 문구가 있는지 확인해보셔야 합니다.

만약 없는 경우엔 thread-safe가 지원되는 Reader 와 Writer를 선택해주셔야하며, 꼭 그 Reader를 써야한다면 [SynchronizedItemStreamReader](https://docs.spring.io/spring-batch/docs/current/api/org/springframework/batch/item/support/SynchronizedItemStreamReader.html) 등을 이용해 **thread-safe** 로 변환해서 사용해볼 수 있습니다.

그리고 또 하나 주의할 것은 멀티 쓰레드로 각 Chunk들이 개별로 진행되다보니 Spring Batch의 큰 장점중 하나인 **실패 지점에서 재시작하는 것은 불가능** 합니다.

이유는 간단합니다.

단일 쓰레드로 순차적으로 실행할때는 10번째 Chunk가 실패한다면 **9번째까지의 Chunk가 성공했음이 보장** 되지만, 멀티쓰레드의 경우 1~10개의 Chunk가 동시에 실행되다보니 10번째 Chunk가 실패했다고 해서 **1~9개까지의 Chunk가 다 성공된 상태임이 보장되지 않습니다**.

그래서 일반적으로는 ItemReader의 `saveState` 옵션을 `false` 로 설정하고 사용합니다.

자 그럼 실제로 하나씩 코드를 작성하면서 실습해보겠습니다.

## 2. PagingItemReader 예제

가장 먼저 알아볼 것은 PagingItemReader를 사용할때 입니다.

이때는 걱정할 게 없습니다.

PagingItemReader는 **Thread Safe** 하기 때문입니다.

> 멀티 쓰레드로 실행할 배치가 필요하시다면 웬만하면 PagingItemReader로 사용하길 추천드립니다.

예제 코드는 JpaPagingItemReader로 작성하였습니다.

```java
@Slf4j
@RequiredArgsConstructor
@Configuration
public class MultiThreadPagingConfiguration {
    public static final String JOB_NAME = "multiThreadPagingBatch";

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final EntityManagerFactory entityManagerFactory;

    private int chunkSize;

    @Value("${chunkSize:1000}")
    public void setChunkSize(int chunkSize) {
        this.chunkSize = chunkSize;
    }

    private int poolSize;

    @Value("${poolSize:10}") // (1)
    public void setPoolSize(int poolSize) {
        this.poolSize = poolSize;
    }

    @Bean(name = JOB_NAME+"taskPool")
    public TaskExecutor executor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor(); // (2)
        executor.setCorePoolSize(poolSize);
        executor.setMaxPoolSize(poolSize);
        executor.setThreadNamePrefix("multi-thread-");
        executor.setWaitForTasksToCompleteOnShutdown(Boolean.TRUE);
        executor.initialize();
        return executor;
    }

    @Bean(name = JOB_NAME)
    public Job job() {
        return jobBuilderFactory.get(JOB_NAME)
                .start(step())
                .preventRestart()
                .build();
    }

    @Bean(name = JOB_NAME +"_step")
    @JobScope
    public Step step() {
        return stepBuilderFactory.get(JOB_NAME +"_step")
                .<Product, ProductBackup>chunk(chunkSize)
                .reader(reader(null))
                .processor(processor())
                .writer(writer())
                .taskExecutor(executor()) // (2)
                .throttleLimit(poolSize) // (3)
                .build();
    }

    @Bean(name = JOB_NAME +"_reader")
    @StepScope
    public JpaPagingItemReader<Product> reader(@Value("#{jobParameters[createDate]}") String createDate) {

        Map<String, Object> params = new HashMap<>();
        params.put("createDate", LocalDate.parse(createDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")));

        return new JpaPagingItemReaderBuilder<Product>()
                .name(JOB_NAME +"_reader")
                .entityManagerFactory(entityManagerFactory)
                .pageSize(chunkSize)
                .queryString("SELECT p FROM Product p WHERE p.createDate =:createDate")
                .parameterValues(params)
                .saveState(false) // (4)
                .build();
    }

    private ItemProcessor<Product, ProductBackup> processor() {
        return ProductBackup::new;
    }

    @Bean(name = JOB_NAME +"_writer")
    @StepScope
    public JpaItemWriter<ProductBackup> writer() {
        return new JpaItemWriterBuilder<ProductBackup>()
                .entityManagerFactory(entityManagerFactory)
                .build();
    }
}
```

(1) `@Value("${poolSize:10}")`
- 생성할 쓰레드 풀의 쓰레드 수를 환경변수로 받아서 사용합니다.
- `${poolSize:10}` 에서 10은 앞에 선언된 변수 `poolSize`가 없을 경우 10을 사용한다는 기본값으로 보시면 됩니다.
- 배치 실행시 PoolSize를 조정하는 이유는 **실행 환경에 맞게 유동적으로 쓰레드풀을 관리하기 위함** 입니다.
- Field가 아닌 Setter로 받는 이유는 Spring Context가 없이 테스트 코드를 작성할때 PoolSize, ChunkSize등을 입력할 방법이 없기 때문입니다.

(2) `ThreadPoolTaskExecutor`
- 쓰레드 풀을 이용한 쓰레드 관리 방식입니다.
- 옵션: `corePoolSize` (Pool의 기본 사이즈), `maxPoolSize` (Pool의 최대 사이즈)
- 이외에도 `SimpleAsyncTaskExecutor` 가 있는데, 이는 매 요청시마다 쓰레드를 생성하므로 운영 환경에선 잘 사용하진 않습니다.

(3) `throttleLimit(poolSize)`
- 기본값은 **4** 입니다.
- 생성된 쓰레드 중 몇개를 실제 작업에 사용할지를 결정합니다.
- 일반적으로 `corePoolSize`, `maximumPoolSize`, `throttleLimit` 를 모두 같은 값으로 맞춥니다.

(4) `.saveState(false)`
- 멀티쓰레드 환경에서 사용할 경우 필수적으로 사용해야할 옵션입니다.
- Reader 가 실패한 지점을 저장하지 못하게해, 다음 실행시에도 무조건 처음부터 다시 읽도록 합니다.

### 테스트 코드

```java
@ExtendWith(SpringExtension.class)
@SpringBatchTest
@SpringBootTest(classes={MultiThreadPagingConfiguration.class, TestBatchConfig.class})
@TestPropertySource(properties = {"chunkSize=1", "poolSize=2"}) // (1)
public class MultiThreadPagingConfigurationTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductBackupRepository productBackupRepository;

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @AfterEach
    void after() {
        productRepository.deleteAll();
        productBackupRepository.deleteAll();
    }

    @Test
    public void 페이징_분산처리_된다() throws Exception {
        //given
        LocalDate createDate = LocalDate.of(2020,4,13);
        ProductStatus status = ProductStatus.APPROVE;
        long price = 1000L;
        for (int i = 0; i < 10; i++) {
            productRepository.save(Product.builder()
                    .price(i * price)
                    .createDate(createDate)
                    .status(status)
                    .build());
        }

        JobParameters jobParameters = new JobParametersBuilder()
                .addString("createDate", createDate.toString())
                .addString("status", status.name())
                .toJobParameters();
        //when
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters);

        //then
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        List<ProductBackup> backups = productBackupRepository.findAll();
        backups.sort(Comparator.comparingLong(ProductBackup::getPrice));

        assertThat(backups).hasSize(10);
        assertThat(backups.get(0).getPrice()).isEqualTo(0L);
        assertThat(backups.get(9).getPrice()).isEqualTo(9000L);
    }
}
```

(1) `properties = {"chunkSize=1", "poolSize=2"}`
- 10개의 데이터를 처리할때 2개의 쓰레드가 병렬로 처리하는지 확인하기 위한 설정입니다.

실행 시 2개의 쓰레드가 각자 페이지를 Read하고 Write 하는것을 확인할 수 있습니다.

## 3. CursorItemReader

JdbcCursorItemReader를 비롯하여 JDBC ResultSet를 사용하여 데이터를 읽는 CursorItemReader는 Thread Safe하지 않습니다.

이와 같이 Thread Safe 하지 않는 Reader들을 Thread Safe하게 변경하기 위해서는 데이터를 읽는 `read()`에 `synchronized` 를 걸어야만 합니다.

다만 이렇게 하게 되면 Reader는 순차적으로 데이터를 읽게 되지만, **Processor/Writer는 멀티 쓰레드로** 작동이 됩니다. 배치 과정에서는 보통 Write 단계에서 더 많은 자원이 소모되므로 이 정도로도 충분한 성능 향상을 꾀할 수 있습니다.

가장 쉬운 방법은 **Spring Batch 4.0부터 추가된 SynchronizedItemStreamReader로 Wrapping 하는 것** 입니다.

### 3-1. Not Thread Safety 코드 (문제 상황)

멀티쓰레드 환경에서 바로 `JdbcCursorItemReader`를 사용할 경우, 여러 쓰레드가 동일한 데이터를 중복해서 읽거나 건너뛰는 현상이 발생하여 결과 데이터 정합성이 깨지게 됩니다.

### 3-3. Thread Safety 코드 (해결책)

Reader 영역을 `SynchronizedItemStreamReader`로 감싸기만 하면 됩니다.

```java
@Bean(name = JOB_NAME +"_reader")
@StepScope
public SynchronizedItemStreamReader<Product> reader(@Value("#{jobParameters[createDate]}") String createDate) {
    String sql = "SELECT id, name, price, create_date, status FROM product WHERE create_date=':createDate'"
            .replace(":createDate", createDate);

    JdbcCursorItemReader<Product> itemReader = new JdbcCursorItemReaderBuilder<Product>()
            .fetchSize(chunkSize)
            .dataSource(dataSource)
            .rowMapper(new BeanPropertyRowMapper<>(Product.class))
            .sql(sql)
            .name(JOB_NAME + "_reader")
            .build();

    return new SynchronizedItemStreamReaderBuilder<Product>()
            .delegate(itemReader) // (1)
            .build();
}
```

(1) `.delegate(itemReader)`
- `delegate` 에 감싸고 싶은 ItemReader 객체를 등록 합니다.
- 감싸진 객체는 `synchronized` 메소드 내에서 호출되어 동기화된 읽기가 가능해집니다.

이렇게 변경 후 테스트를 돌려보면 데이터 유실이나 중복 없이 정상적으로 멀티쓰레드 배치가 완료되는 것을 확인할 수 있습니다.

## 마무리

이미 네트워크/DISK IO/CPU/Memory 등 서버 자원이 **단일 쓰레드에서도 리소스 사용량이 한계치에 달했다면** 멀티쓰레드로 진행한다고 해서 성능 향상을 기대할 순 없습니다.

멀티 쓰레드는 여러가지 고려사항이 많습니다. 실제 운영 환경에 적용하실때는 충분히 테스트를 해보신뒤 실행해보시길 권장합니다.
