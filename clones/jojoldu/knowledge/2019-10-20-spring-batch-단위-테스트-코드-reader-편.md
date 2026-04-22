---
topic: "Spring Batch 단위 테스트 코드 - Reader 편"
source_type: other
source_url: "https://jojoldu.tistory.com/456"
authorship: self
published_at: 2019-10-20
---
# 10.1. Spring Batch 단위 테스트 코드 - Reader 편

**Author:** 향로 (기억보단 기록을)
**Date:** 2019. 10. 20.

웹 애플리케이션을 개발하다보면 통합 테스트 보다, **단위 테스트가 훨씬 더 많이 작성** 됩니다.

단위 테스트로 많은 코드를 검증 후, 통합 테스트 코드를 통해 각 단위가 합쳐졌을때 잘 작동 되는지 검증하곤 하는데요.

스프링 배치를 이용한 **배치 애플리케이션** 에서는 많은 분들이 **통합 테스트만** 작성할때가 많습니다.

[전편](https://jojoldu.tistory.com/455) 에서 말씀드린것처럼 스프링 배치의 단위 테스트 작성이 통합 테스트 보다 복잡하기 때문입니다.

그래서 이번 챕터에서는 다음의 질문들에 대해 이야기해볼까 합니다.

*   Reader의 쿼리가 잘 작동되었는지는 어떻게 확인하지?
*   StepScope를 통한 JobParameter가 잘 할당 된다는 것은 어떻게 확인하지?

부분 부분을 잘개 쪼개서 테스트할 수 있는 방법들을 소개드리겠습니다

Reader의 단위 테스트는 다음을 보고 싶을때가 많습니다.

*   내가 작성한 Reader의 Query가 잘 작동하는지

그래서 Reader의 단위 테스트 방법은 이 부분에 초점을 맞춰서 진행할 예정입니다.

테스트 방법은 총 2단계로 진행됩니다.

StepScope & JobScope가 없는 테스트와
StepScope & JobScope가 필요한 테스트.

차근차근 진행해보겠습니다.

> 참고로 아래 모든 단위 테스트들에는 H2 의존성이 필수입니다.
> `compile('com.h2database:h2')`

## 10.1.1 StepScope 가 필요 없는 단위 테스트

Jdbc를 사용하는 배치를 만든다고 가정해보겠습니다.

전체 스프링 배치 코드를 작성하기까지 시간이 필요해 그전에 빠르게 **JdbcItemReader의 쿼리** 만 검증하는 테스트 코드를 작성하고 싶을때가 많습니다.

전체 코드를 모두 작성하고 테스트를 시작하기에는 부담이 많이 되기 때문이죠.

그래서 **최소한의 내용만 구현된** Reader 테스트 코드를 만들어보겠습니다.

> 참고로 이 방식은 **JPA에서는 사용하기가 어렵습니다**.
> Spring Data Jpa를 통해 생성되는 여러 환경들을 본인이 직접 다 구성해야되기 때문입니다.
> 그래서 JPA를 쓰지 않고, **JdbcTemplate** 로 배치 환경을 구성하시는 분들이 참고해보시면 좋을것 같습니다.

일단 테스트할 대상인 배치 코드입니다.

```java
@Slf4j // log 사용을 위한 lombok 어노테이션
@RequiredArgsConstructor // 생성자 DI를 위한 lombok 어노테이션
@Configuration
public class BatchOnlyJdbcReaderTestConfiguration {
    public static final DateTimeFormatter FORMATTER = ofPattern("yyyy-MM-dd");
    public static final String JOB_NAME = "batchOnlyJdbcReaderTestJob";

    private final DataSource dataSource;

    private int chunkSize;

    @Value("${chunkSize:1000}")
    public void setChunkSize(int chunkSize) {
        this.chunkSize = chunkSize;
    }

    @Bean
    @StepScope
    public JdbcPagingItemReader<SalesSum> batchOnlyJdbcReaderTestJobReader(
            @Value("#{jobParameters[orderDate]}") String orderDate) throws Exception {

        Map<String, Object> params = new HashMap<>();

        params.put("orderDate", LocalDate.parse(orderDate, FORMATTER));

        SqlPagingQueryProviderFactoryBean queryProvider = new SqlPagingQueryProviderFactoryBean();
        queryProvider.setDataSource(dataSource);
        queryProvider.setSelectClause("order_date, sum(amount) as amount_sum");
        queryProvider.setFromClause("from sales");
        queryProvider.setWhereClause("where order_date =:orderDate");
        queryProvider.setGroupClause("group by order_date");
        queryProvider.setSortKey("order_date");

        return new JdbcPagingItemReaderBuilder<SalesSum>()
                .name("batchOnlyJdbcReaderTestJobReader")
                .pageSize(chunkSize)
                .fetchSize(chunkSize)
                .dataSource(dataSource)
                .rowMapper(new BeanPropertyRowMapper<>(SalesSum.class))
                .queryProvider(queryProvider.getObject())
                .parameterValues(params)
                .build();
    }
}
```

보시면 **딱 Reader 부분만** 있는 상태입니다.

즉, Job / Step / Processor / Writer를 모두 구현하지 않은 상태이며 **Reader쿼리가 정상이면 언제든 나머지 부분을** 구현하면 되는 상태입니다.

이 배치 코드를 테스트 한다면 다음과 같이 작성할 수 있습니다.

```java
public class BatchNoSpringContextUnitTest2 {

    private DataSource dataSource;
    private JdbcTemplate jdbcTemplate;
    private ConfigurableApplicationContext context;
    private LocalDate orderDate;
    private BatchOnlyJdbcReaderTestConfiguration job;

    @Before
    public void setUp() {
        this.context = new AnnotationConfigApplicationContext(TestDataSourceConfiguration.class); // (1)
        this.dataSource = (DataSource) context.getBean("dataSource"); // (2)
        this.jdbcTemplate = new JdbcTemplate(this.dataSource); // (3)
        this.orderDate = LocalDate.of(2019, 10, 6);
        this.job = new BatchOnlyJdbcReaderTestConfiguration(dataSource); // (4)
        this.job.setChunkSize(10); // (5)
    }

    @After
    public void tearDown() {
        if (this.context != null) {
            this.context.close();
        }
    }

    @Test
    public void 기간내_Sales가_집계되어_SalesSum이된다() throws Exception {
        // given
        long amount1 = 1000;
        long amount2 = 100;
        long amount3 = 10;
        jdbcTemplate.update("insert into sales (order_date, amount, order_no) values (?, ?, ?)", orderDate, amount1, "1"); // (1)
        jdbcTemplate.update("insert into sales (order_date, amount, order_no) values (?, ?, ?)", orderDate, amount2, "2");
        jdbcTemplate.update("insert into sales (order_date, amount, order_no) values (?, ?, ?)", orderDate, amount3, "3");

        JdbcPagingItemReader<SalesSum> reader = job.batchOnlyJdbcReaderTestJobReader(orderDate.format(FORMATTER)); // (2)
        reader.afterPropertiesSet(); // (3)

        // when & then
        assertThat(reader.read().getAmountSum()).isEqualTo(amount1 + amount2 + amount3); // (4)
        assertThat(reader.read()).isNull(); //(5)
    }

    @Configuration
    public static class TestDataSourceConfiguration {

        // (1)
        private static final String CREATE_SQL =
                        "create table IF NOT EXISTS `sales` (id bigint not null auto_increment, amount bigint not null, order_date date, order_no varchar(255), primary key (id)) engine=InnoDB;";

        // (2)
        @Bean
        public DataSource dataSource() {
            EmbeddedDatabaseFactory databaseFactory = new EmbeddedDatabaseFactory();
            databaseFactory.setDatabaseType(H2);
            return databaseFactory.getDatabase();
        }

        // (3)
        @Bean
        public DataSourceInitializer initializer(DataSource dataSource) {
            DataSourceInitializer dataSourceInitializer = new DataSourceInitializer();
            dataSourceInitializer.setDataSource(dataSource);

            Resource create = new ByteArrayResource(CREATE_SQL.getBytes());
            dataSourceInitializer.setDatabasePopulator(new ResourceDatabasePopulator(create));

            return dataSourceInitializer;
        }
    }
}
```

### setUp

(1) `new AnnotationConfigApplicationContext(...)`
* `DataSource`, `JdbcTemplate`, `Reader` 등이 실행될 수 있는 Context 를 생성합니다.

(2) `(DataSource) context.getBean("dataSource")`
* `TestDataSourceConfiguration` 를 통해 생성된 **DataSource Bean** 을 가져옵니다.

(3) `new JdbcTemplate(this.dataSource)`
* 지금 생성된 JdbcTemplate을 통해 `create table`, `insert` 등의 테스트 환경을 구축합니다.

(4) `new BatchOnlyJdbcReaderTestConfiguration(dataSource)`
* 테스트할 대상인 Config에 (2) 에서 생성한 DataSource를 생성자 주입 합니다.

(5) `this.job.setChunkSize(10)`
* Reader의 PageSize / FetchSize를 결정하는 ChunkSize를 설정합니다.

### 테스트 메소드

(1) `jdbcTemplate.update`
* `insert` 쿼리를 통해 **테스트할 환경을 구축** 합니다.

(2) `job.batchOnlyJdbcReaderTestJobReader`
* `setUp` 메소드에서 만든 Job에서 Reader를 가져옵니다.

(3) `reader.afterPropertiesSet()`
* Reader의 쿼리를 생성합니다. 이 메소드가 실행되지 않으면 **Reader의 쿼리가 null** 입니다.

(4) `assertThat(reader.read())`
* `group by` 결과로 원하는 값의 1개의 row가 반환되는지 검증합니다.

(5) `assertThat(reader.read()).isNull()`
* 조회 결과가 1개의 row라서 다음으로 읽을 row는 없으니 `null`임을 검증한다.

### 테스트 Config

(1) `create table`
* Reader의 쿼리가 수행될 테이블 (`sales`) 를 생성하는 쿼리입니다.

(2) `@Bean dataSource`
* 테스트용 인메모리 DB인 H2를 사용합니다.

(3) `@Bean initializer`
* (2)를 통해 생성된 DB의 초기 작업(테이블 생성 등)을 설정합니다.

## 10.1.2 StepScope 가 필요한 단위 테스트

StepScope와 같이 **스프링 배치만의 Scope가 있어야만** 작동하는 스프링 배치 기능 중 대표적인 것이 JobParameter입니다. JobParameter는 JobScope 혹은 StepScope가 있는 환경에서만 사용할 수 있어 단순한 방식으로는 테스트할 수 없습니다.

테스트할 대상 코드는 Job / Step / Writer가 추가된 상태여야 합니다.

```java
@Slf4j
@RequiredArgsConstructor
@Configuration
public class BatchJdbcTestConfiguration {
    public static final DateTimeFormatter FORMATTER = ofPattern("yyyy-MM-dd");
    public static final String JOB_NAME = "batchJdbcUnitTestJob";

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final DataSource dataSource;

    private int chunkSize;

    @Value("${chunkSize:1000}")
    public void setChunkSize(int chunkSize) {
        this.chunkSize = chunkSize;
    }

    @Bean
    public Job batchJdbcUnitTestJob() throws Exception {
        return jobBuilderFactory.get(JOB_NAME)
                .start(batchJdbcUnitTestJobStep())
                .build();
    }

    @Bean
    public Step batchJdbcUnitTestJobStep() throws Exception {
        return stepBuilderFactory.get("batchJdbcUnitTestJobStep")
                .<SalesSum, SalesSum>chunk(chunkSize)
                .reader(batchJdbcUnitTestJobReader(null))
                .writer(batchJdbcUnitTestJobWriter())
                .build();
    }

    @Bean
    @StepScope
    public JdbcPagingItemReader<SalesSum> batchJdbcUnitTestJobReader(
            @Value("#{jobParameters[orderDate]}") String orderDate) throws Exception {

        Map<String, Object> params = new HashMap<>();
        params.put("orderDate", LocalDate.parse(orderDate, FORMATTER));

        SqlPagingQueryProviderFactoryBean queryProvider = new SqlPagingQueryProviderFactoryBean();
        queryProvider.setDataSource(dataSource);
        queryProvider.setSelectClause("order_date, sum(amount) as amount_sum");
        queryProvider.setFromClause("from sales");
        queryProvider.setWhereClause("where order_date =:orderDate");
        queryProvider.setGroupClause("group by order_date");
        queryProvider.setSortKey("order_date");

        return new JdbcPagingItemReaderBuilder<SalesSum>()
                .name("batchJdbcUnitTestJobReader")
                .pageSize(chunkSize)
                .fetchSize(chunkSize)
                .dataSource(dataSource)
                .rowMapper(new BeanPropertyRowMapper<>(SalesSum.class))
                .queryProvider(queryProvider.getObject())
                .parameterValues(params)
                .build();
    }

    @Bean
    public JdbcBatchItemWriter<SalesSum> batchJdbcUnitTestJobWriter() {
        return new JdbcBatchItemWriterBuilder<SalesSum>()
                .dataSource(dataSource)
                .sql("insert into sales_sum(order_date, amount_sum) values (:order_date, :amount_sum)")
                .beanMapped()
                .build();
    }
}
```

### 4.0.x 이하 버전

```java
@RunWith(SpringRunner.class)
@EnableBatchProcessing // (1)
@TestExecutionListeners( { // (2)
        DependencyInjectionTestExecutionListener.class,
        StepScopeTestExecutionListener.class })
@ContextConfiguration(classes={ // (3)
        BatchJdbcTestConfiguration.class,
        BatchJdbcUnitTestJobConfigurationLegacyTest.TestDataSourceConfiguration.class})
public class BatchJdbcUnitTestJobConfigurationLegacyTest {

    @Autowired private JdbcPagingItemReader<SalesSum> reader;
    @Autowired private DataSource dataSource;

    private JdbcOperations jdbcTemplate;
    private LocalDate orderDate = LocalDate.of(2019, 10, 6);

    // (4)
    public StepExecution getStepExecution() {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("orderDate", this.orderDate.format(FORMATTER))
                .toJobParameters();

        return MetaDataInstanceFactory.createStepExecution(jobParameters);
    }

    @Before // (5)
    public void setUp() throws Exception {
        this.reader.setDataSource(this.dataSource);
        this.jdbcTemplate = new JdbcTemplate(this.dataSource);
    }

    @After // (6)
    public void tearDown() throws Exception {
        this.jdbcTemplate.update("delete from sales");
    }

    @Test
    public void 기간내_Sales가_집계되어_SalesSum이된다() throws Exception {
        //given
        long amount1 = 1000;
        long amount2 = 500;
        long amount3 = 100;

        saveSales(amount1, "1");
        saveSales(amount2, "2");
        saveSales(amount3, "3");

        // when && then
        assertThat(reader.read().getAmountSum()).isEqualTo(amount1+amount2+amount3);
        assertThat(reader.read()).isNull();
    }

    private void saveSales(long amount, String orderNo) {
        jdbcTemplate.update("insert into sales (order_date, amount, order_no) values (?, ?, ?)", this.orderDate, amount, orderNo);
    }
    ...
}
```

(2) `@TestExecutionListeners(...)`: `StepScopeTestExecutionListener.class`가 핵심입니다. 테스트 케이스에서 **팩토리 메소드** (여기서는 `getStepExecution()`) 를 찾아서 반환된 `StepExecution` 을 사용합니다.

(4) `getStepExecution()`: 여기서 반환하는 `StepExecution` 가 테스트에서 사용되는 Reader의 **Step 환경** 이 됩니다.

### 4.1.x 이상 버전

4.1.x 에서는 `@TestExecutionListeners` 를 통해 하던 설정이 모두 `@SpringBatchTest`로 교체됩니다.

```java
@RunWith(SpringRunner.class)
@EnableBatchProcessing
@SpringBatchTest // (1)
@ContextConfiguration(classes={
        BatchJdbcTestConfiguration.class,
        BatchJdbcUnitTestJobConfigurationNewTest.TestDataSourceConfiguration.class})
public class BatchJdbcUnitTestJobConfigurationNewTest {
    .... // 4.0 이하 버전과 동일
}
```

`@SpringBatchTest`는 `JobLauncherTestUtils`, `StepScopeTestExecutionListener` 등을 자동으로 지원하여 설정을 간소화해줍니다.

## 10.1.3 JPA에서의 Reader 테스트

JPA는 `@SpringBootTest`로 자동으로 해주는 설정들이 많아 좀 더 편하게 테스트 코드를 작성할 수 있습니다.

```java
@RunWith(SpringRunner.class)
@SpringBatchTest
@SpringBootTest(classes={BatchJpaTestConfiguration.class, TestBatchConfig.class})
public class BatchJpaUnitTestJobConfigurationTest {

    @Autowired private JpaPagingItemReader<SalesSum> reader;
    @Autowired private SalesRepository salesRepository;
    @Autowired private SalesSumRepository salesSumRepository;

    private static final LocalDate orderDate = LocalDate.of(2019,10,6);

    @After
    public void tearDown() throws Exception {
        salesRepository.deleteAllInBatch();
        salesSumRepository.deleteAllInBatch();
    }

    public StepExecution getStepExecution() {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("orderDate", orderDate.format(FORMATTER))
                .toJobParameters();

        return MetaDataInstanceFactory.createStepExecution(jobParameters);
    }

    @Test
    public void 기간내_Sales가_집계되어_SalesSum이된다() throws Exception {
        //given
        int amount1 = 1000;
        int amount2 = 500;
        int amount3 = 100;

        saveSales(amount1, "1");
        saveSales(amount2, "2");
        saveSales(amount3, "3");

        reader.open(new ExecutionContext());

        //when & then
        assertThat(reader.read().getAmountSum()).isEqualTo(amount1+amount2+amount3);
        assertThat(reader.read()).isNull(); // 더이상 읽을게 없어 null
    }

    private Sales saveSales(long amount, String orderNo) {
        return salesRepository.save(new Sales(orderDate, amount, orderNo));
    }
}
```

JPA 테스트 역시 `getStepExecution` 메소드를 이용해 **테스트용 StepExecution** 을 생성하고 Reader의 결과를 검증하면 됩니다.

## 10.1 마무리

이번 10.1에서는 다음을 배웠습니다.

* JdbcReader 환경에서의 StepScope 없이 진행하는 Reader 단위 테스트 방법
* JdbcReader 환경에서의 StepScope 를 활성화시킨 Reader 단위 테스트 방법
* `getStepExecution()` 의 사용 방법 및 구동 원리
* JPA 에서의 Reader 단위 테스트 방법

다음은 **Processor 단위 테스트** 를 진행하겠습니다.
