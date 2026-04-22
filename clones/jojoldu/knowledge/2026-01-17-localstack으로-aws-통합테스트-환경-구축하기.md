---
topic: "localstack으로 AWS 통합테스트 환경 구축하기"
source_type: other
source_url: "https://tech.inflab.com/202202-integration-test-with-localstack"
authorship: self
published_at: 2026-01-17
---
# localstack으로 AWS 통합테스트 환경 구축하기

**작성자:** 인트 (INT)  
**날짜:** 2022년 2월

---

안녕하세요. 인프랩에서 백엔드 개발을 담당하고 있는 인트라고합니다.

저는 최근 오픈한 채용 서비스 [랠릿](https://www.rallit.com/) 프로젝트에 참여하였습니다.

기존 인프런 서비스와는 다른 스택과 환경에서 개발되었고 그 과정에서 여러 시행착오와 고민을 하게 되었습니다.

이번 포스팅에서는 그중에서 AWS 서비스를 사용하는 로직의 통합테스트를 위해 `localstack` 을 도입했던 과정을 공유하고자 합니다.

## 통합테스트

우리는 잘 작동하고 깔끔한 코드를 위해 테스트를 작성합니다.

테스트는 의존성 여부에 따라 크게 3가지 종류가 있습니다.

- e2e
- integration
- unit

이번 포스팅에서 이야기하고자 하는 주제는 통합(integration) 테스트로 그중에서도 AWS 리소스와 연동해야 하는 테스트를 다룹니다.

이번에 신규 프로젝트를 진행하면서 `SES` 와 `S3` 서비스가 필요하게 되었고 관련 모듈을 만들게 되었습니다.

만든 모듈에 대해 유닛테스트를 작성하였지만 AWS 를 사용하는 로직을 **유닛 테스트만 가지고 검증** 하기에는 부족하다는 생각이 들었습니다.

그래서 통합테스트를 작성하려 했고 이를 위해 실제 AWS 리소스를 활용하려 했지만, 다음과 같은 문제가 예상되었습니다.

1. 비용

테스트가 실행되는 상황은 보통 아래와 같습니다.

- 개발자 각자 로컬에서 실행
- CI / CD

하루에도 수십번의 테스트 실행이 이루어지는 상황에서 매번 AWS 리소스를 사용하다 보면 무시할 수 없는 비용의 문제가 발생할 수 있습니다.

2. secret 관리

실제 AWS 리소스에 접근하려면 `secret access key` 같은 접속정보가 필요합니다.

이를 위해 각 개발자 로컬에 해당 정보를 제공해야 하며 그만큼 유출 가능성이 커집니다.

3. 테스트 간 독립성

올바른 테스트를 위해서는 테스트 케이스 간 독립성이 중요합니다.

즉 테스트 순서에 따라 결과가 달라지거나 어떤 테스트의 결과가 다른 테스트에 영향을 끼쳐선 안 됩니다.

하지만 하나의 AWS 리소스를 사용하는 경우 테스트의 병렬실행 시 문제가 발생할 수 있습니다.

예로 들면 SQS 에 메시지를 넣는 테스트 코드와 빼내는 테스트 코드가 있다면 두 테스트가 동시에 실행되었을 때 타이밍에 따라 빼낸 메시지가 기대했던 값과 달라 때때로 테스트가 실패할 수 있습니다.

이를 해결하기 위해 각 테스트 간 다른 AWS 리소스를 사용하도록 할 수 있지만, 리소스를 무한정 늘릴 수 없다는 한계가 있습니다.

이와 같은 문제를 해결하기 위해 이번에 `localstack` 을 도입하였습니다.

## Localstack

![localstack](https://tech.inflab.com/static/0cb538dd428c85b09b2d7355e285d7e0/37523/localstack.png)

[localstack](https://localstack.cloud/) 은 AWS API 를 시뮬레이션 해주는 프레임워크입니다.

도커 컨테이너 형태로 제공되며 `AWS REST API` 스펙에 맞는 모킹 http 서버를 실행합니다.

무료버전과 유료버전이 있으며 유료버전은 더 많은 AWS 서비스를 제공합니다.

위 사진처럼 로컬 환경과 CI 환경에서 각각 독립적인 테스트 환경을 구축할 수 있습니다.

컨테이너를 실행하는 방법으로 docker 를 사용하거나 `testcontainers` 를 사용할 수 있는데 먼저 각각의 장단점을 살펴보려고 합니다.

## Testcontainers 로 실행하기

### 소개

[Testcontainers](https://www.testcontainers.org/) 이름 그대로 **테스트를 위한 컨테이너의 생명주기를 관리** 해주는 라이브러리입니다.

즉 컨테이너의 실행과 초기화 대기, 종료를 제어할 수 있습니다.

`java`, `node.js`, `go` 와 같은 여러 프로그래밍 언어를 지원합니다.

`node.js` 에서 사용하는 경우 `beforeAll` 이나 `beforeEach` 에 이 라이브러리를 사용해 컨테이너를 올립니다.

```ts
let localstackPort: number;
let container: GenericContainer;

// 컨테이너 실행
beforeAll(async () => {
  container = await new GenericContainer("localstack/localstack")
    // 내부 4566 포트를 외부의 임의 포트로 노출
    .withExposedPorts(4566)
    // 환경 변수 설정
    .withEnv("SERVICES", "ses")
    // 컨테이너 로그에 이 문구가 나올때까지 기다림
    .withWaitStrategy(Wait.forLogMessage('Execution of "preload_services"'))
    .start();

  localstackPort = container.getMappedPort(4566);
});

// 컨테이너 종료
afterAll(() => container.close());
```

`testcontainers` 는 여러 컨테이너를 동시에 실행시켜도 외부에 노출되는 포트가 중복되지 않게 해줍니다.

따라서 각 테스트 간에 서로 다른 컨테이너에 접속하게 할 수 있기에 병렬실행이 가능하고 테스트 간 독립성이 보장됩니다.

### 단점

저희는 `testcontainers` 의 적용을 위해 고민을 했지만 결국 **testcontainers 대신 docker-compose 를 활용하기로 했고** 그 이유는 다음과 같습니다.

#### 단건 테스트의 속도가 느려집니다

테스트 실행 여부와 관계없이 항상 컨테이너를 실행해둘 수 있는 docker 방식과 달리 테스트를 실행할 때 컨테이너를 실행하고 테스트 종료 후 마무리하는 과정이 필요합니다.

이로 인해 단건 테스트의 속도가 docker 에 비해 많이 느려집니다.

전체 개발 프로세스 중 전체 테스트보다 단건 테스트를 더 많이 수행하게 되므로 생산성 측면에서 오히려 손해라고 판단하였습니다.

#### 생각보다 병렬실행의 이점을 얻기 힘듭니다

testcontainers 를 통해 얻을 수 있는 독립성을 활용해 여러 테스트를 병렬로 실행할 수 있으나 대량의 컨테이너를 올리고 내리는데 드는 부하를 무시할 수 없기에 큰 속도향상을 기대하기 힘든 상황이었습니다.

## Docker compose 로 실행하기

위와 같은 이유로 저희는 docker 로 단일 localstack 을 실행하는 것으로 결정하였고 이제 그 과정을 설명하려고 합니다.

> 예제는 SES 와 S3 를 사용하고 있습니다.

### 환경변수

`localstack` 은 컨테이너 설정을 위해 여러 환경변수를 제공합니다.

이번 예제에서 사용할 환경변수는 `SERVICE` 로 `localstack` 이 어떤 서비스를 실행할 것인지 설정합니다.

만약 아무런 값을 주지 않으면 모든 서비스를 실행하고 그만큼 시간이 오래 걸리기 때문에 필요한 서비스만 넣는 게 좋습니다.

다른 환경변수에 대한 내용은 아래 링크를 참조합니다.

- [https://hub.docker.com/r/localstack/localstack](https://hub.docker.com/r/localstack/localstack)

### 초기화 스크립트 작성

SES 를 사용하려면 발송인 이메일 주소가 사전에 등록되어 있어야 하고 S3 는 버킷을 만들어야 합니다.

localstack 도 실제 메일을 보내거나 버킷을 만들지는 않지만, 등록 API 와 버킷 생성 API 를 사전에 수행하지 않은 경우 에러 응답을 내려줍니다.

SDK 를 활용해서 테스트 코드 실행 전 등록 API 를 수행해도 되지만 **초기화 스크립트** 를 활용하면 편리하게 사전작업을 할 수 있습니다.

`localstack` 은 컨테이너 실행 시 `/docker-entrypoint-initaws.d` 경로 밑의 스크립트 파일을 읽어 실행합니다.

이를 활용해 먼저 아래 내용의 스크립트를 `localstack-init` 디렉터리 밑에 생성합니다.

- init.sh

```shell
#!/bin/sh
echo "Init localstack"
awslocal s3 mb s3://test-bucket
awslocal ses verify-email-identity --email-address test@email.com
```

`awslocal` 명령어는 `localstack` API 서버에 요청을 하는 것을 제외하면 [aws cli](https://aws.amazon.com/ko/cli/) 와 사용법이 동일합니다.

내용을 보면 `test-bucket` 이라는 이름의 버킷을 만들고 `test@email.com` 이메일 주소를 인증하는 작업을 수행하게 됩니다.

### docker-compose.yml 작성

이제 docker compose 파일을 아래와 같이 생성합니다.

- docker-compose.yml

```yaml
version: "3.9"

services:
  localstack:
    image: localstack/localstack
    ports:
      - "4566:4566"
    environment:
      - SERVICES=ses,s3
    container_name: localstack
    volumes:
      - "./localstack-init:/docker-entrypoint-initaws.d"
```

### localstack 실행

이제 아래 명령어를 수행하면 컨테이너가 실행되며 로그를 확인하면 초기화 스크립트를 실행했고 S3 와 SES 서비스가 4566 포트에 올라온 것을 확인할 수 있습니다.

```shell
$ docker-compose up
```

![localstack start](https://tech.inflab.com/static/77222a038e4d57da6e6a6f9d8439dc82/37523/localstack-start.png)

### 테스트 코드

이제 아래와 같은 간단한 테스트 코드를 작성한 후 실행하면 성공하는 것을 확인할 수 있습니다.

```typescript
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

describe("SES 테스트", () => {
  const client = new SESClient({
    region: "local", // 임의의 region 을 주어도 정상동작합니다.
    credentials: { secretAccessKey: "test", accessKeyId: "test" }, // 계정정보도 임의의 값을 주어도 정상동작합니다.
    endpoint: "http://localhost:4566", // localstack 주소로 변경합니다.
  });

  it("등록한 전송자 주소로 메일 전송요청 시 성공응답을 받는다", async () => {
    // given
    const from = "test@email.com";
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: ["foo@domain.com"],
      },
      Message: {
        Subject: {
          Data: "메일 제목",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: "메일 내용",
            Charset: "UTF-8",
          },
        },
      },
    });

    // when
    const response = await client.send(command);

    // then
    expect(response.$metadata.httpStatusCode).toBe(200);
    expect(response.MessageId).toBeTruthy();
  });

  it("미등록 전송자 주소로 메일 전송요청 시 에러가 발생한다", async () => {
    // given
    const from = "invalid@email.com";
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: ["foo@domain.com"],
      },
      Message: {
        Subject: {
          Data: "메일 제목",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: "메일 내용",
            Charset: "UTF-8",
          },
        },
      },
    });

    // when
    const send = () => client.send(command);

    // then
    await expect(send).rejects.toThrowError("MessageRejected");
  });
});
```

![test result](https://tech.inflab.com/static/638893b8f2ab16ceeacf29dd444abe27/e9131/test-result.png)

## Localstack 사용 시 주의사항

이처럼 localstack 을 이용하면 통합테스트를 하는 데 많은 도움을 받을 수 있지만 몇 가지 주의해야 사항이 있습니다.

### SES API v2 를 지원하지 않음

본 글의 작성일 기준(2021년 12월)으로 아직 SES API 는 v2 버전을 지원하지 않습니다.

사실 처음 SES 테스트를 위해 v2 버전의 SDK 를 사용했고 테스트 시 아래와 같은 에러가 나왔습니다.

![v2 error](https://tech.inflab.com/static/af50d8d7ccb1c244f330666c81380132/37523/v2-error.png)

에러 메시지만 봐서는 원인을 파악하기 쉽지 않았습니다.

하지만 밑의 stacktrace 를 디깅해보니 원인은 `localstack` 이 아래와 같은 응답을 보냈는데 SDK 가 그것을 JSON 으로 parsing 하다가 에러가 발생한 것이었습니다.

```xml
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<title xmlns="http://ses.amazonaws.com/doc/2010-01-31/">404 Not Found</title>
<h1>Not Found</h1>
<p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>
```

404 에러가 발생했다는 것은 SDK 가 수행한 API 가 `localstack` 에 구현되지 않았다는 것으로 추측했습니다.

github issue 를 검색해보니 예상대로 v2 버전을 지원하지 않는 것을 확인하였습니다.

- [https://github.com/localstack/localstack/issues/3179](https://github.com/localstack/localstack/issues/3179)

> 해당 이슈를 보면 최근에 `available-in-pro` 태그가 달린 것으로 보아 프로 버전은 지원하는 것으로 보입니다.

통합테스트를 포기하고 v2 버전을 사용할지 아니면 v1 을 사용할지 고민하다가 v1 을 쓰기로 하였습니다.

아직 **v1 버전이 deprecated 되지 않았으며 테스트를 통해 안정성을 확보하는 것을 우선** 하였기 때문입니다.

### 순차 실행과 멱등성

모든 테스트가 하나의 localstack 컨테이너를 사용하기 때문에 독립성을 위해 순차 실행을 해야 합니다.

`jest` 에서는 순차 실행을 위해 `--runInBand` 옵션을 사용합니다.

또한 특정 테스트가 `localstack` 의 상태를 변경하는 경우 다른 테스트 실행 전에 상태를 되돌리는 작업을 하지 않는다면 순차 실행을 하는 경우라도 테스트가 실패할 수 있습니다.

즉 멱등성이 보장되지 않을 수 있습니다.

위와 같은 이유로 순차 실행은 불가피하지만, 테스트의 개수에 비례하여 속도가 느려진다는 단점이 있습니다.

이를 해결하기 위해 **코드를 여러 모듈로 분리하고 전체 테스트 시 각 모듈은 병렬로 수행되지만, 모듈 내부에서만 순차 실행** 하는 방법을 생각해볼 수 있습니다.

현재 저희는 `Nest.js` 프레임워크를 사용하며 서비스별로 `monorepo` 로 구성되어 있습니다.

그래서 서비스별로 병렬로 실행하며 각 서비스 테스트는 차례대로 실행하도록 하였습니다.

- package.json

```text
{
  "scripts": {
    // 각 서비스의 테스트는 순차실행합니다
    "test:ci-service-a": "jest app/service-a --runInBand",
    "test:ci-service-b": "jest app/service-b --runInBand",
    "test:ci-service-c": "jest app/service-c --runInBand",
    "test:ci-all": "run-p test:ci-*" // 모든 모듈은 병렬로 실행합니다
  }
}
```

위처럼 구성한 경우 총 테스트 시간은 테스트가 실행되는 서버환경에 따라 오차가 있지만 세 서비스 중 가장 오래걸리는 테스트의 시간과 일치하게 됩니다.

### CI 에서 localstack 이 완전히 실행된 이후에 테스트 실행해야 함

localstack 은 컨테이너가 실행된 이후에도 초기화 과정이 필요하기 때문에 컨테이너 실행 후 바로 테스트 실행 하는 경우 때때로 실패할 수 있습니다.

로컬환경에서는 컨테이너를 계속 실행해두기에 괜찮지만, CI 에서는 매번 실행하기에 문제가 될 수 있습니다.

이를 해결하기 위해 컨테이너를 최대한 일찍 시작한 후 다른 사전작업을 하면서 완료되기를 기대하거나
초기화가 완료될 때까지 **주기적으로 localstack 으로 http 요청을 수행해 정상 응답이 올 때까지 대기** 하는 방법이 있습니다.

다만 주의할 점은 컨테이너의 `/docker-entrypoint-initaws.d` 경로에 스크립트를 넣은경우 **해당 스크립트는 http 서버가 올라간 이후 실행됩니다.**

이 경우에는 `localstack` 컨테이너 로그를 계속 확인해서 해당 스크립트가 실행되었는지 확인해야 합니다.

예를 들면 아래와 같은 스크립트의 실행이 필요한 경우

```shell
#!/bin/sh
echo "Init localstack"
awslocal s3 mb s3://test-bucket
echo "Init localstack finished"
```

아래 스크립트를 컨테이너를 올린 이후 실행하여 컨테이너 로그에 `Init localstack finished` 가 나올 때까지 기다립니다.

```shell
#!/bin/sh
echo "checking if localstack id ready"

while true; do
  echo "checking localstack..."
  if docker logs -n 3 localstack 2>&1 | grep -q 'Init localstack finished'; then
    break
  fi
  sleep 3
done
```

## 마무리

지금까지 통합테스트를 위한 `localstack` 도입과정을 살펴보았습니다.

인프런 이직 후 처음으로 `AWS` 와 `localstack` 을 사용하는 거라 많은 시행착오를 거친것 같습니다.

`testcontainers` 와 `docker` 로 시작해서 계속해서 trade off 가 있는 선택지가 발생했고 어떤 것이 좋을지 고민한 과정이 기억에 남습니다.
이 글이 `localstack` 을 도입하려는 누군가에게 도움이 되기를 바라봅니다.

마지막으로 긴 글 읽어주셔서 감사합니다.
