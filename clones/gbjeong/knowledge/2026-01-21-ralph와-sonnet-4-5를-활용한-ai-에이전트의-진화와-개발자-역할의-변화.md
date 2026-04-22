---
topic: "Ralph와 Sonnet 4.5를 활용한 AI 에이전트의 진화와 개발자 역할의 변화"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_ralph%EB%A5%BC-%EC%93%B0%EB%A9%B4-%EC%8B%9C%EA%B0%84%EB%8B%B9-10%EC%9C%BC%EB%A1%9C-sonnet-45%EA%B0%80-%EC%89%AC%EC%A7%80-%EC%95%8A%EA%B3%A0-%EB%8F%8C%EC%95%84%EA%B0%91%EB%8B%88%EB%8B%A4-activity-7419853805862809600-gWgh?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-21
---
Ralph를 쓰면 시간당 $10으로 Sonnet 4.5가 쉬지 않고 돌아갑니다. 코드 짜고, 실패하면 고치고, 성공하면 다음 태스크로 넘어가요. Anthropic은 이 현실을 채용에 반영했습니다. 성능 최적화 과제를 공개하면서 "Opus 4.5가 11.5시간 걸려 달성한 1487 사이클, 이보다 잘하면 연락 달라"고 했거든요.

Ralph는 Geoffrey Huntley가 만든 기법입니다. https://lnkd.in/g_xVkvaF

원리는 단순해요. bash loop 하나로 AI가 태스크를 끝낼 때까지 반복 실행합니다. 매 반복마다 새로운 context로 시작하고, 진행 상황은 git commit으로 저장돼요. AI가 "기억"이 아니라 "기록"으로 연속성을 유지하는 거죠.

실제 성과도 있습니다. $50,000짜리 외주 계약을 $297 API 비용으로 끝낸 사례가 있고, Y Combinator 해커톤에서는 팀들이 하룻밤에 6개 repo를 배포했어요.

Anthropic 과제로 돌아가면요. 이건 커스텀 VLIW SIMD 아키텍처에서 트리 순회 알고리즘을 최적화하는 문제입니다. 측정 단위는 시뮬레이션된 CPU의 클록 사이클이에요. 낮을수록 좋습니다. https://lnkd.in/gP6xxMvP

인간 2시간 최고 기록: 약 1790 사이클.
Opus 4.5 (11.5시간): 1487 사이클.
Opus 4.5 (개선된 harness): 1363 사이클.

AI가 이겼습니다. 그래서 Anthropic은 기준을 바꿨어요. "1487 사이클 미만 달성하면 이력서 보내라. 면접 논의하겠다."

여기서 "개선된 harness"가 핵심입니다. Harness를 어렵게 생각할 필요 없어요. Claude Code가 harness고, skills와 plugin이 harness입니다. 모델을 더 잘 돌리게 해주는 실행 환경이에요.

패턴이 보입니다. Ralph는 2025년 7월에 나왔지만, 당시 모델 성능으로는 실용적이지 않았어요. Sonnet 4.5가 나오면서 비로소 이 harness가 작동하기 시작했습니다. 그리고 skills가 출시됐고, 지금 plugin 광풍이 불고 있어요. Opus 4.5가 나오면서 Anthropic은 engineering blog에 "Effective harnesses for long-running agents"를 올렸습니다. 그리고 지금 Ralph 광풍이에요. https://lnkd.in/g-iGJFNv

새 모델이 나오면 그 모델을 제대로 쓸 수 있는 harness가 따라 나옵니다. 대중에게 퍼지는 데는 1-2달 정도 걸려요. 지금이 그 타이밍입니다.

개발자의 역할이 바뀌고 있습니다. 코드 작성자에서 요구사항 정의자로, 타이핑하는 사람에서 검증하는 사람으로요. 이 흐름을 일찍 탄 사람과 늦게 탄 사람의 격차는 점점 벌어질 겁니다.
