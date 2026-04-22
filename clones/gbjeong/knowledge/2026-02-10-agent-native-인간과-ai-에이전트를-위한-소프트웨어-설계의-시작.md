---
topic: "Agent Native: 인간과 AI 에이전트를 위한 소프트웨어 설계의 시작"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EC%95%9E%EC%9C%BC%EB%A1%9C-%EB%AA%A8%EB%93%A0-%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4%EB%8A%94-%EB%91%90-%EC%A2%85%EB%A5%98%EC%9D%98-%EC%82%AC%EC%9A%A9%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%B4-%EC%84%A4%EA%B3%84%EB%90%A9%EB%8B%88%EB%8B%A4-%EC%9D%B8%EA%B0%84%EA%B3%BC-ai-activity-7427105336169246721-A219?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGP5IZkBUjVNPO9CSUByjz9GTAj-mGm8T8s"
authorship: self
published_at: 2026-02-10
---
앞으로 모든 소프트웨어는 두 종류의 사용자를 위해 설계됩니다. 인간과 AI 에이전트. 먼 미래 얘기가 아닙니다. --dangerously-skip-permissions 플래그는 이미 AI가 사람 개입 없이 코드를 읽고 고치고 실행하는 걸 허용합니다.

이 흐름을 'Agent Native'라고 부릅니다. 앱에 CLI나 스킬 같은 인터페이스를 제공해서 AI 에이전트가 직접 앱을 제어하게 만드는 겁니다. Claude나 Codex가 스스로 앱을 사용하고, 문제를 발견하면 고치고, 다시 검증하는 self-correcting loop. 이걸 위한 설계가 시작됐습니다.

극단적이고 재밌는 예가 이미 있습니다. MoltBet이라는 P2P 베팅 플랫폼은 웹사이트에 들어가면 인간이 읽을 수 있는 UI가 없습니다. 대신 API 스펙이 있습니다. Claude Code 같은 에이전트가 페이지를 읽고, API를 호출하고, 베팅을 생성하고 해결합니다. 사용자가 인간이 아니라 에이전트인 서비스가 이미 돌아가고 있는 겁니다.

그런데 한 가지 전제가 있습니다. 코드베이스가 시간이 갈수록 복잡해지면, 인간도 AI 에이전트도 점점 느려집니다.

Compound Engineering은 이 전제를 뒤집습니다. GitHub 스타 7,000개를 넘긴 이 프로젝트의 핵심 명제는 "코드베이스는 시간이 갈수록 쉬워져야 한다"입니다. 복리처럼 좋은 구조가 축적되면, 새 기능 추가도 AI의 코드 이해도 점점 빨라집니다.

개발자들은 이미 이 방향으로 움직이고 있습니다. Claude hooks로 작업 완료 시 사운드 알림을 받고, 권한 승인이 필요할 때만 돌아옵니다. AI가 일하는 동안 다른 일에 집중하는 거죠. "10배 생산성 팁"이라는 표현이 나올 만합니다.

더 흥미로운 건 Compound Engineering 가이드 자체가 AI 챗봇에 복사-붙여넣기하도록 설계됐다는 점입니다. 기술 문서의 소비자가 인간에서 AI로 확장되고 있다는 신호입니다.

그리고 이 에이전트들을 오케스트레이션하는 도구도 등장했습니다. Antfarm은 Cron, YAML, SQLite만으로 여러 AI 에이전트를 팀으로 구성하고 작업을 분배합니다. 개발자에게 익숙한 스택이라 진입 장벽이 거의 없습니다.

인간만을 위한 소프트웨어 설계는 끝나가고 있습니다. AI 에이전트가 코드를 잘 읽을 수 있게 만드는 것. 그게 다음 경쟁력입니다.
