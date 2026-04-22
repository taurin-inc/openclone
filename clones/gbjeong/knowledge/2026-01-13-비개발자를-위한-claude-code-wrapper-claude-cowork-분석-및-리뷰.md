---
topic: "비개발자를 위한 Claude Code Wrapper, 'Claude Cowork' 분석 및 리뷰"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EA%B0%9C%EB%B0%9C-%EB%A7%90%EA%B3%A0-%EB%82%98%EB%A8%B8%EC%A7%80-%EB%AA%A8%EB%93%A0-%EC%9D%BC%EC%9D%84-%EC%9C%84%ED%95%9C-claude-cowork-%EB%B9%84%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%8A%94-activity-7416954701042077696-Gb4_?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-13
---
개발 말고 나머지 "모든 일"을 위한 Claude Cowork. 비개발자는 이걸로 일해보는 걸 꼭 추천드려요. 저는 너무 흥미로웠어요. 그래서 많이 사용해보고, Claude Code에게 Cowork의 난독화된 코드를 분석시켰습니다. 
열흘만에 만들었다는 이 서비스는 정말로 Claude Code를 백본으로 사용하는 Claude Code Wrapper입니다.

1. Claude Code Wrapper의 의미

단순하게 얘기하면 예쁜 UI로 감싼 Claude Code에요. Claude Agent SDK가 뒤에서 실행되는데, 이 SDK는 Claude Code 런타임을 필요로 합니다. 코드를 분석시켜보고 재밌었던 건 Cowork가 폴더 하나를 만들어서 그 안에서 Claude Code가 동작하는 것과 똑같다는 거에요. VM 안에서 파일을 읽고, 쓰고, 명령어를 실행합니다.

2. 터미널에 바라던 바로 그 UI

왼쪽에서 대화하고, 오른쪽에서 생성된 파일을 확인하는 뷰. 제가 정말 바라던 UI입니다. 이번 작업 세션에서 생성한 아티팩트와 작업 파일을 실시간으로 확인할 수 있는 것도요. fsDetectedFiles라는 객체가 세션 중 생성/삭제된 파일을 추적합니다.

3. 스킬 추가하는 방법

의외로 간단합니다. Claude Desktop 설정에 스킬을 업로드하면 됩니다. Cowork는 세션이 시작될 때 Claude Desktop에서 사용할 수 있는 스킬 목록을 가져옵니다. 그래서 Desktop에 내 스킬을 올리기만 하면? 내가 쓰던 스킬을 Cowork에서도 그대로 사용할 수 있습니다.

4. 빌트인 커넥터를 바로 쓰기

3번과 이어지는 맥락인데요. Cowork는 Claude Desktop의 기능을 대부분 활용합니다. 내가 미리 연결해 놓은 커넥터를 그대로 사용할 수 있어요. Chrome 브라우저를 띄워서 바로 제어할 수 있고, Notion, Linear, Fireflies도 연결되어 있으면 바로 사용 가능합니다.

5. VM 샌드박스에서 안전한 사용

Cowork의 보안 설계가 인상적입니다. AI가 컴퓨터를 조작할 때 생기는 신뢰 문제를 VM 격리로 해결했어요. Claude는 "감옥(VM)" 안에서만 작업하고, 필요한 폴더만 "창문(마운트)"으로 연결됩니다. 기본적으로 아무것도 못하고, 사용자가 허용한 것만 접근 가능합니다. 실수로 시스템 파일을 지우거나, 악의적인 프롬프트에 속아서 rm -rf /를 실행해도 폴더 바깥은 안전합니다.

1. 알아서 서브에이전트를 병렬로 실행

반복 가능한 작업을 시키면 Claude Code의 Task 도구를 사용해서 병렬로 서브에이전트를 실행합니다. 예를 들어 "이 프로젝트의 모든 버그를 찾아서 수정해줘"라고 하면, 메인 에이전트가 작업을 분해하고 여러 서브에이전트가 동시에 탐색, 분석, 테스트를 진행합니다.

7. 200k context를 넘어가면 Auto Compact

컨텍스트가 200k를 넘어가면 자동으로 compact가 실행됩니다. 재밌는 건 이게 유저가 메시지를 보낸 것과 같은 UI로 보여진다는 거에요. "Summary of our work: ..."처럼 대화 흐름 안에서 자연스럽게 표시됩니다. Desktop app에는 별도의 compact UI가 없고, CLI가 보내는 메시지가 그대로 채팅에 나타납니다.

Anthropic의 철학이 아키텍처 전체에 녹아있습니다. 개발자가 아니어도 Claude Code의 강력함을 쉽게 경험할 수 있게 됐습니다. 저는 큰 패러다임 시프트라고 생각합니다.
