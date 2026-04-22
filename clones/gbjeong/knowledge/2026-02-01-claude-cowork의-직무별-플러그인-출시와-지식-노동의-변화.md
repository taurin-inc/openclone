---
topic: "Claude Cowork의 직무별 플러그인 출시와 지식 노동의 변화"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-cowork%EA%B0%80-%EC%A7%80%EC%8B%9D%EB%85%B8%EB%8F%99%EC%9D%84-%EB%81%9D%EB%82%B4%EB%9F%AC-%EA%B0%80%EA%B3%A0-%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4-plugins-activity-7423840081410678784-3Lx3?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-02-01
---
Claude Cowork가 지식노동을 끝내러 가고 있습니다. Plugins 기능이 추가됐어요. 하나 하나가 직원 하나에 매핑됩니다. sales, PM, marketing, finance, legal, cs ... 이 스킬들을 만든 의도가 보이네요. 이 플러그인 잘 깎으면... 누군가는 대체될 수도 있습니다.

왜 플러그인인가? 하나의 플러그인에 Skills, Connectors, Slash Commands, Sub-agents가 번들링되어 있습니다. 특정 직무에 필요한 모든 것이 한 패키지에 담겨 있어요. "어떤 도구와 데이터를 써야 하는지", "핵심 워크플로우는 어떻게 처리할지"를 Claude에게 알려줄 수 있습니다. 덕분에 팀 전체가 더 일관되고 더 좋은 결과물을 얻게 됩니다.


1. Sales (영업) - Skills 6개, Commands 3개

account-research는 prospect 회사를 자동으로 조사합니다. 웹 검색으로 회사 개요, 최근 뉴스, 채용 공고, 주요 인물을 파악합니다. CRM을 연결하면 기존 거래 이력까지 통합됩니다.
call-prep은 미팅 전 준비 자료를 만들어줍니다. 참석자 LinkedIn 프로필, 회사 최근 동향, 우리 제품과의 연결점, 예상 질문까지 정리해줍니다.
competitive-intelligence는 경쟁사 배틀카드를 HTML로 생성합니다. 제품 비교, 가격 정보, 우리의 강점, 예상 반론과 대응 스크립트까지 한 페이지에 담깁니다.
핵심 철학은 "조사 없이 아웃리치 금지"입니다. 이메일 작성 스킬이 있는데, 반드시 account-research를 먼저 실행해야 작동합니다. 제네릭한 콜드메일을 막는 설계입니다.


2. Finance (재무/회계) - Skills 6개, Commands 5개

journal-entry는 분개 작성을 도와줍니다. 미지급금 적립, 감가상각, 선급비용 상각 같은 월말 정기 분개를 자동으로 준비합니다.
financial-statements는 손익계산서, 재무상태표, 현금흐름표를 표준 형식으로 생성합니다. 전월 대비, 예산 대비 분석까지 포함됩니다.
월말 결산 체크리스트가 일자별로 정의되어 있습니다. 결산 시작일부터 마감일+5일까지 매일 해야 할 작업이 순서대로 나열됩니다. 어떤 작업이 어떤 작업에 의존하는지도 표시됩니다.


3. Product Management - Skills 6개, Commands 6개

feature-spec은 PRD 작성을 도와줍니다. 문제 정의, 목표, Non-Goals, 사용자 스토리, 요구사항, 성공 지표, 미결 질문, 타임라인 순서로 구조화된 문서를 만들어줍니다. 사용자 스토리는 INVEST 원칙(Independent, Negotiable, Valuable, Estimable, Small, Testable)을 따릅니다.
roadmap-management는 로드맵 관리입니다. Now/Next/Later 형식, 분기별 테마 형식, OKR 연동 형식 중 선택할 수 있습니다. 우선순위 결정에 RICE, MoSCoW, ICE 프레임워크가 내장되어 있습니다. 작업 간 의존성도 매핑해줍니다.
stakeholder-comms는 스테이크홀더별 맞춤 업데이트를 생성합니다. 경영진에게는 200단어 요약, 엔지니어에게는 기술 상세, 고객에게는 혜택 중심으로 같은 내용을 다르게 포장합니다.

4. Legal (법무) - Skills 6개, Commands 5개

contract-review는 계약서 검토 워크플로우입니다. 조직의 협상 플레이북을 기준으로 각 조항을 GREEN(수용 가능), YELLOW(협상 필요), RED(에스컬레이션 필요)로 분류합니다. RED 항목에는 수정 문구까지 제안합니다.
nda-triage는 NDA 신속 심사입니다. 들어오는 NDA를 표준 조건과 비교해서 위험도를 분류합니다. 낮은 위험은 바로 서명, 중간 위험은 수정 후 서명, 높은 위험은 법무팀 검토로 라우팅합니다.
canned-responses는 자주 받는 법무 문의에 대한 템플릿 응답입니다. 정보 삭제 요청, 소환장 대응, NDA 요청 같은 것들입니다. 단, 에스컬레이션 트리거가 명확합니다. "규제 기관으로부터의 요청"이면 템플릿 사용 금지, 반드시 법무팀 검토.
모든 산출물에 "이것은 법적 조언이 아닙니다" 면책이 강제로 포함됩니다. ㅎㅎ


5. Data (데이터 분석) - Skills 7개, Commands 6개

sql-queries는 SQL 쿼리 작성을 도와줍니다. PostgreSQL, Snowflake, BigQuery, Redshift, Databricks 5가지 방언을 지원합니다. 각 방언별 날짜 함수, 문자열 함수, 성능 최적화 팁이 포함되어 있습니다.
data-exploration은 데이터 프로파일링입니다. 테이블을 받으면 행/열 수, 각 컬럼의 null 비율, 카디널리티, 분포를 분석합니다. 데이터 품질 이슈를 플래그하고, 어떤 분석이 가능한지 제안합니다.
data-visualization은 Python(matplotlib, seaborn, plotly)으로 시각화를 만듭니다. 데이터 관계 유형에 따라 적절한 차트를 추천합니다. 색맹 대응 팔레트, 접근성 체크리스트도 포함되어 있습니다.
interactive-dashboard-builder는 Chart.js로 자체 포함 HTML 대시보드를 만듭니다. 서버 없이 파일 하나로 작동합니다. 필터, 정렬, 드래그앤드롭이 가능한 인터랙티브 대시보드입니다.

진짜 힘은 커스터마이징에서 나옵니다. 이 플러그인들은 시작점일 뿐이에요. .mcp.json 파일 하나 수정하면 HubSpot을 Salesforce로 교체할 수 있습니다. 스킬 파일에 우리 회사 용어, 조직 구조, 프로세스를 넣으면 Claude가 우리 회사를 이해합니다. 워크플로우도 "교과서적 방식"이 아니라 "우리 팀이 실제로 일하는 방식"으로 조정할 수 있어요. 팀이 플러그인을 만들고 공유할수록, Claude는 부서를 넘나드는 전문가가 됩니다.

github: https://lnkd.in/gYpyMcPJ
