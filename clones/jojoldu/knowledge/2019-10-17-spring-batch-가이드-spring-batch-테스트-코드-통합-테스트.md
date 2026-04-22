---
topic: "Spring Batch 가이드 - Spring Batch 테스트 코드 (통합 테스트)"
source_type: other
source_url: "https://jojoldu.tistory.com/455"
authorship: self
published_at: 2019-10-17
---
# 10. Spring Batch 가이드 - Spring Batch 테스트 코드

**Author:** 향로 (기억보단 기록을)
**Publish Date:** 2019. 10. 17.

배치 애플리케이션이 웹 애플리케이션 보다 어려운 점을 꼽자면 QA를 많이들 얘기합니다.

일반적으로 웹 애플리케이션의 경우 전문 테스터 분들 혹은 QA 분들이 전체 기능을 검증을 해주시는 반면, 배치 애플리케이션의 경우 DB의 최종상태라던가 메세징큐의 발행내역 등 **개발자들이 직접 확인해주는 것** 외에는 검증 하기가 쉽진 않습니다. (별도의 어드민을 제공하는것도 포함입니다.)

더군다나 개발자가 로컬 환경에서 배치 애플리케이션을 수행하는 것도 많은 수작업이 필요합니다. 수정/삭제 등의 배치 애플리케이션이라면 **한번 수행할때마다 로컬 DB의 데이터를 원복** 하고 다시 수행하는 작업을 반복해야 합니다.

이러다보니 당연하게 테스트 코드의 필요성이 많이 강조됩니다. 다행이라면 배치 애플리케이션은 웹 애플리케이션 보다 테스트 코드 작성이 좀 더 수월하고, 한번 작성하게 되면 그 효과가 좋습니다. 아무래도 UI 검증이 필요한 웹 애플리케이션에 비해 **Java 코드에 대한 검증만** 필요한 배치 애플리케이션의 테스트 코드가 좀 더 수월합니다.

이번 챕터에서는 스프링 배치 환경에서의 테스트 코드에 관해 배워봅니다. JUnit & Mockito 프레임워크와 H2를 이용한 테스트 환경 등에 대해서는 별도로 설명하지 않습니다. 해당 프레임워크에 대한 기본적인 사용법은 이미 충분히 많은 자료들이 있으니 참고해서 봐주시면 됩니다.

## 10-1. 통합 테스트

개인적인 생각으로 스프링 배치 테스트 코드는 ItemReader의 단위 테스트를 작성하는 것 보다 **통합 테스트 코드 작성이 좀 더 쉽다** 고 생각합니다. 스프링 배치 모듈들 사이에서 ItemReader만 뽑아내 **쿼리를 테스트 해볼 수 있는 환경** 을 Setup 하려면 여러가지 장치가 필요합니다.

물론 그렇다고 해서 항상 통합 테스트만 작성하라는 의미는 아닙니다. 저 같은 경우 최근에는 배치의 테스트 코드를 작성할때 **Reader / Processor의 단위 테스트 코드를 먼저 작성** 후 통합 테스트 코드를 작성합니다. 단위 테스트의 장점을 버리라는 의미는 아닙니다. 단지 그동안 해오셨던 웹 애플리케이션의 테스트 코드와 달리 스프링 배치의 테스트 코드는 **특이성** 이 있으니, 그 부분을 고려해 **쉽게 접근 가능한 통합 테스트 코드를 먼저** 배워보자는 의미입니다.

그래서 먼저 해볼것은 스프링 배치의 통합 테스트 입니다.

> 스프링 부트 배치 테스트를 사용하실때는 의존성에 `spring-boot-starter-test` 가 꼭 있어야만 합니다.

### 10-1-1. 4.0.x (부트 2.0) 이하 버전

스프링 배치 4.1 보다 아래 버전의 스프링 배치를 사용하신다면 다음과 같이 통합 테스트를 사용할 수 있습니다.

> 스프링 부트 배치 기준으로는 **2.1.0 보다 하위 버전** 이라고 보시면 됩니다.

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes={BatchJpaTestConfiguration.class, TestBatchLegacyConfig.class}) // (1)
public class BatchIntegrationTestJobConfigurationLegacyTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils; // (2)

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private SalesSumRepository salesSumRepository;

    @After
    public void tearDown() throws Exception {
        salesRepository.deleteAllInBatch();
        salesSumRepository.deleteAllInBatch();
    }

    @Test
    public void 기간내_Sales가_집계되어_SalesSum이된다() throws Exception {
        //given
        LocalDate orderDate = LocalDate.of(2019,10,6);
        int amount1 = 1000;
        int amount2 = 500;
        int amount3 = 100;

        salesRepository.save(new Sales(orderDate, amount1, "1"));
        salesRepository.save(new Sales(orderDate, amount2, "2"));
        salesRepository.save(new Sales(orderDate, amount3, "3"));

        JobParameters jobParameters = new JobParametersBuilder()
                .addString("orderDate", orderDate.format(FORMATTER))
                .toJobParameters();

        //when
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters); // (3)

        //then
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        List<SalesSum> salesSumList = salesSumRepository.findAll();
        assertThat(salesSumList.size()).isEqualTo(1);
        assertThat(salesSumList.get(0).getOrderDate()).isEqualTo(orderDate);
        assertThat(salesSumList.get(0).getAmountSum()).isEqualTo(amount1+amount2+amount3);
    }
}
```

(1) `@SpringBootTest(classes={...})`
- 통합 테스트 실행시 사용할 Java 설정들을 선택합니다.
- `BatchJpaTestConfiguration` : 테스트할 Batch Job
- `TestBatchLegacyConfig`: 배치 테스트 환경

(2) `JobLauncherTestUtils`
- Batch Job을 테스트 환경에서 실행할 Utils 클래스입니다.
- CLI 등으로 실행하는 Job을 **테스트 코드에서 Job을 실행** 할 수 있도록 지원합니다.

(3) `jobLauncherTestUtils.launchJob(jobParameters)`
- **JobParameter와 함께 Job을 실행** 합니다.
- 해당 Job의 결과는 `JobExecution`에 담겨 반환 됩니다.
- 성공적으로 Batch가 수행되었는지는 `jobExecution.getStatus()`로 검증합니다.

(1)의 코드를 보시면 어떤 Batch를 수행할지 **Config 클래스로 지정** 되었습니다. 이외에 나머지 클래스들은 불러오지 않기 때문에 **실행 대상에서 자동으로 제외** 됩니다. 자동으로 제외될 수 있는 이유는 `JobLauncherTestUtils`가 `@Autowired setJob()`로 현재 Bean에 올라간 Job을 주입받기 때문인데요.

현재 실행하는 테스트 환경에서 `Job` 클래스의 Bean은 `class={}`에 등록된 `BatchJpaTestConfiguration`의 Job 하나 뿐이라 자동 선택되는 것입니다. 이렇게 하지 않을 경우 JobLauncherTestUtils에서는 **여러개의 Job Bean 중 어떤것을 선택해야할지 알 수 없어 에러** 가 발생합니다. 그래서 `@SpringBootTest(classes={...})` 를 통해 **단일 Job Config** 만 선택하도록 합니다.

이전에는 `@ConditionalOnProperty`와 `@TestPropertySource` 를 사용하여 **특정 Batch Job** 만 설정을 불러와 배치를 테스트 했습니다. 다만 저 개인적으로 생각하는 이 방식의 단점들은 아래와 같습니다.

1. 행사 코드가 많이 필요합니다 (`@ConditionalOnProperty`, `@TestPropertySource` 등).
2. 전체 테스트 수행시 매번 Spring Context가 재실행되어 속도가 너무나 느립니다.

대신 Bean 충돌 걱정이 없고 운영 환경에서 필요한 Job만 로딩하기 때문에 실행 속도가 빠르다는 장점도 있습니다.

저 같은 경우 현재 스프링 배치 공식 문서에서도 권장하는 방법인 `@ContextConfiguration` 를 사용 중입니다. (`@SpringBootTest(classes={...})` 는 내부적으로 `@ContextConfiguration`를 사용하기 때문에 둘은 같습니다.) 이 어노테이션은 `ApplicationContext` 에서 관리할 Bean과 Configuration 들을 지정할 수 있기 때문에 **특정 Batch Job** 의 설정들만 가져와서 수행할 수 있습니다.

`TestBatchLegacyConfig` 의 코드는 아래와 같이 구성합니다.

```java
@Configuration
@EnableAutoConfiguration
@EnableBatchProcessing // (1)
public class TestBatchLegacyConfig {

    @Bean
    public JobLauncherTestUtils jobLauncherTestUtils() { // (2)
        return new JobLauncherTestUtils();
    }
}
```

(1) `@EnableBatchProcessing`
- 배치 환경을 자동 설정합니다. 테스트 환경에서도 필요하기 때문에 별도의 설정에서 선언되어 사용합니다.

(2) `@Bean JobLauncherTestUtils`
- 스프링 배치 테스트 유틸인 `JobLauncherTestUtils`을 Bean으로 등록합니다.

### 10-1-2. 4.1.x 이상 (부트 2.1) 버전

스프링 배치 4.1에서 새로운 어노테이션 `@SpringBatchTest`가 추가되었습니다. 해당 어노테이션을 추가하게되면 자동으로 ApplicationContext 에 테스트에 필요한 여러 유틸 Bean을 등록해줍니다.

자동으로 등록되는 빈은 총 4개입니다.
- **JobLauncherTestUtils**: 스프링 배치 테스트에 필요한 전반적인 유틸 기능 지원
- **JobRepositoryTestUtils**: JobExecution 생성/삭제 지원
- **StepScopeTestExecutionListener**: 단위 테스트시 StepScope 컨텍스트 생성
- **JobScopeTestExecutionListener**: 단위 테스트시 JobScope 컨텍스트 생성

자 그럼 `@SpringBatchTest` 를 이용해 코드를 개선해보겠습니다.

```java
@RunWith(SpringRunner.class)
@SpringBatchTest // (1)
@SpringBootTest(classes={BatchJpaTestConfiguration.class, TestBatchConfig.class}) // (2)
public class BatchIntegrationTestJobConfigurationNewTest {
    ...
}
```

새롭게 추가될 `TestBatchConfig` 클래스의 코드는 아래가 전부입니다.

```java
@Configuration
@EnableAutoConfiguration
@EnableBatchProcessing
public class TestBatchConfig {}
```

기존에 생성해주던 `JobLauncherTestUtils` 가 모두 `@SpringBatchTest`를 통해 자동 Bean으로 등록되니 더이상 직접 생성해줄 필요가 없습니다.

### 10-1-3. @SpringBootTest 가 필수인가요?

JPA를 비롯해서 **자동 설정이 많이 필요한** 의존성들이 있는 프로젝트라면 `@SpringBootTest`가 필요한 경우가 많습니다. 사용하지 않을 경우 전체 테스트 수행시 `InstanceAlreadyExistsException` 등 다양한 에러가 발생할 수 있습니다.

스프링 배치 팀의 개발자인 [benas](https://github.com/benas) 역시 수동으로 환경을 만드는 비용보다는 마음 편하게 `@SpringBootTest`를 사용하는 것을 추천하고 있습니다.

### 마무리

통합 테스트에 대해 알아보았습니다. 분량이 많다 보니 **단위 테스트는 다음편** 에서 다뤄볼 예정입니다. 다음 편에서 다룰 단위 테스트는 **Reader로 실행되는 쿼리만 어떻게 검증할 것인가**, **JobParameter는 단위테스트에서 어떻게 주입할 수 있는가** 등등을 다뤄보겠습니다.
