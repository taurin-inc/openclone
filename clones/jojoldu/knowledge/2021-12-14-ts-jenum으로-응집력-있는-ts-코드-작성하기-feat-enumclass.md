---
topic: "ts-jenum으로 응집력 있는 TS 코드 작성하기 (feat. EnumClass)"
source_type: other
source_url: "https://jojoldu.tistory.com/621"
authorship: self
published_at: 2021-12-14
---
# ts-jenum 으로 응집력 있는 TS 코드 작성하기 (feat. EnumClass)

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 12. 14.

TypeScript의 Enum은 딱 열거형으로서만 사용할 수 있습니다.

다른 언어에서 Enum을 Static 객체로 사용해본 경험이 있는 분들이라면 이 지점이 굉장히 답답하다는 것을 느낄 수 있는데요.

> Enum을 객체로 활용하면 어떤 큰 장점을 얻게되는지는 [배민 기술 블로그](https://techblog.woowahan.com/2527/) 를 참고해보시면 좋습니다.

저와 똑같이 답답함을 느끼신 분이 계시는지, 이미 TypeScript도 Java의 Enum과 같이 Static 객체로 Enum을 다룰 수 있도록 `ts-jenum` 을 만들어주셨습니다.

이번 시간에는 `ts-jenum` 을 이용해 응집력 있는 Enum 활용법을 소개드리겠습니다.

## 1. 설치

[ts-jenum](https://www.npmjs.com/package/ts-jenum) 은 Java의 `java.lang.Enum` 과 같은 사용성을 얻기 위해 제공하는 라이브러리입니다.

별도의 데코레이터를 제공하는데, 이를 통해 TS/JS가 가진 Enum의 한계점을 해결합니다.

설치 방법은 간단합니다.

```bash
npm i ts-jenum
```

## 2. 사용법

기본적인 예제는 [공식 Github](https://github.com/reforms/ts-jenum) 에 나와있습니다.

그 중 일부를 소개드립니다.

먼저 ts-jenum을 사용한 클래스는 다음과 같이 생성할 수 있습니다.

```typescript
import { Enum, EnumType } from 'ts-jenum';

@Enum('code') // (1)
export class EJobLevel extends EnumType<EJobLevel>() { // (2)
    // (3)
    static readonly IRRELEVANT = new EJobLevel("IRRELEVANT", '경력무관', 0, 99,);
    static readonly BEGINNER = new EJobLevel("BEGINNER", '인턴/신입', 0, 0,);
    static readonly JUNIOR = new EJobLevel("JUNIOR", '주니어', 1, 3);
    static readonly MIDDLE = new EJobLevel("MIDDLE", '미들', 4, 7);
    static readonly SENIOR = new EJobLevel("SENIOR", '시니어', 8, 20);

    private constructor(readonly _code: string, readonly _name: string, readonly _startYear, readonly _endYear,) {
        super();
    }
}
```

> 저는 Enum과 구분하기 위해서 ts-jenum 클래스는 prefix로 `E`를 붙여서 사용하고, 지칭은 EnumClass라고 합니다.
> ex) `Enum: JobLevel`, `ts-jenum: EJobLevel`

이후 오해를 막기 위해 `ts-jenum` 으로 만들어진 클래스들은 **EnumClass** 라고 하겠습니다.

(1) `@Enum('필드명')`
* **EnumClass 메인 Key** 가 될 필드를 지정합니다.
* 여기서는 `_code` 필드의 **getter 메소드** 인 `code`를 메인 Key로 사용합니다.
* 해당 Key는 **절대 중복이 되어선 안됩니다** (EnumClass의 `static class` 들의 구분자 역할을 하기 때문입니다).

(2) `extends EnumType<EJobLevel>()`
* `ts-jenum` 이 제공하는 EnumType을 꼭 상속 받아야합니다.
* 이때 EnumType는 제네릭 타입으로 **상속받은 EnumClass를 꼭 사용해야합니다**.
* EnumClass 에서 제공하는 여러 편의 메소드들 (`find`, `values`, `valueByName` 등등)을 사용할때 타입 명시가 필요하기 때문입니다.

(3) `static readonly IRRELEVANT ~~`
* Enum 타입을 선언하듯이 **EnumClass의 타입** 을 선언합니다.
* 여기서 선언된 `IRRELEVANT`, `BEGINNER`, `JUNIOR`, `MIDDLE`, `SENIOR` 등이 EnumClass의 타입으로 작동합니다.

이렇게 작성된 EnumClass는 다음과 같이 활용 가능합니다.

```typescript
it('ts-jenum 기본 케이스 검증', () => {
  // toString은 @Enum() 에 선언된 필드를 사용한다
  expect('' + JobLevel.IRRELEVANT).toBe(JobLevel.IRRELEVANT.code);

  // values() 는 전체 EnumClass를 반환한다
  expect(JobLevel.values()).toStrictEqual([
    JobLevel.IRRELEVANT,
    JobLevel.BEGINNER,
    JobLevel.JUNIOR,
    JobLevel.MIDDLE,
    JobLevel.SENIOR,
  ]);

  // valueOf는 @Enum() 에 선언된 필드를 통해 찾을 수 있다
  expect(JobLevel.valueOf('MIDDLE')).toBe(JobLevel.MIDDLE);

  // valueByName 는 실제 static 클래스이름으로 찾을 수 있다
  expect(JobLevel.valueByName('MIDDLE')).toBe(JobLevel.MIDDLE);

  // enumName은 static 클래스명이 반환된다
  expect(JobLevel.MIDDLE.enumName).toBe('MIDDLE');

  // find는 람다표현식으로 EnumClass들 사이에서 원하는 대상을 하나 찾을 수 있다.
  expect(JobLevel.find((e) => e.name === '미들')).toBe(JobLevel.MIDDLE);

  // filter는 람다표현식으로 EnumClass들 사이에서 원하는 대상들 여러개를 찾을 수 있다.
  expect(
    JobLevel.filter((e) => e.name === '주니어' || e.name === '미들'),
  ).toStrictEqual([JobLevel.JUNIOR, JobLevel.MIDDLE]);
});
```

## 3. 예제

실제 사례를 통해 한번 EnumClass를 어떻게 활용하면 좋을지 소개드리겠습니다.

```typescript
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class JobLevel extends EnumType<JobLevel>() {
  static readonly IRRELEVANT = new JobLevel('IRRELEVANT', '경력무관', 0, 99);
  static readonly BEGINNER = new JobLevel('BEGINNER', '인턴/신입', 0, 0);
  static readonly JUNIOR = new JobLevel('JUNIOR', '주니어', 1, 3);
  static readonly MIDDLE = new JobLevel('MIDDLE', '미들', 4, 7);
  static readonly SENIOR = new JobLevel('SENIOR', '시니어', 8, 20);

  private constructor(
    readonly _code: string,
    readonly _name: string,
    readonly _startYear,
    readonly _endYear,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get startYear(): number {
    return this._startYear;
  }

  get endYear(): number {
    return this._endYear;
  }

  static findName(code: string): string {
    return this.values().find((e) => e.equals(code))?.name;
  }

  static findByYear(year: number): JobLevel {
    return this.values().find(
      (e) => e.betweenYear(year) && e !== this.IRRELEVANT,
    );
  }

  betweenYear(year: number): boolean {
    return this.startYear <= year && this.endYear >= year;
  }

  getPeriod(): string {
    return `${this.startYear} ~ ${this.endYear}`;
  }

  equals(code: string): boolean {
    return this.code === code;
  }

  toCodeName() {
    return {
      code: this.code,
      name: this.name,
    };
  }
}
```

### 3-1. 데이터들간 연관 관계 정리

데이터베이스에 저장된 영문자 `BEGINNER` 은 화면에서는 `인턴/신입`로 노출되어야 한다고 가정해봅니다. 리터럴 객체도 좋은 해결책이지만, 확장성까지 고려한다면 클래스로 추출하기 좋은 사례입니다.

지금처럼 **미리 정의된 데이터 세트** 안에서만 활동한다면 `ts-jenum` 의 EnumClass가 많은 도움이 됩니다. 클래스의 메소드를 통해 API 응답용 객체로 쉽게 변환할 수도 있습니다.

### 3-2. 상태와 행위 한 곳에서 관리하기

도메인 로직(예: 연차에 따른 등급 확인)이 필요한 경우, `if / switch` 문을 사용하는 대신 EnumClass 내부에 로직을 포함시켜 응집력을 높일 수 있습니다.

```typescript
// 연차로 역량 레벨 조회 예시
const result = JobLevel.findByYear(5); // JobLevel.MIDDLE 반환
```

이렇게 하면 `JobLevel.findByYear(workYear)` 한 줄로 도메인 로직을 수행할 수 있으며, 상태와 로직이 한 곳에서 관리됩니다.

### 3-3. 데이터 그룹 관리하기

여러 레벨을 묶어서 '신입/경력직' 구분이 필요할 때, 별도의 EnumClass를 만들어 관계를 설정할 수 있습니다.

```typescript
@Enum('code')
export class JobLevelGroup extends EnumType<JobLevelGroup>() {
  static readonly NEWCOMER = new JobLevelGroup('NEWCOMER', '신입', [
    JobLevel.BEGINNER,
    JobLevel.JUNIOR,
    JobLevel.IRRELEVANT,
  ]);

  static readonly EXPERIENCED = new JobLevelGroup('EXPERIENCED', '경력직', [
    JobLevel.MIDDLE,
    JobLevel.SENIOR,
    JobLevel.IRRELEVANT,
  ]);

  private constructor(
    readonly _code: string,
    readonly _name: string,
    readonly _jobLevels: JobLevel[],
  ) {
    super();
  }

  static findByJobLevel(jobLevel: JobLevel): JobLevelGroup {
    return this.values().find((group) =>
      group._jobLevels.some((level) => level.equals(jobLevel)),
    );
  }

  get code(): string {
    return this._code;
  }
}
```

이렇게 작성하면 역량 레벨에 맞춰 그룹을 찾을 수 있고, 객체 간의 관계가 명확해집니다.

## 4. 마무리

ts-jenum의 EnumClass는 다른 언어의 Enum과 같은 장점을 얻게 해줍니다.

* A값과 B값이 실제로는 동일한 것인지, 전혀 다른 의미인지 명확해집니다.
* 코드를 사용하기 위해 필요한 메소드들을 응집력 있게 관리할 수 있습니다.
* 변경 시 영향 범위를 파악하기 쉽습니다.

특히 문자열만으로는 표현하기 힘든 **문맥(Context)**을 담을 수 있다는 점이 큰 장점입니다. 라이브러리 특성상 프론트엔드에서 활용하기에는(트리 쉐이킹 등의 이슈로) 어려움이 있을 수 있겠지만, 복잡한 관계 속에서 연관된 데이터들의 상태와 행위를 관리할 때 매우 유용합니다.
