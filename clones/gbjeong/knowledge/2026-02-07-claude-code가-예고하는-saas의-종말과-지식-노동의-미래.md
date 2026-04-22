---
topic: "Claude Code가 예고하는 SaaS의 종말과 지식 노동의 미래"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code-is-the-inflection-point-activity-7426033272574431232-AVdn?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQFIuUBjtLDXqBO-JeEfWiwWUc1RwKF3-U"
authorship: self
published_at: 2026-02-07
---
GitHub 커밋의 4%가 Claude Code로 작성되고 있고, 연말에는 20%를 넘을 예정입니다. Claude Code는 그냥 코딩 도구가 아니라 READ - THINK - WRITE - VERIFY를 누구보다 잘 하는 에이전트입니다. 코딩은 가장 먼저 적용된 것 뿐, 진짜 타깃은 지식 노동 시장 전체입니다.

터미널에서 돌아가는 Claude Code는 코드베이스를 읽고, 계획을 세우고, 실행하고, 검증합니다. Claude Code를 정확히 표현하면 "Claude Computer"에 가깝습니다. 컴퓨터 전체에 접근해서 환경을 이해하고, 목표를 향해 반복적으로 계획을 수행합니다.

구루 개발자들의 말이 인상적이었습니다. Andrej Karpathy는 코드를 수동으로 작성하는 능력이 퇴화하고 있다고 말합니다. Vercel CTO Malte Ubl은 자신의 새로운 주요 업무가 "AI가 잘못한 것을 알려주는 것"이라고 합니다. Claude Code 창시자 Boris Cherny는 자기 팀 코드의 거의 100%가 Claude Code로 작성된다고 합니다. 심지어 Linus Torvalds도 바이브 코딩을 하고 있습니다. (리눅스를 만든)

그런데 핵심은 코딩이 아닙니다. Claude Code가 증명한 워크플로우는 READ(정보 수집) - THINK(분석) - WRITE(출력 생성) - VERIFY(검증)입니다. 코딩은 이 사이클이 가장 먼저 적용된 교두보일 뿐이고, 진짜 타깃은 15조 달러 규모의 정보 노동 시장 전체입니다. 10억 명 이상의 정보 노동자가 하는 업무의 상당 부분이 이 사이클과 동일합니다.

Anthropic은 이걸 알고 Cowork를 출시했습니다. "일반 컴퓨팅을 위한 Claude Code"입니다. 4명의 엔지니어가 10일 만에 만들었고, 코드 대부분은 Claude Code가 작성했습니다. 영수증으로 스프레드시트를 만들고, 파일을 정리하고, 흩어진 메모에서 보고서를 작성합니다. 터미널 빼고 데스크톱을 더한 겁니다.


1. SaaS의 3대 해자가 동시에 무너지고 있다

SaaS의 75% 마진을 지탱하던 해자는 세 가지였습니다. 데이터 전환 비용(데이터가 갇혀 있음), 워크플로우 락인(UI 학습 비용), 통합 복잡성(Slack-Jira 연동 같은 것). 에이전트가 이 셋을 동시에 침식하고 있습니다.

에이전트는 시스템 간 데이터 마이그레이션을 자동화합니다. 인간용 UI가 필요 없으니 워크플로우 락인이 무의미해집니다. MCP가 통합을 단순화합니다. 에이전트가 직접 Postgres에 쿼리해서 차트 만들고 이메일로 보내면, CRM이나 BI 같은 "버튼 클릭 + 정보 재포맷" 소프트웨어의 존재 이유가 사라집니다.


2. 소프트웨어의 미래는 메모리 계층 구조다

Fabricated Knowledge의 Doug O'Laughlin이 제시한 비유가 인상적이었습니다. "Claude Code는 DRAM이다."

DRAM(빠르고 일시적) = AI 에이전트의 컨텍스트 윈도우. 정보 처리, 분석, GUI, 워크플로우는 모두 일시적으로 생성되고 사라집니다. 용도에 맞게 그때그때 만들면 됩니다.

NAND(느리고 영속적) = 인프라 소프트웨어, API, 데이터. 영속적 저장소이자 단일 진실의 원천. 이것만 살아남습니다.

Tableau, Figma, Zapier, Notion, Asana. 인간이 인간을 위해 만든 UI 중심 소프트웨어는 멸종 위기에 처해 있습니다. 살아남으려면 에이전트가 소비하는 API 기반 데이터 인프라로 전환해야 합니다.


3. YouTube가 케이블 TV를 죽인 것과 같은 패턴

TV 프로그램 제작비 25만 달러가 YouTube 채널 3,000달러로 떨어진 것처럼, 소프트웨어 제작 비용이 급락하고 있습니다. 공급이 폭증하면 마진이 압축됩니다. Peak SaaS입니다.

Microsoft는 이 한가운데에 서 있습니다. Azure로 GPU를 빌려주는 대상(OpenAI, Anthropic)이 바로 Office를 잠식하는 주체입니다. 성을 지키려면 GPU를 거둬야 하고, Azure를 키우려면 성문을 열어야 합니다.


저도 제품을 만들면서 같은 고민에 도달했습니다. MCP와 Plugin으로 Claude Code와의 연동을 확보하면서, 동시에 제품 안에서만 축적되는 데이터를 만들려고 합니다. 유저가 인터랙션하면서 쌓이는 이 데이터만이 유저가 계속 서비스를 사용할 유일한 이유가 됩니다.

UI는 에이전트가 그때그때 만들면 됩니다. 살아남는 건 API와 데이터뿐입니다.
https://lnkd.in/gKsiUe9f
