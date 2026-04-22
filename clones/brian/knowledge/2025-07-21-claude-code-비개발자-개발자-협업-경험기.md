---
topic: "Claude code + 비개발자 + 개발자 협업 경험기"
source_type: newsletter
source_url: "https://briandwjang.substack.com/p/claude-code"
authorship: self
published_at: 2025-07-21
---
# Claude code + 비개발자 + 개발자 협업 경험기

**작성자:** 브라이언(장동욱)  
**날짜:** 2025년 7월 21일

Vibe coding이라고는 Replit으로 몇개 웹앱, 웹사이트 만들어본 정도 경험밖에 없는 나는 제대로 동작하고 사람들이 필요로 하는 서비스를 한번 만들어보고 싶은 니즈가 있었는데, 최근 [Taeho](https://open.substack.com/users/159424824-taeho?utm_source=mentions) 대표님이 아주 감사한 제안을 주셨다.

“하루 날 잡고 저랑 Vibe coding해서 서비스 하나 만들어보실래요? 저도 비개발자와 vibe coding으로 일하는 경험에서 배울게 많을 것 같고 브라이언도 도움이 되실 것 같아요”

너무 많은걸 배울 수 있는 기회라고 생각해서 덥썩 하겠다고 하고, 지난주 금요일 아침에 둘이 역삼의 빈 회의실에 모였다.

### Backlog에 남겨진 아이디어 : 명상 서비스

최근 영어 표현을 카톡으로 보내주는 서비스들에서 영감을 받아 “Meditation service delivered by Whatsapp”을 만들려고 했었고, replit으로 랜딩페이지와 어드민 페이지를 구현해서 가져갔다.

![랜딩페이지 초안](https://substackcdn.com/image/fetch/$s_!uxee!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb92e543b-dcca-4e03-ac88-c9ed05bdba4e_1524x1484.png)

(랜딩페이지 초안)

원래 계획은 유튜브에 좋은 Voice guided 명상 컨텐츠가 많기 때문에 명상 컨텐츠를 직접 만들기보다는 선별을 해서 보내주면 된다고 생각했고, 습관화를 하기 어려운게 가장 큰 페인포인트라고 생각해서 1) 좋은 큐레이션 + 2) 습관화를 USP(Unique selling proposition)로 잡고 한달에 5달러에서 9달러 정도를 받으려고 했다.

다만 Taeho와 티키타카를 하다보니 결국 자체 컨텐츠가 아니면 결제를 받기엔 USP가 약하지 않을까라는 결론으로 이어졌고, 취지상 오늘 같이 비개발자 + 개발자가 바이브코딩으로 협업하는 경험을 위해 모인 것인데 (replit이)거의 다 만들어온 것을 가지고 시작하기 보다는 다른 서비스를 해보자고 의견을 모았다. 그래서 이 서비스는 backlog로 남겨두었다. (누군가 좋은 아이디어라고 생각하면 하셔도 된다.)

### Claude code와 Github에서 바로 협업하기

실제로 어떤 아이템으로 만들기로 했는지는 사정상 오픈을 안하기로 결정을 해서, 과정과 배움만 공유를 해보겠다. Replit을 통해서만 몇 번 만들어봤던 나에게, Github 프로젝트 페이지에서 협업을 하는 과정은 매우 새롭고 흥미로웠다. Taeho가 나에게 Github ID와 vercel ID를 알려달라고 해서, 공유했고, 바로 프로젝트 페이지에 초대가 되었다. 그리고는 간단한 몇줄의 코드로 Taeho가 평소 사용하는 Claude code를 github에서 사용할 수 있도록 설정하였다. 그리고 이런 순서로 진행해보기로 했다. PRD도 없고, 와이어 프레임도 없는 방식이었다.

1.  서비스가 어떤 형상이 될지 각자 랜딩페이지 등 vibe coding으로 구현해보기
2.  둘 중에 더 좋은 것으로 claude와 github에서 바로 구현들어가기
3.  최대한 당일에 오픈하는 것을 목표로 하기

첫 랜딩페이지는 Taeho가 claude를 통해 아이디어를 받아 figma로 구현한 랜딩페이지를 초안으로 시작했다. 클로드 연동 테스트 등을 제외하고 우리 프로젝트의 첫 Issue → Pull request는 claude에 코딩을 부탁하는 것으로 시작이 되었다.

![Github Issue](https://substackcdn.com/image/fetch/$s_!v4Qr!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff46ac731-6fac-4f2c-af54-11a03e16b505_1912x1588.png)

그리고 나서 완성된 replit이 구현한 서비스 상세 페이지들의 프론트엔드로 나머지를 구현해야겠다 싶어서 아예 replit에게 지금까지 구현한 서비스를 구현할 수 있도록 프롬프트를 달라고 했고, 이걸 기반으로 claude에게 참고해서 전체 플랫폼을 구현해달라고 부탁했다. 이후 랜딩페이지는 replit에 프론트엔드 소스코드를 아예 출력해달라고해서 복붙해서 참고해달라고 하는 것도 잘 반영이 되는 것을 확인했다.

이런 식으로, 각자 개선해야겠다고 생각한게 있으면

“이거 이렇게 수정 한번 해볼게요”

하고 동의를 간단히 얻고, Issue를 만들어 Claude에게 일을 시킨 후, 완료가 되면 Pull request로 빼서 Deploy된 버전을 확인 + Code review까지 완료한 후(이것도 시스템 프롬프트로 Claude가 merge 전에 하도록 되어있다.) Squash and merge 하는 방식으로 하루종일 코딩을 했다.

![Github Issues list](https://substackcdn.com/image/fetch/$s_!Dxwp!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa06efc8f-edc6-4e91-9bf2-3e43894130e5_2314x1578.png)
(Github Issues list)

![Github Pull request list](https://substackcdn.com/image/fetch/$s_!Kw73!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4d637cac-bd98-45d6-b900-9c43f587c36f_2556x1586.png)
(Github Pull request list)

Taeho는 직접 코딩하여 Commit한 경우도 꽤 있었다. 결과적으로 둘이서 금요일 저녁 7시까지 해서 37개의 commit을 진행했다. 나머지 백엔드, 어드민페이지 구현 등은 태호가 주말에 틈틈히 해주셨는데 월요일에 보니 commit(PR) 숫자가 82개로 늘어있어서 깜짝 놀랐다. 이게 특급 개발자의 속도구나 싶었다.

### 이 경험을 통해 배운점

이 특별한 경험을 통해 많은 것을 배웠는데 몇개 임팩트 있는 배움을 추려보면 아래와 같았다.

*   **Github에 AI agent를 초대해서 일하는 방식의 장점**
    *   이미 이렇게 일하고 계신 팀들도 많겠지만 나에게는 새로웠던 점.
    *   GitHub 리포지토리에 AI 에이전트를 초대하여 일하는 방식은 기존에 일하는 방식에 녹아들면서도 풀스택 개발자 한명을 추가하는 효과가 있다.
    *   이슈(issue) → PR 생성 → 코드 리뷰 → 충돌 해결 → 배포 과정을 자동화
    *   “어떤 에러가 났는데 수정해 줘” 식의 자연어 명령만으로 코드 수정/커밋/PR 생성까지
    *   팀에 풀스택 개발자 추가 또는 개발자의 생산성을 높여주는 효과
*   **개발은 이제 Two-Way Door 결정이 되었다:** 태호와 그날 이야기 나누었던 주제인데, Jeff Bezos가 말했던 실험 가능한(‘Two-Way Door’) 결정은 빠르게 실행→검증→개선, 되돌릴 수 없는(‘One-Way Door’) 결정은 신중하게 하라는 framework에서 원래 개발은 one way 도어였지만 이제는 Two way 도어가 된 것 같다는 태호의 말이 몸으로 와닿았다.
*   **PRD 역할의 재정의와 Full stack PO의 가능성**: 상세한 PRD 없이도 ‘무엇을 만들 것인가’가 명확하면, 작게 만들고 계속 반복하는 방식이 더 빠른 제품 출시에 유효하며, PRD가 PO와 디자인, 개발자 사이의 소통과 협업을 위한 것이었는데 이게 없어도 된다는 것이 무슨 의미인가를 생각해보면 각각이 Full stack PO 한명으로 squad를 대신하여 일하는 방식이 실제로 가능해진 것을 체감했고, 이렇게 하면 3명이서 한 스쿼드가 되어 한 기능을 맡는게 아니라 3개 스쿼드가 각각 기능들을 맡아 개선을 할 수 있게 되니 훨씬 속도가 빠르겠다 싶었다.
