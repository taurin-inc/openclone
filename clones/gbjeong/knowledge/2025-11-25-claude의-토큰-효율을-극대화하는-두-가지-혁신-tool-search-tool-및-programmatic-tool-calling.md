---
topic: "Claude의 토큰 효율을 극대화하는 두 가지 혁신: Tool Search Tool 및 Programmatic Tool Calling"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-opus-45-solves-a-puzzle-game-activity-7399201476109172736-GFfX?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-11-25
---
Opus 4.5보다 더 중요한 게 발표됐습니다. 토큰 사용량을 85%나 아껴주는 Tool Search Tool 입니다. 그리고 하나 더, Programmatic Tool Calling 도 알아야합니다. 영상 보면 바로 이해가 되네요

1. Tool Search Tool의 토큰을 아끼는 방법
Github, Notion 같은 MCP 를 연결하면 프롬프트 하나 실행 안 하고도 컨텍스트의 1/3을 넘게 차지하는 건 악명이 높습니다.
그런데 이런 MCP 를 전부 컨텍스트에 추가해놓는 대신 검색하는 tool만 놓는 방식입니다. 이렇게 하면 필요한 도구만 동적으로 그때그때 불러오게 됩니다.

기존 방식:
- 모든 도구 정의를 미리 로드 (50+ MCP 도구에 ~72K 토큰)
- 대화 기록과 시스템 프롬프트가 남은 공간을 놓고 경쟁합니다.
- 작업 시작도 전에 ~77K 토큰 차지 (전체의 1/3을 넘김)

Tool Search Tool 사용 시:
- 처음에는 Tool Search Tool만 로드 (~500 토큰)
- 실행하면서 도구를 동적으로 발견 (3-5개의 관련 도구, ~3K 토큰)
- 컨텍스트 차지: ~8.7K 토큰, 컨텍스트 윈도우의 95% 보존

이 방식이 토큰 사용량을 85%나 줄였고, MCP 선택 정확도도 Opus 4.5 기준 9% 향상되었습니다. (Opus 4 기준으로는 25%나 향상..) 10개 이상의 도구를 사용한다면 사용하는게 좋다고 권장하고 있습니다. 만약 Notion mcp 를 쓴다면? 무조건 사용하는게 좋습니다. 단점은 시간이 조금 더 걸립니다. 툴 검색이 들어가니까요.

2. Programmatic Tool Calling: 툴의 중간 결과는 Claude 에게 전달할 필요 없다
MCP 같은 Tool 을 여러 번 호출하면 툴의 모든 결과값이 컨텍스트를 차지해서 토큰 사용량이 많아집니다. 이 방법은 연쇄적으로 툴을 실행한다면 중간 결과는 굳이 Context로 추가하지 않는 접근입니다.

예를 들어서 "3분기 출장 예산을 초과한 팀원은 누구인가?"라고 물어보면 여러 도구를 호출해야 합니다.

기존 방식:
- 팀원 가져오기 → 20명
- 각 사람에 대해 Q3 비용 가져오기 → 20번의 도구 호출, 각각 50-100개의 항목 반환 (항공권, 호텔, 식사, 영수증)
- 직원 레벨별 예산 한도 가져오기
이 모든 것이 Claude의 컨텍스트에 들어갑니다: 2,000개 이상의 비용 항목 (50KB 이상)

Programmatic Tool Calling 사용:
- 모든 도구 결과가 Claude로 반환되는 대신, 전체 워크플로우를 오케스트레이션하는 Python 스크립트를 작성합니다. 스크립트는 Code Execution 도구(샌드박스 환경)에서 실행됩니다. API를 통해 도구 결과를 반환하면 모델에 의해 소비되는 것이 아니라 스크립트에 의해 처리됩니다. Claude는 최종 출력만 봅니다.

토큰을 37퍼센트 정도 감소시키는 것과 동시에 레이턴시도 감소합니다. 클로드가 계속 읽을 필요가 없으니까요. 다음 도구를 선택할 때 실수하는 경우도 조금 줄어듭니다.

이 영상 하나면 설득이 바로 됩니다! https://lnkd.in/dypQcx8d
