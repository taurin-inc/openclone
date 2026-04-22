---
topic: "Code generator 개발기 (Part 2)"
source_type: other
source_url: "https://tech.inflab.com/20230625-code-generator-part-2"
authorship: self
published_at: 2023-06-25
---
# Code generator 개발기 (Part 2)

**작성자**: 루카스  
**날짜**: 2023년 06월 25일

안녕하세요. 인프랩 프런트엔드 개발자 루카스입니다.

[이전 글](https://tech.inflab.com/20230613-code-generator-part-1/) 에서는 code generator의 필요성과 직접 구현하기까지의 고민을 공유했습니다. 이번 포스트에서는 code generator를 비롯하여 schema validator, type guard를 어떻게 구현했는지 간단히 소개해 드리려고 합니다.

우선 말씀드리고 싶은 부분은, *아주 간단한 아이디어* 이며 **구현하는 데 있어 복잡한 기술이 필요하지 않다** 는 점입니다. 이 점을 먼저 유념해 주시고 아랫글을 읽어주시면 좋을 것 같습니다.

## 1. 목표와 필요한 기능

[먼저 지난 글에서 세웠던 목표](https://tech.inflab.com/20230613-code-generator-part-1/#5-%EB%AA%A9%ED%91%9C) 에 대해 다시 생각해 보겠습니다. 저는 code generator를 구현하기 전 아래와 같은 목표를 세웠습니다.

1. File 혹은 network 요청을 통해 OpenAPI specification JSON을 직접 파싱하여 원하는 형태의 결과를 file로 만들 수 있어야 한다.
2. 프런트엔드 개발자가 API의 schema 변화에 최대한 불편하지 않게 대응할 수 있어야 한다.
3. 프런트엔드 개발자가 결과물로 만들어지기를 원하는 API를 선택할 수 있어야 한다.
4. API에서 선언한 response를 JSON validator를 통해 검증할 수 있는 type guard가 자동으로 생성되어야 한다.
5. 백엔드 개발자는 프런트엔드의 번거로움을 생각하지 않고 API를 생산할 수 있어야 한다.
6. 백엔드 개발자가 선언한 Swagger와 실제 API response의 형태가 일치하는지 integration test에서 검증할 수 있어야 한다.

특히 마지막 목표는 [Elixir의 doc test](https://elixir-lang.org/getting-started/mix-otp/docs-tests-and-with.html) 개념을 차용한 것입니다. 작년에 진행했던 개인 프로젝트에서 테스트를 작성할 때의 경험이 좋았고, GraphQL이 지원하는 schema 정합성 검증을 비슷하게라도 할 수 있을 것이라는 기대가 있었습니다. 특히 저희 백엔드 파트는 테스트 작성을 매우 중시하고 있어, OpenAPI specification과 실제 API 결과를 테스트하는 편한 방법을 지원할 수 있을 것이라 보았습니다.

> 아랫글 부터 OpenAPI specification JSON은 OAS로 줄이겠습니다.

## 2. 사용한 라이브러리

먼저 구현에 사용한 라이브러리를 소개하겠습니다.

### 1. 구현

- **inversify**
  기능이 늘어날수록 코드 베이스가 복잡해질 것을 고려하여 의존성 주입을 도와줄 IoC container로 선택했습니다.
- **json-schema-to-typescript**
  사실상 code generator의 핵심 라이브러리입니다. JSON schema를 바탕으로 TypeScript 타입을 생성해 줍니다.
- **lodash**
- **object-traversal**
- **js-yaml**
  옵션을 yaml 형태로 받기 위해 사용했습니다.
- **jsonschema**
  Code generator가 허용할 수 있는 옵션을 검증하기 위해 선택했습니다.

### 2. 빌드, 배포

- **TypeScript**
- **tsup**
  esbuild 기반의 빠르고 설정이 간단한 빌드 툴입니다.
- **Release Please**
  conventional commit을 기반으로 pull request 생성부터 배포, change log 관리까지 자동화해 주는 GitHub Action입니다.
- **commitlint**
  일관된 커밋 메시지 작성을 강제하여 배포 프로세스의 실수를 방지합니다.

### 3. 테스트

- **Jest**

---

## 3. 세부 구현 소개

Code generator는 크게 3단계로 실행됩니다.

1. **전처리 과정**: 옵션 검증 및 OAS JSON 로드.
2. **Task 실행**: `ReactQueryTask`, `TypeGuardTask`, `SchemaValidatorTask` 등이 병렬로 실행됩니다.
3. **파일 출력**: 생성된 결과물을 지정된 위치에 파일로 저장합니다.

![codegen-flow](https://tech.inflab.com/17ba839aa9414f8596263f0ffe25b0ac/codegen-flow-light.svg)

### 1. 옵션 입력 받기

사용자로부터 YAML 형태로 옵션을 입력받습니다. `react-query` 사용 여부, `validator` 생성 여부, API 필터링 조건 등을 설정할 수 있습니다.

### 2. 전처리

#### 옵션 검증
`ConfigProvider`와 `ConfigLoader`를 통해 옵션을 파싱하고 검증합니다. 각 옵션(react-query 등)의 변경을 격리하여 유연하게 추가/변경할 수 있도록 구조화했습니다.

#### OAS 파일 전달 받기
`Loader` 인터페이스를 구현한 `FileLoader`와 `FetchLoader`를 만들어, 로컬 파일이나 네트워크 요청을 통해 OAS JSON을 로드할 수 있게 했습니다.

#### Preprocess pipe
로드한 OAS JSON에서 deprecated된 API를 제외하거나 특정 태그를 필터링하는 등의 가공 처리를 담당합니다. `factory` 패턴을 사용하여 필요한 전처리 로직을 유연하게 실행합니다.

### 3. ReactQueryTask

`json-schema-to-typescript`를 활용하여 API 응답 규격에 맞는 타입을 생성하고, template literal을 이용해 React Query의 hooks 문자열을 만들어 냅니다.

![react-query-diagram](https://tech.inflab.com/049cc6ddfcd51332af149cf65756304e/react-query-diagram.svg)

### 4. TypeGuardTask

#### Type guard란 무엇인가
TypeScript에서 변수의 타입을 좁히는(narrowing) 함수입니다. 프런트엔드에서는 특히 API 응답 데이터의 구조에 따라 렌더링 분기를 처리할 때 유용합니다.

#### 자동으로 type guard 만들기
수동으로 작성한 type guard는 API 변경 시 동기화가 깨질 위험이 있습니다. 이를 해결하기 위해 OAS JSON을 기반으로 `jsonschema` 라이브러리를 사용하는 검증 함수를 자동으로 생성하게 했습니다.

### 5. SchemaValidatorTask

백엔드 개발자가 OAS 명세와 실제 API 응답이 일치하는지 integration test에서 검증할 수 있도록 [Ajv](https://ajv.js.org/)의 standalone 인스턴스를 생성해 주는 기능을 제공합니다.

---

## 4. 결과물의 형태

OAS JSON을 입력받았을 때, 생성되는 결과물의 예시는 다음과 같습니다.

### ReactQueryTask 결과 (schema.ts)
```typescript
export interface CategoryAllResponse {
  jobGroup: Maybe<JobGroupCodeName[]>;
  jobSeekerStatus: CodeName[];
}

export function useV1CategoryQuery({ ... }) {
  const result = useQuery<V1CategoryResponse, unknown>(
    queryKey,
    () => fetchV1Category(url, requestOptions),
    options,
  );
  return { ...result, data: result.data?.data };
}
```

### TypeGuardTask 결과 (guard.ts)
```typescript
import { Validator } from 'jsonschema';
const validator = new Validator();

export const isCategoryAllResponse = (value: unknown): value is CategoryAllResponse => {
  return validator.validate(value, {
    type: 'object',
    properties: { ... },
    required: ['jobSeekerStatus'],
  }).valid;
};
```

### 활용 사례
```tsx
// 프런트엔드 활용
import { useV1CategoryQuery, API_ENDPOINT } from './schema';
import { isJobGroupCodeName } from './guard';

// 백엔드 테스트 활용
import validator from './validator';
it('OAS와 실제 결과는 같아야 한다.', async () => {
  const response = await controller.categoryAllResponse();
  expect(validator.categoryAllResponse(response)).toBe(true);
});
```

---

## 5. 정리

구현 과정에서 가장 고민했던 부분은 **책임을 적절하게 분배**하고 **코드 중복을 제어**하는 것이었습니다.

1. 객체의 책임을 세심하게 분리했습니다.
2. 횡단 관심사는 `Service` 레이어로 나누었습니다.
3. 실행 시점 로직 변경이 필요한 경우 **전략 패턴**을 사용했습니다.
4. 공통 로직 처리를 위해 **템플릿 메서드 패턴**을 적용했습니다.

![all-diagram](https://tech.inflab.com/2189cfb5d5cf5aee3d71573524eae18c/all-diagram.svg)

이어지는 글에서는 code generator를 도입하고 나서 어떻게 일하는 방식이 바뀌었는지 소개해 드리겠습니다.
