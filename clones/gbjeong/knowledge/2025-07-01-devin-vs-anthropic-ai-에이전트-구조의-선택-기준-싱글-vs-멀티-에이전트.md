---
topic: "Devin vs Anthropic: AI 에이전트 구조의 선택 기준 (싱글 vs 멀티 에이전트)"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_devin-vs-anthropic-6%EC%9B%94-12%EC%9D%BC-devin%EC%9D%80-%EB%A9%80%ED%8B%B0-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8%EB%A5%BC-activity-7345717587613274112-oEpK?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQRO6EBVuLBNtunTd3oFxqQ7dKWdLdOoNs"
authorship: self
published_at: 2025-07-01
---
Devin vs Anthropic

6월 12일 Devin은 “멀티 에이전트를 만들지 말라”는 글을 올렸고, 바로 다음 날 Anthropic은 멀티 에이전트 기반 리서치 시스템 구축 사례를 공개했습니다.
“멀티 에이전트가 반드시 옳은가?”를 두고 벌어진 흥미로운 대결(?)입니다.

한국인을 위해 결론부터: 둘 다 맞습니다.
Key Takeaway: LLM이 해야 할 주요 작업이 ‘쓰기’인지, ‘읽기’인지에 따라 다르게 선택하면 됩니다.

1. 대표적인 쓰기 중심 작업 - 코딩
- Cursor, Claude Code 같은 최신 코딩 툴은 대부분 한 모델이 순차적으로(seqeuntial) 코드를 작성·수정합니다.
- Devin 개발팀은 이를 ‘edit-apply’ 모델이라 부르며, “소형 모델이 전체 파일을 다시 쓰도록 하면 코드가 서로 뒤엉키는 충돌을 원천 봉쇄할 수 있다”고 설명합니다.
- 즉, 동시에 여러 에이전트가 코드를 만지면 코드 간에 충돌 리스크가 급격히 상승한다는 겁니다. 이런 상황은 충분히 상상할 수 있죠.

2. 대표적인 읽기 중심 작업 - 리서치
- Anthropic의 Claude Research는 리드 에이전트가 질문을 쪼개고, 여러 서브 에이전트가 각자 context window를 최대로 써가며 자료를 탐색한 뒤 요약을 취합합니다.
- 이 시스템 덕분에 단일 에이전트 대비 약 90 % 성능이 향상됐습니다.
- 토큰 소비가 늘어나는 건 사실이지만, 방대한 정보를 빠르게 소화해야 하는 리서치 환경이라면 충분히 상쇄된다는 메시지죠.

LangChain은 이 두 사례를 묶어 “핵심은 Context Engineering”이라고 강조합니다.
시스템 프롬프트가 static한 인스트럭션이라면, Context는 에이전트가 일하면서 쌓이는 dynamic한 정보입니다.
어떤 정보를 언제, 얼마나 압축해 전달하느냐가 멀티·싱글 구조를 넘어 모든 AI 에이전트 앱의 성능을 결정합니다.
Andrej Karpathy도 6월 26일 X(트위터)에서 Context Engineering에 대해 모델에 딱 맞는 정보를 넣는 일은 과학이자, LLM의 ‘심리’를 읽어내는 예술이라고 언급했습니다.

에이전트 구조에는 silver bullet이 없습니다. 대신 Context Engineering을 통해 어떤 정보를 어떻게 LLM에 먹일지 큰 그림을 얻을 수 있었습니다.
쓰기가 핵심이라면 순차적인 작업이 효과적이고
읽기가 핵심이라면 최대한 많은 정보를 처리할 수 있는 병렬 탐색이 효과적입니다.
