---
topic: "AI 에이전트 시대의 새로운 코딩 패러다임: AI Manager로의 진화"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_x%EC%97%90%EC%84%9C-%ED%94%84%EB%A1%A0%ED%8B%B0%EC%96%B4%EB%93%A4%EC%9D%B4-%EB%A7%90%ED%95%98%EB%8A%94-%EA%B1%B8-%EB%B3%B4%EA%B3%A0-%EC%A3%BC%EB%B3%80%EC%97%90%EC%84%9C-%EC%A0%95%EB%A7%90-%EC%9E%98-%EC%93%B0%EB%8A%94-%EC%82%AC%EB%9E%8C%EC%9D%84-%EB%B3%B4%EB%A9%B4%EC%84%9C-activity-7413704535048908801-DIso?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-04
---
X에서 프론티어들이 말하는 걸 보고, 주변에서 정말 잘 쓰는 사람을 보면서 깨달았습니다. 이건 이제 배워야 하는 영역인데, 절대 쉽지 않습니다. Claude Code를 만든 Boris는 터미널에서 5개, 웹에서 10개. 15개의 Claude를 동시에 돌립니다.

가을까지만 해도 저는 이렇게 말하고 다녔습니다.
"Claude Code 숙련도? 그냥 AI랑 대화 잘하면 되는 거 아니야?"

틀렸습니다.

안드레이 카파시가 연말에 말한 것처럼, 새롭게 코딩하는 방식은 AI와 잘 대화하는 멘탈 모델을 뛰어넘었습니다.

---

Boris가 며칠 전 X에 자신의 워크플로우를 공개했습니다.
https://lnkd.in/ghw4Ym6r

1. 대부분의 세션은 Plan mode로 시작한다. 좋은 계획이 있으면 Claude가 one-shot으로 해낸다
2. 매일 수십 번 쓰는 워크플로우는 slash command로 만들어둔다
3. PostToolUse hook으로 코드 포맷팅을 자동화한다
4. 오래 걸리는 작업은 background agent나 Stop hook으로 검증한다

핵심은 마지막 문장이었습니다.
"Claude에게 자기 작업을 검증할 방법을 주면, 결과 품질이 2-3배 올라간다."

---

oh my opencode라는 프로젝트도 있습니다.
https://lnkd.in/g9AQjv5v
GPT 5.2로 설계하고, Gemini 3 Pro로 프론트엔드 쓰고, Claude Opus 4.5로 백엔드 쓰고.
막히면 다른 모델에게 도움받고, 완료되면 다시 검토시킵니다.

이 프로젝트가 말하는 핵심 개념이 있습니다.
"당신의 에이전트는 이제 개발팀 리드입니다. 당신은 AI Manager입니다."

---

저도 이렇게 일합니다.

clarify라는 스킬을 만들었습니다.
"clarify"라고 한 마디 하면, Claude가 AskUserQuestion으로 3단계 질문을 던집니다.
저는 엔터만 치면서 모호함을 없앱니다.

video-subtitle이라는 스킬도 있습니다.
영상 하나 던지면 3개의 서브에이전트가 순차적으로 돌아갑니다.
subtitle-generator가 STT로 추출하고, subtitle-cleaner가 중복을 정리하고, subtitle-corrector가 발표자료 보면서 오류를 교정합니다.

이런 스킬과 에이전트들을 GitHub에 공개하고 있습니다.
https://lnkd.in/gCspfYKR

---

이렇게 일하는 우리는 완전히 다른 고민을 합니다.

Skill을 트리거해서 SubAgent를 부를지.
AskUserQuestion을 어떻게 활용하게 할지.
심지어 난독화된 Claude Code 코드를 에이전트에게 읽혀서 "서브에이전트는 서브에이전트를 부를 수 없다"는 제약을 알아내기도 합니다.

Claude Code 리밋에 도달할 줄 아는 사람의 가치가 점점 높아집니다.
이 사람은 LLM이 어떻게 동작하는지 알고, 목표를 LLM에 정렬할 줄 아는 인재이기 때문입니다.

---

이 새로운 방식을 체계적으로 배워야 합니다.
하지만 배울 매뉴얼이 없습니다.

그래서 프론티어에 있는 사람들이 뭉치게 되는 것 같습니다.
우리끼리 있어야 서로 배울 게 있기 때문입니다.

아주 작은 커뮤니티에서 서로 공유하면서 배우고 있는데, 진짜 자극을 많이 느낍니다.
