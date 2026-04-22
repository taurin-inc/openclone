---
topic: "(MySQL) Auto Increment에서 TypeSafe Bulk Insert 진행하기 (feat.EntityQL, JPA)"
source_type: other
source_url: "https://jojoldu.tistory.com/558"
authorship: self
published_at: 2021-03-28
---
# (MySQL) Auto Increment에서 TypeSafe Bulk Insert 진행하기 (feat.EntityQL, JPA)

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 3. 28.

여러 글에서 언급하고 있지만, JPA환경에서 키 생성 전략을 Auto Increment로 할 경우 BulkInsert가 지원되지 않습니다.

- [Spring Batch Item Writer 성능 비교](https://jojoldu.tistory.com/507)
- [MySQL 환경의 스프링부트에 하이버네이트 배치 설정 해보기](https://woowabros.github.io/experience/2020/09/23/hibernate-batch.html)

그래서 수십만 ~ 수백만건의 Entity 를 insert 할 때는, 항상 `JdbcTemplate`를 이용하여 Insert합치기 구문을 이용한 BulkInsert 처리를 하는데요.

이 방식은 기존 JPA와 Querydsl 을 이용한 Typesafe 방식을 전혀 활용하지 못해서 단점이 많아 항상 많은 고민을 하게 됩니다.

그래서 이번 시간에서는 어떻게 하면 **Auto Increment에서 TypeSafe Bulk Insert** 을 할 수 있는지 그 방안을 한번 이야기해볼까 합니다.

> 모든 내용은 **MySQL** 기반 하에 이야기 합니다.
> 
> 즉, 이외 DBMS 에서는 다를 수 있습니다.

## 1. (MySQL) JPA Bulk Insert 의 문제

먼저 JPA Bulk Insert의 문제에 대해서 처음 들어보신 분들을 위해 정리하자면 다음과 같습니다.

- BulkInsert란 Insert 쿼리를 한번에 처리하는 것을 의미합니다.
  - MySQL에서는 아래와 같이 Insert 합치기 옵션을 통하면 비약적인 성능 향상을 가집니다.

```sql
INSERT INTO person (name) VALUES
('name1'),
('name2'),
('name3');
```

- Insert 합치기를 하려면 JdbcUrl 옵션에 `rewriteBatchedStatements=true`이 필수로 설정되어 있으면 바로 적용이 가능합니다.
- 단, **Id 채번(생성) 전략이 auto_increment** 일 경우 JPA를 통한 save는 **Insert 합치기가 적용되지 않습니다**.
  - `Table Sequence` 로 채번 전략을 선택할 경우 JPA로도 Insert 합치기가 가능합니다.
  - 하지만 운영 환경에서는 `Table Sequence` 사용이 쉽지 않습니다.
    - 이미 auto_increment 로 수억~수십억건 쌓여있는 테이블에서 채번 전략을 변경/마이그레이션 하는 것은 굉장히 부담스러운 작업이며
    - 데드락 이슈 케이스들 ( [HikariCP Dead lock에서 벗어나기](https://woowabros.github.io/experience/2020/02/06/hikaricp-avoid-dead-lock-2.html))
    - 동일하게 Bulk Insert가 지원되는 환경에서는 Auto Increment가 더 성능이 뛰어나기 때문입니다.

결론은 Auto_increment이면 JPA가 아닌 `JdbcTemplate`과 같은 네이티브 쿼리를 작성하는 경우에만 insert합치기를 통한 bulk insert가 지원됩니다.

다만, `JdbcTemplate`와 같이 문자열 기반의 네이티브 쿼리 방식으로만 Bulk Insert 구현을 하기에는 부담스러운 점들은 다음과 같습니다.

- JdbcTemplate (+ MyBatis)와 같이 문자열 기반의 SQL 프레임워크는 IDE 자동 지원이 제한적.
- Entity (Table) 컬럼 추가/수정이 있을때마다 연관된 쿼리 문자열을 모두 찾아서 반영 필요.
  - 컬럼이 수십개인 테이블 다수를 동시에 고쳐야할 경우를 생각해보면 끔찍합니다.
  - 잠재적 장애 발생 요인이며, 생산성 저하에 가장 큰 요인.

[JOOQ](https://www.jooq.org/) 나 [Querydsl-SQL](https://github.com/querydsl/querydsl/tree/master/querydsl-sql) 같은 **네이티비 쿼리 기반의 Typesafe 도구** 를 선택해야만 컴파일체크/타입지원/IDE 자동완성 등의 TypeSafe한 Bulk Insert가 가능하다는 결론이 나옵니다.

여기서 JOOQ의 경우 **오픈소스 라이센스로는 클라우드 DB를 지원하지 않습니다**.

![jooq](https://t1.daumcdn.net/cfile/tistory/998758446060777906)

사실상 **DB에 관계없이 사용하려면 Querydsl-SQL** 을 사용해야만 합니다.

라이센스 문제나 그동안의 사용성 (JPA에서는 Querydsl-JPA를 대부분 사용하고 있으니) 으로 인해 Querydsl-SQL을 이용하고 싶지만, 실제 운영 레벨에서 사용하기에 단점이 꽤 많습니다.

- QClass 생성 과정이 복잡하고 과합니다.
  - JPA 기반이 아니라서 **어노테이션 기반이 아닌 실제 테이블을 Scan** 해야만 합니다.
    - 애플리케이션이 실행되면 JPA 어노테이션 기반으로 자동으로 QClass가 생성되는 Querydsl-JPA 와 달리 SQL의 경우
  - 즉, 로컬 혹은 베타 DB를 **미리** 실행하고, Gradle 설정에는 **해당 DB의 접속 정보를 등록** 해서 Querydsl-SQL이 테이블들을 scan 할 수 있도록 설정 되어야만 Gradle Task를 수행해서 QClass를 생성할 수 있습니다.
    - 이건 마찬가지로 테이블 Scan 방식을 사용하는 **JOOQ도 똑같은 단점** 입니다.
- 이렇게 Gradle을 통해 DB를 접근하는 방식이 힘들어 한번 만들어진 QClass를 버전관리 하여 재생성을 최소화 하려고 하는데 이러면 완전 안티패턴입니다.
  - 제너레이트 클래스를 버저닝하게 되면 불필요한 변경사항을 계속 커밋 로그로 관리하게 됩니다.
  - 특히나 같은 Entity 클래스의 변경이 있다면 Conflict 코드를 수동으로 해소하기가 어렵습니다.
- 부가 설정이 너무 많이 필요합니다.
  - Querydsl의 버전 업데이트가 최근에는 자주 되지 못하는 것은 큰 단점중 하나입니다.

결과적으로 MySQL Auto Increment 환경에서 대용량 Insert 처리를 안적적으로 사용하기 위해서는 다음의 2가지가 필요하다는 것을 알 수 있습니다.

- Native SQL 문법 지원을 지원하는 Typesafe 개발
- 테이블 Scan이 아닌 JPA와 같은 **애플리케이션 코드 기반** 코드 Generate

자 그럼 이 문제를 어떻게 해결할 것인지 알아보겠습니다.

### 1-1. QueryDSL-EntityQL

위 문제는 JPA & MySQL를 사용하는 사람들이라면 모두다 경험하다보니 많은 분들이 이를 해결하기 위해 오픈소스를 만들었는데요.

그 중에서 [QueryDSL-EntityQL](https://github.com/eXsio/querydsl-entityql) 가 있습니다.

EntityQL은 **JPA의 어노테이션을 기반으로 Querydsl-SQL QClass를 생성** 하는 역할을 합니다.

즉, 네이티브 쿼리를 사용할 수 있는 Querydsl-SQL을 쓰려면 SQL용 QClass가 필요한데, 이 SQL QClass 생성을 테이블 스캔 방식이 아닌 JPA 어노테이션 기반으로 할 수 있도록 중간 컨버터 역할을 하는 오픈소스입니다.

![entityql](https://t1.daumcdn.net/cfile/tistory/997371456060777902)

아직까지 대중화된 프로젝트는 아니지만, [Querydsl Github Issue](https://github.com/querydsl/querydsl/issues/2459#issuecomment-567652568) 에서 어느정도의 호응이 있음을 볼 수 있습니다.

## 2. 적용

일단 설치하기에 앞서 Gradle 환경에서 사용하기 위한 몇 가지 제약조건을 먼저 소개 드리겠습니다.

### 2-1. Gradle 로 사용시 제약조건

수동 Generate

Gradle 기반 환경에서 EntityQL을 통해 Querydsl-SQL용 QClass를 생성한다면 크게 2가지 방법을 지원합니다.

1) 특정 패키지를 지정해서 해당 패키지 하위의 모든 Entity들을 자동으로 Generate

2) **개별 클래스 하나하나의 위치를 등록해서 수동** 으로 Generate

여기서 누가봐도 1번을 쓸 것 같지만, 저는 2번을 선택했는데요.

- 특정 패키지를 지정해서 해당 패키지에 속해 있는 전체 클래스들을 대상으로 할 수는 있습니다.
- 다만, 이렇게 하려면 **해당 패키지에는 Entity 클래스들만 존재해야만 합니다**. (하위 패키지 포함)
- 지정된 패키지에 다른 클래스가 있으면 패키지 스캔이 실패합니다.
  - 즉, Entity와 함께 쌍으로 묶이는 기본(확장하지 않은) JpaRepository , Enum 등을 모두 최상위 패키지부터 다르게 두어야만 합니다.
- 이건 EntityQL 하나를 위해 시스템의 근간이 되는 도메인 Layer 분리를 해야되는 상황이라 저는 원하지 않는 방법입니다.
  - 그래서 Querydsl-SQL이 필요한 특정 Entity 클래스들만 지정해서 개별 지정해서 사용하는 방식을 선택했습니다.

#### 멀티모듈 강제화

위 1번 문제로 인해서 수동으로 생성이 필요할 경우 **멀티모듈에서만 사용이 가능** 하고, 단일 모듈에서는 불가능 하다는 것입니다.

이는 앞서 Gradle 플러그인을 통하지 않았기 때문인데, 직접 클래스 위치를 등록해서 사용하는 방식은 단일 모듈에서 사용할 수가 없습니다.

이유는 다음과 같습니다.

(EntityQL을 통해 생성된) Querydsl-SQL QClass를 사용하는 코드가 있으면 해당 QClass 삭제후 재생성을 진행할때 **컴파일 에러** 가 발생합니다.

당연하게도 프로젝트 내에 사용되던 클래스가 없어지니 이후 compile이 모두 다 실패할 수 밖에 없습니다.

즉, QClass를 생성하는 `generateModel` Task는 `compileJava` Task를 우선 수행하는데, 이 `compileJava` Task가 실패하여 `generateModel` 가 수행되지 못하고, 결국엔 QClass 생성이 못하게 됩니다.

![module1](https://t1.daumcdn.net/cfile/tistory/99AA0048606077793B)

그래서 멀티모듈로 구성하여, **실제 QClass 생성 모듈과 사용 모듈을 분리** 해서 QClass 생성 모듈을 통해 Generate 될때 컴파일 에러가 발생하지 않도록 해야 합니다.

자 그럼 본격적으로 설정을 해보겠습니다.

### 2-2. Gradle 설정

먼저 프로젝트의 전체 구조를 보겠습니다.

> 전체 코드는 [Github](https://github.com/jojoldu/blog-code/tree/master/spring-boot-entityql) 에 있으니 참고하시면 됩니다.
>
> 모든 코드는 실제 현업에서 사용할 수 있도록 Querydsl-JPA 설정과 함께 진행됩니다.
>
> Querydsl-JPA 설정을 해보신적 없다면 [이전 포스팅](https://jojoldu.tistory.com/372) 을 참고합니다.

![module2](https://t1.daumcdn.net/cfile/tistory/99E3883A6060777902)

위 모듈들을 하나씩 설정해보겠습니다.

#### 2-2-1. entity 모듈

먼저 entity 모듈입니다.

build.gradle의 설정 먼저 해보겠습니다.

> Gradle 6 기준입니다.

**entity 모듈 - build.gradle**

```gradle
plugins {
    ...
    id 'pl.exsio.querydsl.entityql' version "0.0.12"
}

...
apply plugin: "io.spring.dependency-management"

dependencies {
    ...
    implementation("org.reflections:reflections:0.9.11") // entityql
    api("com.github.eXsio:querydsl-entityql:3.1.0") // entityql

    implementation("joda-time:joda-time:2.9.4") // querydsl-sql
    api("com.querydsl:querydsl-sql-spring:${queryDslVersion}") // querydsl-sql (Querydsl-JPA 버전과 통일)

}

// entityql start
def generatedSql='src/main/generated_sql' // (1)
def defaultPackage = 'com.jojoldu.blogcode.entityql.entity.domain.'
entityql {
    generators = [\
            generator = {\
                type = 'JPA'\
                sourceClasses = [\
                        defaultPackage+'academy.Academy', // (2)\
                        defaultPackage+'student.Student',\
                ]\
                destinationPackage = defaultPackage+'sql' // (3)\
                destinationPath = file(generatedSql).absolutePath\
                filenamePattern = 'E%s.java' // (4)\
            }\
    ]
    sourceSets.main.java.srcDirs += [generatedSql] // (5)
    idea.module.generatedSourceDirs += file(generatedSql) // (6)
}

clean.doLast { // (7)
    file(generatedSql).deleteDir()
}
```

(1) `generatedSql`
- `'src/main/generated_sql'` 가 이후 설정들에서 모두 사용되기 때문에 변수로 만들어서 재사용합니다.
- Querydsl-JPA가 일반적으로 `'src/main/generated` 에서 생성되니 Querydsl-SQL은 다른 디렉토리로 지정합니다.

(2) `sourceClasses`
- 직접 Scan 대상이 되는 클래스들의 위치를 지정합니다.

(3) `destinationPackage`
- SQL QClass가 생성될 패키지명을 등록합니다.

(4) `filenamePattern`
- 대상이 되는 Entity 클래스와 이름이 충돌나지 않도록 `E` 를 사용했는데 `S` 등으로 사용해도 됩니다.
- `Q` 를 붙일 경우 Querydsl-JPA로 생성된 QClass 이름과 충돌날 수 있으니 피하시는걸 추천드립니다.

(5) `sourceSets.main.java.srcDirs`
- 프로젝트에서 generate된 디렉토리를 소스 디렉토리로 인식할 수 있도록 지정합니다.

(6) `idea.module.generatedSourceDirs`
- IntelliJ IDEA가 generate된 디렉토리를 소스 디렉토리로 인식할 수 있도록 지정합니다.

(7) `clean.doLast`
- Gradle `clean` 수행시 SQL QClass 생성 디렉토리도 함께 삭제되도록 설정합니다.

위와 같이 설정할 경우 이후 **완전히 설정이 끝나고 QClass 생성하면** 아래와 같이 generate 디렉토리들이 생성됩니다.

![module3](https://t1.daumcdn.net/cfile/tistory/99FA6E336060777937)

별도 Config 클래스들을 설정해보겠습니다.

**entity 모듈 - EntityQlConfiguration**

```java
import com.querydsl.sql.H2Templates;
import com.querydsl.sql.MySQLTemplates;
import com.querydsl.sql.SQLQueryFactory;
import com.querydsl.sql.SQLTemplates;
import com.querydsl.sql.spring.SpringExceptionTranslator;
import com.querydsl.sql.types.DateTimeType;
import com.querydsl.sql.types.LocalDateType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import pl.exsio.querydsl.entityql.config.EntityQlQueryFactory;

import javax.sql.DataSource;

@Slf4j
@RequiredArgsConstructor
@Configuration
public class EntityQlConfiguration {

    @Bean
    @Profile("local") // (1)
    public SQLTemplates h2SqlTemplates() {
        return new H2Templates();
    }

    @Bean
    @Profile("!local") // (2)
    public SQLTemplates mySqlTemplates() {
        return new MySQLTemplates();
    }

    @Bean
    public SQLQueryFactory sqlQueryFactory(DataSource dataSource, SQLTemplates sqlTemplates) {
        com.querydsl.sql.Configuration configuration = new com.querydsl.sql.Configuration(sqlTemplates);
        configuration.setExceptionTranslator(new SpringExceptionTranslator());
        configuration.register(new DateTimeType());
        configuration.register(new LocalDateType());

        return new EntityQlQueryFactory(configuration, dataSource)
                .registerEnumsByName("com.jojoldu.blogcode.entityql.entity.domain.academy"); // (3)
    }
}
```

(1) `h2SqlTemplates`: H2 DB용 SqlTemplate을 등록합니다.
(2) `mySqlTemplates`: MySQL용 SqlTemplate을 등록합니다.
(3) `registerEnumsByName`: EntityQL은 Enum 인식을 위해서 별도로 해당 **Enum들이 위치한 패키지** 를 등록 해야 합니다.

마지막으로 설정할 것은 `EntityMapper` 입니다. JPA의 `@Column`에 선언된 `name` 필드와 자바 오브젝트 필드를 매핑시킬 수 있는 별도의 Mapper를 만들어 사용합니다.

**entity 모듈 - EntityMapper**

```java
public class EntityMapper implements Mapper<Object> {
    public static final EntityMapper DEFAULT = new EntityMapper(false);
    public static final EntityMapper WITH_NULL_BINDINGS = new EntityMapper(true);
    private final boolean withNullBindings;

    public EntityMapper(boolean withNullBindings) {
        this.withNullBindings = withNullBindings;
    }

    @Override
    public Map<Path<?>, Object> createMap(RelationalPath<?> path, Object object) {
        try {
            Map<String, Path<?>> columnToPath = new HashMap<>();
            for (Path<?> column : path.getColumns()) {
                columnToPath.put(ColumnMetadata.getName(column), column);
            }
            Map<Path<?>, Object> values = new HashMap<>();
            for (Field field : ReflectionUtils.getFields(object.getClass())) {
                putByEmbedded(object, columnToPath, values, field);
                putByColumn(object, columnToPath, values, field);
                putByJoinColumn(object, columnToPath, values, field);
            }
            return values;
        } catch (IllegalAccessException e) {
            throw new QueryException(e);
        }
    }
    // ... putByEmbedded, putByColumn, putByJoinColumn 상세 구현
}
```

### 2-3. Entity 적용

Entity 적용시에는 아래 유의사항들을 유의해주셔야 합니다.

- 스캔대상으로 지정된 테이블은 모두 `@Table`에 `name`이 선언되어있어야 합니다.
- `@Column` 의 `name`이 모두 지정되어 있어야 합니다.
- `@JoinColumn` 에는 `name` 과 `referencedColumnName` 이 모두 선언되어 있어야 합니다.

**Academy Entity 예시**

```java
@Getter
@NoArgsConstructor
@Entity
@Table(name = "academy",
        indexes = {
        @Index(name = "idx_academy_1", columnList = "phone_number")
})
public class Academy extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;
    
    // ...
}
```

#### AcademyBulkRepository

이제 실제로 Academy를 Bulk Insert 할 수 있는 Repository를 생성해보겠습니다.

```java
@Slf4j
@RequiredArgsConstructor
@Repository
@Transactional
public class AcademyBulkRepository {
    private static final Integer DEFAULT_CHUNK_SIZE = 1_000;
    private final SQLQueryFactory sqlQueryFactory;

    public void saveAll(List<Academy> entities, int chunkSize) {
        SQLInsertClause insert = sqlQueryFactory.insert(EAcademy.qAcademy); // (1)
        List<List<Academy>> subSets = Lists.partition(entities, chunkSize);

        int index=1;
        for (List<Academy> subSet : subSets) {
            LocalDateTime now = LocalDateTime.now();
            for (Academy entity : subSet) {
                entity.setCurrentTime(now); 
                insert.populate(entity, EntityMapper.DEFAULT).addBatch(); // (2)
            }
            insert.execute(); // (3)
            insert.clear(); // (4)
            log.info("Academy {}번째 처리 - {}건", index++, subSet.size());
        }
    }
}
```

(1) `SQLInsertClause` 인스턴스 생성.
(2) `addBatch()`를 통해 Insert 합치기.
(3) `execute()`로 쿼리 실행.
(4) `clear()`를 통해 인스턴스 초기화.

## 3. 테스트

### 3-2. Bulk Insert 성능 테스트

성능 테스트시 Insert 합치기 옵션 활성화를 위해 **MySQL** 에서 테스트를 해봐야 합니다.

```java
    @Test
    void jpa_saveAll_test() throws Exception {
        academyRepository.saveAll(academies);
    }

    @Test
    void entytlql_bulk_test() throws Exception {
        academyBulkRepository.saveAll(academies);
    }
```

비교해보면 1만건 기준 대략 7.8초 (JPA) vs **0.44초** (EntityQL) 로 비약적인 성능 차이를 보입니다.

## 4. 추가 Tip

### 4-2. 제한 사항
- `@ManyToMany`를 지원하지 않습니다.
- `@JoinTable`를 지원하지 않습니다.
- 중간 조인 테이블을 선언해서 사용하지 않기 때문에 SQL 모델을 생성할 방법이 없기 때문입니다. 이 경우에는 `JdbcTemplate`으로 직접 구현하시면 됩니다.

### 4-3. 이슈 케이스
`java.lang.NoSuchMethodError` 발생 시 Guava 버전 충돌일 수 있습니다. 이 경우 아래와 같이 버전을 강제 지정합니다.

```gradle
configurations {
    all {
        resolutionStrategy {
            force 'com.google.guava:guava:20.0'
        }
    }
}
```

## 5. 마무리

JPA와 Querydsl-JPA에 비해서 설정이 과한 면이 있습니다. 하지만 `JdbcTemplate`으로 매번 문자열 기반의 Bulk Insert를 구현하는 고충을 겪고 계신다면, 한번의 설정으로 TypeSafe한 환경을 구축할 수 있는 EntityQL은 좋은 대안이 될 수 있습니다.
