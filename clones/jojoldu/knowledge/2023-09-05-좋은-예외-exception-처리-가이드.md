---
topic: "좋은 예외(Exception) 처리 가이드"
source_type: other
source_url: "https://jojoldu.tistory.com/734"
authorship: self
published_at: 2023-09-05
---
# 좋은 예외(Exception) 처리

**작성자:** 향로 (기억보단 기록을)
**작성일:** 2023. 9. 5.

좋은 예외 처리는 견고한 프로그램을 만들고, 좋은 사용자 경험을 줄 수 있다.

예외 처리를 통해 애플리케이션이 예기치 않게 종료되는 것을 방지하고, 갑작스런 종료 대신 사용자는 무엇이 잘못되었는지, 그리고 가능하다면 어떻게 바로잡을 수 있는지에 대한 의미 있는 오류 메시지를 받을 수 있다.

뿐만 아니라 좋은 예외처리는 개발자가 문제를 진단하는 데 큰 도움이 되어 이로 인해 문제 해결 시간이 단축된다.

특히, 복잡한 시스템에서 여러 단계의 프로세스가 있는 경우 예외는 프로세스의 위치에 따라 다르게 처리되어 적절한 예외 처리는 이러한 프로그램의 프로세스를 관리하는 데 유연성을 제공한다.

반면, 이를 위해 과도하게 사용하면 메인 비즈니스 로직이 무엇인지 파악하기 힘들 정도로 너무 많은 오류 처리를 가지고 있는 코드가 되기도 한다.

이번 글에서는 좋은 코드를 다루기 위해 필요한 오류 처리 (예외 다루기)를 이야기한다.

> Node.js, Java 등에서도 함께 사용할 수 있는 내용들을 고려했다.
>
> 예제 코드는 TS로 구현되어있다. (우리 팀원들을 위한 글이니깐)
>
> 예외와 함께 다니는 로그에 대해서도 함께 이야기 하고 싶지만, 이후에 별도로 다룬다.

## 복구 가능한 오류와 불가능한 오류 구분하기

가장 먼저 할 것은 **복구 가능한 오류와 복구 불가능한 오류를 구분** 하는 것이다.

모든 예외에 대해서 동일한 방식을 적용할 수는 없다. 어떤 예외는 상시로 발생해서 무시할 수 있으며, 어떤 예외는 무시하면 절대 안되는 경우도 있다.

이들을 구분없이 다룬다면 사용자는 불편하고, 개발자는 상시로 발생하는 알람으로 점점 더 시스템의 문제에 등한시 하게 된다. 그래서 이들을 구분해서 **예외가 발생했을때 어떻게 처리할지** 결정해야 한다.

### 복구 가능한 오류

복구 가능한 오류는 일반적으로 **시스템 외적인 요소로 발생하는 치명적이지 않은 오류** 이다.

사용자가 잘못된 전화번호를 입력한다면 이는 시스템을 멈춰야할 정도의 문제가 아니다. 사용자에게 전화번호가 잘못되었으니 다시 입력하라는 오류 메세지를 제공하고 다시 입력받으면 된다.

마찬가지로 네트워크 오류가 발생했다면 잠시 후, 다시 요청하면 된다. 이러한 오류는 프로그램이 감지하고 적절한 조치를 취한 후 정상적으로 계속 실행될 수 있는 오류이다.

- 사용자의 오입력
- 네트워크 오류
- 서비스적으로 중요하지 않은 작업의 오류

복구 가능한 오류는 **상시로 발생할 수 있다고 가정하고**, 사용자 (호출자) 에게 가능한 문제 원인을 인지할 수 있게 해야한다.

너무 잦은 복구 가능한 오류의 발생은 복구 불가능한 오류 (개발자의 잘못구현된 코드)일 수 있으니 이를 위해 로그 레벨을 `warn` 으로 두고 임계치를 넘으면 모니터링 알람을 보내도록 구성한다. (단, 여기서의 알람 임계치는 복구 불가능한 오류 보다는 기준이 높아야 한다)

### 복구 불가능한 오류

복구 불가능한 오류는 **별도의 조치 없이 시스템이 자동으로 복구할 수 있는 방법이 없는 경우** 이다. 대부분의 경우, 이 오류의 원인을 해결하기 전에 프로그램이 계속 실행될 수 없다.

- 메모리 부족 (Out of Memory)
- 스택오버플로우 (StackOverflow)
- 시스템 레벨의 오류 (하드웨어 문제나 운영 체제의 중대한 버그)
- 개발자의 잘못 구현된 코드

복구 불가능한 오류는 자주 발생하는 오류가 아니기 때문에 **빠르게 개발자에게 문제 원인을 알려야한다**. 이를 위해 로그 레벨을 `error`로 두고, 로그에서는 에러 트레이스를 남긴 뒤, 임계치를 초과하면 개발자에게 알람을 보내도록 구성해야한다.

## null, -1, 빈 문자열 등 특수값을 예외로 사용하지 않기

예외 상황은 예외 (Exception) 으로 처리해야 한다. 일부 프로젝트에서는 **비정상적인 경우에 예외가 아닌 특정 값을 사용** 하는 경우가 있다.

예를 들어 아래와 같이 사용자의 입력값이 잘못된 경우 -1을 반환하는 코드를 볼 수 있다.

```typescript
// bad
function divideWrong(a: number, b: number): number {
    if (b === 0) {
        return -1;  // 오류를 나타내는 대신 -1 반환
    }
    return a / b;
}
```

이렇게 반환할 경우 호출자는 항상 반환값을 확인해야 한다. 그리고 `-1` 이 의미하는 바가 무엇인지 알아야 한다.

반면, 다음과 같이 예외를 반환하는 경우는 호출자가 항상 예외를 처리해야 한다. 그리고 예외의 의미를 알기 위해서는 예외의 타입을 확인하면 된다.

```typescript
// good
function divideRight(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Division by zero is not allowed.");  // 오류를 throw
    }
    return a / b;
}
```

이 외에도 특수값을 사용하는 것보다 예외를 사용하는 것의 장점은 다음과 같다.

- 정확히 어떤 문제인지 표현할 수가 있다.
- 해당 문제의 상세 메세지를 포함시킬 수 있다.
- 어떤 경로로 이 문제가 발생한 것인지 확인할 수 있는 Stack Trace를 알 수 있다.
- 더 깔끔한 코드를 작성할 수 있다

## 문자열을 throw 하지 않기

JS/TS 에서 종종 볼 수 있는 경우인데, 다음과 같이 문자열을 그대로 `throw` 하는 경우가 있다.

```typescript
// bad
throw '유저 정보를 받아오는데 실패했습니다.';
```

문자열을 throw하면 다양한 형태의 CustomException 을 구분할 수 있는 방법은 오직 메세지 내용만으로 구분해야 한다. 뿐만 아니라 스택트레이스 등 다양한 에러 정보가 없어 문제를 해결하는데 어려움이 생기게 된다.

그래서 다음과 같이 예외는 항상 Error (Exception) 객체를 사용해야 한다.

```typescript
// good
throw new Error ('유저 정보를 받아오는데 실패했습니다.');
throw new NotFoundResourceException ('유저 정보를 받아오는데 실패했습니다.');
```

이렇게 Exception 객체를 던지면 오류에 대한 보다 의미 있는 정보를 제공할 수 있다.

## 추적 가능한 예외

실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다. 그래서 다음의 내용이 예외에 담겨야 한다.

- 오류 메세지에 어떠한 값을 사용하다가 실패하였는지
- 실패한 작업의 이름과 실패 유형

이들이 포함되어 있어야 운영 환경에서 예외가 발생했을 때 조금이라도 정확하고 빠르게 대응 가능해진다.

예를 들어 다음과 같은 형태로 예외를 생성하면 입력값에 대한 오류인것은 알겠지만, **어떻게 입력했길래 검증 로직에서 실패한 것인지 알 수가 없다**.

```typescript
// bad
throw new IllegalArgumentException('잘못된 입력입니다.');
```

반면 다음과 같이 예외를 남기면, 어떤 이유로 잘못된 것인지 빠르게 파악할 수 있다.

```typescript
// good
throw new IllegalArgumentException(`사용자 ${userId}의 입력(${inputData})가 잘못되었다.`);
```

## 의미를 담고 있는 예외

예외의 이름은 그 예외의 원인과 내용을 정확하게 반영해야 한다. 코드를 읽는 사람이 예외 이름만 보고도 해당 예외가 왜 발생했는지 어느 정도 추측할 수 있어야 한다.

- 코드의 가독성 향상: 의미 있는 이름을 가진 예외는 코드를 읽는 사람에게 문맥을 제공한다.
- 디버깅 용이성: 오류의 원인을 빠르게 파악하고 수정할 수 있다.

```typescript
// bad
class CustomException extends Error {}

function connectToDatabase() {
    throw new CustomException("Connection failed because of invalid credentials.");
}
```

위 예외는 너무 포괄적인 의미를 담고 있다. (`CustomException`) 이를 좀 더 유의미한 예외로 만들어서 개선할 수 있다.

```typescript
// good
class InvalidCredentialsException extends Error {}

function connectToDatabase() {
    throw new InvalidCredentialsException("Failed to connect due to invalid credentials.");
}
```

## Layer에 맞는 예외

Repository (혹은 DAO) 에서 HttpException을 던진다거나 Presentation (Controller) 에서 SQLException을 처리하는것은 Layer별 역할에 맞지 않다. 각 계층에 맞게 적절한 예외를 정의하고 던져야 한다.

일반적인 3계층 웹 애플리케이션에서는 다음과 같이 계층에 맞는 예외를 던지는 것이 유용하다.

```typescript
// Data Access Layer
function fetchUserData(userId: string): any {
    // ...
    throw new DataAccessException("Failed to fetch user data from database.");
}

// Business Logic Layer
function getUserProfile(userId: string): any {
    try {
        const userData = fetchUserData(userId);
        // ... some business logic
    } catch (error) {
        if (error instanceof DataAccessException) {
            throw new BusinessLogicException("Error processing user profile.");
        }
    }
}

// Presentation Layer
function displayUserProfile(userId: string): void {
    try {
        const profile = getUserProfile(userId);
        // ... display logic
    } catch (error) {
        if (error instanceof BusinessLogicException) {
            throw new PresentationException("Error displaying user profile.");
        }
    }
}
```

각 계층에서 발생한 예외들은 가능한 가장 늦은 위치(글로벌 에러 핸들러 등)에서 처리한다.

## 예외 계층 구조 만들기

예외를 가능한 계층 구조로 만들어서 사용한다. 기준에 맞게 분류한 Exception들은 그에 맞게 일관된 처리 방법을 적용할 수 있다.

```typescript
// bad
class DuplicatedException extends Error {}
class UserAlreadyRegisteredException extends Error {}

// good
class ValidationException extends Error {}
class DuplicatedException extends ValidationException {}
class UserAlreadyRegisteredException extends ValidationException {}
```

## 외부의 예외 감싸기

외부 SDK, 외부 API를 통해 발생하는 예외들은 하나로 묶어서 처리한다.

```typescript
// bad
function order() {
  const pay = new Pay();
  try{
      pay.billing();
      database.save(pay);
  } catch (e) {
      logger.error(`pay fail`, e);
  }
}
```

이렇게 처리하면 외부 라이브러리에서 발생하는 문제와 내부 로직의 문제를 구분하기 어렵다. 다음과 같이 의존성을 분리하는 것이 좋다.

```typescript
// good
function billing() {
  try {
    pay.billing();
  } catch (e) {
    // 외부 예외들을 파악하여 우리 서비스의 예외로 변환
    throw new BillingException (e);
  }
}

function order() {
  const pay = new Pay();
  billing();

  try{
    database.save(pay);
  } catch (e) {
    pay.cancel();
  }
}
```

## 다시 throw할 거면 잡지 않기

catch 절에서 아무 작업도 없이 바로 throw 를 하는 코드는 불필요하다. 로깅이나 예외 변환 등 작업이 필요한 것이 아니라면 try-catch를 사용하지 않는 것이 좋다.

```typescript
// bad
function something() {
  try {
    // 비즈니스 로직
  } catch (e) {
    throw e
  }
}
```

## 정상적인 흐름에서 Catch 금지 (무분별한 Catch 금지)

프로그램의 정상적인 흐름을 제어하기 위해 예외를 사용하지 않는다. 예외는 오직 예외적인 경우에만 사용해야 한다.

```typescript
// bad (예외를 흐름 제어로 사용)
function display() {
  try {
    const data = fetchDataFromAPI();
    process(data);
  } catch (error) {
      if (error instanceof NoDataFoundError) {
          displayEmptyState();
      }
  }
}

// good (조건문으로 처리)
function display() {
  const data = fetchDataFromAPI();
  if (!data) {
    displayEmptyState();
    return;
  }
  process(data);
}
```

## 가능한 늦게 예외를 처리 한다

Exception을 throw 하자마자 잡지 않고, 해당 예외를 처리해야 하는 가장 최상위 계층(글로벌 핸들러, 미들웨어 등)에서 처리한다.

```typescript
// good: 최상위 계층(예: Nest.js Exception Filter)에서 공통 처리
@Catch()
export class DivideZeroExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 공통 응답 포맷팅 및 로깅
  }
}
```

이렇게 하면 개별 비즈니스 로직 코드가 깔끔해지고, 예외 처리의 통일성을 기할 수 있다.

## 마무리

프로그램을 만들면서 오류를 피할 수 없다. 그래서 좋은 코드는 오류를 어떻게 다루는지가 중요하다.

예외 처리와 로깅에 대한 기준을 세우고 이를 기록하며 개선해 나가는 것은 프로그래밍 언어와 무관하게 개발자 커리어에 큰 도움이 된다. 계속해서 자신만의 기준을 기록해두는 것을 추천한다.
