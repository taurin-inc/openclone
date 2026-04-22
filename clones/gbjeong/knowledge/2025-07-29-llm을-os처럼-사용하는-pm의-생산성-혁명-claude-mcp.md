---
topic: "LLM을 OS처럼 사용하는 PM의 생산성 혁명: Claude + MCP"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_llm%EC%9D%84-os%EC%B2%98%EB%9F%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-pm%EC%9D%98-%EC%83%9D%EC%82%B0%EC%84%B1-%ED%98%81%EB%AA%85-claude-mcp-activity-7355983437809283073-lOs0?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQRO6EBVuLBNtunTd3oFxqQ7dKWdLdOoNs"
authorship: self
published_at: 2025-07-29
---
LLM을 OS처럼 사용하는 PM의 생산성 혁명: Claude + mcp

"지난주 스프린트 결과를 정리해서 노션에 올려줘"
이 한 마디로 코드베이스의 git log를 분석하고, 코드베이스의 docs를 모두 읽고, notion에 있는 과거 스프린트 문서를 파악해서 새로운 페이지가 만들어진다면 어떨까요?

[LLM as OS]
Andrej Karpathy가 제시한 "LLM as OS" 개념은 단순히 AI 도구를 사용하는 것을 넘어, LLM을 컴퓨터의 두뇌이자 운영체제로 활용하는 패러다임에 가깝습니다.
전통적인 OS에서는 각 프로그램을 열고, 메뉴를 클릭하고, 명령어를 입력해야 했습니다. 하지만 LLM OS는 자연어로 명령하면 시스템이 알아서 필요한 작업들을 수행해줍니다. 

[컴퓨터에 엑셀, 브라우저, 캘린더를 설치하는 것처럼 LLM에는 mcp를 연결하자]
LLM이 사용할 수 있는 툴을 연결해주는게 중요합니다. MCP 라는 표준화된 프로토콜 덕분에 엄청난 생태계가 열렸습니다. file system, github, notion, browser 등 원래 사용하던 툴에 LLM이 접근할 수 있게 됐습니다. 이제 LLM은 말만 하는게 아니라 실제로 해당 툴을 읽고 수정합니다.

[Claude 프로젝트 기능을 사용하자]
프로젝트 기능은 잘 사용되지 않지만 LLM을 미니 OS처럼 사용하기 편리합니다.
GitHub, Google Drive, 로컬 파일을 연결하고, 시스템 프롬프트를 통해 작업의 기본 규칙을 설정할 수 있습니다. 이제 간단하게 OS 완성입니다.

[자연어 한 줄로 스프린트 완료 문서를 작성하자]
1️⃣ Claude Code에 "최근 일주일 커밋 내역을 분석해서 주요 기능과 버그 수정 사항을 정리해줘"라고 지시합니다.
2️⃣ Notion mcp를 연동하여 기존 스프린트 문서들을 불러와 context에 넣고, 시스템 프롬프트에는 기존 문서의 형식과 톤을 따라서 새 문서를 생성하라고 작성합니다.
3️⃣ 변경사항을 붙여넣고 "변경사항을 반영해서 새 스프린트 문서를 작성해줘"라는 한 줄의 명령으로 완성도 높은 문서가 생성됩니다.
이 과정에서 Claude는 단순히 텍스트를 생성하는 것이 아니라, GitHub의 커밋 히스토리를 분석하고, Notion의 기존 문서 패턴을 학습하며, 우리 팀만의 고유한 문서 스타일을 재현합니다.

[AI native?]
모든 일을 LLM을 중심에 두고 해야 합니다. 복잡하고 거창한 에이전트 시스템을 구축하는 것보다 이런 멘탈리티가 AI native라고 생각합니다. "보고서 작성을 위해 데이터를 분석하고, 그래프를 만들고, 이메일로 공유해줘"와 같은 복잡한 작업도 자연어 한 문장으로 처리할 수 있습니다. 단순히 효율성의 문제가 아닙니다. 우리가 컴퓨터와 상호작용하는 방식의 근본적인 변화입니다. 
반복적인 일에 시간을 낭비하는 대신 더 창의적이고 전략적인 일에 집중할 수 있게 되었습니다.

[정리]
- 어떤 일이든 LLM으로 할 수는 없을까? 질문하기
- LLM에 원래 내가 사용하는 툴을 연결하기. claude + mcp 조합이 생태계가 잘 구축돼 있어서 편하다.
- LLM client 를 사용할 때에는 context window를 어떻게 '자동적으로' 채울지 고민하기
