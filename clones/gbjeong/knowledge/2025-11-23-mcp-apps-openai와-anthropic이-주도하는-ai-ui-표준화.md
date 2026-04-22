---
topic: "MCP Apps: OpenAI와 Anthropic이 주도하는 AI UI 표준화"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EC%95%9E%EC%9C%BC%EB%A1%9C-mcp-%EC%84%9C%EB%B2%84%EA%B0%80-ui%EA%B9%8C%EC%A7%80-%EC%8F%B4%EC%A4%8D%EB%8B%88%EB%8B%A4-mcp-apps%EA%B0%80-%EC%98%A8%EB%8B%A4-openai-activity-7398495570371215360-TuRO?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-11-23
---
앞으로 MCP 서버가 UI까지 쏴줍니다. MCP Apps가 온다. OpenAI 와 Anthropic 이 손잡고 UI 표준화를 위한 MCP-APPS를 표준으로 채택하기 일보 직전입니다. 이 표준이 어떤 변화를 가져올지 쉽게 정리해 보겠습니다.

1. UI가 왜 필요한가요? : 텍스트의 한계를 넘어서

지금까지의 MCP 서버는 '텍스트'와 'JSON 데이터'만 주고받았습니다.
예를 들어 주식 데이터를 요청하면, 숫자가 잔뜩 적힌 텍스트가 돌아옵니다. 이걸 보고 호스트(Claude나 ChatGPT 같은 AI)가 차트를 그려주길 기대해야 했죠. 하지만 AI마다 그려주는 방식도 다르고, 아예 못 그려주는 경우도 많았습니다.

MCP Apps는 서버가 "데이터"뿐만 아니라 "화면(UI)"까지 직접 제공하게 해줍니다.

- 데이터 시각화: 서버가 데이터를 던져주는 게 아니라, 예쁜 차트 화면을 통째로 보냅니다.
- 복잡한 설정: 텍스트로 "A 설정 켜줘, B는 꺼줘"라고 타이핑하는 대신, 체크박스와 슬라이더가 있는 설정 화면을 띄워줍니다.

이제 MCP 서버가 단순한 '데이터 파이프'가 아니라, 하나의 '미니 앱'처럼 동작하게 되는 겁니다.

2. MCP Apps가 어떻게 동작하나요? : 핵심 3가지

A. UI도 '리소스'다 (pre-declared resources)

서버는 미리 "나 이런 화면(UI) 가지고 있어"라고 선언합니다. 이걸 ui://로 시작하는 주소로 관리해요.

// 서버: "나 막대 차트 화면 있어!"
{
  uri: "ui://charts/bar-chart",
  name: "Bar Chart Viewer",
  mimeType: "text/html+mcp"
}

호스트는 도구를 실행하기 전에 이 화면을 미리 가져와서 검사할 수 있습니다. 보안상 안전한지 확인하기도 좋고, 미리 로딩해두니 속도도 빠르죠.

B. 웹 표준으로 대화합니다 (postMessage & JSON-RPC)

"화면은 띄웠는데, AI랑 어떻게 대화해?"
걱정 마세요. 웹 개발자들에게 익숙한 postMessage 방식을 사용합니다.
UI 화면과 호스트(AI)가 서로 데이터를 주고받을 때, MCP가 이미 쓰고 있는 JSON-RPC라는 표준 규약을 그대로 씁니다.
즉, 기존 MCP 생태계와 완벽하게 호환된다는 뜻입니다.

C. HTML로 시작합니다 (Simple is Best)

거창한 기술 대신, 가장 기본인 HTML부터 지원합니다.
- 모든 브라우저에서 돌아갑니다.
- 보안 모델이 확실합니다.
- 스크린샷 찍기도 편합니다.

일단은 안전한 샌드박스(격리된 공간) 안에서 HTML을 보여주는 것부터 시작하고, 더 복잡한 기능은 차차 추가될 예정입니다.

3. 보안이 중요합니다.

"서버가 내 화면에 마음대로 뭘 띄우면 위험하지 않나요?"
맞습니다. 그래서 이 제안은 보안(Security)을 최우선으로 설계했습니다.

- 격리 (Sandbox): UI는 외부와 차단된 안전한 공간에서만 실행됩니다.
- 검사 (Inspection): 실행 전에 코드를 미리 확인할 수 있습니다.
- 승인 (Consent): 중요한 작업은 사용자가 직접 클릭해야 실행됩니다.

단순히 "화면을 띄운다"는 것을 넘어서 MCP Apps는 에이전틱 앱(Agentic App)의 새로운 표준이 될 가능성이 큽니다.

Postman, Shopify, HuggingFace 같은 거대 기업들이 이미 이 움직임에 동참하고 있습니다. OpenAI의 Apps SDK도 이 흐름을 검증했고요. 이제 AI 모델, 사용자, 그리고 애플리케이션이 만나는 방식이 완전히 달라질 겁니다.

재미있는 점은, 이 제안이 MCP-UI 팀과 OpenAI, Anthropic의 핵심 개발자들, 그리고 오픈소스 커뮤니티의 집단 지성이 함께 만들어냈다는 것입니다.

과거를 돌아보면, Function Calling과 Tool Calling 개념은 OpenAI가 먼저 정립했지만, 이를 표준화된 프로토콜인 MCP로 엮어내며 생태계를 폭발시킨 것은 Anthropic이었습니다. 이번 협력은 그 역사를 다시 한번 재현하려는 움직임으로 보입니다.

MCP Apps는 단순한 기술 스펙 추가가 아니라, 사용자 경험(UX)을 직접적으로 개선하는 기능입니다. 텍스트 기반의 AI 상호작용이 가진 한계를 넘어, 진짜 유저에게 편리함을 가져다주는 '킬러 기능'이 될 수도 있습니다.
