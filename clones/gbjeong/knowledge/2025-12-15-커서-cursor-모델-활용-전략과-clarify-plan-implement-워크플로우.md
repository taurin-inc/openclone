---
topic: "커서(Cursor) 모델 활용 전략과 Clarify-Plan-Implement 워크플로우"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EC%BB%A4%EC%84%9C-%EC%A7%81%EC%9B%90%EC%9D%B4-%EC%BB%A4%EC%84%9C-%EB%AA%A8%EB%93%9C%EB%A7%88%EB%8B%A4-%EC%96%B4%EB%96%A4-%EB%AA%A8%EB%8D%B8%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94%EC%A7%80-%ED%8A%B8%EC%9C%97%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4-%EB%B0%B0%EC%9A%B8-activity-7406472642557489152-RcCR?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-12-15
---
커서 직원이 “커서 모드마다 어떤 모델을 사용하는지” 트윗했습니다. 배울 점은 항상 플래그쉽 모델을 사용하는 것과 Plan과 Implement를 나누는 것입니다. 그리고 저는 Plan보다 Clarify라는 단계를 제일 먼저 사용합니다.

1. 왜 항상 비싼 모델인가?

“토큰 비용 아끼려고 싼 모델 쓴다”는 말, 자주 듣습니다.

그런데 진짜 비용이 뭔지 생각해보면요.

싼 모델로 30분 삽질한 시간 vs 비싼 모델이 한 번에 해결한 3분

명확하게 수치화하는 건 어렵지만 확신을 갖고 일할 수 있다는 장점이 큽니다.


2. 저는 Plan 전에 Clarify를 먼저 합니다.

Claude Code는 최근 Research → Implement Plan → Code처럼 더 잘게 쪼개는 가이드를 주기도 했습니다.

특히 저는 Claude Code에서 Plan 모드를 직접 사용하는 대신, 이런 프롬프트를 자주 씁니다:

> “내 요구사항을 명확하게 만들기 위해 객관식으로 질문해. 사소한 디테일까지, 내가 미처 몰랐던 것을 꺼낼 수 있게 여러 depth로 질문해”

저희 팀은 이 과정을 Clarify라고 부릅니다.

이 과정을 통해 “내가 모르는 것을 모르는 상태”를 벗어나고, 내 의도를 명확하게 만듭니다. 이 단계가 모든 과정 중 첫 번째로 들어가면 요구사항이 훨씬 잘 전달되더라구요.


Clarify → Plan → Implement

이 순서를 추천드립니다!
