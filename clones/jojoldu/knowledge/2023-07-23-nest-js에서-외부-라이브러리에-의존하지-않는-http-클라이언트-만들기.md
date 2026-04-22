---
topic: "Nest.js에서 외부 라이브러리에 의존하지 않는 HTTP 클라이언트 만들기"
source_type: other
source_url: "https://tech.inflab.com/20230723-pure-http-client"
authorship: self
published_at: 2023-07-23
---
# Nest.js에서 외부 라이브러리에 의존하지 않는 HTTP 클라이언트 만들기

**작성자:** 인트(INT)  
**날짜:** 2023년 7월 23일

안녕하세요. 인프랩 백엔드 개발자 인트입니다.

현대의 웹 애플리케이션은 API를 통해 다양한 데이터와 서비스를 연동하는 것이 일상이 되었습니다. 이러한 API를 사용하기 위해 다양한 통신방법이 존재하는데, HTTP를 가장 보편적으로 사용합니다. 우리는 이러한 HTTP 통신을 위해 다양한 외부 라이브러리를 사용하고 있습니다.

이번 포스트에는 Nest.js 환경에서 외부 라이브러리에 종속되지 않고 쉽게 테스트할 수 있는 HTTP 클라이언트를 만든 경험을 공유하고자 합니다. 인터페이스 분리, 추상화 등 지금은 당연하게 사용하는 개념들에 대한 이야기가 될 것 같습니다. 후반부에는 더 나아가 **선언적 HTTP 클라이언트** 에 대한 이야기와 이를 구현한 라이브러리를 소개하고자 합니다.

## Nest.js HTTP Module의 단점

본격적인 내용에 앞서 Nest.js에서 제공하는 `HTTP Module`에 대한 이야기를 나누고자 합니다. Nest.js를 사용하신다면 이 모듈의 도입을 한 번쯤 고민해 보셨을 것입니다. 공식 문서를 보면 다음과 같은 예제가 있습니다.

```typescript
@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {
  }

  findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('http://localhost:3000/cats');
  }
}
```

짧은 코드이지만 이 모듈의 사용법과 제공하는 인터페이스를 파악할 수 있습니다. 저희도 이 모듈의 적용을 고려해 봤지만, 다음과 같은 이유로 사용하지 않았습니다.

### Observable을 반환

`HTTPModule`이 제공하는 `HttpService`의 모든 HTTP 요청 메서드는 Observable을 반환합니다. Observable은 여러 비동기 작업이 발생하는 상황에서 `rxjs`에서 제공하는 연산자를 활용해 쉽게 체이닝을 할 수 있는 장점이 있습니다. 하지만 저희는 대부분 일회성 HTTP 요청을 받아 처리하는 경우가 많았기에 Promise를 반환하는 것이 더 유용하다고 생각합니다.

아니면 공식 문서에서 안내하는 Promise를 반환하는 방법을 사용할 수 있지만, 이는 내부적으로 `Promise -> Observable -> Promise`로 변환하는 불필요한 과정이 추가됩니다.

### AxiosResponse를 반환

`HttpService`가 Observable을 반환하는 것을 넘어 내부에 AxiosResponse를 반환하는 것도 문제였습니다. AxiosResponse는 axios 라이브러리에서 제공하는 타입으로, **HttpService에 의존하는 서비스는 결국 axios에 의존** 하게 됩니다.

사실상 표준이라고 할 만한 HTTP 클라이언트 라이브러리는 없는 상황에서, axios도 언젠가 deprecated될 가능성이 있습니다. 만약 이러한 일이 발생해 새로운 라이브러리로 교체하는 상황이라면, `HttpService`에 의존한 서비스는 높은 확률로 AxiosResponse를 import 하고 있을 것이기에 이를 모두 새로운 라이브러리가 반환하는 항목으로 교체해야 합니다.

애초에 `rxjs`, `axios` 등 **우리가 제어할 수 없는 외부 라이브러리의 상황에 따라 서비스 코드도 함께 수정** 해야 하는 상황이 문제라고 생각합니다. 이는 OCP라 불리는 개방 폐쇄 원칙을 지키지 못한 설계라고 할 수 있습니다.

---

## WebClientModule 구조

저희는 `WebClientModule`이라 불리는 HTTP 클라이언트 모듈을 직접 만들어 사용하고 있습니다. 이 모듈의 역할은 **내부 구현은 감추고 핵심적인 HTTP 인터페이스만 노출해 외부에서 사용** 할 수 있도록 하는 것입니다.

![module](https://tech.inflab.com/static/8a0b5fbe65129e22e61c98931ddeaba7/37523/module.png)

### WebClient

```typescript
export interface WebClient {
  get(): this;
  head(): this;
  post(): this;
  put(): this;
  patch(): this;
  delete(): this;
  options(): this;
  uri(uri: string): this;
  header(param: Record<string, string>): this;
  contentType(mediaType: MediaType): this;
  body<T>(inserter: BodyInserter<T>): this;
  retrieve(): Promise<ResponseSpec>;
}
```

외부 서비스가 의존하는 인터페이스로 `GET`, `POST` 등의 HTTP 메서드를 제공하고 `header`, `body` 등 HTTP 요청에 필요한 정보를 설정할 수 있습니다. builder 패턴을 적용해 각 메서드가 `this`를 반환하며 `retrieve` 메서드를 호출하면 HTTP 요청을 수행하며 `ResponseSpec`을 반환합니다.

### BodyInserter

`BodyInserter`는 contentType에 따라 다른 형태의 body를 생성하기 위한 클래스입니다.

```typescript
export class BodyInserter<T> {
  private constructor(
    private readonly _mediaType: MediaType,
    private readonly _data: T,
  ) {
  }

  static fromJSON(json: Record<string, unknown>) {
    return new BodyInserter(MediaType.APPLICATION_JSON, json);
  }

  static fromFormData(form: Record<string, unknown>) {
    return new BodyInserter(MediaType.APPLICATION_FORM_URLENCODED, form);
  }

  static fromText(text: string | Buffer) {
    return new BodyInserter(MediaType.TEXT_PLAIN, text);
  }
}
```

### ResponseSpec

`ResponseSpec`은 HTTP 요청에 대한 응답을 표현하는 클래스입니다. HTTP 응답에 항상 존재하는 상태 코드와 응답 바디를 제공하며, 추가로 `toEntity` 메서드를 통해 응답을 특정 클래스의 인스턴스로 변환할 수 있습니다.

```typescript
export class ResponseSpec {
  constructor(
    private readonly _statusCode: number,
    private readonly _body: string,
  ) {
  }

  toEntity<T>(entity: ClassConstructor<T>): T {
    return plainToInstance(entity, JSON.parse(this._body));
  }

  get statusCode() {
    return this._statusCode;
  }

  get rawBody(): string {
    return this._body;
  }
}
```

### GotClient

`WebClient`의 구현체로 [got](https://www.npmjs.com/package/got) 라이브러리를 사용하고 있습니다.

```typescript
import got, {ExtendOptions} from 'got';

export class GotClient implements WebClient {
  private static readonly TIMEOUT = 10_000;
  private readonly _option: ExtendOptions;

  constructor(url?: string, timeout = GotClient.TIMEOUT) {
    this._option = {
      method: 'GET',
      url: url,
      timeout: { request: timeout, response: timeout },
    };
  }

  uri(uri: string): this {
    this._option.url = uri;
    return this;
  }

  get(): this {
    this._option.method = 'GET';
    return this;
  }

  post(): this {
    this._option.method = 'POST';
    return this;
  }

  async retrieve(): Promise<ResponseSpec> {
    const response = await got({
      ...this._option,
      isStream: false,
      resolveBodyOnly: false,
      responseType: 'text',
    });

    return new ResponseSpec(response.statusCode, response.body);
  }
}
```

### WebClientService

`WebClient`는 builder 패턴을 적용했기에 다른 HTTP 요청을 위해 새로운 인스턴스를 생성해야 합니다. 이를 위해 `WebClientService` 클래스를 만들었으며 `WebClient` 인스턴스를 생성하는 역할을 합니다.

```typescript
abstract class WebClientService {
  abstract create(url?: string): WebClient;
}

export class GotClientService extends WebClientService {
  override create(url?: string): WebClient {
    return new GotClient(url);
  }
}
```

### 사용 예시

```typescript
import {Injectable} from '@nestjs/common';
import {BodyInserter, WebClientService} from '@app/web-client';

@Injectable()
export class UserService {
  constructor(private readonly webClientService: WebClientService) {
  }

  async create(email: string, password: string): Promise<void> {
    const response = await this.webClientService
      .create(`https://user.domain.com/users`)
      .post()
      .body(BodyInserter.fromJSON({email, password}))
      .retrieve()
      .then((spec) => spec.toEntity(UserApiResponse));
  }
}
```

---

## WebClientModule 장점

### 순수한 유닛 테스트 작성

외부 라이브러리를 직접 mock하지 않고, `WebClient`의 인터페이스를 따르는 `MockWebClient`를 만들어 테스트할 수 있습니다.

```typescript
export class MockWebClient implements WebClient {
  urls: string[] = [];
  methods: Method[] = [];
  #responses: { statusCode: number; body: string }[] = [];

  uri(url: string): this {
    this.urls.push(url);
    return this;
  }

  async retrieve(): Promise<ResponseSpec> {
    const response = this.#responses.shift();
    return new ResponseSpec(response.statusCode, response.body);
  }

  addResponse(statusCode: number, body: string): this {
    this.#responses.push({statusCode, body});
    return this;
  }
  // ...생략
}
```

이를 활용하면 jest의 mock 기능이나 `@nestjs/testing` 패키지 없이도 순수한 코드로 테스트를 작성할 수 있습니다.

### 유연한 외부 라이브러리 교체

만약 `got` 대신 `node-fetch`로 교체해야 한다면, 새로운 구현체를 만들고 `WebClientModule`에서 `useClass` 부분만 수정하면 됩니다. 서비스 로직은 전혀 수정할 필요가 없습니다.

---

## 선언적 HTTP 클라이언트

현재의 구조도 충분히 훌륭하지만, 서비스 로직에 여전히 HTTP 통신 세부 사항이 포함되어 있습니다. JVM 진영의 `OpenFeign`이나 `Retrofit`처럼, 인터페이스만 정의하면 구현체가 자동으로 생성되는 **선언적 HTTP 클라이언트** 방식을 TypeScript와 Nest.js에서도 적용할 수 있습니다.

### Nest.js 용 선언적 HTTP 클라이언트

TypeScript의 데코레이터를 활용하면 다음과 같은 형태로 코드를 작성할 수 있습니다.

```typescript
@HttpInterface('https://example.com/api')
class UserHttpService {
  @GetExchange('/users/{id}')
  @ResponseBody(UserResponse)
  async request(@PathVariable('id') id: number): Promise<UserResponse> {
    return {} as any;
  }
}
```

이런 방식을 사용하면 서비스는 오직 직접 작성한 인터페이스(`UserHttpService`)에만 의존하게 되어 결합도를 더욱 낮출 수 있습니다.

> 이 기능을 적용해 구현한 라이브러리는 다음 링크에서 확인하실 수 있습니다: [nest-http-interface](https://www.npmjs.com/package/@r2don/nest-http-interface)
