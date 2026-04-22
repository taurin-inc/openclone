---
topic: "[Typescript] 1. TypeORM에서 페이징 API 만들기 - 기본페이징 기능"
source_type: other
source_url: "https://jojoldu.tistory.com/579"
authorship: self
published_at: 2021-06-10
---
# [Typescript] 1. TypeORM에서 페이징 API 만들기 - 기본페이징 기능

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 6. 10.

웹 서비스를 구현하는 과정에서 페이징 API는 가장 기본적인 기능인데요.

Java 기반의 페이징 구현 코드는 많은데, Typescript 와 TypeORM 의 구현 코드가 많지 않아 작성하게 되었습니다.

현재 Typescript 와 TypeORM 스펙으로 웹 서비스를 구현하신다면 한번쯤 참고해보셔도 좋을것 같습니다.

> 전체 코드는 [Github](https://github.com/jojoldu/ts-api-template) 에 있습니다.

여기서는 기본적인 페이징에 대해서만 소개 드리는데요.

**고성능의 페이징 API** 가 필요하다면 이전의 포스팅들을 참고해주세요.

*   [1. NoOffset 사용하기](https://jojoldu.tistory.com/528)
*   [2. 커버링 인덱스 사용하기](https://jojoldu.tistory.com/529)
*   [3-1. 페이지 건수 고정하기](https://jojoldu.tistory.com/530)
*   [3-2. 첫 페이지 조회 결과 cache 하기](https://jojoldu.tistory.com/531)

---

## 1. 프로젝트 구조

사용된 대표적인 패키지는 다음과 같습니다.

*   Typescript
*   [TypeDI](https://www.npmjs.com/package/typedi)
    *   DI (Dependency Injection) 라이브러리
*   TypeORM
*   [typeorm-typedi-extensions](https://www.npmjs.com/package/typeorm-typedi-extensions)
    *   위 TypeORM의 Repository들을 DI 로 사용하기 위한 패키지
*   [Routing Controllers](https://www.npmjs.com/package/routing-controllers)
    *   Rest API 용
*   Jest
    *   테스트 프레임워크
*   Supertest
    *   실제 HTTP API를 호출해서 API 명세를 테스트할 수 있도록 지원합니다.

프로젝트 구조는 다음과 같습니다.

```
├─ src
│  ├─ app.ts
│  ├─ config # config
│  ├─ controller # API Route
│  ├─ entity # ORM Entity & Command Repository
│  ├─ repository # Query Repository
│  ├─ service # Service Layer
│  │  ├─ Page.ts # Service Response Dto
│  │  ├─ PageWithoutCount.ts # Service Response Dto
├─ test
│  ├─ integration # Integration Test Dir
│  └─ unit # Unit Test Dir
```

여기서 Entity와 Repository가 분리된 것이 의아하실텐데요.

Entity는 흔히 Domain이란 영역을 담당하고 있습니다. 여기서 Command (등록/수정/삭제)는 Domain에 밀접하게 대응되지만, Query (조회)는 **Domain 보다는 기능에 밀접** 하게 됩니다.

일반적으로 조회 기능은 도메인에 종속 되기 보다는 **기능마다 어떤 데이터를 노출하고싶은지** 에 대응되기 마련인데요. 그러다보니 서비스의 중요한 비지니스 로직은 대부분 데이터 변경 작업이고, 데이터 조회(R) 작업은 단순 데이터 조회입니다.

이 2가지 업무를 같은 영역에서 다루다보면 **실제 도메인 로직이 아님에도 도메인 영역에서 다뤄야하는 경우가 빈번** 합니다. 이럴 경우 분리된 조회용 repository Layer에서 다루게 됩니다.

---

## 2. 페이징 API 코드

먼저 페이징 처리에 항상 사용될 Request Dto와 Response Body Dto를 생성합니다.

### 2-1. 공통 코드

**PageRequest.ts**

```typescript
export abstract class PageRequest {
    pageNo: number| 1;
    pageSize: number| 10;

    getOffset(): number {
        return (this.pageNo-1) * this.pageSize;
    }

    getLimit(): number {
        return this.pageSize;
    }
}
```

*   `getOffset`: pageNo와 pageSize를 계산해서 `offset`으로 전환해주는 메소드입니다.

**Page.ts**

```typescript
export class Page<T> {
  pageSize: number;
  totalCount: number;
  totalPage: number;
  items: T[];

  constructor(totalCount: number, pageSize: number, items: T[]) {
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount/pageSize);
    this.items = items;
  }
}
```

페이징 결과를 담을 Page 클래스입니다. 제네릭 (`<T>`)을 사용하여 다양한 타입을 허용합니다.

### 2-2. 구현 코드

**ArticleQueryRepository.ts**

```typescript
@EntityRepository(Article)
export class ArticleQueryRepository {
    paging(param: ArticleSearchRequest): Promise<[Article[], number]>{
        const queryBuilder = createQueryBuilder()
            .select([
                "article.id",
                "article.reservationDate",
                "article.title",
                "article.content"
            ]) // (1)
            .from(Article, "article")
            .limit(param.getLimit())
            .offset(param.getOffset()); // (2)

        if(param.hasReservationDate()) { // (3)
            queryBuilder.andWhere("article.reservationDate >= :reservationDate", {reservationDate: param.reservationDate})
        }

        if(param.hasTitle()) {
            queryBuilder.andWhere("article.title ilike :title", {title: `%${param.title}%`});
        }

        return queryBuilder
            .disableEscaping()
            .getManyAndCount(); // (4)
    }
}
```

1.  **select**: 단순 조회에서는 필요한 컬럼만 받는 DTO 형태로 결과를 만드는 것을 추천합니다.
2.  **.offset(param.getOffset())**: 객체에게 책임을 위임하여 값을 전달받습니다.
3.  **if(param.hasReservationDate())**: 동적 쿼리를 처리합니다.
4.  **getManyAndCount()**: 조회 결과와 전체 카운트를 함께 반환합니다.

**ArticleService.ts**

```typescript
@Service() // (1)
export class ArticleService {
    constructor(
        @InjectRepository() private articleQueryRepository: ArticleQueryRepository, // (2)
        ) {}

    async search(param: ArticleSearchRequest) : Promise<Page<ArticleSearchItem>>{
        const result = await this.articleQueryRepository.paging(param);
        return new Page<ArticleSearchItem>(result[1], param.pageSize, result[0].map(e => new ArticleSearchItem(e))); // (3)
    }
}
```

1.  **@Service**: TypeDI를 통한 의존성 등록.
2.  **@InjectRepository**: Repository 주입을 위한 데코레이터.
3.  **result**: `result[0]`은 데이터, `result[1]`은 카운트입니다.

**ArticleController.ts**

```typescript
@JsonController("/article")
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @HttpCode(200)
    @Get('/search')
    public async search(@QueryParams() param: ArticleSearchRequest, @Res() res: Response) {
        try{
            return await this.articleService.search(param);
        }catch (e) {
            logger.error('에러 발생', e);
            return e.message;
        }
    }
}
```

---

## 3. 테스트 코드

**Page.test.ts**

```typescript
describe('Page', () => {
    it.each([
        [10, 10, 1],
        [11, 10, 2],
        [20, 10, 2],
        [9, 10, 1],
        [0, 10, 0],
    ])('totalCount=%i, pageSize=%i 이면 totalPage=%i', (totalCount, pageSize, expected) => {
        expect(new Page(totalCount, pageSize, []).totalPage).toBe(expected);
    })
})
```

**PageRequest.test.ts**

```typescript
describe('PageRequest', () => {
    it.each([
        [1, 10, 0],
        [2, 10, 10],
        [3, 10, 20],
        [1, 20, 0],
        [2, 20, 20],
    ])('pageNo=%i, pageSize=%i 이면 offset=%i', (pageNo, pageSize, offset) => {
        expect(new MockPageRequest(pageNo, pageSize).getOffset()).toBe(offset);
    })
})

class MockPageRequest extends PageRequest {
    constructor(pageNo: number, pageSize: number) {
        super();
        super.pageNo = pageNo;
        super.pageSize = pageSize;
    }
}
```

**ArticleQueryRepository.test.ts**

```typescript
it("paging + ilike ", async () => {
    const now = new Date();
    const targetTitle = 'Test';
    const article = Article.create(now, targetTitle, '테스트데이터', null);
    await articleRepository.save(article);

    //when
    const result = await articleQueryRepository.paging(ArticleSearchRequest.create(now, 'test', 1, 10));
    const entities = result[0];
    const count = result[1];
    
    //then
    expect(entities).toHaveLength(1);
    expect(entities[0].title).toBe(targetTitle);
    expect(count).toBe(1);
});
```

**ArticleController.test.ts**

```typescript
it("paging 조회", async () => {
    // given
    const title = 'title';
    const date = dayjs('2021-06-05').toDate();
    await articleRepository.save(Article.create(date, title, 'content', null));

    // when
    const res = await request(app)
        .get('/api/article/search')
        .query({pageNo: 1, pageSize: 10, reservationDate: '2021-01-10', title: title})
        .send();

    // then
    expect(res.status).toBe(200);
    expect(res.body.totalCount).toBe(1);
});
```

---

## 3. 마무리

간단하게 Typescript와 TypeORM을 통해 페이징 API를 만들어보았습니다.

사실 테스트 코드나 DI 등을 제외하면 훨씬 더 적은 코드로 구현할 수도 있는데요. 다만 이렇게 할 경우 기능에만 집중할뿐 팀 단위/서비스 운영 관점에서는 전혀 효용성이 없는 프로젝트가 되기 쉽습니다.

다음 시간에는 기존의 페이징 코드에서 `count`가 없는 형태의 API로 변경하는 것을 소개 드리겠습니다.
