---
topic: "Claude Code 세션 종료를 자동화하는 session-wrap 플러그인"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EC%A0%80%EB%8A%94-claude-code-%EC%84%B8%EC%85%98%EC%9D%B4-%EB%81%9D%EB%82%A0-%EB%95%8C%EB%A7%88%EB%8B%A4-wrap-%EC%9D%B4-%EB%AA%85%EB%A0%B9%EC%96%B4%EB%A5%BC-activity-7415878861919379456-h0-g?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-10
---
저는 Claude Code 세션이 끝날 때마다 "/wrap" 이 명령어를 씁니다. 복잡하게 이 세션을 어떻게 정리할지 고민할 필요가 없어졌어요. CLAUDE.md 업데이트, 문서 업데이트, 새 Skills 제안까지 한 번에 받을 수 있거든요.

세션 끝나면 뭔가 찝찝합니다. "이거 CLAUDE.md에 적어야 하나?", "다음에 뭐 해야 하더라?" 이런 생각이 계속 남아요. 그래서 이걸 자동화했습니다.

1. /wrap을 치면 5개 에이전트가 세션을 분석합니다.

- doc-updater: CLAUDE.md, context.md에 추가할 내용 제안
- automation-scout: 반복 패턴을 skill/command/agent로 자동화할 기회 탐지
- learning-extractor: 배운 것, 실수한 것, 새로 발견한 것 추출
- followup-suggester: 미완성 작업, 다음 세션 우선순위 정리
- duplicate-checker: 제안된 내용이 이미 있는지 중복 검증

2. 두 단계 Phase로 동작해요.

Phase 1에서 4개 에이전트가 병렬로 분석합니다. 각자 독립적이니까 동시에 돌려도 됩니다. Phase 2에서 duplicate-checker가 Phase 1 결과를 검증합니다. "이거 이미 CLAUDE.md에 있어요" 같은 중복을 걸러주죠.

3. 분석 끝나면 선택지를 줍니다. ask user question

"커밋 할래요?", "CLAUDE.md 업데이트 할래요?", "자동화 만들래요?" 원하는 것만 고르면 됩니다. 저는 보통 커밋이랑 문서 업데이트를 같이 선택합니다.

4. 재밌는게, 이것도 anthropic 의 플러그인 /plugin-dev로 만들었습니다.
plugin-dev가 플러그인 구조 잡아주고, 에이전트 파일 생성하고, 명령어 정의까지 도와줬어요. 5개 에이전트 만드는 게 복잡할 것 같았는데 생각보다 빨랐습니다.

세션 마무리가 습관이 되니까 좋은 점이 있습니다.

CLAUDE.md가 자연스럽게 풍부해집니다. 매번 "이건 기록해야지" 하고 까먹었던 것들이 차곡차곡 쌓여요. 그리고 자동화 아이디어도 놓치지 않게 됩니다.

session-wrap 이라는 플러그인으로 plugins-for-claude-natives에 공개해뒀습니다.
GitHub: https://lnkd.in/gYUeFY9P

/wrap 치고 고민에서 해방되세요. 그리고 다음 다음 작업으로 바로 넘어가세요!
