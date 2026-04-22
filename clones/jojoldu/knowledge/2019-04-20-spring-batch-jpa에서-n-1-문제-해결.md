---
topic: "Spring Batch JPA에서 N+1 문제 해결"
source_type: other
source_url: "https://jojoldu.tistory.com/414"
authorship: self
published_at: 2019-04-20
---
# Spring Batch JPA에서 N+1 문제 해결

by 향로 (기억보단 기록을)
2019. 4. 20.

안녕하세요? 이번 시간엔 Spring batch에서 N+1 문제 해결을 진행해보려고 합니다.

모든 코드는 [Github](https://github.com/jojoldu/blog-code/tree/master/spring-batch-n1) 에 있기 때문에 함께 보시면 더 이해하기 쉬우실 것 같습니다.

## 1. 테스트 환경

프로젝트는 SpringBoot Batch + Lombok + Spock으로 구성됩니다.

> 스프링부트의 버전은 2.2.7 입니다.

해당 기술들이 처음이셔도 기존에 사용되던 기술과 크게 다르지 않기 때문에 보시는데 어려움이 없으실 것 같습니다.

다음은 기본적인 Entity와 Repository를 생성하겠습니다.

엔티티는 총 4개로 구성됩니다.

![관계도](https://t1.daumcdn.net/cfile/tistory/994211435EDDA7530E)

3개의 엔티티의 코드는 다음과 같습니다.

```java
@NoArgsConstructor
@Getter
@Entity
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @OneToMany(mappedBy = "store", cascade = ALL)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = ALL)
    private List<Employee> employees = new ArrayList<>();

    public Store(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public void addProduct(Product product){
        this.products.add(product);
        product.updateStore(this);
    }

    public void addEmployee(Employee employee){
        this.employees.add(employee);
        employee.updateStore(this);
    }
}
```

```java
@NoArgsConstructor
@Getter
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private long price;

    @ManyToOne
    @JoinColumn(name = "store_id", foreignKey = @ForeignKey(name = "FK_PRODUCT_STORE"))
    private Store store;

    public Product(String name, long price) {
        this.name = name;
        this.price = price;
    }

    public void updateStore(Store store){
        this.store = store;
    }
}
```

```java
@NoArgsConstructor
@Getter
@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDate hireDate;

    @ManyToOne
    @JoinColumn(name = "store_id", foreignKey = @ForeignKey(name = "FK_EMPLOYEE_STORE"))
    private Store store;

    public Employee(String name, LocalDate hireDate) {
        this.name = name;
        this.hireDate = hireDate;
    }

    public void updateStore(Store store){
        this.store = store;
    }
}
```

그리고 배치의 Writer로 저장될 `StoreHistory`를 생성합니다.

```java
@NoArgsConstructor
@Getter
@Entity
public class StoreHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String storeName;
    private String productNames;
    private String employeeNames;

    public StoreHistory(Store store, List<Product> products, List<Employee> employees) {
        this.storeName = store.getName();
        this.productNames = products.stream()
                .map(Product::getName)
                .collect(Collectors.joining( "," ));

        this.employeeNames = employees.stream()
                .map(Employee::getName)
                .collect(Collectors.joining( "," ));
    }
}
```

엔티티가 다 생성되었으니 배치 코드를 작성하겠습니다.

```java
@Configuration
@ConditionalOnProperty(name = "job.name", havingValue = JOB_NAME)
public class StoreBackupBatchConfiguration {

    public static final String JOB_NAME = "storeBackupBatch";
    private static final String STEP_NAME = JOB_NAME+"Step";

    private EntityManagerFactory entityManagerFactory;
    private JobBuilderFactory jobBuilderFactory;
    private StepBuilderFactory stepBuilderFactory;

    public StoreBackupBatchConfiguration(EntityManagerFactory entityManagerFactory, JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
        this.entityManagerFactory = entityManagerFactory;
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
    }

    @Value("${chunkSize:1000}")
    private int chunkSize; 

    private static String ADDRESS_PARAM = null;

    @Bean
    public Job job() {
        return jobBuilderFactory.get(JOB_NAME)
                .start(step())
                .build();
    }

    @Bean
    @JobScope
    public Step step() {
        return stepBuilderFactory.get(STEP_NAME)
                .<Store, StoreHistory>chunk(chunkSize)
                .reader(reader(ADDRESS_PARAM))
                .processor(processor())
                .writer(writer())
                .build();
    }

    @Bean
    @StepScope
    public JpaPagingItemReader<Store> reader (
            @Value("#{jobParameters[address]}") String address) {

        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("address", address+"%");

        JpaPagingItemReader<Store> reader = new JpaPagingItemReader<>();
        reader.setEntityManagerFactory(entityManagerFactory);
        reader.setQueryString("select s From Store s where s.address like :address");
        reader.setParameterValues(parameters);
        reader.setPageSize(chunkSize);

        return reader;
    }

    public ItemProcessor<Store, StoreHistory> processor() {
        return item -> new StoreHistory(item, item.getProducts(), item.getEmployees());
    }

    public JpaItemWriter<StoreHistory> writer() {
        JpaItemWriter<StoreHistory> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }

}
```

조건(`like %address`)에 맞는 `Store`를 조회하여 `StoreHistory`로 복사하는 단순한 배치 프로그램입니다.

배치 코드를 테스트할 테스트 코드를 작성하겠습니다.

먼저 스프링배치 테스트 환경을 위해 설정파일을 하나 생성합니다.

```java
@EnableBatchProcessing
@Configuration
@EnableAutoConfiguration
@ComponentScan
@ConditionalOnProperty(name = "job.name", havingValue = JOB_NAME)
public class TestJobConfiguration {

    @Bean
    public JobLauncherTestUtils jobLauncherTestUtils() {
        return new JobLauncherTestUtils();
    }
}
```

이를 기반으로 테스트 클래스를 추가합니다.

```java
@SpringBootTest
@TestPropertySource(properties = "job.name=storeBackupBatch")
class StoreBackupBatchConfigurationTest extends Specification {

    @Autowired
    JobLauncherTestUtils jobLauncherTestUtils

    @Autowired
    StoreRepository storeRepository

    @Autowired
    StoreHistoryRepository storeHistoryRepository

    def "Store 정보가 StoreHistory로 복사된다" () {
        given:
        Store store1 = new Store("서점", "서울시 강남구")
        store1.addProduct(new Product("책1_1", 10000L))
        store1.addProduct(new Product("책1_2", 20000L))
        store1.addEmployee(new Employee("직원1", LocalDate.now()))
        storeRepository.save(store1)

        Store store2 = new Store("서점2", "서울시 강남구")
        store2.addProduct(new Product("책2_1", 10000L))
        store2.addProduct(new Product("책2_2", 20000L))
        store2.addEmployee(new Employee("직원2", LocalDate.now()))
        storeRepository.save(store2)

        Store store3 = new Store("서점3", "서울시 강남구")
        store3.addProduct(new Product("책3_1", 10000L))
        store3.addProduct(new Product("책3_2", 20000L))
        store3.addEmployee(new Employee("직원3", LocalDate.now()))
        storeRepository.save(store3)

        JobParameters jobParameters = new JobParametersBuilder()
                .addString("address", "서울")
                .toJobParameters()
        when:
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters)

        then:
        jobExecution.status == BatchStatus.COMPLETED
    }
}
```

## 2. 문제 상황

테스트를 실행해보시면 테스트는 성공적으로 통과하지만, 로그에 문제가 있어 보입니다.

![N_1문제발생](https://t1.daumcdn.net/cfile/tistory/9904833A5EDDA7530D)

`Store`와 `Product`, `Employee`가 1대다 관계다보니 `reader.read()`과정에서 자연스레 JPA N+1 문제가 발생했습니다.

이 문제를 해결하기 위해 `join fetch`를 추가하겠습니다. 먼저 `Product` 만 걸어보겠습니다.

쿼리를 자세히 확인해보면 한 번의 `join`이 발생한 것을 알 수 있습니다.

자 그럼 여기서 추가로 Product외에 다른 자식 엔티티인 `Employee`에도 `join fetch`를 걸어보겠습니다.

![employee추가](https://t1.daumcdn.net/cfile/tistory/99AA8A405EDDA7550D)

예상치 못한 `MultipleBagFetchException`을 만나게 됩니다. 즉, 한번에 **2개 이상의 자식 엔티티에는** `join fetch`을 사용할 수 없어 문제가 발생하였습니다.

가장 편한 해결책은 Lazy Loading 하는 것이지만, 앞에서 보신 것처럼 JPA N+1 문제가 발생해서 성능상 큰 문제가 발생합니다.

## 3. 해결

### 3-1. default_batch_fetch_size

Hibernate에서는 **여러 자식들이 있을때 N+1 문제를 회피** 하기 위해 `hibernate.default_batch_fetch_size` 라는 옵션이 있습니다.

`src/test/resources/application.yml`에 다음과 같은 옵션을 추가합니다.

```yml
spring:
  jpa:
    properties:
      hibernate.default_batch_fetch_size: 1000
```

이 **`batch-size` 옵션은 하위 엔티티를 로딩할 때 한 번에 상위 엔티티 ID를 지정한 숫자만큼 `in Query`로 로딩** 해줍니다.

**hibernate.default_batch_fetch_size가 JPA에서 정상 작동** 하는 것을 확인했으나, **배치(JpaPagingItemReader)에서는 작동하지 않습니다.**

### 3-2. Hibernate 테스트

Hibernate Item Reader에서 테스트해보겠습니다.

```java
@Bean
@StepScope
public HibernatePagingItemReader<Store> reader(@Value("#{jobParameters[address]}") String address) {
    Map<String, Object> parameters = new LinkedHashMap<>();
    parameters.put("address", address + "%");
    SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);

    HibernatePagingItemReader<Store> reader = new HibernatePagingItemReader<>();
    reader.setQueryString("FROM Store s WHERE s.address LIKE :address");
    reader.setParameterValues(parameters);
    reader.setSessionFactory(sessionFactory);
    reader.setFetchSize(chunkSize);
    reader.setUseStatelessSession(false);

    return reader;
}
```

HibernatePagingItemReader와 HibernateCursorItemReader에서는 **옵션이 잘 작동합니다**. 즉, ORM Reader 중 **JpaPagingItemReader에서만 작동되지 않습니다**.

### 3-3. Custom JpaPagingItemReader

왜 JpaPagingItemReader에서만 안될까요? 코드를 살펴보면 JpaPagingItemReader는 **트랜잭션을 Reader에서 진행**합니다.

이러다보니 **트랜잭션 안에서만 작동하는 hibernate.default_batch_fetch_size** 가 **단일 객체에서만** 발동하게 됩니다. 직접 Custom Reader를 생성하여 내부의 트랜잭션을 걷어내겠습니다.

```java
public class JpaPagingFetchItemReader <T> extends AbstractPagingItemReader<T> {
    // ... 내부 구현 생략 (EntityManager 및 Query 생성 로직)
    
    @Override
    @SuppressWarnings("unchecked")
    protected void doReadPage() {
        if (transacted) {
            entityManager.clear();
        }

        Query query = createQuery().setFirstResult(getPage() * getPageSize()).setMaxResults(getPageSize());

        if (parameterValues != null) {
            for (Map.Entry<String, Object> me : parameterValues.entrySet()) {
                query.setParameter(me.getKey(), me.getValue());
            }
        }

        if (results == null) {
            results = new CopyOnWriteArrayList<>();
        } else {
            results.clear();
        }

        if (!transacted) {
            List<T> queryResult = query.getResultList();
            for (T entity : queryResult) {
                entityManager.detach(entity);
                results.add(entity);
            }
        } else {
            results.addAll(query.getResultList());
        }
    }
    // ...
}
```

TransactionManager를 사용하는 코드를 모두 제거한 ItemReader를 사용하면 성공적으로 `hibernate.default_batch_fetch_size` 옵션이 적용된 것을 확인할 수 있습니다.

### 3-4. Transacted 옵션을 사용하면 안되나요?

`transacted` 옵션을 `false`로 두면 `entityManager.detach` 가 발생하게 되어 **ItemProcessor에서는 세션이 없는 엔티티**가 되어 `failed to lazily initialize a collection of role` 문제가 발생합니다. 따라서 `transacted` 옵션을 `false`로 두는 것만으로는 원하는 효과를 얻을 수 없습니다.

## 4. 결론

- `join fetch`는 **하나의 자식에만 적용** 가능
- Spring Data의 JpaRepository / Spring Batch의 HibernateItemReader에서는 `hibernate.default_batch_fetch_size`로 N+1 문제를 피할 수 있다.
- Spring Boot 2.1.3 (Spring Batch 4.1.1)까지는 `hibernate.default_batch_fetch_size` 옵션이 **JpaPagingItemReader에서 작동하지 않는다**.
- Custom하게 수정해서 쓸 순 있지만, 검증되지 않은 방식

> 현재 해당 내용의 수정을 [PR](https://github.com/spring-projects/spring-batch/pull/713) 로 보냈습니다. Merge되면 이 블로그의 내용은 수정 될 수 있습니다.

## 참고
- [7 tips-to-boost-your-hibernate-performance/](http://www.thoughts-on-java.org/tips-to-boost-your-hibernate-performance/)
- [hibernate-facts-multi-level-fetching](https://vladmihalcea.com/2013/10/22/hibernate-facts-multi-level-fetching/)
- [권남 위키](http://kwonnam.pe.kr/wiki/java/hibernate/performance)
- [beware-of-hibernate-batch-fetching](https://prasanthmathialagan.wordpress.com/2017/04/20/beware-of-hibernate-batch-fetching/)
