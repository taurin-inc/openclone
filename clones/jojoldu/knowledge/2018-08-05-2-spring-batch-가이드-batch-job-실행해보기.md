---
topic: "2. Spring Batch 가이드 - Batch Job 실행해보기"
source_type: other
source_url: "https://jojoldu.tistory.com/325"
authorship: self
published_at: 2018-08-05
---
# 2. Spring Batch 가이드 - Batch Job 실행해보기

**Author:** 향로 (기억보단 기록을)  
**Date:** 2018. 8. 5.

이번 시간에는 간단한 Spring Batch Job을 생성 & 실행하면서 전반적인 내용을 공부해보겠습니다.

> 작업한 모든 코드는 [Github](https://github.com/jojoldu/spring-batch-in-action) 에 있으니 참고하시면 됩니다.

## 2-1. Spring Batch 프로젝트 생성하기

기본적인 프로젝트 개발 환경은 다음과 같습니다.

*   IntelliJ IDEA 2018.2
*   Spring Boot 2.0.4
*   Java 8
*   Gradle

> lombok 기능을 많이 사용합니다. lombok 플러그인을 본인의 IDE에 맞게 설치하시면 좋습니다.

먼저 Spring Boot 프로젝트를 나타내는 Spring Initializr (Spring Boot)를 선택합니다. 본인만의 Group, Artifact 를 선택하시고 Gradle 프로젝트를 선택합니다.

이후 Spring 의존성을 선택하는 화면에선 Batch, JPA, MySQL, H2 등을 선택합니다. 만약 본인의 프로젝트가 JPA만 쓰고 있다면 JDBC를 선택하지 않으셔도 됩니다.

`build.gradle`은 아래와 같은 형태가 됩니다.

```groovy
buildscript {
    ext {
        springBootVersion = '2.0.4.RELEASE'
    }
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}

apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'

group = 'com.jojoldu.spring'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = 1.8

repositories {
    mavenCentral()
}

dependencies {
    compile('org.springframework.boot:spring-boot-starter-batch')
    compile('org.springframework.boot:spring-boot-starter-data-jpa')
    compile('org.springframework.boot:spring-boot-starter-jdbc')
    runtime('com.h2database:h2')
    runtime('mysql:mysql-connector-java')
    compileOnly('org.projectlombok:lombok')
    testCompile('org.springframework.boot:spring-boot-starter-test')
    testCompile('org.springframework.batch:spring-batch-test')
}
```

패키지 안에 있는 `BatchApplication.java`를 열어보시면 전형적인 Spring Boot `main` 메소드가 보입니다.

## 2-2. Simple Job 생성하기

Batch Job을 만들기 전에, `BatchApplication.java`에 **Spring Batch 기능 활성화** 어노테이션 (`@EnableBatchProcessing`)을 추가합니다. 이 어노테이션을 선언해야 Spring Batch의 여러 기능들을 사용할 수 있습니다.

설정이 끝나셨으면 패키지 아래에 `job` 패키지를 생성하고, `SimpleJobConfiguration.java` 파일을 생성하여 다음과 같이 작성합니다.

```java
@Slf4j // log 사용을 위한 lombok 어노테이션
@RequiredArgsConstructor // 생성자 DI를 위한 lombok 어노테이션
@Configuration
public class SimpleJobConfiguration {
    private final JobBuilderFactory jobBuilderFactory; // 생성자 DI 받음
    private final StepBuilderFactory stepBuilderFactory; // 생성자 DI 받음

    @Bean
    public Job simpleJob() {
        return jobBuilderFactory.get("simpleJob")
                .start(simpleStep1())
                .build();
    }

    @Bean
    public Step simpleStep1() {
        return stepBuilderFactory.get("simpleStep1")
                .tasklet((contribution, chunkContext) -> {
                    log.info(">>>>> This is Step1");
                    return RepeatStatus.FINISHED;
                })
                .build();
    }
}
```

*   **@Configuration**: Spring Batch의 모든 Job은 `@Configuration`으로 등록해서 사용합니다.
*   **jobBuilderFactory.get("simpleJob")**: `simpleJob`이란 이름의 Batch Job을 생성합니다.
*   **stepBuilderFactory.get("simpleStep1")**: `simpleStep1`이란 이름의 Batch Step을 생성합니다.
*   **.tasklet((contribution, chunkContext))**: Step 안에서 수행될 기능을 명시합니다. Tasklet은 Step 안에서 단일로 수행될 커스텀한 기능들을 선언할 때 사용합니다.

Spring Batch에서 **Job은 하나의 배치 작업 단위**를 의미하며, Job 안에는 여러 Step이 존재하고, Step 안에는 Tasklet 혹은 Reader & Processor & Writer 묶음이 존재합니다. Tasklet 하나와 Reader & Processor & Writer 한 묶음은 같은 레벨입니다.

`BatchApplication.java`의 `main` 메소드를 실행하면 로그에 `>>>>> This is Step1`이 출력되는 것을 확인할 수 있습니다.

## 2-3. MySQL 환경에서 Spring Batch 실행해보기

Spring Batch는 실행을 위해 메타 데이터 테이블들이 필요합니다. 메타 데이터란 데이터를 설명하는 데이터로, Spring Batch의 메타 데이터는 다음과 같은 내용을 담고 있습니다.

*   이전에 실행한 Job 목록
*   최근 실패/성공한 Batch Parameter
*   다시 실행할 경우 시작 지점
*   Job 내의 Step 성공/실패 여부

기본적으로 H2 DB를 사용할 경우엔 자동으로 생성되지만, MySQL이나 Oracle과 같은 DB를 사용할 때는 개발자가 직접 생성해야 합니다. Spring Batch 내부에 각 DBMS에 맞춘 `schema-*.sql` 파일이 존재하므로 이를 복사해서 사용하면 됩니다.

### 2-3-1. MySQL에 연결하기

`src/main/resources/application.yml`에 Datasource 설정을 추가합니다.

```yaml
spring:
  profiles:
    active: local

---
spring:
  profiles: local
  datasource:
    hikari:
      jdbc-url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
      username: sa
      password:
      driver-class-name: org.h2.Driver
---
spring:
  profiles: mysql
  datasource:
    hikari:
      jdbc-url: jdbc:mysql://localhost:3306/spring_batch
      username: jojoldu
      password: jojoldu1
      driver-class-name: com.mysql.jdbc.Driver
```

각 `spring.profiles` 설정을 통해 profile이 local이면 H2를, mysql이면 MySQL을 사용하도록 합니다.

### 2-3-2. MySQL 환경으로 실행하기

IntelliJ 실행 환경에서 Active profiles를 `mysql`로 설정하여 실행합니다. 메타 테이블이 없는 상태에서 실행하면 `BATCH_JOB_INSTANCE` 테이블이 없다는 에러가 발생합니다.

해결을 위해 `schema-mysql.sql` 파일을 찾아 해당 스키마를 MySQL에서 실행하여 테이블을 생성합니다. 테이블 생성 후 다시 실행하면 MySQL 환경에서도 정상적으로 배치가 실행되는 것을 확인할 수 있습니다.
