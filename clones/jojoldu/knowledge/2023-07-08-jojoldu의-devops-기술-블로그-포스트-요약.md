---
topic: "jojoldu의 DevOps 기술 블로그 포스트 요약"
source_type: other
source_url: "https://jojoldu.tistory.com/category/DevOps"
authorship: self
published_at: 2023-07-08
---
# DevOps (기억보단 기록을)

**Author:** jojoldu (기억보단 기록을)

---

### AWS Lambda를 활용한 동적 Redirect Server 구축하기 (Dynamic HTML Serving)
**날짜:** 2023. 7. 8.

기존 프로젝트에서 신규로 페이지를 만들었지만, 해당 페이지의 공유 링크는 기존 프로젝트의 meta tag가 아니라 신규 페이지 전용 meta tag 가 필요할 때가 종종 있다. 카톡방 공유 링크의 미리보기나 여러 크롤러들의 수집등에 유리함을 얻기 위해서는 Server Side에서 meta tag를 만들어서 HTML을 내려주는 것이 좋다. 하지만 아래와 같은 환경이라면 이렇게 Server Side를 동적으로 그려내기가 어려울 수 있다. 기존 프로젝트의 레거시로 인해서 동적으로 Server Side에서 meta tag를 수정하기가 어렵거나 SPA로 구축되어 단일 HTML로만 관리되고 있어 Server Side에서 meta tag 를 수정하기 어렵거나 그래서 원하는 meta tag를 가진 공유 링크만 담당하는..

---

### AWS RDS PostgreSQL에서 Slow, Error, DDL 쿼리 발생시 Slack 발송하기
**날짜:** 2023. 4. 13.

이전 글 에서 RDS에서 Slow Query가 발생했을때 Slack을 발송하는 것을 구현했다. 이번 시간에는 해당 코드를 발전시켜서 Slow, Error, DDL 쿼리들을 각각의 채널에 발송시키도록 Lambda 코드를 개선해보자. 이후에 이 코드는 Serverless 등의 프레임워크로 교체될 예정이다.

1. 구조
가능하면 AWS Lambda는 각각 하나의 기능만 담당하도록 구성하고 싶었다. 하지만 CloudWatach의 로그 스트림에서는 구독 필터를 2개밖에 할당하지 못한다. 즉, Slow, Error, DDL 등 종류별로 Lambda를 만들어서 구독을 시킬 수가 없다. 그래서 하나의 Lambda에서 로그 종류를 구분해서 각각 Slack 채널에 전송하도록 구성해야한다. 물론 하나의 Lambda가 Gateway가 ..

---

### Giscus 댓글, 텔레그램 (Telegram) 으로 알람 받기
**날짜:** 2023. 3. 6.

최근에 Giscus로 댓글 시스템을 이관하면서 새 댓글이 생성될때 알람을 받을 방법이 없었다. 그래서 간단하게 Github Action과 Telegram을 통해 알람을 받도록 구성했다.

1. 텔레그램 Bot 생성
BotFather 에서 새로운 봇을 생성한다. `/newbot` 을 입력해서 새로운 봇 생성을 시작 blog-comment 라는 이름으로 봇 생성 방금전에 생성한 blog-comment 봇의 username을 지어야한다. 여기서는 MyBlogCommentBot 으로 지었다. 마지막엔 꼭 bot이 붙어야 한다. 마지막 메세지에 포함된 token 값이 앞으로 사용할 Token이라 별도로 관리를 한다. 해당 Bot의 채널ID를 알아야 API를 사용할 수 있다. chatId를 확인해보기 위해 생성된 Bot..

---

### Utterances 에서 Giscus 로 마이그레이션하기
**날짜:** 2023. 3. 5.

블로그의 댓글을 Utterances 에서 Giscus 로 마이그레이션 했다. 기존 댓글을 잘 사용하고 있었지만, 장점이 훨씬 많은 Giscus로 이관하게 되었다.

1. Giscus 장점
Giscus 는 Utterances에 비해 많은 장점들이 있다. 대댓글 댓글 수, 댓글 정렬, 게시물에 대한 반응 다양한 테마 생각보다 많은 테마와 사용자가 직접 생성한 테마를 적용할 수 있다. 블로그에 적용된 테마는 Github Light High Contrast 테마이다. (High Contrast 테마는 JetBrains IDE에서도 사용하는 애정하는 테마이다.) 그 외 장점 지연 로딩 댓글 다국어 (한국어 포함) 봇 자체 호스팅 기타 등등 여러 다양한 옵션들이 존재 가장 중요한건 실제로 계속해서 관리가 되고 있는 ..

---

### Jira Release 발생시 Slack에 Release Notes 발행하기
**날짜:** 2022. 5. 2.

회사 업무를 진행하다보면 매번 자주 하는 작업 중 하나가, 배포공유이다. 배포가 완료되고, Jira의 티켓들을 Release 하고나면, 어떤 티켓들이 이번에 운영에 배포되었는지를 Slack에 공유하는 것이다. 매번 하는 것이 귀찮으니, 자동화를 진행할 필요가 있다.

1. Jira Rule 생성
Jira에는 자동화를 지원하는 기능이 있다. Automation 이라는 기능인데, Jira의 굉장히 많은 기능들을 별도의 앱 없이 자동화를 사용할 수 있도록 한다. 이를 이용하면 Slack / Github / Jenkins 등의 연동을 아주 쉽게 할 수 있다. 이번 글에서도 마찬가지로 Jira Automation을 이용해서 진행한다. Jira 보드의 좌측에 있는 Project settings를 선택한다. 이동된 좌..

---

### release 브랜치 merge시 Tag 생성, 브랜치 삭제하기 (feat. Gihtub Action)
**날짜:** 2022. 4. 23.

최근에 상권님의 포스팅을 보고나서 기존 프로젝트의 배포에 대한 추가 자동화를 진행했다. 앱 배포후 Jira에서 버전 Release처리 자동으로 하는 방법(feat. GitHub Action) 상권님의 포스팅에서는 다음과 같이 Github Action 의 자동화를 구성하셨다. Master 브랜치에서 Push가 발생하면 PR Merge 가 되어도 Master 에서는 Push가 발동된다 Merge Commit으로 발생한 커밋 메세지에서 버저닝 번호만 추출해서 Tag로 생성 반면에 우리 프로젝트는 release 브랜치의 반영이 다음과 같이 진행된다. 그래서 그대로 적용할수는 없었고, 우리팀 스타일에 맞게 개조가 필요했다. maaster Push가 아니라 PR이 merge가 되었을때만 Github Action이 ..
