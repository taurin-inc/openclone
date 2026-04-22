---
topic: "Spring Batch와 QuerydslItemReader 구현 및 성능 최적화"
source_type: other
source_url: "https://jojoldu.tistory.com/473"
authorship: self
published_at: 2020-02-05
---
# Spring Batch와 QuerydslItemReader

**Author:** 향로 (기억보단 기록을)
**Date:** 2020. 2. 5.

> 아래 글은 [사내 기술 블로그](http://woowabros.github.io/experience/2020/02/05/springbatch-querydsl.html) 에 동일하게 공유된 글입니다.

안녕하세요 우아한형제들 정산시스템팀 이동욱입니다.

올해는 무슨 글을 기술 블로그에 쓸까 고민하다가, 1월초까지 생각했던 것은 **팀에 관련된 주제** 였습니다.

팀에 관련된 이야기라면 뭐니뭐니해도 팀장님 얘기가 빠질수가 없는데, 주제를 정하자마자 **조직개편으로 팀장님이 다른 팀으로 발령** 났습니다.

정권이 교체되었으니 라인 환승도 해야하고, [우아한테크코스](http://woowabros.github.io/techcourse/2019/10/14/woowacourse.html) 졸업생 분이 신입 개발자로 합류도 하셔서 팀 이야기는 좀 더 뒤로 미룰수 밖에 없었습니다.

![환승](https://t1.daumcdn.net/cfile/tistory/9991EA335E3A6B6525)
(레진코믹스의 [레바툰-191화](https://www.lezhin.com/ko/comic/revatoon/191))

그래서 비 기술적인 주제 보다는 시류를 덜타는 기술적인 주제를 찾게 되었는데요. 저희팀이 유독 많이 사용하고, 필요하면 라이브러리를 만들어서 사용하기도 하는 **Spring Batch와 Querydsl** 에 대해 주제를 정하게 되었습니다.

아무래도 Spring Batch는 다른 스프링 모듈에 비해 인기가 없습니다. 하지만 이미 본문을 먼저 다쓰고 서문을 쓰고 있어서 어쩔수 없습니다. 트래픽으로 증명할 수 밖에요.

## Intro

> 예제로 사용한 모든 코드는 [Github](https://github.com/jojoldu/spring-batch-querydsl) 에 올려두었습니다.

현재 팀에서 공식적으로 JPA를 사용하면서 **복잡한 조회 쿼리** 는 [Querydsl](http://www.querydsl.com/) 로 계속 처리해오고 있었습니다. 웹 애플리케이션에서는 크게 문제가 없으나, 배치 애플리케이션에서는 문제가 하나 있었습니다.

그건 바로 Spring Batch 프레임워크에서 공식적으로 **QuerydslItemReader를 지원하지 않는 것** 이였습니다.

아래는 Spring Batch에서 공식적으로 지원하는 ItemReader들의 목록입니다.

| Reader |
| --- |
| JdbcCursorItemReader |
| JdbcPagingItemReader |
| HibernateCursorItemReader |
| HibernatePagingItemReader |
| JpaPagingItemReader |
| RepositoryItemReader |

이외에도 다양한 ItemReader들을 지원하지만 **QuerydslItemReader는 지원하지 않습니다**.

이러다보니 Spring Batch에서 Querydsl를 사용하기가 쉽지 않았는데요. 큰 변경 없이 Spring Batch에 Querydsl ItemReader를 사용한다면 다음과 같이 **AbstractPagingItemReader를 상속한 ItemReader** 생성해야만 했습니다.

```java
public class ProductRepositoryItemReader extends AbstractPagingItemReader<Product> {
    private final ProductBatchRepository productBatchRepository;
    private final LocalDate txDate;

    public ProductRepositoryItemReader(ProductBatchRepository productBatchRepository,
                                      LocalDate txDate,
                                      int pageSize) {

        this.productBatchRepository = productBatchRepository;
        this.txDate = txDate;
        setPageSize(pageSize);
    }

    @Override // 직접 페이지 읽기 부분 구현
    protected void doReadPage() {
        if (results == null) {
            results = new ArrayList<>();
        } else {
            results.clear();
        }

        List<Product> products = productBatchRepository.findPageByCreateDate(txDate, getPageSize(), getPage());

        results.addAll(products);
    }

    @Override
    protected void doJumpToPage(int itemIndex) {
    }
}
```

당연히 이 ItemReader에서 사용할 **페이징 쿼리를 가진 Querydsl Repository** 도 추가로 생성합니다.

```java
@Repository
public class ProductBatchRepository extends QuerydslRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ProductBatchRepository(JPAQueryFactory queryFactory) {
        super(Product.class);
        this.queryFactory = queryFactory;
    }

    public List<Product> findPageByCreateDate(LocalDate txDate, int pageSize, long offset) {
        return queryFactory
                .selectFrom(product) // 실제 쿼리
                .where(product.createDate.eq(txDate)) // 실제 쿼리
                .limit(pageSize) // 페이징
                .offset(offset) // 페이징
                .fetch();
    }
}
```

위 코드를 **매 Batch Job마다 작성** 해야만 했습니다. 정작 중요한 배치 쿼리 작성보다 **행사 코드가 더 많은 일** 이 발생한 것입니다. 실제로 위의 Reader에서 변경이 필요한 부분은 **주어진 조건의 Product를 가져오는 쿼리** 입니다. 그 외 나머지 부분은 매번 Reader가 필요할때마다 작성해야할 반복된 코드입니다.

그래서 팀에서는 **Querydsl의 쿼리에만 집중** 할 수 있도록 QuerydslItemReader를 개발하게 되었습니다. 이 글에서는 아래 2가지 ItemReader에 대해 소개하고 사용법을 다뤄볼 예정입니다.

- Querydsl **Paging** ItemReader
- Querydsl **NoOffsetPaging** ItemReader

---

## 1. QuerydslPagingItemReader

QuerydslPagingItemReader의 컨셉은 단순합니다. **JpaPagingItemReader에서 JPQL이 수행되는 부분만 교체** 하는 것 입니다.

기본적으로 Spring Batch 의 Chunk 지향 구조 (reader/processor/writer) 에서 JPQL이 실행되는 부분은 `doReadPage()` 입니다. 즉, `doReadPage()` 에서 쿼리가 수행되는 부분을 Querydsl의 쿼리로 변경하면 되는것이죠.

단순하게 JpaPagingItemReader를 상속하여 `createQuery()`만 override를 할 수 없다는 것을 알게되었으니(private 메소드임) **JpaPagingItemReader의 전체 코드를 복사** 하여 생성하겠습니다.

```java
public class QuerydslPagingItemReader<T> extends AbstractPagingItemReader<T> {

    protected final Map<String, Object> jpaPropertyMap = new HashMap<>();
    protected EntityManagerFactory entityManagerFactory;
    protected EntityManager entityManager;
    protected Function<JPAQueryFactory, JPAQuery<T>> queryFunction;
    protected boolean transacted = true;//default value

    protected QuerydslPagingItemReader() {
        setName(ClassUtils.getShortName(QuerydslPagingItemReader.class));
    }

    public QuerydslPagingItemReader(EntityManagerFactory entityManagerFactory,
                                    int pageSize,
                                    Function<JPAQueryFactory, JPAQuery<T>> queryFunction) {
        this();
        this.entityManagerFactory = entityManagerFactory;
        this.queryFunction = queryFunction;
        setPageSize(pageSize);
    }

    public void setTransacted(boolean transacted) {
        this.transacted = transacted;
    }

    @Override
    protected void doOpen() throws Exception {
        super.doOpen();

        entityManager = entityManagerFactory.createEntityManager(jpaPropertyMap);
        if (entityManager == null) {
            throw new DataAccessResourceFailureException("Unable to obtain an EntityManager");
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void doReadPage() {

        clearIfTransacted();

        JPAQuery<T> query = createQuery()
                .offset(getPage() * getPageSize())
                .limit(getPageSize());

        initResults();

        fetchQuery(query);
    }

    protected void clearIfTransacted() {
        if (transacted) {
            entityManager.clear();
        }
    }

    protected JPAQuery<T> createQuery() {
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
        return queryFunction.apply(queryFactory);
    }

    protected void initResults() {
        if (CollectionUtils.isEmpty(results)) {
            results = new CopyOnWriteArrayList<>();
        } else {
            results.clear();
        }
    }

    protected void fetchQuery(JPAQuery<T> query) {
        if (!transacted) {
            List<T> queryResult = query.fetch();
            for (T entity : queryResult) {
                entityManager.detach(entity);
                results.add(entity);
            }
        } else {
            results.addAll(query.fetch());
        }
    }

    @Override
    protected void doJumpToPage(int itemIndex) {
    }

    @Override
    protected void doClose() throws Exception {
        entityManager.close();
        super.doClose();
    }
}
```

먼저 **람다 표현식** 을 사용할 수 있도록 `Function<JPAQueryFactory, JPAQuery<T>> queryFunction` 가 생성자 인자로 추가되었습니다. 이를 통해 매번 새로운 Reader를 만들 필요 없이 Job 클래스에서 바로 Reader를 생성할 수 있게 됩니다.

또한 `hibernate.default_batch_fetch_size` 옵션을 제대로 활용하기 위해 JpaPagingItemReader에 있던 자체적인 트랜잭션 관리 코드를 제거했습니다. Spring Batch는 기본적으로 Chunk 단위로 트랜잭션을 보장하기 때문에 문제가 없음을 확인했습니다.

### 1-1. 테스트 코드로 검증

```java
@Test
public void reader가_정상적으로_값을반환한다() throws Exception {
    //given
    LocalDate txDate = LocalDate.of(2020,10,12);
    String name = "a";
    int expected1 = 1000;
    int expected2 = 2000;
    productRepository.save(new Product(name, expected1, txDate));
    productRepository.save(new Product(name, expected2, txDate));

    int pageSize = 1;

    QuerydslPagingItemReader<Product> reader = new QuerydslPagingItemReader<>(emf, pageSize, queryFactory -> queryFactory
            .selectFrom(product)
            .where(product.createDate.eq(txDate)));

    reader.open(new ExecutionContext());

    //when
    Product read1 = reader.read();
    Product read2 = reader.read();
    Product read3 = reader.read();

    //then
    assertThat(read1.getPrice()).isEqualTo(expected1);
    assertThat(read2.getPrice()).isEqualTo(expected2);
    assertThat(read3).isNull();
}
```

### 1-2. 사용 방법

```java
@Bean
public QuerydslPagingItemReader<Product> reader() {
    return new QuerydslPagingItemReader<>(emf, chunkSize, queryFactory -> queryFactory
            .selectFrom(product)
            .where(product.createDate.eq(jobParameter.getTxDate())));
}
```

---

## 2. QuerydslNoOffsetPagingItemReader

MySQL은 특성상 **페이징이 뒤로 갈수록 느려집니다**. offset 페이징 쿼리가 뒤로갈수록 느린 이유는 결국 **앞에서 읽었던 행을 다시 읽어야하기 때문** 인데요. 이 문제를 해결하기 위해 **이전에 조회된 결과를 한번에 건너뛸수 있게** 마지막 조회 결과의 ID를 조건문에 사용하는 방식을 사용합니다.

```sql
SELECT *
FROM items
WHERE 조건문
AND id < 마지막조회ID # 직전 조회 결과의 마지막 id
ORDER BY id DESC
LIMIT 페이지사이즈
```

이 방식을 사용하면 아무리 페이지가 뒤로 가더라도 처음 페이지를 읽은 것과 동일한 효과를 가지게 됩니다.

### 구현 요약
- `offset` 이 제거된 `limit` 쿼리
- 조회된 페이지의 **마지막 id 값을 캐시**
- 캐시된 **마지막 id값을 다음 페이지 쿼리 조건문** 에 추가
- **정렬 기준에 따라** 조회 조건에 마지막 id의 조건이 자동 포함 (`asc`: `>`, `desc`: `<`)

`QuerydslNoOffsetPagingItemReader`의 핵심은 조회된 페이지의 마지막 ID를 기억했다가 다음 쿼리의 시작점으로 사용하는 것입니다.

```java
public class QuerydslNoOffsetPagingItemReader<T> extends QuerydslPagingItemReader<T> {

    private QuerydslNoOffsetOptions<T> options;

    // ... 생성자 생략 ...

    @Override
    protected void doReadPage() {
        clearIfTransacted();
        JPAQuery<T> query = createQuery().limit(getPageSize());
        initResults();
        fetchQuery(query);
        resetCurrentIdIfNotLastPage(); // 조회된 페이지의 마지막 ID 캐시
    }

    @Override
    protected JPAQuery<T> createQuery() {
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
        options.initFirstId(queryFunction.apply(queryFactory), getPage()); 
        return options.createQuery(queryFunction.apply(queryFactory), getPage()); 
    }

    private void resetCurrentIdIfNotLastPage() {
        if (isNotEmptyResults()) {
            options.resetCurrentId(getLastItem());
        }
    }
}
```

### 2-2. 사용 방법

```java
@Bean
public QuerydslNoOffsetPagingItemReader<Product> reader() {
    // 1. No Offset 옵션 설정 (기준 필드와 정렬 방향)
    QuerydslNoOffsetNumberOptions<Product, Long> options =
            new QuerydslNoOffsetNumberOptions<>(product.id, Expression.ASC);

    // 2. Reader 생성
    return new QuerydslNoOffsetPagingItemReader<>(emf, chunkSize, options, queryFactory -> queryFactory
            .selectFrom(product)
            .where(product.createDate.eq(jobParameter.getTxDate())));
}
```

---

## 3. QuerydslNoOffsetPagingItemReader 성능 비교

기존에 작동되던 배치 중 2개를 변경해서 비교해 보았습니다.

### 3-1. 첫번째 Batch Job (약 87만 건)
| 구분 | 총 수행 시간 | 마지막 페이지 읽기 시간 |
| --- | --- | --- |
| QuerydslPagingItemReader | 21분 | 2.4초 |
| QuerydslNoOffsetPagingItemReader | **4분 36초** | **0.03초** |

### 3-2. 두번째 Batch Job (약 119만 건)
| 구분 | 총 수행 시간 | 마지막 페이지 읽기 시간 |
| --- | --- | --- |
| QuerydslPagingItemReader | 55분 | 5초 |
| QuerydslNoOffsetPagingItemReader | **2분 27초** | **0.08초** |

비교 결과를 보면 마지막 페이지에 가서도 속도가 전혀 느려지지 않는 것을 확인할 수 있습니다.

---

## 4. 마무리

2개의 QuerydslItemReader가 추가되면서 기존의 Spring Batch Job들에도 많은 변화가 생겼습니다.

- **복잡한 정렬 기준이 아니면서 대량의 페이징 조회** 가 필요한 경우엔 `QuerydslNoOffsetPagingItemReader`
- 그외 일반적인 상황에서는 `QuerydslPagingItemReader`

부족한 코드를 공개한다는게 참 부끄러운 일이지만, 그래도 누군가에겐 이 코드가 필요하지 않을까 생각했습니다. 

### 번외. Jitpack으로 의존성 관리하기

```groovy
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    compile 'com.github.jojoldu.spring-batch-querydsl:spring-batch-querydsl-reader:2.1.0'
}
```
