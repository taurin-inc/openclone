---
topic: "Sonnet 4.5와 Claude Agent SDK를 활용한 고성능 에이전트 개발 및 사용 후기"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_sonnet-45-claude-agent-sdk-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-1%EC%8B%9C%EA%B0%84-activity-7379075521353150464-2e5O?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQRO6EBVuLBNtunTd3oFxqQ7dKWdLdOoNs"
authorship: self
published_at: 2025-10-01
---
Sonnet 4.5 + Claude Agent SDK = 에이전트 1시간 컷. 금방 만들었지만 성능은 클로드코드 급입니다. 오늘 농협과 논의하는 자리에 간단한 에이전트를 만들어갔어요. sonnet 4.5쓰러 Claude Code로 돌아오세요 여러분!

# Agent SDK: 클로드 코드급 성능 에이전트 만들기

Agent 클라이언트를 구현하기 쉽고, 툴 콜링 성능이 좋습니다. 어떤 뜻이냐면 클로드를 쓸 때만큼이나 설정이 간단해서 mcp 와 프롬프트 세팅만 하면 알아서 돌아갑니다. 
농협 대출 상품 페이지의 reponse 를 다운로드해서 DB에 저장한 다음, 간단한 RAG tool 을 만들었어요. 구현할 코드는 적은데 아주 안정적으로 동작해요. 

실은 이 라이브러리는 Claude Code SDK 였는데 이름만 바뀐 겁니다. 그래서 우리가 사용하는 Claude Code 동작과 똑같아요. 파일 읽기/쓰기, Bash, WebSearch 등 기본 툴이 내장돼있어서 이걸 사용하면 클로드 코드 급 앱을 뚝딱 만들 수 있어요

단점도 있어요. 앱에 따라 다르지만 LLM 사용 비용이 높아요. Claude 모델이 비싸기도 하고(Sonnet도 비싸죠), turn 을 여러 번 돌게 가이드해야 제대로 성능을 뽑기 때문에 토큰을 많이 먹어요.

# Sonnet 4.5: 빠른데 Opus 4.1을 압도한다

1. 데모를 위해서 뭘 만들지 리서치
농협을 만나서 깊은 인상을 주기 위해 바이브코딩으로 어떤 데모를 만들어가면 좋을지 토론했습니다. 농협 관련 페이지를 조사하면서 playwright로 같이 웹페이지를 봤습니다. 이전 sonnet 4한테는 playwright mcp 동작이 버거웠는데, 항상 제대로 동작하더라구요. 덕분에 농협은행 금융상품몰의 모든 상품을 크롤링했고, 대출 상품은 api response 도 가져올 수 있었습니다. 농협의 실제 대출 상품을 토대로 에이전트를 만들었구요.

2. PRD 와 세부 issue 생성
PRD 전체 스펙을 알잘딱으로 만들어주고, 요구사항을 반영해서 이터레이션하는 게 더 쉬워졌습니다. 이건 성능 차이라기보다는 Opus 보다 레이턴시가 낮아서 제 피로도가 줄어든 것 같아요. 좋은 스펙을 만들기 위해 한 세션에서 계속 대화해야 하는데 Opus 는 시간이 오래 걸려서 지루했거든요. 

PRD를 만들고 나면 세부 issue 생성을 linear mcp 로 사용하는데요. 여기서 중요한 건 issue의 크기를 얼마 정도의 크기로 자르냐입니다. 너무 작으면 태스크가 많아지고 너무 크면 한 번에 처리하기 어려워서요. 그런데 Opus 는 과하게 세분화하는 경향이 있었던 반면, 이번 Sonnet 4.5는 적당한 단위로 잘라주었습니다.

3. 코드 작성 및 문제 해결
UI, 데이터베이스, Agent 3가지 작업이 있었는데 맨땅에서 만드는 것보다 vercel의 ai sdk repo 를 cloning 하는 걸 택했습니다. 바이브코딩으로 맨바닥에서 만들 때 예쁜 앱을 만들기 어려우니까요. 
데이터베이스 작업은 TS, prisma, Neon MCP 만 정해줬더니 4개 정도의 티켓을 한 번에 처리하더라고요.
- Prisma 스키마 설계
- 데이터 전처리 유틸리티 구현
- 데이터 마이그레이션 스크립트 작성 및 실행
- Prisma 검색 쿼리 래퍼 구현
"시험 삼아 todo Status 에 있는 issue 해결" 이라고 명령어를 내렸는데 뚝딱 해냈습니다. 30시간씩 돌면서 밴치마크를 풀었다더니, 앞으로는 한 번에 여러 티켓을 던지는 실험을 계속 해봐야겠어요.

Agent 작업은 모델의 knowledge cutoff 후에 나온 sdk 를 사용하는거라 문서를 찾아서 읽게 했는데 context7 mcp 정확도가 떨어지더라고요. 반복적으로 ts가 아니라 python sdk 를 검색하는 부분에서 갸우뚱했습니다. 결국 공식 문서를 llms.txt 처럼 넣어줬어요.
물론 컨텍스트를 주자마자 한 번에 해결했습니다. 모델 성능은 진짜 좋아요.


# Claude Code로 돌아오세요
opus로 문제가 안 풀리면 codex 를 켜는 일이 많았는데 이번 프로젝트에서는 한 번도 안 켰어요. 성능이 좋아지기도 했고 제 워크플로우가 Claude Code 와 SubAgent에 최적화돼있어서 그런 걸지도요. 그런데 codex와 성능 비교할 때 항상 느끼는 건 claude 가 tool call을 더 자주 한다고 느낀다는 것입니다. 테스트를 더 자주 돌리는 것과 같은 원리라 저랑 스타일이 더 맞는 것 같아요. 게다가 sonnet 4.5의 성능도 좋아지면서 codex 를 쓸 일이 더 없어졌습니다. 가끔 codex 불러서 코드 리뷰 받는 정도!

아마 많음 분들이 다시 Claude Code로 돌아올 것 같아요. 게다가 Sonnet은 작은 플랜에서도 동작하니까 더 많은 분들이 성능을 체감할 수 있을 것 같아요. 그리고 Claude Code의 훌륭한 하네스 기능들도요!
