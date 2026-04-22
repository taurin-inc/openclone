---
topic: "AI 에이전트 시대의 새로운 표준, MCP(Model Context Protocol)의 부상"
source_type: social
source_url: "https://www.linkedin.com/posts/leekh929_ai-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-%EC%8B%9C%EB%8C%80%EC%9D%98-http%EA%B0%80-%ED%83%84%EC%83%9D%ED%95%98%EA%B3%A0-%EC%9E%88%EB%8A%94-%EA%B2%83%EC%9D%BC%EA%B9%8C%EC%9A%94-%EC%9B%B9%EC%97%90%EB%8A%94-http%EA%B0%80-activity-7407166461972140032-fpsE?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGLvovIBq-RuKIs4p21FCG4rS7rLRPIl5bU"
authorship: self
published_at: 2025-12-17
---
AI 에이전트 시대의 HTTP가 탄생하고 있는 것일까요?

웹에는 HTTP가 있었습니다. 서비스 간 통신에는 REST API가 있었습니다. 그렇다면 AI 에이전트 시대에는 무엇이 필요할까요? 최근 하나의 후보가 본격적으로 등장했습니다. OpenAI, Google, Microsoft, Anthropic. 평소라면 이 이름들이 한 문장에 나란히 놓일 일이 없습니다. AI 패권을 놓고 가장 치열하게 경쟁하는 회사들입니다. 그런데 이 회사들이 하나의 프로토콜을 중심으로 모였습니다.

그리고 지난주 Anthropic은 이를 Linux Foundation에 기증하고, 'Agentic AI Foundation'이라는 중립 재단을 설립한다고 발표했습니다. MCP(Model Context Protocol). Anthropic의 엔지니어 두 명이 시작한 이 프로젝트가 18개월 만에 업계 표준이 되고 있습니다.

1. 왜 새로운 표준이 필요할까요?

AI 에이전트는 정보를 보는 데서 그치지 않습니다. 캘린더를 확인하고, 이메일을 보내고, 데이터베이스를 조회하고, 결제를 처리합니다. "작업을 실행"해야 합니다. 문제는 연결입니다. AI 모델 M개와 서비스 N개가 있으면, M×N개의 연동이 필요합니다. USB가 등장하기 전, 프린터마다 다른 케이블이 필요했던 시절과 비슷합니다. MCP는 이 문제를 해결하려는 시도입니다. 한 번 구현하면 어떤 AI 클라이언트에서든 작동합니다. Google이 MCP 서버를 제공하면 Claude에서도, ChatGPT에서도 연결됩니다. 실제로 Google Cloud의 Steren Giannini는 "Anthropic의 Claude와 OpenAI의 ChatGPT에서 테스트해봤는데, 그냥 작동한다"고 합니다.

2. 왜 이렇게 빨리 합의가 됐을까요?

MCP는 2024년 11월, Anthropic의 두 엔지니어가 내부 문제를 해결하기 위해 시작한 프로젝트였습니다. 대규모 전략적 이니셔티브가 아니라, 실무자들의 필요에서 출발한 것입니다.
1년 후 결과를 보면 놀랍습니다. 10,000개 이상의 MCP 서버. OpenAI는 ChatGPT와 Agents SDK에 통합. Google DeepMind CEO Demis Hassabis는 "AI 에이전트 시대의 오픈 표준으로 빠르게 자리잡고 있다"고 했습니다.

왜 경쟁사들이 이렇게 빨리 움직였을까요? 표준이 없으면 모두가 손해이기 때문입니다. AI 에이전트가 유용해지려면 수많은 서비스에 쉽게 연결되어야 합니다. 그런데 각 회사가 다른 표준을 고집하면 생태계 자체가 형성되지 않습니다. 개발자 입장에서 OpenAI용, Google용, Anthropic용 연동을 따로 만들어야 한다면, 아무도 만들지 않습니다. 경쟁보다 협력이 이익인 드문 영역입니다. 수조 원의 AI 투자가 가치로 전환되려면 에이전트가 실제로 작동해야 하고, 그러려면 공통 인프라가 필요합니다. 혼자서는 아무도 이 생태계를 만들 수 없습니다.

그래서 Anthropic은 한 발 더 나아갔습니다. MCP를 Linux Foundation에 기증하고, 'Agentic AI Foundation'을 설립한다고 발표한 것입니다. "이건 우리 것이 아니다"라는 선언입니다. Linux Foundation의 Jim Zemlin은 "폐쇄된 벽으로 이루어진 독점 스택의 미래를 피하는 것이 목표"라고 말했습니다.

3. 그런데 MCP가 정답일까요?

한 가지 흥미로운 점을 더하자면, MCP를 만든 Anthropic이 최근 'Skills'라는 새로운 개념을 함께 확대하고 있어 보입니다. MCP는 실제 운영에서 한 가지 현실적 문제가 있습니다. MCP 서버가 도구들을 노출하면, AI 모델은 그 정의를 context에 로드해야 합니다. GitHub MCP 서버 하나가 90개 이상의 도구를 노출하면, 모델이 생각을 시작하기도 전에 수만 토큰 이상이 소모됩니다.

Skills는 이 문제를 보완합니다. 모든 도구를 미리 로드하는 대신, 필요할 때만 가져오는 방식입니다. Anthropic의 정확한 전략을 알 수는 없지만, MCP가 만들어진 지 1년 만에 이미 보완책이 등장하고 있다는 점은, 이 영역이 얼마나 빠르게 진화하고 있는지를 보여줍니다.

HTTP는 사람이 정보를 "보기 위한" 표준이었습니다. 브라우저가 서버에 문서를 요청하고, 사람이 화면을 보고 판단합니다. AI 에이전트는 다릅니다. 사람 대신 "행동"합니다. 그렇다면 AI가 세상과 소통하는 새로운 표준이 필요한 건 자연스러운 흐름입니다. MCP가 그 답이 될지는 아직 모릅니다. 하지만 "AI를 위한 공통 언어"가 필요하다는 것, 치열한 경쟁자들조차 그 필요성에 합의했다는 것, 그리고 이를 특정 회사가 소유하지 않고 중립 재단에 기증했다는 것. 이건 꽤 의미 있는 신호인 것 같습니다.
