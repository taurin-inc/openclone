---
topic: "Spring Boot에서 AWS 파라미터 스토어로 private 설정값 사용하기"
source_type: other
source_url: "https://jojoldu.tistory.com/509"
authorship: self
published_at: 2020-07-14
---
# Spring Boot에서 AWS 파라미터 스토어로 private 설정값 사용하기

**작성자:** 향로 (기억보단 기록을)
**게시일:** 2020. 7. 14.

이를 테면 DB의 접속정보나 암호화에 사용될 Salt Key 등은 프로젝트 코드 내부에서 관리하기엔 위험이 따릅니다. 누구나 볼 수 있기 때문이죠.

> 이건 사내 private 저장소를 사용해도 비슷합니다. 사내의 누구나 이 설정값을 확인할 수 있다면 위험하다고 보안 감사에서 지적 받을 수 있습니다.

그래서 실제 운영 환경에서는 이런 주요 설정들은 **프로젝트 코드 밖에서** 관리되는데요. 가장 흔한 방법은 서버에 직접 파일을 저장해서 사용하는 것입니다.

하지만 최근처럼 클라우드 환경이 대세인 상황에서는 **동적으로 서버가 추가/삭제가 되는 상황** 에서는 서버에서 직접 파일 관리하기에는 어려움이 많습니다.

그래서 이에 대해서 외부에서 설정 정보를 관리하고, 애플리케이션에서는 해당 설정정보를 받아서 쓰는 방식이 선호되고 있는데요. 대표적으로는 [버전 관리 기반의 Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/reference/html/) 가 있습니다.

![cloudconfig](https://t1.daumcdn.net/cfile/tistory/99E232445F12E5240A)
(이미지 출처: [microservices-centralized-configuration-with-spring-cloud-f2a1f7b78cc2](https://medium.com/@ijayakantha/microservices-centralized-configuration-with-spring-cloud-f2a1f7b78cc2))

아무래도 국내에서 가장 많이 공유된 방법이다보니 위와 같은 이슈에서 가장 먼저 선호되는 방법일텐데요. 당장 급하게 도입해야하거나 관리될 데이터가 아주 소수일 때 사용하기엔 적절하지 않을 수도 있습니다.

1~2개의 설정값을 관리하기 위해 별도의 Config 서버를 구축 (베타/운영 환경 둘다) 하고, 추가적인 Git Repository를 생성하는 등의 과정이 상황에 따라서 과하게 느껴질 수 있는데요.

이럴때 사용하기 좋은게 AWS에서 제공하는 파라미터 스토어입니다.

AWS의 파라미터 스토어는 AWS에서 원격 설정값을 제공하는 서비스이며, 이에 대한 사용 방법은 이미 Spring Cloud에서 `spring-cloud-starter-aws-parameter-store-config` 로 지원해주고 있으니 적용하기에 아주 쉽습니다.

> 모든 코드는 [Github](https://github.com/jojoldu/spring-boot-aws) 에 있습니다.

AWS 파라미터 스터오는 **표준 파라미터, Limit 해제를 하지 않는 상태** 라면 무료로 사용 가능합니다.

![price](https://t1.daumcdn.net/cfile/tistory/995346355F12E52406)
- [요금표](https://aws.amazon.com/ko/systems-manager/pricing/)

그래서 실제로 Spring Boot 배포시에만 적용된다면 비용 관계 없이 편하게 이용하실 수 있으실것 같습니다.

자 그럼 실제 프로젝트에 한번 적용해보겠습니다.

---

## 1. 적용하기

### 1-1. 프로젝트 설정

기존의 Spring Cloud 프로젝트에 다음의 의존성을 추가합니다.

```groovy
dependencies {
    ...
    implementation 'org.springframework.cloud:spring-cloud-starter-aws-parameter-store-config'
}
```

만약 Spring Cloud Dependency가 없다면 아래와 같이 추가해줍니다.

```groovy
ext {
    set('springCloudVersion', "Hoxton.SR6")
}

...

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}
```
- `springCloudVersion` 버전은 본인 프로젝트의 Spring Boot 버전에 맞춰 설정하시면 됩니다.

추가 되셨다면 `src/main/resource` 아래에 `bootstrap.yml` 파일을 생성하여 추가합니다. `spring-cloud-starter-aws-parameter-store-config` 에서의 설정 값은 기존의 다른 설정들처럼 `application.yml`을 사용하지 않고, `bootstrap.yml` 을 사용합니다.

설정은 아래와 같습니다.

```yml
aws:
  paramstore:
    enabled: true
    prefix: /spring-boot-aws
    name: cloud-parameter-store
    profileSeparator: _
```

- `enabled`: 파라미터 스토어 설정 ON
- `prefix`: 파라미터 스토어의 Key 값 가장 첫번째 구분용. `/aaa/bbb/ccc` 와 같은 구조에서 `/aaa`를 담당
- `name`: Key의 두번째 구분용. `/aaa/bbb/ccc` 와 같은 구조에서 `/bbb`를 담당. 바로 하단의 `profileSeparator` 와 함께 사용 가능
- `profileSeparator`: 바로 위 name과 함께 사용될 **profile 구분자**. ex: 파라미터 스토어의 Key가 `/aaa/bbb_local/ccc` 가 있다면, `profileSeparator`가 `_` 이며, 현재 Spring Boot 애플리케이션 profile이 `local` 일 경우 값을 호출할 수 있다.
- `failFast`: 기본값 `true`. 파라미터 스토어에서 값을 못 읽었을때 어떻게 할지를 결정하는 옵션. true이면 애플리케이션 실행을 못하도록 한다.

파라미터 스토어 사용은 위와 같은 설정이면 끝납니다. 실제 설정값을 사용하는 클래스를 만들어보면 다음과 같습니다.

```java
@Getter
@Setter
@NoArgsConstructor
@Configuration
public class ParameterStoreProperties {

    @Value("${encrypt.key}") // (1)
    private String encryptKey;
}
```
(1) `@Value("${encrypt.key}")`: 파라미터 스토어의 `/aaa/bbb/ccc` 구조에서 `/ccc`를 담당

### 1-2. 파라미터 스토어 설정

1. AWS 서비스 검색에서 **Systems Manager**를 검색합니다. (파라미터 스토어가 Systems Manager 하위에 위치합니다.)
2. 사이드바의 **Parameter Store -> 파라미터**로 이동합니다.
3. 파라미터 생성 버튼을 클릭 하신뒤 아래와 같이 각 항목을 입력합니다.

- **이름**: `{prefix}/{name}{profileSeparator}{profile}/parameter.key` 규칙을 따릅니다.
  - 예: prefix: `/spring-boot-aws`, name: `cloud-parameter-store`, parameter.key: `encrypt.key`
- **유형**: 보안 문자열(SecureString) - 파라미터 값이 암호화 되어 관리됩니다.
- **값**: 파라미터로 관리되길 원하는 값을 등록합니다.

Spring Boot profile (`local`, `real`) 항목까지 포함해서 생성한다면 다음과 같은 관계가 됩니다.

- active profile이 없을 경우: `/spring-boot-aws/cloud-parameter-store/encrypt.key`
- active profile이 local일 경우: `/spring-boot-aws/cloud-parameter-store_local/encrypt.key`
- active profile이 real일 경우: `/spring-boot-aws/cloud-parameter-store_real/encrypt.key`

---

## 2. 테스트

### 2-1. IAM User 발급

로컬 PC에서 테스트 할 때는 AWS를 사용할 수 있는 Key를 발급 받아야 합니다.

1. IAM 페이지에서 사용자 추가를 진행합니다.
2. 권한에는 `SSM ReadOnlyAccess` (조회 전용) 또는 `FullAccess`를 체크합니다.
3. 생성된 `access_key_id`와 `secret_access_key`를 로컬 PC의 `~/.aws/credentials` 파일에 등록합니다.

```bash
[default]
aws_access_key_id=생성된 access_key_id
aws_secret_access_key=생성된 secret_access_key
```

`~/.aws/config` 파일에는 리전을 등록합니다.

```bash
[default]
region=ap-northeast-2
output=json
```

### 2-2. 테스트 코드

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class ParameterStorePropertiesTest {

    @Autowired
    private ParameterStoreProperties properties;

    @Test
    void local_파라미터를_가져온다() throws Exception {
        assertThat(properties.getEncryptKey()).isEqualTo("jojoldu_local");
    }
}
```

테스트를 실행하면 AWS 파라미터 스토어에 등록된 값을 정상적으로 가져오는 것을 확인할 수 있습니다.

---

## 3. 동적 파라미터?

AWS 파라미터 스토어를 이용한 방식에선 **동적 파라미터(Dynamic Refresh)가 지원되지 않습니다.** 즉, 처음 Spring Boot Application이 실행될 때만 한 번 파라미터를 가져오며, 이후 AWS 콘솔에서 값을 변경하더라도 실행 중인 애플리케이션에는 실시간으로 반영되지 않습니다.

변경된 값을 반영하려면 애플리케이션을 재시작해야 합니다. 실시간 반영이 꼭 필요하다면 Spring Cloud Config나 별도의 DB 설정을 고려해야 합니다.

---

## 4. 주의사항

만약 위 설정을 마친 뒤 배포 시 `LOG_PATH_IS_UNDEFINED/` 와 같은 **로그 설정 관련 오류**가 발생한다면, `application.yml`에 있는 `logging.path` 설정을 **bootstrap.yml**로 옮겨야 합니다.

`spring-cloud-starter-aws-parameter-store-config` 의존성이 추가되면 로깅 설정 시점의 문제로 인해 `application.yml`의 변수를 제대로 읽지 못할 수 있기 때문입니다. 이를 `bootstrap.yml`로 옮기면 정상적으로 작동합니다.
