---
topic: "jojoldu의 Spring Data 및 JPA 기술 블로그 포스트 요약"
source_type: other
source_url: "https://jojoldu.tistory.com/category/Spring%20Data"
authorship: self
published_at: 2026-02-03
---
# Spring Data

**작성자:** jojoldu
**카테고리:** Spring Data

---

## Hibernate Fetch Join시 메모리에서 페이징 처리 사전 차단하기
**게시일:** 2023. 10. 2.

Hibernate (Spring Data JPA) 를 사용하다보면 종종 `HHH000104: firstResult/maxResults specified with collection fetch; applying in memory!` 의 WARN (경고) 로그 메세지를 만난다. 해당 로그는 페이징 처리할때 여러 엔티티를 Fetch Join 을 하면 발생한다. Fetch Join은 N+1 문제를 해결하는 가장 자주 사용되던 방식이다. 하지만, 경고 메시지에서 언급했듯이 페이징 처리시에 사용할 경우 페이징이 전혀 적용되지 않고, 조건에 해당하는 모든 데이터를 가져와 메모리에 올려두고 사용한다. 조건에 해당 하는 데이터 전체를 가져오기 때문에 당연히 성능 상 이슈가 되며, 이를 메모리에 올려두고 페이징을 처리하니...

---

## EntityQL로 OneToMany (1:N) Bulk Insert 구현하기
**게시일:** 2021. 4. 12.

지난 시간에는 EntityQL 환경을 적용해보았습니다. 간단한 예제로 단일 Entity의 Bulk Insert를 보여드렸는데요. 이번 시간에는 OneToMany 환경에서 어떻게 Bulk Insert를 구현할지 알아보겠습니다.

1. 해결책
EntityQL이 전환해주는 Querydsl-SQL은 JPA 기반이 아닙니다. 그래서 OneToMany와 같은 연관관계 Insert/Update 등은 JdbcTemplate처럼 직접 구현을 해야하는데요. 원래 JdbcTemplate으로 작성하던 코드를 단순히 정적 타입 개발이 가능하도록 지원할 뿐인것 이제는 다들 아시죠? 그래서 꼭 Querydsl-SQL이 아니더라도, JdbcTemplate로 구현한다 하여도, OneToMany 를 BulkInsert를 하려면 다음의 과..

---

## JPA 사용시 @Embedded 주의사항
**게시일:** 2021. 4. 3.

간혹 JPA의 @Embedded 를 잘못사용하는 경우를 보게 됩니다. 이번 시간에는 @Embedded 를 사용하면서 주의해야할 점을 알아보겠습니다. 꼭 @Embedded 만의 문제는 아니며, Entity 내부에 객체형 필드가 선언되어 있으면 주의할 필요가 있습니다.

문제 상황
예를 들어서 다음과 같은 Entity 가 있습니다.
```java
@Getter
@NoArgsConstructor
@Entity
public class Pay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private long amount;
    private String orderNo;
    @Embedded
    private PayDetails payDetails = ..
```

---

## (MySQL) Auto Increment에서 TypeSafe Bulk Insert 진행하기 (feat.EntityQL, JPA)
**게시일:** 2021. 3. 28.

여러 글에서 언급하고 있지만, JPA환경에서 키 생성 전략을 Auto Increment로 할 경우 BulkInsert가 지원되지 않습니다. Spring Batch Item Writer 성능 비교 MySQL 환경의 스프링부트에 하이버네이트 배치 설정 해보기 그래서 수십만 ~ 수백만건의 Entity 를 insert 할 때는, 항상 JdbcTemplate를 이용하여 Insert합치기 구문을 이용한 BulkInsert 처리를 하는데요. 이 방식은 기존 JPA와 Querydsl 을 이용한 Typesafe 방식을 전혀 활용하지 못해서 단점이 많아 항상 많은 고민을 하게 됩니다. 그래서 이번 시간에서는 어떻게 하면 Auto Increment에서 TypeSafe Bulk Insert을 할 수 있는지 그 방안을 한번 이..

---

## JPA Entity Select에서 Update 쿼리 발생할 경우
**게시일:** 2020. 11. 28.

JPA Entity를 단순히 조회만 하였는데도, 예상치 못하게 Update 쿼리가 발생하는 경우가 있습니다. 이를테면 다음과 같은 경우인데요. find로 조회만 하는데, 다음과 같이 select와 update 쿼리가 발생 하였습니다. 신기한 것은 전체 컬럼에 대한 Update 쿼리가 발생한것입니다. 이렇게 트랜잭션 내에서 Update 쿼리 발생하면 보통은 Dirty Checking이 발생했음을 의심해볼만 한데요. 의심이라고 말씀드리는 이유는 실제로 다른 원인이 있을수도 있기 때문입니다. 자 그럼 왜 이렇게 발생했는지 실제 예제 코드와 함께 보겠습니다.

1. 예제 코드
먼저 위에서 발생한 Entity를 비롯한 서비스 코드는 다음과 같습니다.
Order @Getter @NoArgsConstructor @Ent..

---

## Querydsl (JPA) 에서 Cross Join 발생할 경우
**게시일:** 2020. 11. 16.

JPA 기반의 환경에서 Querydsl를 사용하다보면 @OneToOne 관계에서 Join 쿼리 작성시 주의하지 않으면 Cross Join이 발생할 수 있습니다. CrossJoin 이란 집합에서 나올 수 있는 모든 경우를 이야기 합니다. 예로 A 집합 {a, b}, B 집합 {1,2,3}이며 이들의 CrossJoin은 AxB로 다음과 같습니다. {(a, 1), (a, 2), (a, 3), (b, 1), (b, 2), (b, 3)} 당연히 일반적인 Join보다 성능상 이슈가 발생하게 됩니다. 이번 시간에는 어떤 경우에 이런 Cross Join이 발생하는지, 어떻게 해결할 수 있는지 확인해보겠습니다. 모든 코드는 Github에 있습니다.

1. 테스트 환경
테스트 환경은 다음과 같습니다. Spring Boot ..
