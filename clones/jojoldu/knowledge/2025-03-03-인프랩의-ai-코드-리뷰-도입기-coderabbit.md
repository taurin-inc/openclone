---
topic: "인프랩의 AI 코드 리뷰 도입기: CodeRabbit"
source_type: other
source_url: "https://tech.inflab.com/20250303-introduce-coderabbit"
authorship: self
published_at: 2025-03-03
---
thought
Extract main content (title, author, date, main body).
Navigation, footer, sidebar, ads, comments, related links, social buttons.
Markdown.
Original (Korean).

    *   *Title:* 인프랩의 AI 코드 리뷰 도입기: CodeRabbit (Extracted from the context of the blog post and the URL: `20250303-introduce-coderabbit`).
    *   *Author:* 인프랩의 백엔드 개발자 약풍 (Yakpoong).
    *   *Date:* 2025년 3월 3일 (Derived from the URL and internal links like `20250303`).
    *   *Body sections:*
        *   Introduction (Introduction to CodeRabbit).
        *   Example Project.
        *   CodeRabbit Features (Summary, Feedback, Q&A/Issue Creation, Review Instructions).
        *   Internal Examples (DDL conventions, performance, library knowledge, config files).
        *   Reports.
        *   Comparison with static analysis tools.
        *   Conclusion.

    *   *Remove:* Links like "permalink", breadcrumbs, image metadata tags (like `37523`), comment sections, giscus widgets, and pagination (Next/Prev posts).
    *   *Format:* Standard Markdown headers (`#`, `##`, `###`), code blocks (` ```java `), images (`![]()`).

    *   *Intro:* "안녕하세요. 인프랩의 백엔드 개발자 약풍입니다..."
    *   *Example Project:* "구체적인 이해를 돕기 위하여..."
    *   *Features:* List 1 through 5.
    *   *Review Instructions:* These are crucial "Internal Use" examples.
    *   *Static Analysis vs CodeRabbit:* SonarQube comparison.
    *   *Ending:* "지금까지 CodeRabbit 의 기능을..."

    *   The user provided a chunk of text that includes various noise.
    *   I need to filter out the sidebar/navigation/comments.
    *   *Comments section:* Starts with "반응 18개", "댓글 13개", "SungbinYang"... - **DELETE**.
    *   *Footer:* "이전 글", "다음 글" - **DELETE**.
    *   *Clean headers:* Remove the "permalink" text and the `#` hash links inside headers.# 인프랩의 AI 코드 리뷰 도입기: CodeRabbit

**작성자:** 약풍 (Yakpoong)
**날짜:** 2025년 3월 3일

안녕하세요. 인프랩의 백엔드 개발자 약풍입니다.

코드 리뷰는 버그를 예방하고, 팀의 코드 품질을 유지시키는 중요한 장치입니다. 많은 개발자들이 서로의 코드에 대해 리뷰하고 피드백하는 시간은 꼭 필요하지만, 팀의 규모나 상황에 따라 코드 리뷰가 꼼꼼하게 이루어지지 않는 경우들도 종종 생깁니다.

CodeRabbit은 개발팀이 더 활발한 코드리뷰를 할 수 있도록 도와줍니다. CodeRabbit은 AI 기술을 활용하여 코드 변경 사항을 자동으로 분석하고, 코드에 대해 리뷰합니다. 개발자들은 CodeRabbit을 통해 Pull Request(PR) 생성과 동시에 코드 스타일, 버그 가능성, 성능 개선 포인트 등을 자동으로 리뷰받을 수 있습니다.

이 글에서는 CodeRabbit이 어떤 기능을 제공하는지, **인프랩에서는 어떻게 CodeRabbit 을 활용** 하여 코드리뷰를 하고있는지 살펴보겠습니다. 🚀

## 예시 프로젝트

구체적인 이해를 돕기 위하여, 예시 프로젝트를 먼저 소개하겠습니다. 시연용 데모 프로젝트로 자주 사용되는 [spring-petclinic](https://github.com/inflearn/spring-petclinic) 프로젝트에 아주 간단한 피처 기능을 구현하며, CodeRabbit 의 코드리뷰를 받아보겠습니다.

동물병원에 반려동물용 강의 관리 기능을 추가해 보겠습니다. API Endpoint 를 하나 추가하고, 반려동물용 강의를 입력하는 기능을 구현해야 합니다. 구체적인 코드 내용은 [Pull Request](https://github.com/inflearn/spring-petclinic/pull/1) 를 참고해 주세요. CodeRabbit 의 기능을 소개하기 위해, 코드는 최대한 간단한 구조로 구성해 보았습니다.

## CodeRabbit 의 기능 소개

예제 Pull Request 를 바탕으로, CodeRabbit 의 기능을 설명해 보겠습니다. CodeRabbit 에서 제공하는 모든 기능을 소개하지는 않고, 인프랩 개발팀에서 주로 사용하는 기능들을 위주로 설명하겠습니다.

### 1. 코드 변경사항 요약

코드를 리뷰하는 개발자가 처음 Pull Request 를 열었을 때 읽는 것은 PR Summary 입니다. 리뷰하려는 코드나 Pull Request에 대한 배경지식이 많지 않은 경우, Pull Request 에 대한 문맥을 파악하는 것이 중요합니다. **CodeRabbit은 코드 변경사항의 요약** 본을 보여주고, 리뷰어가 코드 변경사항을 빠르게 파악할 수 있도록 도와줍니다.

![PR Summary](https://tech.inflab.com/static/5d65ead8f6913d50f55d0e9646e4bc84/37523/pr-summary.png)
*Pull Request Summary*

CodeRabbit 은 Pull Request 가 열릴 때, 코드의 변경사항을 요약하여 댓글로 달아줍니다. **Pull Request 를 리뷰할 다른 개발자들은 이 요약을 읽고, 코드 변경사항에 대한 전반적인 이해를 얻을 수 있습니다.** 단순히 요약만 적어줄 뿐만 아니라, 코드의 변경사항을 쉽게 파악할 수 있는 Workthrough 를 작성해 줍니다.

또한 개발자들이 이해하기 쉽도록, **코드의 변경사항을 한 눈에 이해할 수 있는 Sequence Diagram 도 생성**해 줍니다. Layered Architecture 가 적용되어 있거나, 팀의 코드 컨벤션이 정착되어 있다면 다이어그램 만으로 코드의 구현 내용을 쉽게 예상해 볼 수 있습니다.

![Sequence Diagram](https://tech.inflab.com/static/b9c2e4e7466f138a9fcd4d7bfe61698c/37523/pr-diagram.png)
*Pull Request 의 Sequence Diagram*

### 2. 코드 리뷰 및 피드백

CodeRabbit 을 도입한 후에 리뷰 과정에서 많은 도움을 받았는데, 특히 인간이라면 자주 하게되는 실수들을 CodeRabbit 이 잡아준 적이 많습니다.

#### 오타에 대한 피드백
먼저 타이핑을 하는 과정에서 자주 발생하는 오타를 잘 잡아줍니다.

```java
package org.springframework.samples.petclinic.course;

import org.springframework.data.jpa.repository.JpaRepository;

// CourseRepository 를 CouresRepository 로 잘못 입력
public interface CouresRepository extends JpaRepository<Course, Integer> {}
```

![클래스명 오타](https://tech.inflab.com/static/2c7d9288e3b9f190a404c5c59e9d4b12/37523/code-review1.png)
*오타에 대한 코드리뷰*

#### 함수의 인자를 잘못 넘긴 경우
함수를 호출할 때, 인자값의 순서를 헷갈려서 잘못 넘기는 경우도 잘 잡아냅니다.

```java
public void createCourse() {
    String name = "하루 30분 집사 완전정복";
    String description = "인간의 행동과 심리를 배울 수 있는 강의입니다";
    String difficulty = "초급";
    Integer vetId = 1;

    // 인자값을 잘못 넘김 (description을 두 번 넘김)
    courseService.createCourse(name, description, description, vetId);
}
```

![함수 인자값 실수](https://tech.inflab.com/static/d0793f2745cfa7c9e9dbcf02259a7222/37523/code-review2.png)

#### 디버깅을 위한 코드를 남겨놓은 경우
`console.log()` 나 `System.out.println()` 과 같이 삭제하지 않은 디버깅 코드도 지적해 줍니다.

#### 팀의 컨벤션에 어긋나는 경우
CodeRabbit 은 팀의 컨벤션에 어긋나는 코드를 작성한 경우도 잡아줍니다. 예를 들어, Foreign Key 역할을 하는 컬럼은 `BIGINT` 타입으로 설정해야 하는 팀 컨벤션이 있다면 이를 감지할 수 있습니다.

### 3. 코드 질문 및 이슈 생성

리뷰해준 내용에 대한 해결책이 바로 떠오르지 않거나 추가 질문이 생기면, CodeRabbit에게 자유롭게 질문을 할 수 있습니다. 더 나아가, 대화 도중 바로 GitHub Issue 를 생성하는 것도 가능합니다.

### 4. Review Instructions

**Review Instructions** 는 CodeRabbit 이 코드리뷰를 할 때 어떤 기준으로 리뷰를 해야 하는지에 대한 가이드라인을 설정하는 기능입니다. `.coderabbit.yaml` 파일을 통해 프로젝트별 설정을 할 수 있습니다.

#### 인프랩의 활용 예시:
1.  **DDL 컨벤션 설정:** PK, FK 컬럼은 반드시 `BIGINT` 타입을 사용하도록 가이드.
2.  **성능 최적화 설정:** Node.js에서 독립적인 비동기 작업은 `Promise.all()`을 사용하도록 유도.
3.  **라이브러리 배경지식 설정:** 특정 라이브러리(예: MikroORM)의 알려진 버그가 발생하는 메서드 사용을 지양하도록 경고.
4.  **설정 파일 형식 설정:** `.yml` 파일 등에서 특정 값이 ARN 형식이 아닌 HTTP URL 형식이어야 함을 검증.

### 5. Report

CodeRabbit은 각 Repository에서 어떠한 작업들이 있었는지를 보고서 형식으로 제공하는 Report 기능을 제공합니다. 이를 통해 주간/월간 미팅 시 업무 내용을 공유할 수 있습니다.

## 정적 분석도구와의 차이

SonarQube와 같은 정적 분석 도구는 주로 코드의 정적 패턴 분석(문법 오류, 보안 취약점 등)에 초점을 맞춥니다. 반면 **CodeRabbit은 맥락(Context) 기반 피드백**을 제공합니다. "왜 이렇게 작성했는지", "더 나은 설계는 무엇인지"와 같은 사람과 유사한 판단을 내립니다. 인프랩에서는 SonarQube와 CodeRabbit을 함께 사용하여 상호보완적으로 운영하고 있습니다.

## 마치며

약 7개월간 CodeRabbit을 사용하며 팀의 코드리뷰 문화가 더 활성화되었습니다. AI Assistant가 동료의 리뷰를 완전히 대체할 수는 없지만, 기계적인 실수를 걸러주고 컨벤션을 체크해 줌으로써 리뷰의 효율성을 크게 높여주었습니다. 여러분의 Pull Request에도 `LGTM 👍`이 가득하길 바랍니다!
