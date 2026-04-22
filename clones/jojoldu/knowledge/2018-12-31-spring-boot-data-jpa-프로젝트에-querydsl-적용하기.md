---
topic: "Spring Boot Data Jpa 프로젝트에 Querydsl 적용하기"
source_type: other
source_url: "https://jojoldu.tistory.com/372"
authorship: self
published_at: 2018-12-31
---
# Spring Boot Data Jpa 프로젝트에 Querydsl 적용하기

**by 향로 (기억보단 기록을) | 2018. 12. 31.**

안녕하세요?

이번 시간에는 Spring Boot Data Jpa 프로젝트에 [Querydsl](http://www.querydsl.com/) 을 적용하는 방법을 소개 드리겠습니다.

> 모든 코드는 [Github](https://github.com/jojoldu/blog-code/tree/master/spring-boot-querydsl) 에 있습니다.

Spring Data Jpa를 써보신 분들은 아시겠지만, 기본으로 제공해주는 `@Query`로는 **다양한 조회 기능을 사용하기에 한계** 가 있습니다.

그래서 이 문제를 해결하기 위해 **정적 타입을 지원하는 조회 프레임워크** 를 사용하는데요.

Querydsl은 Jooq와 함게 **가장 유명한 조회 프레임워크** 입니다.

이번 포스팅에서는 Spring Boot Data Jpa에서 Querydsl을 어떻게 설정하는지를 이야기합니다.

Querydsl의 장점 혹은 왜 써야하는지 등의 내용은 담지 않습니다.

개발환경은 다음과 같습니다.

- IntelliJ
- Spring Boot 2.1.1
- Gradle
- Lombok

IntelliJ가 아닌 이클립스라도 크게 문제는 없습니다만, IntelliJ라면 더욱 편하게 진행하실 수 있습니다.

---

## 1. Gradle 설정

[Gradle Multi Module](https://jojoldu.tistory.com/123) 이 아닌 단일 모듈로 작업을 시작합니다.

먼저 스프링부트와 Gradle로 프로젝트를 생성합니다. 그리고 build.gradle을 열어 아래와 같이 Querydsl 관련 설정을 추가합니다.

먼저 **Querydsl 플러그인 설정** 을 먼저합니다.

```groovy
buildscript {
    ext {
        querydslPluginVersion = '1.0.10' // 플러그인 버전
    }
    repositories {
        ...
        maven { url "https://plugins.gradle.org/m2/" } // 플러그인 저장소
    }
    dependencies {
        ...
        classpath("gradle.plugin.com.ewerk.gradle.plugins:querydsl-plugin:${querydslPluginVersion}") // querydsl 플러그인 의존성 등록
    }
}
```

위 플러그인이 있어야만 Querydsl의 도메인 모델인 `QClass`들이 생성됩니다. 그리고 Querydsl을 사용할 수 있는 라이브러리를 추가합니다.

```groovy
dependencies {
    compile("com.querydsl:querydsl-jpa") // querydsl
    compile("com.querydsl:querydsl-apt") // querydsl
    ...
}
```

의존성까지 다 추가되셨다면 Gradle에 Querydsl의 도메인인 QClass 생성을 위한 Task를 추가합니다.

```groovy
// querydsl 적용
apply plugin: "com.ewerk.gradle.plugins.querydsl" // Plugin 적용
def querydslSrcDir = 'src/main/generated' // QClass 생성 위치

querydsl {
    library = "com.querydsl:querydsl-apt"
    jpa = true
    querydslSourcesDir = querydslSrcDir
}

sourceSets {
    main {
        java {
            srcDirs = ['src/main/java', querydslSrcDir]
        }
    }
}
```

### Gradle 5.0 이상 & IntelliJ 2020.x 사용시

최근 Gradle 버전이 계속 증가하면서 Querydsl의 Gradle Plugin이 해당 버전을 못쫓아가는 경우가 발생합니다. 이로 인해서 최근엔 Gradle의 `Annotation processor` 을 사용하는 방법을 많이 사용하고 계십니다.

아래는 **Gradle Plugin이 필요 없는 설정** (build.gradle) 코드입니다.

```groovy
plugins {
    id 'io.spring.dependency-management' version '1.0.10.RELEASE'
}
...

apply plugin: "io.spring.dependency-management"
dependencies {
    compile("com.querydsl:querydsl-core") // querydsl
    compile("com.querydsl:querydsl-jpa") // querydsl
    annotationProcessor "com.querydsl:querydsl-apt:${dependencyManagement.importedProperties['querydsl.version']}:jpa" // querydsl JPAAnnotationProcessor 사용 지정
    annotationProcessor("jakarta.persistence:jakarta.persistence-api")
    annotationProcessor("jakarta.annotation:jakarta.annotation-api")

}

def generated='src/main/generated'
sourceSets {
    main.java.srcDirs += [ generated ]
}

tasks.withType(JavaCompile) {
    options.annotationProcessorGeneratedSourcesDirectory = file(generated)
}

clean.doLast {
    file(generated).deleteDir()
}
```

설정 하시고 나면 Gradle Project에서 `Tasks -> other -> compileJava`를 실행시키시면 `src/main/generated`에 Q클래스들이 생성됩니다.

---

## 2. Java Config & 기본 사용법

### 2-1. Java Config

설정값을 모아둔 패키지에 `QuerydslConfiguration`을 생성합니다.

```java
@Configuration
public class QuerydslConfiguration {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```

위 설정으로 프로젝트 어느 곳에서나 `JPAQueryFactory`를 주입 받아 Querydsl을 사용할 수 있게 됩니다.

### 2-2. 기본적인 사용법

먼저 테스트로 사용할 Entity를 생성합니다.

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Academy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @Builder
    public Academy(String name, String address) {
        this.name = name;
        this.address = address;
    }
}
```

그리고 Querydsl Repository를 생성합니다. 클래스명은 `AcademyRepositorySupport`입니다.

```java
@Repository
public class AcademyRepositorySupport extends QuerydslRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public AcademyRepositorySupport(JPAQueryFactory queryFactory) {
        super(Academy.class);
        this.queryFactory = queryFactory;
    }

    public List<Academy> findByName(String name) {
        return queryFactory
                .selectFrom(academy)
                .where(academy.name.eq(name))
                .fetch();
    }
}
```

QClass 생성을 위해 IntelliJ의 Gradle View를 열어서 **Tasks -> other -> compileQuerydsl** 를 실행합니다. 성공하면 `src/main/generated/`에 QClass가 생성됩니다.

### 2-3. 기본 사용법 테스트

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class BasicTest {

    @Autowired
    private AcademyRepository academyRepository;

    @Autowired
    private AcademyRepositorySupport academyRepositorySupport;

    @After
    public void tearDown() throws Exception {
        academyRepository.deleteAllInBatch();
    }

    @Test
    public void querydsl_기본_기능_확인() {
        //given
        String name = "jojoldu";
        String address = "jojoldu@gmail.com";
        academyRepository.save(new Academy(name, address));

        //when
        List<Academy> result = academyRepositorySupport.findByName(name);

        //then
        assertThat(result.size(), is(1));
        assertThat(result.get(0).getAddress(), is(address));
    }
}
```

---

## 3. Spring Data Jpa Custom Repository 적용

항상 2개의 Repository를 의존성으로 받아야 하는 단점을 해결하기 위해 Spring Data Jpa의 Custom Repository 기능을 사용합니다.

`Custom`이 붙은 인터페이스를 상속한 `Impl` 클래스의 코드는 `Custom` 인터페이스를 상속한 `JpaRepository`에서도 사용할 수 있습니다.

`AcademyRepositoryCustom` 인터페이스와 `AcademyRepositoryImpl` 클래스를 생성합니다.

```java
public interface AcademyRepositoryCustom {
    List<Academy> findByName(String name);
}
```

```java
@RequiredArgsConstructor
public class AcademyRepositoryImpl implements AcademyRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Academy> findByName(String name) {
        return queryFactory.selectFrom(academy)
                .where(academy.name.eq(name))
                .fetch();
    }
}
```

그리고 `AcademyRepository`에서 상속 구조로 변경합니다.

```java
public interface AcademyRepository extends JpaRepository<Academy, Long>, AcademyRepositoryCustom {
}
```

---

## 4. 상속/구현 없는 Repository

Querydsl만으로 Repository를 구성하는 방법입니다. **JPAQueryFactory** 만 있으면 됩니다.

```java
@RequiredArgsConstructor
@Repository
public class AcademyQueryRepository {
    private final JPAQueryFactory queryFactory;

    public List<Academy> findByName(String name) {
        return queryFactory.selectFrom(academy)
                .where(academy.name.eq(name))
                .fetch();
    }
}
```

- 최소한의 Bean 등록을 위해 `@Repository`를 선언합니다.
- 별도의 상속/구현 없이 `JPAQueryFactory` 만 주입받습니다.
- 특정 Entity만 사용해야 한다는 제약이 없어 유연하게 대응할 수 있습니다.

---

## 5. 주의 사항

Querydsl의 QClass를 담는 `src/main/generated`는 자동생성되는 파일들의 디렉토리이니 무조건 `.gitignore`에 추가하셔야 합니다.
