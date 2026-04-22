---
topic: "Spring Boot 3.x 실행이 안될 경우 (feat. IntelliJ)"
source_type: other
source_url: "https://jojoldu.tistory.com/698"
authorship: self
published_at: 2023-01-20
---
# Spring Boot 3.x 실행이 안될 경우 (feat. IntelliJ)

**작성자:** 향로 (기억보단 기록을)  
**날짜:** 2023. 1. 20.

---

스프링 부트 3.0 이 출시되었다.

(현재 최신은 3.0.1 이지만)

3.0 부터는 **Java 17부터 지원** 된다.

그러다보니 기존에 Java8, 11등을 사용하시던 분들은 3.x 스프링 부트 프로젝트를 실행할때 에러들을 만나게 되는데, 이번에 나도 똑같이 경험해서 정리하게 되었다.

## 문제

스프링 부트 3.0.1 프로젝트를 실행할 일이 생겼다.

그래서 기존에 설치된 IntelliJ에서 Gradle Import를 시켰더니 다음과 같이 방다한 에러 메세지와 함께 실행이 되지 않았다.

> 기존 노트북에서 모두 Java 11로 프로젝트를 구동시켰었다.

```
No matching variant of org.springframework.boot:spring-boot-gradle-plugin:3.0.1 was found. The consumer was configured to find a runtime of a library compatible with Java 16, packaged as a jar, and its dependencies declared externally, as well as attribute 'org.gradle.plugin.api-version' with value '7.6' but:
          - Variant 'apiElements' capability org.springframework.boot:spring-boot-gradle-plugin:3.0.1 declares a library, packaged as a jar, and its dependencies declared externally:
              - Incompatible because this component declares an API of a component compatible with Java 17 and the consumer needed a runtime of a component compatible with Java 16
              - Other compatible attribute:
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.6')
          - Variant 'javadocElements' capability org.springframework.boot:spring-boot-gradle-plugin:3.0.1 declares a runtime of a component, and its dependencies declared externally:
              - Incompatible because this component declares documentation and the consumer needed a library
              - Other compatible attributes:
                  - Doesn't say anything about its target Java version (required compatibility with Java 16)
                  - Doesn't say anything about its elements (required them packaged as a jar)
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.6')
          - Variant 'mavenOptionalApiElements' capability org.springframework.boot:spring-boot-gradle-plugin-maven-optional:3.0.1 declares a library, packaged as a jar, and its dependencies declared externally:
              - Incompatible because this component declares an API of a component compatible with Java 17 and the consumer needed a runtime of a component compatible with Java 16
              - Other compatible attribute:
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.6')
          - Variant 'mavenOptionalRuntimeElements' capability org.springframework.boot:spring-boot-gradle-plugin-maven-optional:3.0.1 declares a runtime of a library, packaged as a jar, and its dependencies declared externally:
              - Incompatible because this component declares a component compatible with Java 17 and the consumer needed a component compatible with Java 16
              - Other compatible attribute:
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.6')
          - Variant 'runtimeElements' capability org.springframework.boot:spring-boot-gradle-plugin:3.0.1 declares a runtime of a library, packaged as a jar, and its dependencies declared externally:
              - Incompatible because this component declares a component compatible with Java 17 and the consumer needed a component compatible with Java 16
              - Other compatible attribute:
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.6')
          - Variant 'sourcesElements' capability org.springframework.boot:spring-boot-gradle-plugin:3.0.1 declares a runtime of a component, and its dependencies declared externally:
              - Incompatible because this component declares documentation and the consumer needed a library
              - Other compatible attributes:
                  - Doesn't say anything about its target Java version (required compatibility with Java 16)
                  - Doesn't say anything about its elements (required them packaged as a jar)
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.6')
```

그래서 이런 에러들이 나온다면 다음의 방법들을 시도해보자.

## 해결

이 문제의 해결책으로 **스프링 부트 2.7.x 로 다운그레이드** 하면된다는 글들도 몇개 발견하였다.

그건 원하던 해결책이 아니라서 이 글에서는 완전히 배제한다.

### 1. Java

스프링 부트 3.0 부터는 Java 17이 필수다.

그래서 현재 설치된 Java 버전이 무엇인지 확인해보고 **17버전 이상인지** 확인 후, 그 이하라면 17 이상을 설치한다.

```
java -version
```

![java](https://blog.kakaocdn.net/dna/V1ftD/btrWQqovdkj/AAAAAAAAAAAAAAAAAAAAAGFJXHFKFfebXwgkzGh0HAfZqACEF6nKQ7R1Wl6EcBW3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=JJwdBcptLIVkBQ2K9Dy0dOV6vF0%3D)

Java 17 이상인데도 여전히 프로젝트의 오류가 그대로 발생한다면 다른 설정들을 확인해본다.

### 2. build.gradle

해당 프로젝트의 `sourceCompatibility` 가 17이상으로 되어있는지 확인한다.

![gradle](https://blog.kakaocdn.net/dna/nT5yY/btrWQXTBHeA/AAAAAAAAAAAAAAAAAAAAAGF-AGQHSyatko2IueE0AuVyd7ZuXprRytMDmSO2KGN8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=D9jlaLa2mJCL2p%2Fh8XU3KLvcdTc%3D)

```gradle
sourceCompatibility = '17'
```

이 설정까지 해도 안된다면, IntelliJ 설정이 안되어있을 확률이 높다.

### 3. IntelliJ

결국 이 프로젝트를 실행하는 **IntelliJ가 프로젝트를 Java 17로 실행** 해야만 한다.

그래서 아래 설정들을 따라 Java 17 이상으로 IntelliJ를 설정한다.

#### 3-1. Gradle Build

IntelliJ의 `Preferences/Settings` -> `Build, Execution, Deployment` -> `Build Tools` -> `Gradle` 로 이동한다.

그럼 아래와 같이 Gradle 설정이 나오는데, 이때 **Gradle의 JVM이 Java 17이상인지** 확인한다.

![ij1](https://blog.kakaocdn.net/dna/cpUIiY/btrWQbLPlIE/AAAAAAAAAAAAAAAAAAAAADkc7_t4-PqJM_MSEUHhbodcqn95kSwNG3rcO6NYFkjV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=dkYKmm9%2FnxuUi6%2BrfDxvPWzkxSo%3D)

만약 17이상이 아니라면 17이상으로 설정한다.

#### 3-2. Project SDK

다음으로 `File` -> `Project Structure..` 로 이동하여 프로젝트 SDK의 버전을 확인후 Java 17이상으로 설정한다.

![ij2](https://blog.kakaocdn.net/dna/NfFrJ/btrWQe2OESh/AAAAAAAAAAAAAAAAAAAAAAf2y-ezbKJ_7GbbN-E5m58NGXDYzqS944zFUDcygpP3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=6FW660wKLl%2F29Azy4zEElM5fnP8%3D)

**Project**

![ij3](https://blog.kakaocdn.net/dna/EEY16/btrWQLeIYvg/AAAAAAAAAAAAAAAAAAAAAE0t3MPTTlX0oEcbveFW3zV8HicKTfBszJQV0ciQqzVH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2BT%2B7GAT85jEfoMhHpHRcj5dp4YQ%3D)

**Modules**

![ij4](https://blog.kakaocdn.net/dna/bHoahu/btrWQdJAY70/AAAAAAAAAAAAAAAAAAAAAH2oHhe6v4BqDhBqSXVAGXP9PldoLNV9y5oj5wGFhIWB/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=RcPl%2Bc28Sbwy5n3wqSFAHOoU9%2Fo%3D)

### Gradle Refresh

IntelliJ까지 설정이 모두 끝났다면 다시 Gradle Refresh를 실행해보자.

![result1](https://blog.kakaocdn.net/dna/c4wAoI/btrWRcJM3Iq/AAAAAAAAAAAAAAAAAAAAAC7-C9bJlwbmEPXi5A8f5pZDwIUub62YbnTfVPgONJFt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=2Hjq2P8CYL%2FnIsFbwgDBC7dozVU%3D)

그럼 이제 다음과 같이 정상적으로 빌드가 되는 것을 확인할 수 있다.

![result2](https://blog.kakaocdn.net/dna/bujx0p/btrWRWTQ1Vb/AAAAAAAAAAAAAAAAAAAAAGyHT0sGvAK8sIoYmjEZnyuBrUzaFGegF6TmvdpnTuP2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=mYJy9AVzYxT%2FiSzXYoWfZOdIoKA%3D)
