---
topic: "AI 에이전트 시대의 개발자 역할 변화와 Clawdbot"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_yeongyu-kim%EC%9D%B4-clawdbot-%EC%82%AC%EC%9A%A9%EC%9D%84-%EA%B0%95%EB%A0%A5-%EC%B6%94%EC%B2%9C%ED%95%B4%EC%A3%BC%EC%85%A8%EC%96%B4%EC%9A%94-%EB%A1%9C%EC%BB%AC%EC%97%90%EC%84%9C-activity-7422756684638502913-eJys?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-29
---
YeonGyu Kim이 Clawdbot 사용을 강력 추천해주셨어요. 로컬에서 조금 써봤구요. 제대로 쓰려고 지금 묵혀둔 맥북 가지러 가고 있습니다.
Clawdbot 만든 사람의 영상을 자세히 봤습니다. 오랜 경력을 가진 뛰어난 개발자입니다. 하지만 "읽지 않은 코드를 배포한다."라고 말하더라구요.

1. Closing the Loop
AI가 코드를 짜면, AI가 테스트하고, AI가 디버깅합니다. 테스트가 통과하면 배포합니다.
개발자는 한 줄씩 읽지 않아도 됩니다.

대신 해야 할 일이 있습니다. AI가 스스로 검증할 수 있는 환경을 설계하는 것. 아키텍트가 되는 겁니다.
이렇게도 말합니다. "PR은 이제 Pull Request가 아니라 Prompt Request다."

2. 병렬 에이전트
피터는 Codex CLI를 데일리 드라이버로 씁니다. 터미널을 3x3 그리드로 나눠서 3~8개 에이전트를 동시에 돌립니다.

각 에이전트에 다른 접근법을 줍니다. A는 리팩토링, B는 신기능, C는 버그 수정.
결과 중 가장 좋은 "바이브"를 선택합니다.

에이전트가 직접 코드를 수정하고, 테스트를 돌리고, 작업 단위별로 커밋 메시지까지 작성합니다.
Git 원자적 커밋(Atomic Commits)이 자동으로 쌓입니다.

3. 취향(Taste)과 아키텍처
피터는 미래의 개발자에게 필요한 건 코딩 기술이 아니라 판단력이라고 합니다.

"프로그래머를 위한 슬롯머신"이라고 비유하더라구요. 좋은 결과가 나올 때까지 레버를 당기되, 어떤 결과가 진짜 좋은 코드인지 알아보는 눈이 있어야 한다는 겁니다.

개발자는 벽돌을 쌓는 사람이 아닙니다. 어떤 건물을 지을지 설계하고, 에이전트 군단이 벽돌을 제대로 쌓는지 감독하는 사람입니다.

"The creator of Clawd: I ship code I don't read": https://lnkd.in/gAKdjHhi
