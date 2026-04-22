---
topic: "인프랩의 Java와 Kotlin 혼용 사용기"
source_type: other
source_url: "https://tech.inflab.com/20240110-java-and-kotlin"
authorship: self
published_at: 2024-01-10
---
# 인프랩의 Java와 Kotlin 혼용 사용기

**저자:** 인트(INT)  
**날짜:** 2024년 1월 10일

---

안녕하세요. 인프랩 백엔드 개발자 인트입니다.

인프랩에서는 대부분의 서버 애플리케이션을 Node.js을 사용해 개발하고 있습니다.

하지만 검색엔진과 같은 Spring Boot 기반의 서비스도 존재합니다.

검색엔진 서비스는 MongoDB Atlas Search를 메인 기술로 사용하고 있는데요.

색인과 검색에 특화된 서비스였고 일반적인 비즈니스 로직을 다루지는 않았습니다.

하지만 최근 새로운 강의 에디터 프로젝트는 비즈니스 로직을 가지는 서버로, Spring Boot와 JPA를 사용하고 있습니다.

Spring Boot와 JPA를 사용하는 프로젝트를 위해 Java 또는 Kotlin을 사용할 수 있는데요.

여러 고민 끝에 저희는 **Java와 Kotlin을 혼용해서 사용하기로 결정** 했습니다.

이번 글에서는 이러한 선택을 한 이유와 어떻게 사용하고 있는지 공유하고자 합니다.

## Java만 사용하기

저희가 선택할 수 있는 옵션으로 Java만 사용하는 방법이 있습니다.

스프링 생태계는 Java를 기본 언어로 사용하고 있고, 수 많은 래퍼런스들이 Java를 기준으로 작성되어 있습니다.

JPA(Java Persistence API) 또한 이름에도 나와 있듯이 Java를 기준으로 나온 표준입니다.

이런 이유로 Java를 사용하는 것이 가장 안전한 선택이라고 생각합니다.

하지만 다음과 같은 이유로 Java를 메인으로 사용하지 않았습니다.

### Null safety 부재

Java를 사용하다 보면 만나는 NullPointException은 자주 따라다니는 골칫거리인데요.

NullPointException은 흔히 “10억 달러의 실수” 라고 하는 Null을 참조하려고 할 때 생기는 예외입니다.

Java는 Nullable을 표현하는 타입 시스템이 없기 때문에, 개발자가 직접 Null 여부를 체크해야 합니다.

저의 팀은 대부분 TypeScript를 사용해 백엔드 코드를 작성하고 있는데요.

TypeScript는 오래전부터 [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 이라는 문법을 사용해 Null safety 한 코드를 작성할 수 있습니다.

또한 Node.js 14.0.0 버전 이후부터는 JavaScript로도 Optional Chaining을 사용할 수 있습니다.

Nullable을 표현할 수 있는 타입 시스템과 Optional Chaining을 적극 사용하던 저희에게, Null safety 부재는 큰 단점으로 다가왔습니다.

그동안 **IDE의 도움을 받아 Null safety를 보장받는 것에 익숙** 해졌기 때문입니다.

Java를 오랜 기간 사용해 오신 분들에게는 Null 확인을 누락하는 실수 가능성이 작습니다.

하지만 저희는 이러한 숙련도를 갖추기까지는 꽤 긴 시간이 걸릴 것으로 생각했습니다.

> 사실 Java도 Null safety 한 코드를 작성할 수 있는 방법이 존재합니다.
> 바로 [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html) 클래스를 사용하는 것인데요.
> 하지만 해당 기능에 대해 아직 익숙하지 않고 올바르게 사용하기 위한 숙련도가 부족하다고 생각했습니다.

### 비교적 최신 편의 문법의 미지원

이 내용은 이전 Null safety에서 이어지는 내용일 수 있다고 생각하는데요.

저희가 메인으로 사용하는 언어는 JavaScript/TypeScript이고 관련 문법들을 익숙하게 사용하고 있습니다.

또한 TypeScript는 Java에 비해 최근에 나온 언어이기 때문에 개발에 편리한 문법들이 조금 더 많다고 생각합니다.

따라서 Java를 메인으로 사용하는 경우 불편함을 느낄 수 있다고 생각합니다.

불편함을 느끼는 대표적인 사례 하나를 소개하겠습니다.

Java에서는 JavaScript처럼 메서드의 파라미터에 기본값을 지정하기 위한 문법은 지원하지 않습니다.

저희는 날짜와 같이 제어하기 어려운 값들을 사용하는 로직을 테스트하기 위해 기본 파라미터를 적극 사용합니다.

```typescript
export default class Order {

  // 인자 호출이 없을 경우 LocalDateTime.now()를 사용
  discountWith(now = LocalDateTime.now()) {
    if (now.dayOfWeek() == DayOfWeek.SUNDAY) {
      this._amount = this._amount * 0.9
    }
  }
}
```

Java에서는 오버로딩이나 시간을 관리하는 클래스를 주입하는 방법 등 기존 대비 번거로운 방법을 사용해야 합니다.

```java
public class Order {

  public void discountWith(LocalDateTime now) {
    if (now.getDayOfWeek() == DayOfWeek.SUNDAY) {
      this._amount = this._amount * 0.9;
    }
  }

  public void discountWith() {
    discountWith(LocalDateTime.now());
  }
}
```

물론 최신 버전의 Java를 사용하면 조금 더 편리한 문법을 사용할 수 있습니다.

예를 들면 Multi-line String, Record, Switch Expression 등이 있습니다.

하지만 아직 저희가 사용하는 주력 언어에 비하면 부족하다는 생각이 들었습니다.

## Kotlin만 사용하기

Kotlin을 사용하면 지금까지 언급했던 문제들을 해결할 수 있습니다.

Kotlin은 Null safety를 지원하는 언어이며, TypeScript와 비슷한 문법을 지원합니다.

따라서 Node.js를 사용하던 동료가 새로 합류하는 경우 러닝 커브가 낮아지는 효과도 있습니다.

그래서 Kotlin을 사용하는 게 저희 팀에서는 가장 합당한 선택이라고 생각했습니다.

하지만 모든 코드를 Kotlin만 사용하는 것에도 몇 가지 문제가 있었습니다.

### JPA와 궁합이 좋지 않음

앞서 언급했듯이 JPA는 Java를 기준으로 나온 ORM 표준입니다.

하지만 Kotlin은 개발 철학이 Java, JPA와 맞지 않는 경우가 존재합니다.

Kotlin과 JPA를 키워드로 검색해 보면 다양한 이슈와 해결 방안을 소개하는 글을 쉽게 찾을 수 있습니다.

![kotlin jpa issue](https://tech.inflab.com/static/5d126e5d29d07d1df09b7dbdc42794d5/37523/kotlin-jpa-issue.png)

개인적으로 둘 간에 가장 어울리지 않는 부분은 불변과 가변에 대한 개념이라고 생각합니다.

예를 들면, Kotlin은 `open` 키워드를 사용하지 않은 이상 모든 클래스가 기본적으로 `final`입니다.

또한 data class를 적극 사용하고 가변인 `var`보다는 불변인 `val`을 사용하는 것을 권장합니다.

반면 JPA는 엔티티를 선언할 때 `final` 키워드를 사용하지 않도록 요구합니다.

또한 변경 감지, 지연 로딩 등 런타임에 언제든지 변경될 수 있는 상태를 가지는 것을 자연스럽게 생각합니다.

이러한 불일치를 해결하기 위해 여러 플러그인이 필요하고 지켜야 할 규칙들이 존재합니다.

JVM 환경에 아직 익숙하지 않은 상황에서 이러한 규칙들을 모두 지키는 것은 쉽지 않다고 생각했습니다.

### 번거로운 Private Setter 설정

저희 팀에는 Entity의 내부 Property를 수정하는 경우, 항상 **Entity에 선언한 행위를 표현하는 메서드를 사용** 해야 하는 컨벤션이 있습니다.

Node.js용 ORM에서는 특성상 Property를 `public`으로 선언하기에 외부에서 수정이 가능합니다.

이에 따라 개발자가 이러한 컨벤션을 지키도록 의식적으로 노력해야 합니다.

또한 신규입사자가 이를 잘 지키는지 확인하는 데 시간이 소요됩니다.

반면 JPA를 사용하면 내부 프로퍼티는 `private`으로 선언하고, setter를 노출하지 않도록 할 수 있습니다.

이렇게 하면 프로그래밍 언어 차원에서 컨벤션을 지킬 수 있기 때문에 더 견고한 코드를 작성할 수 있다고 생각합니다.

Kotlin으로 Entity를 선언하는 경우에는 property의 setter를 노출하지 않기 위해 `val` 키워드를 사용합니다.

```kotlin
class Course(
  @Column
  val title: String,
  @Column
  val price: Int,
)
```

하지만 해당 프로퍼티는 클래스 내부에서도 수정이 불가능하고, JPA의 변경 감지 기능도 사용할 수 없습니다.

이를 해결하기 위해 `var` 키워드를 사용하고, setter를 `protected`로 선언하는 방법을 사용할 수 있습니다.

```kotlin
@Entity
class Course(
    title: String,
    price: Int,
) {
    @Column
    var title = title
        protected set
    @Column
    var price = price
        protected  set
}
```

하지만 이렇게 작성하게 되면 생성자와 클래스 내부, 두 번의 Property 선언과 Property마다 `protected set` 문구가 필요합니다.

보통 Java를 Kotlin으로 바꿀 때 이전보다 더 간결해지는 경우가 많은데, 이 경우는 오히려 행사 코드가 늘어난다고 생각합니다.

### 복잡한 QueryDSL 설정

JPA를 사용하는 경우 간단한 데이터 조회는 Spring Data JPA, 복잡한 쿼리는 QueryDSL을 사용하는 사례가 많다고 생각합니다.

그동안 Node.js 기반 ORM을 사용했는데 쿼리빌더가 type-safe하지 않아서 불편함을 느꼈습니다.

그래서 이번에는 이러한 기능을 지원하는 QueryDSL을 사용하기로 했습니다.

QueryDSL은 Java와 Kotlin을 모두 지원하지만, Kotlin을 사용하는 경우 gradle 설정이 복잡해집니다.

사실 QueryDSL은 Java를 사용하는 경우라 할지라도 설정이 복잡하다고 생각합니다.

![querydsl issue](https://tech.inflab.com/static/bfe6547cdd16fb761387e29c5ffb2020/37523/querydsl-issue.png)

설정 작업은 처음 프로젝트 구축 시 한 번만 하면 되기에 큰 문제로 느끼지 않을 수 있습니다.

하지만 QueryDSL이 영향을 받는 다른 프레임워크나 라이브러리들이 업데이트되면 설정을 다시 해야 하는 경우가 발생합니다.

또한 Kotlin으로 QueryDSL을 사용하는 경우 `kapt` 플러그인을 사용해야 하는데요.

`kapt` 플러그인은 Java의 `annotationProcessor`와 같은 역할을 합니다.

이 플러그인의 공식 문서를 보면 현재 관리모드로 더 이상 추가기능을 지원하지 않는다고 나와 있습니다.

![kapt](https://tech.inflab.com/static/22d64f5bc9acdd5d160df860dcff9c02/37523/kapt.png)

문서에 대체제로 소개한 `KSP`는 아직 QueryDSL에서 지원하지 않습니다.

어찌 보면 QueryDSL도 Java로 작성되었고 대부분의 사용자도 Java이기 때문이지 않을까 하는 생각도 들었습니다.

## 결정

지금까지 언급한 내용을 종합해 보겠습니다.

- **Java**
  - JPA와의 궁합이 좋음
  - Null safety 지원 미흡
  - 비교적 편의 문법 미지원
  - QueryDSL 설정이 조금 복잡
- **Kotlin**
  - JPA와의 궁합이 좋지 않음
  - Null safety 지원
  - 편의 문법 지원
  - QueryDSL 설정이 복잡

각 언어를 사용했을 때의 장단점이 존재하는데요.

Kotlin 언어의 장점 중 하나로 상호운용성이 있습니다.

한 프로젝트에서 TypeScript와 JavaScript를 함께 사용할 수 있는 것처럼, Java와 Kotlin을 함께 사용할 수 있습니다.

따라서 **두 언어를 모두 사용해서 장점만 취하면 되지 않을까** 하는 생각이 들었습니다.

Kotlin을 사용하는 경우 아쉬운 부분은 JPA, QueryDSL 즉 Enitity와 관련된 영역인데요.

그래서 저희는 **Entity 선언은 Java로, 그 외 로직은 Kotlin으로 작성** 하기로 했습니다.

## 함께 사용하기

지금까지 두 언어만 선택한 경우의 문제점들을 살펴보았는데요.

이제부터 두 언어를 어떻게 함께 사용하고 있는지 소개하겠습니다.

### 멀티 모듈

저희는 Spring Boot 프로젝트를 멀티 모듈로 구성하고 있습니다.

Entity를 선언하는 core 모듈과 비즈니스 로직을 담당하는 그 외 모듈로 구성하였습니다.

즉 core 모듈은 Java로, 그 외 모듈은 Kotlin으로 작성하고 있습니다.

![multi module](https://tech.inflab.com/static/bf243fdbeceef3e1c15153ddd1f8fc26/37523/multi-module.png)

사실 core 모듈에는 Kotlin 코드도 일부 존재합니다.

하지만 Kotlin 파일에서 같은 core에 있는 Java Enitity에 의존하지 않고 있습니다.

이렇게 하는 이유는 Entity에는 `@Getter`와 같은 Lombok 어노테이션을 사용는데, 이를 Kotlin 코드에서는 참조할 수 없기 때문입니다.

원인은 Java와 Kotlin이 모두 들어있는 모듈을 빌드할 때, Lombok의 어노테이션 프로세싱보다 Kotlin 컴파일이 먼저 실행되기 때문입니다.

이 이슈를 해결하기 위한 방법 중 하나로 [Lombok compiler plugin](https://kotlinlang.org/docs/lombok.html) 을 적용할 수 있습니다. 하지만 이 플러그인은 현재 실험 기능이므로 이후 정식기능으로 변경된다면 도입을 고려할 예정입니다.

### Platform Type 개선

앞서 언급했듯이 Kotlin은 Null safety를 지원하는 언어입니다.

하지만 Java로 선언한 참조타입 변수를 Kotlin에서 사용할 때에는 Null safety를 보장받을 수 없습니다.

이러한 변수의 타입을 Kotlin에서는 Platform Type이라 부릅니다.

IntelliJ IDEA에서 Platform Type을 사용하는 경우 명시적으로 Kotlin 타입으로 선언해서 Nullable 여부를 명시하도록 안내합니다. 하지만 nullable 타입을 non-nullable 타입으로 잘못 선언하는 실수가 발생하는 문제가 있습니다.

Kotlin 공식 문서를 참조하면 Platform Type을 개선할 방안을 찾을 수 있습니다. 바로 `Nullability annotations`을 적용하는 것인데요.

타입을 지정해야 하는 모든 곳에 Null 가능 여부를 어노테이션으로 지정하는 방법입니다. 이를 통해 Kotlin에서 Java 클래스의 내부 Property를 사용할 때도 Null safety를 보장받을 수 있습니다.

```java
@Entity
public class Course {
    @Column
    @Nullable // Nullable임을 표현하는 어노테이션
    private String description;
}
```

```kotlin
// 자동으로 String? 으로 추론됨
val description = course.description
```

### Custom Nullability annotations

`Nullability annotations`은 이미 여러 프레임워크나 라이브러리에서 제공하고 있습니다. JetBrains에서 제공하는 `org.jetbrains.annotations.NotNull`의 경우 retention policy가 `CLASS`로, **런타임에는 해당 어노테이션이 존재하지 않습니다.**

런타임에 존재하지 않는 어노테이션을 사용한 경우, [Fixture Monkey](https://naver.github.io/fixture-monkey) 같은 라이브러리에서 Property의 Null 여부를 런타임에 확인하지 못하는 이슈가 발생합니다.

이를 해결하기 위해 retention policy가 `RUNTIME`인 어노테이션을 직접 만들어 사용하고 있습니다.

```java
@Target({ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Nonnull
@TypeQualifierNickname
public @interface NonNull {}

@Target({ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Nonnull(when = When.MAYBE)
@TypeQualifierNickname
public @interface Nullable {}
```

이를 활용해 Entity는 다음과 같이 작성하고 있습니다.

```java
@Entity(name = "courses")
public class Course {
    @Nonnull
    @Column
    private String title;

    @Nullable
    @Column
    private String description;

    @Nonnull
    public static Course create(@Nonnull String title, @Nullable String description) {
      // ...
    }
}
```

### ArchUnit을 통한 검증

각 Property와 메서드 인자, 반환값에 `@Nonnull`, `@Nullable`을 누락하지 않도록 하기 위해 [ArchUnit](https://www.archunit.org/) 테스트 프레임워크를 사용하고 있습니다.

```kotlin
@ArchTest
fun `@Column 가 있는 프로퍼티에는 @NonNull, @Nullable 등의 어노테이션이 있어야 한다`(classes: JavaClasses) {
    ArchRuleDefinition.fields()
        .that().areAnnotatedWith(Column::class.java)
        .should().beAnnotatedWith(NonNull::class.java)
        .orShould().beAnnotatedWith(Nullable::class.java)
        .check(classes)
}
```

## 마무리

지금까지 Spring Boot & JPA 환경에서 Java와 Kotlin을 함께 사용한 이유와 사용 예제를 소개했습니다.

새로운 기술 도입 시 각 조직의 상황, 구성원의 선호, 역량에 따라 적절한 기술을 선택하는 게 쉽지 않음을 느꼈습니다. 다른 스택을 사용하던 곳에서 Spring 도입을 고려하는 분들께 이 글이 도움이 되었으면 좋겠습니다.

### 요약
- **Java만 사용하기:** Null safety 부재, 최신 문법 부족
- **Kotlin만 사용하기:** JPA 호환성 이슈, QueryDSL 설정 복잡성
- **해결책:** Entity 선언은 Java로, 그 외 비즈니스 로직은 Kotlin으로 작성하여 각 언어의 장점을 취함.
- **보완책:** 멀티 모듈 구성, Custom Nullability Annotation 적용, ArchUnit을 통한 검증.
