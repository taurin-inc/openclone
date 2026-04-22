---
topic: "Claude Code 기반 디자인 에이전트 'Pencil' 분석"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code%EB%A1%9C-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94-figma-%ED%82%AC%EB%9F%AC%EC%95%B1-pencil%EC%9D%B4-%EC%B6%9C%EC%8B%9C%EB%90%90%EC%8A%B5%EB%8B%88%EB%8B%A4-activity-7421318462238695424-5m0b?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-25
---
Claude Code로 동작하는 Figma 킬러앱 Pencil이 출시됐습니다.
Claude Agent SDK를 사용해 내 Claude Code 토큰을 소모하면서 디자인을 합니다.
직접 앱을 뜯어봤습니다. Electron 앱이라 asar 파일을 추출해서 코드를 분석했어요.

그냥 디자인 도구가 아니라, Claude Code의 능력을 디자인 영역에 이식한 에이전트입니다.

1. Claude Agent SDK 통합
Pencil은 @anthropic-ai/claude-agent-sdk 을 사용합니다.
내부에서 @ha/agent라는 자체 wrapper를 만들어서 SDK를 호출해요.

여기서 재미있는 건 systemPrompt 설정입니다.
preset: "claude_code"를 기본으로 쓰고, 거기에 디자인 전용 프롬프트를 append 합니다. Claude Code의 코딩 능력 위에 디자인 레이어를 얹은 구조예요.


2. 시스템 프롬프트의 3가지 구성 요소
Pencil의 시스템 프롬프트는 세 파일의 조합입니다.

첫 번째는 schema.ts입니다.
.pen 파일의 전체 스키마를 TypeScript 인터페이스로 정의해요.
Frame, Rectangle, Text, Fill, Stroke 등 모든 디자인 요소의 타입이 있습니다.
Claude가 이 스키마를 완벽히 이해하고 있어서 유효한 디자인 JSON을 생성할 수 있어요.


두 번째는 general.md입니다.
.pen 파일 편집의 일반 규칙을 담고 있어요.
"get_screenshot 도구로 주기적으로 검증하라"
"batch_design 호출은 최대 25개 작업으로 제한하라"
"placeholder: true 플래그로 작업 중임을 표시하라"
이런 실용적인 가이드라인들이 있습니다. 특히 Flexbox 레이아웃 규칙이 상세해요. fill_container, fit_content 같은 동적 사이징을 언제 쓰는지 명확히 정의했습니다.


세 번째는 design.md입니다.
디자인 워크플로우 전체를 가이드하는 핵심입니다.


3. 디자인 워크플로우
Claude가 디자인할 때 따르는 순서가 정해져 있어요.
get_editor_state로 현재 상태를 파악합니다. 어떤 .pen 파일이 열려있는지, 사용 가능한 컴포넌트가 뭔지 확인해요. 그다음 get_style_guide_tags, get_style_guide로 스타일 영감을 얻습니다. 

get_variables로 디자인 토큰을 읽어요. 하드코딩 대신 변수를 사용하라고 강제합니다.
batch_get으로 컴포넌트 구조를 파악하고요. snapshot_layout으로 기존 레이아웃을 확인합니다. 그리고 batch_design으로 실제 디자인을 생성해요.
마지막에 get_screenshot으로 시각적 검증을 합니다.


4. MCP 서버 구조
Pencil은 자체 MCP 서버를 가지고 있습니다. Claude에게 allowedTools로 mcp__pencil, WebSearch, WebFetch만 허용합니다. 디자인에 필요한 도구만 쓰게 제한했습니다.

Takeaways
이게 AI Native 제품이 만들어지는 방식입니다. LLM을 API로 호출하는 게 아니라, 에이전트로 통합하는 거예요. Claude Code 사용자라면 이미 익숙한 경험입니다. 코딩하던 그 느낌으로 디자인을 합니다. 앞으로 이런 제품이 많이 나올 것 같아요.

Claude Agent SDK 사용해보시길 추천드립니다!

pencil: https://www.pencil.dev/
