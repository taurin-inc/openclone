---
topic: "Anthropic의 자율 코딩 프레임워크 'Harness' 분석 및 워크플로우 활용"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_bmad-%EA%B0%99%EC%9D%80%EA%B1%B0-%EC%8B%A4%EC%A0%84%EC%97%90%EC%84%9C-%ED%95%98%EB%82%98%EB%8F%84-%EC%95%88-%EB%A8%B9%ED%98%80%EC%9A%94-%EB%B3%B5%EC%9E%A1%ED%95%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90%EC%84%9C-%ED%81%B4%EB%A1%9C%EB%93%9C-%EC%BD%94%EB%93%9C%EA%B0%80-activity-7399932976958099456-42Iq?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-11-27
---
BMad 같은거 실전에서 하나도 안 먹혀요. 복잡한 프로젝트에서 클로드 코드가 길을 잃지 않게 도와주는 Harness, "자율코딩(autonomous-coding)"은 단순한 교훈을 줍니다. 이전 세션의 컨텍스트를 잘 이어받아서 코딩하기만 하면 된다.

1. Anthropic은 실패의 두 가지 패턴을 찾았습니다.
- 한 번에 너무 많은 것을 만들려는 경향
- 다 만들지 않았는데 작업이 완료됐다고 판단하고 종료

2. 2개의 에이전트로 단순화해서 문제를 해결합니다.
- Initializer agent: 첫 세션은 초기 환경을 설정하도록 요청하는 프롬프트를 사용합니다: `init.sh` 스크립트, 에이전트가 수행한 작업의 로그를 유지하는 `claude-progress.txt` 파일, 그리고 어떤 파일이 추가되었는지 보여주는 초기 git 커밋.
- Coding agent: 모든 후속 세션은 점진적으로 개발하고 반드시 git 로그와 progress 파일을 업데이트합니다.

3. 도식화하면 이렇게 동작합니다.

세션 1: 초기화 에이전트
└─> feature_list.json 생성 (200개 기능)
└─> init.sh 생성
└─> claude-progress.txt 생성
└─> git repo 초기화

[컨텍스트 윈도우 소진 또는 중단]

세션 2: 코딩 에이전트
└─> git log 읽기
└─> claude-progress.txt 읽기
└─> feature_list.json에서 다음 기능 선택
└─> 1개 기능만 구현
└─> 테스트
└─> git commit + 진행상황 업데이트

[컨텍스트 윈도우 소진 또는 중단]

세션 3: 코딩 에이전트 (새로 시작)
└─> 다시 git log 읽기
└─> 다시 progress 읽기
└─> 다음 기능 구현
└─> ...

... 200개 기능이 모두 완료될 때까지 반복

4. 이건 가장 단순한 형태의 구현입니다. 이걸 기반으로 내 워크플로우를 설계하는 게 필요합니다.
무조건 이 구조를 따라해야 하는게 절대 아닙니다. 하지만 여기서 배운 원리를 기존 워크플로우에 통합시키면 좋을 것 같습니다. 저는 Claude Code한테 linear 를 관리하게 시켜서 다음 issue을 명확하게 알려주는 걸 선호하는데요. git log 를 반드시 읽으라고 하는 부분을 가져가야 할 것 같습니다. 또 claude-progress.txt 에 전체 로그를 쌓는 것도 좋은 방법인 것 같고요. 이 블로그 글에 호들갑떨만한 내용이 있다기보다는 여기서 힌트를 얻어서 내 워크플로우를 업데이트하는게 좋은 접근인 것 같습니다.


+진짜 재미있는 주제인데 Anthropic 에서 묵혀뒀다가 글을 올린 것 같다고 추측해봅니다(완전히 틀렸을 수도 있지만). 퀵스타트에서는 deprecated 된 claude code sdk 를 사용. claude.ai 를 클론한 사진에서는 claude 3.5 sonnet 을 선택한 UI가 보임
