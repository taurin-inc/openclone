---
topic: "Anthropic이 공개한 에이전트 평가(Agent Eval) 핵심 전략 및 로드맵"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_demystifying-evals-for-ai-agents-activity-7416241252284702720-_aUb?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-11
---
Agent eval은 LLM eval과 다릅니다. Anthropic이 에이전트 평가의 비법을 공개했습니다. 어려운 용어가 많지만, Agent를 프로덕션에 배포할 때는 물론, 우리가 Agent를 사용할 때에도 꼭 알아야 하는 내용입니다.

1. Grader 3종류

Agent를 평가하려면 Grader가 필요합니다. 세 가지 유형이 있어요.
Code-Based Grader: 빠르고 객관적이지만, 유효한 변형에 취약합니다. 문자열 매칭, 정적 분석 같은 방식이에요. 
Model-Based Grader: 유연하고 open-ended task도 처리 가능하지만, 비결정적입니다. LLM이 채점하니까요. 
Human Grader: 최고 품질이지만 비싸고 느립니다. LLM judge를 calibration하거나 주관적 출력을 평가할 때 필수예요.


2. 핵심 메트릭: pass@k vs pass^k
pass@k는 k번 시도 중 최소 1번 성공할 확률입니다. 코드 생성처럼 "한 번만 성공하면 되는" 시나리오에 적합해요. 개발자가 여러 결과 중 좋은 걸 고르면 되니까요.
pass^k는 k번 시도가 모두 성공할 확률입니다. 고객 대면 시스템에서는 이게 중요해요. 챗봇이 10번 중 9번 잘 답해도, 1번 이상하게 답하면 고객 신뢰를 잃으니까요.
같은 90% 성공률이라도 pass@3은 99.9%지만 pass^3은 72.9%입니다. 고객 대면 시스템은 훨씬 어려운 기준을 통과해야 합니다.


3. Agent 유형별 평가 전략
Agent 유형에 따라 평가 방법이 완전히 달라집니다. 네 가지 유형을 자세히 살펴볼게요.

Coding Agent
결정적 grader가 자연스럽게 작동합니다. 소프트웨어 테스트는 "돌아가느냐 안 돌아가느냐"가 명확하니까요. SWE-bench Verified, Terminal-Bench 같은 벤치마크가 대표적입니다. 흥미로운 건 1년 만에 40%에서 80% 이상으로 성능이 향상됐다는 점이에요. Coding Agent는 평가하기도 쉽고, 발전 속도도 빠릅니다.

SWE-bench가 코딩 벤치마크에서 가장 많이 언급되는 이유가 있습니다. OpenAI가 SWE-bench Verified를 만들 때 사용한 human annotation 가이드를 보면, 얼마나 섬세하게 task를 정의했는지 알 수 있어요. "명확한 Task 작성"이 왜 중요한지 실감하게 됩니다.
https://lnkd.in/gZK2psmn

Conversational Agent
다차원 측정이 필요합니다. Task 완료 여부만 보면 안 돼요. 세 가지를 봐야 합니다.
- Task 완료: 상태 체크로 실제로 작업이 완료됐는지 확인
- 효율성: transcript 제약으로 불필요한 턴 없이 완료했는지 측정
- 상호작용 품질: LLM 루브릭으로 자연스럽고 유용했는지 평가
τ2-Bench가 현실적인 다중 턴 시나리오를 시뮬레이션하는 대표 벤치마크입니다.

Research Agent
Grader 유형을 조합해야 합니다. 단일 grader로는 부족해요.
- Groundedness 체크: 응답이 인용한 출처에서 실제로 지원되는지 검증
- Coverage 체크: 필수 사실이 빠짐없이 포함됐는지 확인
- Source quality 체크: 인용한 출처가 권위있는지 판단
세 가지를 모두 통과해야 좋은 Research Agent입니다.

4. 핵심 원칙: Read the transcripts

가장 강조하는 건 이겁니다. "Read the transcripts." 점수만 보지 말고 실제 transcript를 읽으라는 거예요. 왜 실패했는지, grader가 제대로 작동하는지, 실패가 진짜 agent 실수인지 eval 문제인지 구분해야 합니다.

[8단계 로드맵]
저는 스타트업 입장에서 1, 3, 7단계가 우선 중요하다고 생각했습니다. 큰 규모의 조직에는 5,6에 과몰입해서 리소스를 낭비하지 않으면 좋을 것 같습니다.

*1단계 - 일단 시작하세요
20-50개 실제 실패 케이스면 충분합니다. 초기 제품 요구사항이 자연스럽게 테스트 케이스로 변환돼요.

2단계 - 수동 테스트를 전환하세요
사용자가 신고한 실패와 지원 큐 이슈를 우선으로 eval 케이스로 만드세요.

*3단계 - 명확한 Task를 작성하세요
도메인 전문가가 독립적으로 같은 판정에 도달해야 합니다. 참조 솔루션을 만들어두세요.

4단계 - 균형 잡힌 세트를 구축하세요
동작해야 할 케이스와 동작하지 말아야 할 케이스를 모두 테스트하세요. 클래스 불균형을 방지해야 합니다.

5단계 - 견고한 Harness를 설계하세요
깨끗한 환경으로 trial을 격리하세요. 공유 상태 오염을 방지해야 합니다.

6단계 - 사려 깊게 Grader를 선택하세요
경로보다 결과를 평가하세요. 부분 점수를 도입하고, LLM judge를 쓴다면 반드시 human으로 calibration하세요.

*7단계 - Transcript를 읽으세요
grader가 올바르게 작동하는지 검증하세요. 실패가 진짜 agent 실수인지, eval 문제인지 구분해야 합니다.

8단계 - Saturation을 모니터링하세요
saturate된 capability eval은 regression suite로 전환하세요. 그리고 새로운 challenging task를 개발하세요.


[추천 프레임워크]
저는 LangSmith와 Langfuse를 써봤는데, 둘 다 경험이 좋았습니다. 특히 transcript(trace)를 시각적으로 탐색할 수 있어서 "왜 실패했는가"를 파악하기 쉬웠어요. 
다만, 대규모 환경에서는 self host 를 고려하세요! hosting 된 클라우드 플랫폼이 다를 때에는 outbound traffic 이 꽤 많이 나옵니다!

https://lnkd.in/giGnmY8W
