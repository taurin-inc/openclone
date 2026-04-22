---
topic: "PostgreSQL 성능 최적화 및 운영 노하우 요약"
source_type: other
source_url: "https://jojoldu.tistory.com/category/Database"
authorship: self
published_at: 2024-06-18
---
# Database

**Author:** jojoldu (기억보단 기록을)

---

## [PostgreSQL] 단일 테이블 컬럼을 최대한 활용하기
**Publish Date:** 2024. 6. 18.

PostgreSQL 14 에서 진행되었다. 간혹 쿼리들을 보면 단일 테이블 (from 테이블)의 컬럼으로 모든 조회 조건이 완성 가능한데, join 테이블 의 조건을 함께 사용하여 성능 저하를 일으키는 경우가 종종 있다. 데이터가 몇개 없을때는 큰 차이를 못 느끼지만, 수십만건 이상이 적재된 여러 테이블을 중첩 Join 할 경우 큰 차이가 느껴지게 된다. 이를 비교해보자.

**문제**
아래의 쿼리는 review 테이블과 연관된 여러 테이블의 정보를 모으고, 이를 페이징 처리하여 제공해야하는 기능이다.

```sql
select *
from "review" as review
left join "users" as "user" on review."user_id" = "user"."id"
left join "courses" as course on ..
```

---

## [PostgreSQL] Nested Loop Join을 HashJoin으로 개선하기
**Publish Date:** 2024. 5. 29.

RDBMS를 사용하다보면 Nested Loop Join 으로 인해 성능 저하를 겪는 경우가 많다. 일부 RDBMS는 특정 버전에 따라 Nested Loop Join만 지원되는 경우도 있다. 다만, 요즘의 RDBMS는 대부분 Hash Join등 여러 Join 형태를 지원하고 있고 이를 통해 성능 개선이 가능하다. MySQL도 8.0.18 부터 Hash Join을 지원한다. 실제 사례로 성능 개선을 진행해보자.

**1. 문제 쿼리**
아래와 같이 여러 Join을 진행하는 실제 쿼리가 있다.
```sql
SELECT i.id, i.titles[?] AS title, i.icon_url 
FROM institutions i 
INNER JOIN interested_corporations ic ON i.id = ic.institution_i..
```

---

## [PostgreSQL] 모든 View 의 접근 기록 테이블에 적재하기 (애플리케이션 변경 없이)
**Publish Date:** 2023. 11. 5.

View Table을 적극적으로 사용하는 시스템에서 View Table의 의존성을 줄이고자 할때가 있다. 이는 레거시 데이터베이스를 리팩토링 해야하는 경우인데, 보통 너무나 파편화된 데이터베이스 접근을 하나로 통합하고자 할때이다. 보통 ORM을 사용하는 경우에는 이러한 리팩토링이 쉽지만, ORM을 사용하지 않는 경우에는 어떻게 해야할까? 가장 먼저 해야할 것은 View가 계속 사용되고 있는지, 리팩토링에서 누락은 없었는지를 확인할 수 있는 방법을 마련하는 것이다. 특정 테이블의 변경이 있을때마다 어떠한 액션을 넣을 수 있는 가장 흔한 방법은 Trigger 이다. 하지만 아쉽게도 PostgreSQL에서는 View Table의 Select 쿼리에 대한 Trigger가 적용되진 않는다. 그래서 다른 방법을 고..

---

## PostgreSQL 11 에서의 add column not null & default 성능 개선
**Publish Date:** 2023. 8. 1.

Aurora MySQL 5.7까지만 써본 경험에서 Online DDL 은 여전히 부담스럽다. 그럼에도 대량의 데이터가 쌓인 테이블에 DDL을 수행하는 것은 서비스를 운영하다보면 피할 수 없다. 100GB 이상의 테이블에 Online DDL로 컬럼을 추가해도 1시간이 넘도록 수행되던 경험을 해보면 가능한 기존 테이블에 컬럼을 추가하는 등의 DDL 작업은 피하고 싶어진다. 다만, MySQL과 다르게 PostgreSQL에서는 오래 전부터 일부 ALTER 작업에 대해서는 잠금 없는 변경이 가능하다. 이는 MySQL에서는 테이블 구조를 변경할때 전체 테이블의 데이터를 새로운 구조로 복사하는 방식을 취해서 테이블의 크기가 큰 경우 오래 걸리는 것과 다르게 PostgreSQL에서는 테이블 구조 변경 작업시 meta ..

---

## (AWS RDS) PostgreSQL 필수 Log 관련 Parameter
**Publish Date:** 2023. 3. 19.

DB를 활용한 365/24시간 서비스에서 가장 중요한 설정 중 하나가 DB 로그를 어떻게 남기고 관리할 것인가이다. MySQL을 주로 사용하다가 PostgreSQL 을 사용하게 되면서 PostgreSQL에서 지원하는 다양한 로그 파라미터들을 알게 되었다. 아래는 사내에서 적용하고 있는 PostgreSQL 의 필수 로그 파라미터 값들이다. ChatGPT 가 나와서 이제 이런 파라미터값들에 대한 설명이 의미가 있나 싶지만…ㅠ

**파라미터**
각 설정들은 공식 문서 를 확인해보면 더 자세하게 확인할 수 있다. 각 설정을 남길 경우 발생되는 로그 메세지 샘플도 첨부했다. 해당 로그 메세지를 파싱하여 Slack 알람 등을 보내는 Lambda 함수를 만드는데 활용하면 좋다.

**log_temp_files**
권장: 1024
설정된 값(KB) 이상..

---

## DataGrip 에서 안전하게 Command 수행하기
**Publish Date:** 2023. 3. 13.

DataGrip을 포함한 GUI 도구로 운영 DB에 쿼리를 수행하는건 항상 조심해야한다. 하지만, 매번 모든 쿼리를 사람이 주의해서 수행하는건 불가능하며, 사람이라면 무조건 실수를 할 수 있다. 사람인 이상 잘못된 쿼리를 실행할 수 있지만, 이게 최대한 치명적인 실수가 발생하지 않도록 장치를 둘 순 있다. 그래서 가능한 실수를 할 수 없는 환경을 조성해서 진행하는게 필요하다.

**1. Reader DB 활용**
보통 클라우드 서비스를 사용하거나, 어느정도 정비가 되어있는 상황이라면 Reader DB (Replica DB) 가 존재한다. GUI 도구를 사용하다보면 의도치 않게 UI 상에서 데이터 수정을 일으킬 수 있다. 그래서 단순 조회가 필요한 경우 조회 기능 밖에 지원하지 않는 DB (Reader)를 사용한다..
