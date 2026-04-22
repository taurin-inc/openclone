---
topic: "[Redis] SpringBoot Data Redis 로컬/통합 테스트 환경 구축하기"
source_type: other
source_url: "https://jojoldu.tistory.com/297"
authorship: self
published_at: 2018-05-26
---
# [Redis] SpringBoot Data Redis 로컬/통합 테스트 환경 구축하기

**향로 (기억보단 기록을)**
2018. 5. 26.

안녕하세요? 이번 시간엔 SpringBoot Data Redis 로컬 테스트 예제를 진행해보려고 합니다.

모든 코드는 [Github](https://github.com/jojoldu/blog-code/tree/master/springboot-data-redis) 에 있기 때문에 함께 보시면 더 이해하기 쉬우실 것 같습니다.

## 들어가며

회사 신규 프로젝트로 Redis 를 사용하게 되었습니다. 로컬에서 개발하고 테스트 할 수 있는 환경구성이 필요했는데요. H2처럼 Redis도 **프로젝트에 의존** 하는 로컬 환경을 구성하게 되서 정리합니다.

> 프로젝트를 실행시키려면 AWS (SQS) 계정이 있어야 한다거나, 특정 데몬(Redis, MySQL)을 설치해야 하는 등이 있으면 개선이 필요하다고 생각합니다. 누가 오더라도 `git clone` 만 받으면 바로 로컬 개발/테스트를 시작할 수 있도록 하는 것을 지향합니다.

사용할 기술은 다음과 같습니다.

*   **Spring Data Redis**: Redis를 마치 JPA Repository를 이용하듯이 인터페이스를 제공하는 스프링 모듈
*   **Lettuce**: Redis Java Client (Spring Boot 2.0.2 기준 공식 지원 Client)
*   **Embedded Redis**: H2와 같은 내장 Redis 데몬

## 기본 환경 구성

먼저 3개 모듈의 의존성을 추가하겠습니다.

**build.gradle**

```groovy
    // spring-data-redis
    compile('org.springframework.boot:spring-boot-starter-data-redis')
    //embedded-redis
    compile group: 'it.ozimov', name: 'embedded-redis', version: '0.7.2'
```

> 기존에 내장 Redis를 쓸때 kstyrc.embedded-redis를 사용했는데요. 3년동안 업데이트가 없어 Fork해서 만들어진 `it.ozimov.embedded-redis` 모듈을 사용합니다.

그리고 Config 파일을 2개를 생성하겠습니다.

**EmbeddedRedisConfig**

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import redis.embedded.RedisServer;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Slf4j //lombok
@Profile("local") // profile이 local일때만 활성화
@Configuration
public class EmbeddedRedisConfig {

    @Value("${spring.redis.port}")
    private int redisPort;

    private RedisServer redisServer;

    @PostConstruct
    public void redisServer() throws IOException {
            redisServer = new RedisServer(redisPort);
            redisServer.start();
    }

    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            redisServer.stop();
        }
    }
}
```

위는 내장 Redis를 프로젝트가 `profile=local`일때만 실행되도록 하는 설정입니다.

**RedisRepositoryConfig**

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableRedisRepositories
public class RedisRepositoryConfig {
    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(redisHost, redisPort);
    }

    @Bean
    public RedisTemplate<?, ?> redisTemplate() {
        RedisTemplate<byte[], byte[]> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }
}
```

*   RedisConnectionFactory를 통해 내장 혹은 외부의 Redis를 연결합니다.
*   RedisTemplate을 통해 RedisConnection에서 넘겨준 byte 값을 객체 직렬화합니다.

이제 Redis 객체와 Repository를 만들어보겠습니다.

**Point**

```java
@Getter
@RedisHash("point")
public class Point implements Serializable {

    @Id
    private String id;
    private Long amount;
    private LocalDateTime refreshTime;

    @Builder
    public Point(String id, Long amount, LocalDateTime refreshTime) {
        this.id = id;
        this.amount = amount;
        this.refreshTime = refreshTime;
    }

    public void refresh(long amount, LocalDateTime refreshTime){
        if(refreshTime.isAfter(this.refreshTime)){ // 저장된 데이터보다 최신 데이터일 경우
            this.amount = amount;
            this.refreshTime = refreshTime;
        }
    }
}
```

**PointRedisRepository**

```java
public interface PointRedisRepository extends CrudRepository<Point, String> {
}
```

이제 테스트 코드로 이 환경이 잘 수행되는지 확인해보겠습니다.

**src/test/resources/application.yml**

```yaml
spring:
  redis:
    host: localhost
    port: 6379
  profiles:
    active: local
```

**테스트 코드**

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class RedisTest1 {

    @Autowired
    private PointRedisRepository pointRedisRepository;

    @After
    public void tearDown() throws Exception {
        pointRedisRepository.deleteAll();
    }

    @Test
    public void 기본_등록_조회기능() {
        //given
        String id = "jojoldu";
        LocalDateTime refreshTime = LocalDateTime.of(2018, 5, 26, 0, 0);
        Point point = Point.builder()
                .id(id)
                .amount(1000L)
                .refreshTime(refreshTime)
                .build();

        //when
        pointRedisRepository.save(point);

        //then
        Point savedPoint = pointRedisRepository.findById(id).get();
        assertThat(savedPoint.getAmount()).isEqualTo(1000L);
        assertThat(savedPoint.getRefreshTime()).isEqualTo(refreshTime);
    }
}
```

![1](https://t1.daumcdn.net/cfile/tistory/99B16C3E5B08DA3B31)

Redis 테스트가 정상적으로 수행되는걸 확인할 수 있습니다.

## 통합 테스트 환경 구성

아쉽게도 지금 방식으로하면 한가지 큰 문제점을 만나게 됩니다. **여러 스프링 테스트 컨텍스트가 실행되면 EmbeddedRedis가 포트충돌** 이 납니다.

통합 테스트 실행 시 (ex: `./gradlew test`) 새로운 컨텍스트를 생성해서 EmbeddedRedis를 하나 더 실행하려고 하면, 이미 지정된 포트(6379)가 사용 중이라서 테스트가 실패합니다.

이를 해결하기 위해 **해당 포트가 미사용 중이라면 사용하고, 사용 중이라면 그 외 다른 포트를 사용** 하도록 설정을 변경하겠습니다.

> 참고: 아래 코드는 맥/리눅스 환경 기준입니다.

**변경된 EmbeddedRedisConfig**

```java
@Profile("local")
@Configuration
public class EmbeddedRedisConfig {

    @Value("${spring.redis.port}")
    private int redisPort;

    private RedisServer redisServer;

    @PostConstruct
    public void redisServer() throws IOException {
        int port = isRedisRunning()? findAvailablePort() : redisPort;
        redisServer = new RedisServer(port);
        redisServer.start();
    }

    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            redisServer.stop();
        }
    }

    /**
     * Embedded Redis가 현재 실행중인지 확인
     */
    private boolean isRedisRunning() throws IOException {
        return isRunning(executeGrepProcessCommand(redisPort));
    }

    /**
     * 현재 PC/서버에서 사용가능한 포트 조회
     */
    public int findAvailablePort() throws IOException {

        for (int port = 10000; port <= 65535; port++) {
            Process process = executeGrepProcessCommand(port);
            if (!isRunning(process)) {
                return port;
            }
        }

        throw new IllegalArgumentException("Not Found Available port: 10000 ~ 65535");
    }

    /**
     * 해당 port를 사용중인 프로세스 확인하는 sh 실행
     */
    private Process executeGrepProcessCommand(int port) throws IOException {
        String command = String.format("netstat -nat | grep LISTEN|grep %d", port);
        String[] shell = {"/bin/sh", "-c", command};
        return Runtime.getRuntime().exec(shell);
    }

    /**
     * 해당 Process가 현재 실행중인지 확인
     */
    private boolean isRunning(Process process) {
        String line;
        StringBuilder pidInfo = new StringBuilder();

        try (BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()))) {

            while ((line = input.readLine()) != null) {
                pidInfo.append(line);
            }

        } catch (Exception e) {
        }

        return !StringUtils.isEmpty(pidInfo.toString());
    }
}
```

변경된 설정은 지정된 Redis Port로 실행 중인 프로세스가 있다면 다른 포트로 내장 Redis를 실행시키고, 없다면 지정된 포트로 실행시킵니다.

![5](https://t1.daumcdn.net/cfile/tistory/9966B1385B08DA3B01)

이렇게 설정하면 통합 테스트 역시 정상적으로 모두 통과하는 것을 확인할 수 있습니다.
