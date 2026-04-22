---
topic: "OpenAI Atlas 출시와 CISO가 경고한 프롬프트 인젝션 보안 위협"
source_type: social
source_url: "https://www.linkedin.com/posts/leekh929_%EC%B6%9C%EC%8B%9C-%EB%8B%A4%EC%9D%8C-%EB%82%A0-openai-ciso%EA%B0%80-atlas%EC%97%90-%EB%8C%80%ED%95%B4-%EA%B8%B4-%EA%B8%80%EC%9D%84-%EC%93%B4-%EC%9D%B4%EC%9C%A0-activity-7386934439886544896-NPr-?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGMNrtwBpXfYKm2n2FZHqWv7GeTF_SMtUQY"
authorship: self
published_at: 2025-10-23
---
출시 다음 날, OpenAI CISO가 Atlas에 대해 긴 글을 쓴 이유

OpenAI Atlas를 써봤습니다. 브라우저 안에 AI가 있다는 건 확실히 편리했습니다. 웹사이트를 돌아다니며 정보를 모으고, 장바구니에 물건을 담고, 이메일을 확인하는 일을 AI가 대신 해줍니다.

그런데 OpenAI의 CISO(Chief Information Security Officer) Dane Stuckey가 긴 포스트를 올렸습니다. 축하 메시지는 아니었습니다. “프롬프트 인젝션은 여전히 frontier, unsolved security problem입니다”라는 트윗이었습니다.

1. 프롬프트 인젝션, 3년째 해결 못한 문제

“웹페이지에 악의적인 명령을 숨겨두면 AI가 속을 수 있습니다.”

웹사이트, 이메일, 문서 등에 보이지 않는 지시를 숨겨두면, AI 에이전트는 그것을 사용자의 명령인 줄 알고 따릅니다. 쇼핑할 때 특정 제품을 추천하도록 편향시키는 것은 가벼운 수준입니다. 심각한 경우는 이메일에서 민감한 정보를 빼내거나, 로그인 크리덴셜을 탈취하는 것입니다.

OpenAI CISO는 이렇게 말했습니다. “우리의 적들은 상당한 시간과 자원을 들여 ChatGPT 에이전트가 이런 공격에 속도록 만들 것입니다.” 3년 전부터 알려진 문제지만, 여전히 해결되지는 않았습니다.

2. OpenAI의 방어: Logged Out Mode와 Watch Mode

OpenAI는 손 놓고 있지 않았습니다. 광범위한 레드팀 테스트를 했고, 악의적 지시를 무시하도록 모델을 훈련시켰습니다. 중첩된 가드레일과 실시간 공격 탐지 시스템도 구축했습니다.

사용자를 위한 두 가지 모드도 만들었습니다.

첫 번째는 “Logged Out Mode”입니다. AI가 웹사이트를 탐색하지만 사용자의 로그인 정보에는 접근하지 못합니다. 장바구니에 물건을 담거나 정보를 수집하는 정도는 가능하지만, 민감한 계정 작업은 할 수 없습니다. 이미 Claude Code나 Codex CLI에서 검증된 방식입니다.

두 번째는 “Watch Mode”입니다. AI가 민감한 사이트(예: 은행, 이메일)에서 작업할 때, 사용자가 해당 탭을 벗어나면 작업이 일시 중지됩니다. 운전자 보조 시스템처럼 “핸들에서 손을 떼지 마세요”를 요구하는 것입니다.

OpenAI는 “Defense in depth”를 강조합니다. 여러 층의 방어를 쌓아 올리는 전략입니다. 중앙화된 시스템의 장점도 활용합니다. 전체 사용자 기반에서 새로운 공격 패턴을 모니터링하고, 발견 즉시 차단할 수 있습니다.

3. 에이전트 개발에 중요해진 보안

하지만 보안 전문가들은 회의적입니다.

Simon Willison은 이렇게 말했습니다. “애플리케이션 보안에서 99%는 failing grade입니다.” 가드레일이 아무리 정교해도, 1%의 틈이 있으면 공격자는 그것을 찾아냅니다. “

AI 에이전트의 능력이 확장될수록 공격 표면도 넓어집니다. 지금은 브라우저입니다. 다음은 이메일입니다. 그다음은 로컬 파일입니다. 에이전트가 더 많은 것을 할 수 있을수록, 프롬프트 인젝션이 노릴 수 있는 것도 많아집니다.

프롬프트 인젝션은 OpenAI만의 문제가 아닙니다. AI 에이전트를 개발하는 모든 회사가 마주하는 과제가 될 것 같습니다.
