---
topic: "AWS Code Deploy로 배포 Jenkins에서 배치 Jenkins로 Spring Batch 배포하기 - 기본 환경 구성"
source_type: other
source_url: "https://jojoldu.tistory.com/313"
authorship: self
published_at: 2018-07-07
---
# 1. AWS Code Deploy로 배포 Jenkins에서 배치 Jenkins로 Spring Batch 배포하기 - 기본 환경 구성

**작성자:** 향로 (기억보단 기록을)
**작성일:** 2018. 7. 7.

안녕하세요? 이번 시간엔 AWS Code Deploy로 배포 Jenkins에서 배치 Jenkins로 Spring Batch 배포하기를 진행해보려고 합니다.

모든 코드는 [Github](https://github.com/jojoldu/jenkins-codedeploy-multi-module) 에 있기 때문에 함께 보시면 더 이해하기 쉬우실 것 같습니다.

## 0. 들어가며

> 여기서는 [Gradle Multi Module](http://jojoldu.tistory.com/123) 로 구성된 프로젝트를 기준으로 합니다.

Spring Batch 를 관리하는 방법은 크게 3가지가 있습니다.

* Linux의 crontab
* Spring Quartz
* Jenkins

보통 Linux의 crontab과 Spring Quartz를 많이들 사용하시는데요.

Jenkins가 생각보다 Spring Batch 관리용으로 유용하고 효율적입니다.

> 현재 제가 속해있는 팀에서도 적극적으로 Jenkins를 Batch 관리로 사용중인데요.
> 왜 사용하게 되었는지 이유가 궁금하신다면 [이 글](https://jojoldu.tistory.com/489) 을 참고해보시면 됩니다.

Jenkins로 Spring Batch를 관리하기 위해서 지켜주셔야할 것은 **배포용 Jenkins와 Batch용 Jenkins를 분리하는 것** 입니다.

여기선 이 2개가 분리되어있다는 가정하에 시작합니다.

---

## 1. AWS 환경 설정

**배포용 Jenkins** 와 **Batch용 Jenkins** 로 Jenkins와 서버는 **총 2대** 가 필요합니다.

> 아직 구축이 안되있으시다면, 이전에 작성한 [EC2에 Jenkins 설치하기](http://jojoldu.tistory.com/290) 을 참고해서 설치하시면 됩니다.

전체적인 구조는 아래와 같습니다.

![intro](https://t1.daumcdn.net/cfile/tistory/99AE894B5B4072B017)

배포용 Jenkins에서 Test & Build를 수행한 후, Code Deploy를 통해 Batch용 Jenkins에 Spring Batch jar를 전달한다고 보시면 됩니다.

> 왜 **하나의 Jenkins에서 하면 안되냐** 고 궁금해하실 수 있습니다.
> 배포를 하기 위한 Jenkins가 DB에 대한 접근 권한 (Spring Batch를 위해) 까지 가지는 것이 위험하기 때문입니다.
> (덤으로 배포용 Jenkins를 업데이트 하는 동안 정기적인 배치 작업은 다운 없이 계속 진행할 수도 있게 됩니다.)
> Java 코드 뿐만 아니라 시스템도 각자의 역할에 맞게 분리하는 것이 확장성이나 유지보수면에서 굉장히 좋기 때문에 웬만해선 분리하는 것을 추천드립니다.

여기서 주의하실 점은 배포용 Jenkins가 설치된 EC2의 **IAM Role에 S3** 가 포함되있어야 합니다.

만약 없으시다면 아래를 따라 변경해주시면 됩니다.

### 1-1. EC2용 IAM Role 생성

![iam1](https://t1.daumcdn.net/cfile/tistory/99D2784F5B4072B01D)
![iam2](https://t1.daumcdn.net/cfile/tistory/995DE8505B4072B001)

아래처럼 배포용 Jenkins와 Batch용 Jenkins 2대의 IAM Role에 새로 만든 IAM Role을 할당합니다.

![iam3](https://t1.daumcdn.net/cfile/tistory/99A369475B4072B017)
![iam4](https://t1.daumcdn.net/cfile/tistory/9958D5335B4072B01C)
![iam5](https://t1.daumcdn.net/cfile/tistory/99EDD6335B4072B010)

### 1-2. Code Deploy용 IAM Role 생성

추가로 **Code Deploy용 IAM Role** 도 생성합니다.

![iam6](https://t1.daumcdn.net/cfile/tistory/99FE3F345B4072B011)
![iam7](https://t1.daumcdn.net/cfile/tistory/99C5763F5B4072B010)
![iam8](https://t1.daumcdn.net/cfile/tistory/99DFCD425B4072B00E)

### 1-3. S3 Bucket 생성

배포할 zip 파일을 관리할 S3 Bucket도 생성합니다.

![s1](https://t1.daumcdn.net/cfile/tistory/99C152335B4072B028)

저는 bucket명을 `dwlee-member-deploy`으로 하겠습니다.

![s2](https://t1.daumcdn.net/cfile/tistory/99D8D34B5B4072B015)

> 배포 Jenkins에서 사용해야하니 bucket명은 어딘가에 적어주시면 좋습니다.

![s3](https://t1.daumcdn.net/cfile/tistory/99FEB5485B4072B022)
![s4](https://t1.daumcdn.net/cfile/tistory/994472405B4072B030)

S3까지 만드셨다면 Code Deploy를 생성하겠습니다.

### 1-4. Code Deploy 생성

Code Deploy로 이동하여 애플리케이션을 생성합니다.

![codedeploy1](https://t1.daumcdn.net/cfile/tistory/99F7683B5B4072B016)

저는 Code Deploy 애플리케이션 이름을 `dwlee-member-deploy`로 하겠습니다.

![codedeploy2](https://t1.daumcdn.net/cfile/tistory/9998493E5B4072B10C)

* **배포 그룹이 애플리케이션 하위** 에 속합니다.
    * 간혹 이게 헷갈려 배포 그룹을 상위의 이름으로 만드는데요.
    * 애플리케이션의 하위이기 때문에 보통은 서브모듈명을 그대로 사용하기도 합니다.

EC2 인스턴스는 Name Tag로 검색해서 찾습니다.

![codedeploy3](https://t1.daumcdn.net/cfile/tistory/993A03395B4072B005)

서비스 역할은 1-2 에서 만든 Code Deploy용 IAM Role을 등록합니다.

![codedeploy4](https://t1.daumcdn.net/cfile/tistory/993C5B345B4072B00D)

자 이렇게 하면 AWS에서 해야할 일은 모두 끝났습니다.
그럼 간단한 배치 프로젝트를 생성하겠습니다.

---

## 2. 프로젝트 설정

[Gradle Multi Module](http://jojoldu.tistory.com/123) 프로젝트를 생성합니다.

저의 경우 아래와 같이 `jenkins-codedeploy-multi-module`란 Root 프로젝트 하위로 `member-batch`, `member-core`를 두었습니다.

![batch1](https://t1.daumcdn.net/cfile/tistory/99AA0E485B4072B005)

여기서는 간단한 샘플 배치 코드를 하나 작성하겠습니다.

먼저 Spring Batch를 쓸 수 있도록 build.gradle에 의존성을 추가합니다.

```groovy
dependencies {
    compile project(':member-core')
    compile('org.springframework.boot:spring-boot-starter-batch')
    testCompile('org.springframework.boot:spring-boot-starter-test')
    testCompile('org.springframework.batch:spring-batch-test')
}
```

> 전체 코드는 [Github](https://github.com/jojoldu/jenkins-codedeploy-multi-module) 을 참고해주세요!

member-batch에 간단한 샘플 배치 코드를 추가합니다.

**SampleBatchConfiguration.java**

```java
@Slf4j
@Configuration
@ConditionalOnProperty(name = "job.name", havingValue = JOB_NAME)
public class SampleBatchConfiguration {

    public static final String JOB_NAME = "sampleBatch";

    @Autowired
    JobBuilderFactory jobBuilderFactory;

    @Autowired
    StepBuilderFactory stepBuilderFactory;

    @Value("${chunkSize:1000}")
    private int chunkSize;

    @Bean
    public Job job() {
        return jobBuilderFactory.get(JOB_NAME)
                .start(step())
                .build();
    }

    @Bean
    public Step step() {
        return stepBuilderFactory.get("step")
                .tasklet((contribution, chunkContext) -> {
                    log.info("샘플 배치입니다!");
                    return RepeatStatus.FINISHED;
                })
                .build();
    }
}
```

그리고 이를 테스트하는 코드도 추가하겠습니다.

**TestJobConfiguration.java**

```java
@EnableBatchProcessing
@Configuration
public class TestJobConfiguration {

    @Bean
    public JobLauncherTestUtils jobLauncherTestUtils() {
        return new JobLauncherTestUtils();
    }
}
```

**SampleBatchConfigurationTest.java**

```java
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = "job.name=sampleBatch")
public class SampleBatchConfigurationTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Test
    public void 샘플_배치() throws Exception {
        //given
        JobParametersBuilder builder = new JobParametersBuilder();
        builder.addString("version", LocalDateTime.now().toString());

        //when
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(builder.toJobParameters());

        //then
        Assert.assertThat(jobExecution.getStatus(), Matchers.is(BatchStatus.COMPLETED));
    }
}
```

이렇게 하시면 아래와 같은 구조가 됩니다.

![batch2](https://t1.daumcdn.net/cfile/tistory/9952BA4F5B4072B125)

샘플 배치가 잘 수행되는지 테스트를 수행해보시면!

![batch3](https://t1.daumcdn.net/cfile/tistory/999DB23E5B4072B11D)

샘플 배치가 잘 수행되는 것을 알 수 있습니다!

프로젝트의 배치 코드는 완성 되었습니다.
이제 Code Deploy와 연동을 진행해보겠습니다.
