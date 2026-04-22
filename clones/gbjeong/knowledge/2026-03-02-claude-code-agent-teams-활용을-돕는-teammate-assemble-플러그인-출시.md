---
topic: "Claude Code Agent Teams 활용을 돕는 teammate-assemble 플러그인 출시"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code%EC%97%90-agent-teams-%EA%B8%B0%EB%8A%A5%EC%9D%B4-%EC%9E%88%EB%8A%94-%EA%B1%B8-%EC%95%8C%EB%A9%B4%EC%84%9C%EB%8F%84-subagent%EB%A7%8C-activity-7434353100255059968-YHY5"
authorship: self
published_at: 2026-03-02
---
Claude Code에 Agent teams 기능이 있는 걸 알면서도 Subagent만 쓰고 있다면, 벌써 고이고 있는 겁니다. 쉽게 사용할 수 있도록 적절한 팀원을 만들어주는 플러그인을 배포했습니다.

Subagent는 시켜놓고 결과만 받는 구조입니다. Agent Teams는 다릅니다. 여러 에이전트가 서로 메시지를 주고받으며 팀으로 일합니다. 진짜 팀처럼요.

그런데 대부분 안 씁니다. research preview라 Settings에서 직접 켜야 하고, 막상 켜도 어떤 역할로 팀을 짜야 할지 막막하거든요. 기본 에이전트는 개발 위주로 사전 정의돼 있어서 리서치, 분석, 콘텐츠 같은 작업엔 맞지 않아요.

teammate-assemble 플러그인은 이걸 해결합니다.

"팀으로 해줘"라고 말하면 내가 하려는 작업을 분석합니다. 그리고 거기에 맞는 팀메이트를 동적으로 골라줍니다. 도메인 전문가와 형식 전문가를 따로 소환하는 게 핵심이에요. 경쟁사 분석이면 researcher 3명이 병렬로 탐색하고, consultant가 분석 기준을 세우고, editor가 리포트를 씁니다. 콘텐츠 작업이면 또 다른 조합이 나옵니다.

"이 팀으로 진행할까요?" 확인을 받고, 승인하면 팀이 촤라락 돌아갑니다.

Subagent와 결정적 차이가 있습니다. Teammate는 서로 대화해요. researcher가 찾은 정보를 director가 읽고 전략을 세웁니다. worker가 구현한 걸 qa가 검증하고, 실패하면 support가 수정합니다. 이 검증-수정 루프가 자동으로 돌아갑니다.

모델 배정에도 원칙이 있어요. 판단엔 opus. 실행엔 sonnet. 탐색엔 haiku. 역할마다 적정 모델을 쓰니까 비용도 예측 가능합니다.

Agent Teams 활성화 방법을 모르셔도 됩니다. 플러그인을 설치하면 알아서 안내해줍니다.
team-assemble 플러그인: https://lnkd.in/gsiUQyxD
