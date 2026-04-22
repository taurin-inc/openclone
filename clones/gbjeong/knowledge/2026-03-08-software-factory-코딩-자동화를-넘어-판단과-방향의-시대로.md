---
topic: "Software Factory: 코딩 자동화를 넘어 판단과 방향의 시대로"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_ralph%EB%A1%9C-%EB%B6%88%EB%A6%AC%EB%8A%94-%EC%9E%A5%EC%8B%9C%EA%B0%84-%EB%8F%8C%EC%95%84%EA%B0%80%EB%8A%94-ai-%EC%82%AC%EC%9A%A9%EB%B2%95%EC%9D%80-%EC%82%AC%EC%8B%A4%EC%9D%80-software-activity-7436538747371888640--N5k"
authorship: self
published_at: 2026-03-08
---
Ralph로 불리는 장시간 돌아가는 AI 사용법은 사실은 "Software Factory"입니다. 단지 오랜시간 동안 앱을 만들 수 있어서가 아닙니다. 이미 운영 중인 소프트웨어에 외부의 자극(새 기획, 유저 피드백)이 들어왔을 때 자동으로 개선되는 시스템입니다.

이게 왜 바이브코딩과 다른지를 3명의 사례로 설명합니다.

Geoffrey Huntley는 Latent Patterns라는 제품을 운영합니다. 제품 안에 "designer mode"가 있어서 제품 안에서 제품을 만듭니다. 변경이 생기면 Cursor Cloud Agent가 risk matrix를 보고 자동으로 배포합니다. 사람은 루프 안에 있지 않습니다. 루프 위에 있습니다. 본인 말로는 "I'm on the loop, not in the loop." 핸드폰으로 에이전트 출력을 감시할 뿐입니다.

더 놀라운 건 SaaS 조합을 끊은 겁니다. PostHog, Pipedrive, Zendesk, Calendly. 이 도구들을 에이전트에게 "만들어"라고 지시해서 1st-party로 내재화했습니다. Zapier로 연결하는 시대가 끝나고, 2000년대 MS Access와 VB로 초개인화 소프트웨어를 만들던 시절로 돌아간 겁니다. 도구가 더 강력해졌을 뿐.

미팅 녹취도 마찬가지입니다. LLM이 Challenger/SPIN 세일즈 프레임워크로 자동 분석합니다. "Watch the loops. Watch the inferencing. That's where your learning is." Geoff의 말입니다.

Karpathy의 autoresearch도 같은 구조입니다. GPU 1개로 하룻밤에 100개 ML 실험을 자율 수행합니다. 사람이 하는 건 program.md 파일 하나에 연구 방향을 적는 것뿐입니다. 83개 실험 중 15개 개선을 채택했고, H100 8대로 스케일업하니 276개 실험에서 29개를 채택했습니다.

직접 코딩하지 않습니다. 오케스트레이션만 합니다. Karpathy가 이걸 "agentic engineering"이라 부릅니다.

저는 이 두 사례에서 공통점을 봅니다. 사람이 하는 일이 "만드는 것"에서 "방향을 잡는 것"으로 바뀌었다는 겁니다. Garry Tan이 "the best program.md wins"라고 했는데, 정확합니다. 코드를 잘 짜는 게 아니라 방향을 잘 잡는 사람이 이깁니다.

Andrew Chen(a16z)은 여기에 경계선을 하나 긋습니다. AI는 검증 가능한 문제에 강합니다. 코드가 컴파일되는지, 수학이 맞는지. 하지만 "이 이메일이 무례한가?", "이 트윗이 임팩트 있나?" 같은 주관적 판단에는 약합니다. 객관적 검증과 주관적 검증 사이의 갭. 가장 흥미로운 비즈니스가 여기서 나온다고 합니다.

저는 이게 Software Factory의 경계를 정의한다고 생각합니다. 자동 배포, 자동 실험, 자동 내재화. 이건 이미 작동합니다. 하지만 "이 기능이 유저에게 가치가 있는가?"는 여전히 사람의 영역입니다. Geoff가 루프 위에서 감시하는 것도, Karpathy가 program.md를 쓰는 것도, 결국 taste입니다.

저는 우리 팀에서도 비슷한 패턴을 경험합니다. 에이전트가 코드를 짜고, 테스트하고, 배포까지 합니다. 그런데 "이 방향이 맞는가?"를 결정하는 건 여전히 사람입니다. 매일 에이전트 출력을 보면서 느낍니다. 이 결정의 질이 곧 소프트웨어의 질이 됩니다.

Software Factory는 코딩을 자동화하는 게 아닙니다. 판단을 제외한 모든 것을 자동화하는 겁니다. 남는 건 방향과 취향뿐입니다.
