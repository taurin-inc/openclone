---
topic: "비개발자를 위한 Claude AI Agent 프로토타입 템플릿"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EB%B9%84%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%8F%84-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EB%A7%8C%EB%93%A4-%EC%88%98-%EC%9E%88%EB%8A%94-ai-agent-%ED%85%9C%ED%94%8C%EB%A6%BF%EC%9E%85%EB%8B%88%EB%8B%A4-claude-activity-7394517981168533505-ps9p?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-11-12
---
비개발자도 프로토타입을 만들 수 있는 AI Agent 템플릿입니다. Claude Code를 사용해서 바이브코딩하기 쉽게 CLAUDE.md를 만들었고, subagent, slash command를 만들어뒀습니다.

Agent는 Claude Agent SDK Typescript 를 사용해서 Claude Code와 동일한 방식으로 움직입니다. 지시를 내리면 목표를 달성하기 위해 최대 10번까지 멀티 턴을 돕니다.

MCP 를 추가하고 (혹은 tool 을 직접 추가) system prompt를 만진 다음, 프론트엔드 디자인을 살짝 만지면 훌륭한 프로토타입이 됩니다. 

프론트엔드는 Next.js 기반의 vercel ai sdk 를 사용했습니다. 복잡한 스트리밍 처리 방식을 sdk 로 사용해서 전체 코드가 단순합니다. 그래서 바이브코딩에 적합합니다.

팁! Multi Clauding 사용 방법:
1. github issue 를 여러 개 만드세요. CLAUDE.md 에 gh cli 를 사용하라는 메모리를 작성했기 때문에 cli 에 로그인을 해두시면 편합니다.
2. ./wt 를 사용해서 워크트리를 자동으로 만들고 자동으로 라이브러리를 install 하세요.
3. 워크트리에서 /solve-github-issue {number} 만 입력하세요. github issue 와 코드베이스를 탐색하는 github-issue-planner 서브에이전트가 실행되고나서 TDD 로 개발합니다. 개발 후에는 github-issue-manager가 issue에 실행 결과 코멘트를 달고, close 하거나 label 을 달아줍니다.

Claude Code 유저라면 API KEY 없이도 바로 실행이 가능합니다! Claude Agent SDK 는 .env를 작성하지 않으면 로컬 Claude Code 를 직접 실행하기 때문입니다 ㅎㅎ.

제품 검증을 위해 간단한 프로토타입을 만들거나,
Pre Sales 단계에서 고객에게 보여줄 데모로 사용하면 효율이 좋습니다!

https://lnkd.in/gAePvv73
