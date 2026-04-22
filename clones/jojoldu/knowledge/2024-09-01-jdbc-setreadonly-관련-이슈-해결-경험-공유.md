---
topic: "JDBC setReadOnly 관련 이슈 해결 경험 공유"
source_type: other
source_url: "https://tech.inflab.com/20240901-jdbc-set-readonly-issue"
authorship: self
published_at: 2024-09-01
---
# JDBC setReadOnly 관련 이슈 해결 경험 공유

**작성자:** 인트(INT), 제이(Jay)  
**날짜:** 2024-09-01

안녕하세요. 인프랩 백엔드 개발자 인트, 제이입니다.

인프랩의 백엔드 서버는 대부분 Node.JS로 구성되어 있지만 일부 JVM 서버도 함께 운영됩니다.

JVM 서버의 경우 모니터링으로 핀포인트를 활용하고 있습니다.

최근에 핀포인트를 통해 간헐적으로 원인을 파악하기 어려운 에러 알림이 발생했었는데, 이에 대한 해결 경험을 공유하고자 합니다.

## 문제가 발생한 환경

- Spring Boot 3.2.5
- Spring JDBC 6.1.6
- PostgreSQL Driver 42.6.2
- AWS Advanced JDBC Wrapper 2.2.3
- AWS Aurora PostgreSQL 14.9.6

## 문제 상황

핀포인트에서는 다음과 같은 에러 메시지를 확인할 수 있었습니다.

이번에 경험한 에러는 **특정 API에서만 발생하는 게 아닌 불특정 조회 API에서 간헐적으로 발생** 했습니다.

![error](https://tech.inflab.com/static/3bc4d257e114b995afa4add2d6d6f6c1/37523/error.png)
핀포인트 로그

에러 메시지는 다음과 같습니다.

```text
Cannot change transaction read-only property in the middle of a transaction
```

핀포인트 로그를 보면 에러는 트랜잭션의 마지막에 commit과 close를 하는 과정에서 발생했습니다.

여기서 특이한 점을 발견할 수 있었습니다.

- 커넥션을 반납하는 과정에서 의문의 쿼리 요청이 발생
- 에러가 발생했지만 이후 정상적으로 다른 트랜잭션이 처리됨 (API는 정상적으로 응답)

## 에러 발생 위치

먼저 에러 메시지를 통해 어떠한 코드에서 에러가 발생했는지 파악하고자 했습니다.

에러 메시지를 해석하면 트랜잭션 내에서 읽기 전용 속성을 변경할 수 없다는 의미라는 것을 확인할 수 있습니다.

![query-error](https://tech.inflab.com/static/d3510fb5c2f2c179435da37cad8b9b0d/37523/query-error.png)

핀포인트에서 에러 발생지점 근처에 사용한 클래스는 `PgConnection`, `ProxyConnection`, `PgStatement` 라는걸 확인할 수 있습니다.

이를 통해 PostgreSQL JDBC 드라이버 내부에서 발생했다는 것을 의심할 수 있었습니다.

실제로 드라이버의 `PgConnection` 클래스 내부 [setReadOnly 메서드](https://github.com/pgjdbc/pgjdbc/blob/6fa2ca102b842cebad9b45db7c147e6d41d3b93d/pgjdbc/src/main/java/org/postgresql/jdbc/PgConnection.java#L892-L907) 에 동일한 에러 메시지를 출력하는 코드를 찾을 수 있었습니다.

![setReadOnly](https://tech.inflab.com/static/8e57d0e48c294e237eda97ce8c10d393/37523/set-read-only.png)

메서드의 첫 번째 분기에 해당하면 에러가 발생하며 `queryExecutor`의 트랜잭션 상태가 `IDLE`이 아닌 경우입니다.

`queryExecutor.getTransactionState()`는 `TransactionState` 열거형을 반환하며, 다음 세 가지 상태를 가집니다.

```java
public enum TransactionState {
  IDLE,
  OPEN,
  FAILED
}
```

이름을 통해 예상할 수 있듯이 트랜잭션 시작 전에는 `IDLE`, 트랜잭션이 시작되면 `OPEN`이 됩니다.

`PgConnection`은 JDBC의 `Connection` 인터페이스를 구현하고 있으며, 해당 인터페이스 `setReadOnly` 메서드의 설명을 보면 다음과 같습니다.

![readonly-desc](https://tech.inflab.com/static/9270eeb83f6b385a73d134b38cfd822c/37523/readonly-desc.png)

`setReadonly`는 **드라이버에게 데이터베이스 최적화를 위한 힌트를 제공하는 메서드로, 트랜잭션 중에는 호출할 수 없다** 고 명시되어 있습니다.

## 의문의 쿼리

이후 트랜잭션 종료 시점에 호출된 의문의 쿼리를 살펴보았습니다.

핀포인트에서 확인한 실행한 쿼리는 다음과 같습니다.

```sql
SELECT SERVER_ID,
       CASE WHEN SESSION_ID = 'MASTER_SESSION_ID' THEN TRUE ELSE FALSE END,
       CPU,
       COALESCE(REPLICA_LAG_IN_MSEC, 0),
       LAST_UPDATE_TIMESTAMP
FROM aurora_replica_status()
WHERE EXTRACT(EPOCH FROM (NOW() - LAST_UPDATE_TIMESTAMP)) <= 300
   OR SESSION_ID = 'MASTER_SESSION_ID'
```

이 쿼리는 백엔드 서버 코드상에는 존재하지 않았습니다.

하지만 `FROM`절에 `aurora_replica_status()`라는 함수를 호출하는 것으로 보아, 저희가 사용하는 `Aurora PostgreSQL`과 관련된 코드에서 발생한 것으로 추정할 수 있었습니다.

## AWS JDBC 래퍼 드라이버

`AWS Aurora`에는 쓰기 인스턴스가 다운되었을 때 읽기 인스턴스 중 하나가 쓰기 인스턴스로 승격되는 `failover` 기능이 있는데요.

AWS에서는 `failover`로 발생하는 다운타임을 최소화하기 위해, 기존 JDBC 드라이버를 감싼 [래퍼 드라이버](https://github.com/aws/aws-advanced-jdbc-wrapper) 를 제공하고 있습니다.

인프랩은 메인 데이터베이스로 `AWS Aurora PostgreSQL` 클러스터를 사용하며, 한 대의 쓰기 인스턴스와 여러 읽기 인스턴스로 구성되어 있습니다.

JVM 백엔드 서버는 강의 도메인을 담당하며 결제, 정산 등 서비스의 중요 도메인을 다룹니다.

이에 따라 높은 가용성이 필요했고 쓰기 인스턴스가 교체되는 상황에서 빠른 failover(fast failover)를 이루고자 래퍼 드라이버를 사용하고 있습니다.

## Failover Plugin

AWS 래퍼 드라이버는 fast failover 뿐만 아니라 다른 여러 가지 기능을 제공합니다. 드라이버는 이를 플러그인 형태로 제공하며 드라이버 설정을 통해 원하는 플러그인을 활성화할 수 있습니다.

[GitHub에 존재하는 공식 문서](https://github.com/aws/aws-advanced-jdbc-wrapper/blob/main/docs/using-the-jdbc-driver/using-plugins/UsingTheFailoverPlugin.md) 를 살펴보면 failover가 어떠한 방식으로 이루어지는지 볼 수 있습니다.

![aws-driver](https://tech.inflab.com/static/362c743b366935534489d7ffc78a2eb2/37523/aws-driver.png)
출처: [aws-advanced-jdb-wrapper github](https://github.com/aws/aws-advanced-jdbc-wrapper/blob/main/docs/using-the-jdbc-driver/using-plugins/UsingTheFailoverPlugin.md)

애플리케이션에서 JDBC 메서드를 실행하면 원본 Connection(PgConnection) 대신 드라이버가 감싼 커넥션의 메서드가 먼저 호출됩니다.

만약 쓰기 인스턴스가 실패한 경우 드라이버는 내부 topology 캐시를 통해 새로운 쓰기 인스턴스를 찾습니다. 이후 물리적 커넥션을 교체해 새롭게 승격된 인스턴스를 더 빠르게 사용할 수 있게 합니다.

저희는 이 래퍼 드라이버가 의문의 쿼리를 실행했다는 것을 의심했고, 드라이버 코드 저장소를 살펴보니 [의문의 쿼리와 동일한 코드](https://github.com/aws/aws-advanced-jdbc-wrapper/blob/0f8b5aa7496c34e97b945d36e42241975cce75d1/wrapper/src/main/java/software/amazon/jdbc/dialect/AuroraPgDialect.java#L40-L47) 를 찾을 수 있었습니다.

쿼리를 만드는 메서드 이름은 `getTopologyQuery`며 클러스터의 상태를 확인해 쓰기 인스턴스의 교체 여부를 파악합니다.

> 앞으로 이 쿼리를 topology 쿼리라고 부르겠습니다.

## 원인 추론

지금까지의 분석을 바탕으로 정리하면 다음과 같습니다.

- 트랜잭션 종료 시 간헐적으로 topology 쿼리가 실행됨
- 해당 쿼리는 AWS에서 제공하는 JDBC 래퍼 드라이버 내부에서 실행됨
- JDBC의 `setReadOnly` 메서드는 트랜잭션 중에 호출할 수 없음

이에 따라 다음과 같은 시나리오로 에러가 발생했을 것으로 추론됩니다.

1. 트랜잭션 종료
2. `TransactionState`가 `IDLE`로 변경됨
3. 특정 조건에서 topology 쿼리가 실행됨
4. `TransactionState`가 다시 `OPEN`으로 변경됨
5. `setReadOnly` 메서드 호출
6. 에러 발생

## 간단한 해결 방안

지금까지의 분석을 통해 이 에러를 해결하는 가장 간단한 방법은 **AWS 래퍼 드라이버를 사용하지 않는 것** 입니다. 왜냐하면 래퍼 드라이버가 트랜잭션 종료 시점에 topology 쿼리를 실행하기 때문에 발생한 문제이기 때문입니다.

저희가 이 드라이버를 사용한 이유는 앞서 언급한 대로 쓰기 인스턴스 장애의 다운타임을 최소화하기 위함이었는데요. 하지만 이러한 장애는 발생 빈도가 낮고 현재 대부분의 백엔드 서버 스택인 Node.JS에는 래퍼 드라이버가 없기에, 일부 JVM 서버만 적용해서 얻는 이점이 크지는 않다고 생각합니다.

그래도 다음과 같은 이유로 인해 이 방법을 적용하지 않았습니다.

- 앞서 언급한 높은 가용성을 포기하는 선택지는 최대한 배제
- 문제의 근본적인 원인을 파악하지 않고 단순히 해당 원인을 제거하는 게 적절한가에 대한 의문
- 드라이버 설정을 제대로 하지 않아 발생한 문제일 수 있기에, 이를 파악하는 게 더 중요하다고 판단
- 간헐적으로 발생하는 에러는 원인을 찾기 어렵지만, 해결하는 과정에서 많은 것을 배울 수 있다고 생각

## 에러 재현

> 디버깅 환경: IntelliJ IDEA 2024.2.3

근본적인 원인을 파악하려면 지금까지의 분석이 맞는지 검증이 필요합니다. 또한 다음과 같은 의문을 해결해야 합니다.

- topology 쿼리가 트랜잭션 종료 과정에서 실행되는 이유는 무엇인가?
- AWS 드라이버는 어떤 상황에서 topology 쿼리를 실행하는가?
- 트랜잭션 종료 과정에서 `setReadOnly` 메서드가 호출되는 이유는 무엇인가?

이를 위해 로컬에서 디버깅을 통해 에러를 재현해 보기로 했습니다. 에러는 불특정 조회 API에서 간헐적으로 발생했기 때문에 다음과 같은 방법을 사용했습니다.

- 임의의 조회 API를 선택
- 에러 발생 위치에 중단점을 설정하고 디버그 모드로 서버 실행
- 부하 테스트 스크립트를 사용해 선택한 조회 API를 반복 호출

스크립트를 실행한 후 일정 시간이 지나 중단점이 트리거 되었습니다.

![error-break](https://tech.inflab.com/static/522f849b7dfb3947372637e4194205b8/37523/error-break.png)

위 화면에서 파악할 수 있는 정보는 다음과 같습니다.

- (A) `CourseApiRepository` 의 `findBySlug` 메서드 실행 시 에러 발생
- (B) `readOnly` 상태를 `true`로 바꾸려고 시도
- (C) `TransactionStatus` 의 상태는 `OPEN`
- (D) 현재 커넥션의 `readOnly` 값은 `true`

추측한 대로 `TransactionStatus` 의 상태가 `OPEN`인 상황에서 `setReadOnly` 메서드가 호출되었습니다.

`findBySlug` 메서드는 `@Transactional(readOnly = true)` 어노테이션이 적용된 `getCourseWithVoucher` 메서드에서 실행되었으며 이 메서드의 가장 첫 번째 쿼리 호출입니다.

![first-query.png](https://tech.inflab.com/static/5878245bb7f592050bb101fd774226c2/37523/first-query.png)

여기서 몇 가지 의문점이 더 발생합니다.

- 핀포인트에는 트랜잭션을 commit 하는 과정에서 에러가 발생했다고 나오지만, 로컬에서는 트랜잭션의 첫 번째 쿼리에서 발생
- `PgConnection`의 readOnly 상태는 이미 `true`

## 내부 라이브러리 코드 파악

IntelliJ IDEA에서 내부 드라이버의 동작을 확인하기 위해 `Hide Frames from Libraries` 옵션을 해제하여 스택을 살펴보았습니다.

![all-frame.png](https://tech.inflab.com/static/21de472047906296254736d40a0c0c84/37523/all-frame.png)

- `HikariProxyConnection` → `ProxyConnection` → `ConnectionWrapper` → `PgConnection` 순으로 호출됨을 확인
- 가장 바깥쪽에서 `setReadOnly` 를 호출하는 클래스는 `LazyConnectionDataSourceProxy` 의 `getTargetConnection`

`getTargetConnection` 메서드는 커넥션 풀에서 트랜잭션에 사용할 커넥션을 가져옵니다. 이 메서드는 아래 두 조건을 만족할 때 target의 `setReadOnly`를 호출합니다.
- `this.readOnly` 가 true
- `readOnlyDataSource` 가 null

디버깅 결과 `this.readOnly`는 true 이며 `readOnlyDataSource`는 `null`이었기에 `setReadOnly`가 호출되었습니다.

## Topology 캐시

AWS 래퍼 드라이버가 topology 쿼리를 수행하는 시점을 분석한 결과:

- 드라이버는 `AuroraHostListProvider`의 `getTopology` 메서드를 통해 정보를 조회
- `topologyCache`에 정보가 없거나 만료(30초)된 경우 topology 쿼리를 수행
- `setReadOnly` 같은 JDBC 메서드가 실행될 때 이 캐시 확인 작업이 동반됨

결론적으로 다음과 같은 시나리오에서 에러가 발생합니다.
1. `LazyConnectionDataSourceProxy`의 `getTargetConnection` 호출
2. `this.target.setReadOnly` 호출
3. AWS 래퍼 드라이버의 `setReadOnly` 내부에서 topology 캐시 만료 확인
4. 캐시 만료로 인해 topology 쿼리 수행 -> `PgConnection`의 상태가 `OPEN`으로 변경됨
5. 이후 `PgConnection.setReadOnly` 호출 시 트랜잭션 중(OPEN)이므로 에러 발생

## 마지막 의문점 해결

핀포인트에서 확인한 트랜잭션 종료(commit) 시점의 에러를 재현하기 위해 조건부 중단점을 설정했습니다.

![reset-connection-breakpoint.png](https://tech.inflab.com/static/5061e59928769895e903be2bc8ab41be/37523/reset-connection-breakpoint.png)

- (A) `commit` 수행으로 `TransactionStatus`가 `IDLE`로 변경됨
- (B) `DataSourceUtils.resetConnectionAfterTransaction` 수행
- (C) `readOnly` 설정을 리셋하기 위해 `setReadOnly(false)` 호출
- (D) 래퍼 드라이버가 호출되면서 topology 캐시가 만료된 경우 다시 쿼리를 수행하여 상태를 `OPEN`으로 만듦
- 결과적으로 `setReadOnly` 호출 시 에러 발생

## 해결 방법

### setReadOnlyDataSource

`LazyConnectionDataSourceProxy`의 `getTargetConnection` 메서드에서 `setReadOnly`를 호출하지 않도록 설정을 변경해야 합니다.

Spring 6.1.2부터 추가된 `setReadOnlyDataSource` 메서드를 활용할 수 있습니다. JavaDoc에 따르면 읽기 전용 DataSource를 사전에 설정하면 매번 트랜잭션의 시작과 끝에서 `readOnly` 값을 스위치하지 않게 됩니다.

### LazyConnectionDataSourceProxy 추가기능

`setReadOnlyDataSource`를 설정하면 `@Transactional`의 `readOnly` 옵션에 따라 DataSource를 자동으로 분기할 수 있습니다. `this.readOnly`가 `true`일 때 `readOnlyDataSource`가 있으면 이를 반환하고, 그렇지 않으면 기본 `targetDataSource`를 사용합니다.

### 최종 설정

기존 `RoutingDataSource`를 사용하던 방식에서 다음과 같이 `LazyConnectionDataSourceProxy`를 활용하는 방식으로 수정했습니다.

![new-config.png](https://tech.inflab.com/static/72a35094a571b4d1ba6f444297ba5ca8/37523/new-config.png)

## 요약

- AWS 래퍼 드라이버 환경에서 트랜잭션 시작/종료 시 `setReadOnly` 호출 시 간헐적으로 에러 발생
- 원인은 래퍼 드라이버가 상태 확인을 위해 던지는 topology 쿼리가 `setReadOnly` 보다 먼저 실행되어 트랜잭션 상태를 `OPEN`으로 만들기 때문
- `PgConnection`은 트랜잭션 도중 `setReadOnly` 호출을 허용하지 않음
- `LazyConnectionDataSourceProxy`에 `setReadOnlyDataSource`를 설정하여 트랜잭션 전후의 불필요한 `setReadOnly` 스위칭을 제거하여 해결

## 마무리

쉽게 해결하는 방법이 있던 이슈였지만 지속적인 디버깅을 통해 스프링이 트랜잭션을 어떻게 관리하는지, 그리고 사용 중인 드라이버의 내부 동작이 어떠한지 깊이 이해할 수 있는 계기가 되었습니다.

긴 글 읽어주셔서 감사합니다.
