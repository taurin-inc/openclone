---
topic: "Claude Code 최신 주요 기능 7가지 정리"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_12%EC%9B%94-10%EC%9D%BC%EB%B6%80%ED%84%B0-%EC%98%AC%EB%9D%BC%EC%98%A8-claude-code%EC%9D%98-%EC%B5%9C%EC%8B%A0-%EA%B8%B0%EB%8A%A5-7%EA%B0%9C%EB%A5%BC-%ED%95%9C-%EB%88%88%EC%97%90-activity-7405362064489299968-1JZO?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-12-12
---
12월 10일부터 올라온 Claude Code의 최신 기능 7개를 한 눈에 정리합니다. Anthropic 은 산타인가!
1. Async Subagents (비동기 서브에이전트)
Task 를 실행하면 서브에이전트가 백그라운드로 이동해서 독립적으로 계속 작업할 수 있게 됐습니다. 심지어 메인 에이전트가 작업을 끝내고 비활성화되더라도요. 로그 모니터링이나 빌드 대기 같은 오래 걸리는 작업에 유용합니다. 이제 빌드 돌려놓고 다른 작업 하다가 나중에 결과만 확인하면 됩니다.

2. Instant Compact (즉시 컴팩트)
컨텍스트 압축 속도가 기하급수적으로 빨라졌습니다. 이제 몇 초면 끝나서 작업 흐름이 끊기지 않아요. 예전에는 컴팩트 걸릴 때마다 몇 분 씩 걸렸는데 성능을 개선했나봐요. *지금은 이 기능이 내려간 상태입니다. Anthropic 에서 이슈를 인지하고 기능을 멈춰놨어요.

3. Custom Session Names (세션 이름 지정)
세션에 커스텀 이름을 붙일 수 있게 됐습니다. /rename 명령어로 이전 세션에 이름을 지정하면 나중에 찾기가 훨씬 편해져요. /resume 화면에서 키보드 단축키도 추가됐습니다. 'R'로 이름 변경, 'P'로 세션 미리보기가 가능합니다.

4. Usage Stats (/stats 명령어)
/stats 명령어가 새로 추가됐습니다. 일일 Claude Code 사용량을 시각화해서 보여주고, 세션 데이터, 사용 스트릭, 자주 쓰는 모델 정보까지 확인할 수 있어요. 토큰 얼마나 썼나 궁금할 때 유용할 것 같습니다.

*/stats 가장 밑에 특정 소설책의 몇 배 만큼이나 많은 토큰을 사용했다고 뜨는게 재밌습니다. 

5. Claude Code on Android
Claude Android 앱에서 Claude Code 태스크를 실행할 수 있게 됐습니다. 리서치 프리뷰 단계예요. 

*유저들 반응은 "난 이미 안드로이드에서 tmux로 잘 돌리고 있었다"고 하지만 사용량이 확실히 늘어날 것 같아요. Claude Code 는 이제 사실상 모든 환경에서 어플리케이션으로 실행 가능해졌습니다. 

6. Hotkey Model Switcher (단축키로 모델 변경)
프롬프트 작성 중간에 모델을 바꿀 수 있는 단축키가 추가됐습니다. Windows는 Alt+P, macOS는 Option+P 입니다. 참고로 macOS에서는 터미널 설정에서 Option 키를 meta/escape 키로 설정해야 작동할 수 있습니다. 간단한 작업은 haiku로, 복잡한 건 opus로 바로 바로 전환하면 토큰 아끼기 좋겠네요.

7. Context Window Info in Status Line (상태 표시줄에 컨텍스트 정보)
상태 표시줄에 컨텍스트 윈도우 정보를 추가할 수 있게 됐습니다. /statusline 명령어로 커스터마이즈하면 돼요. 현재 컨텍스트 사용량을 프로그레스 바로 표시하도록 설정할 수도 있습니다. 컨텍스트가 얼마나 찼는지 실시간으로 보면서 작업할 수 있어서 편리할 것 같아요.
