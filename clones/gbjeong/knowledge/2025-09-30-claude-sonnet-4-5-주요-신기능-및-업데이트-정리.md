---
topic: "Claude Sonnet 4.5 주요 신기능 및 업데이트 정리"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-sonnet-45-%EC%99%80-%ED%95%A8%EA%BB%98-%EB%B0%9C%ED%91%9C%EB%90%9C-%EB%AA%A8%EB%93%A0-%EA%B8%B0%EB%8A%A5%EC%9D%84-%EC%A0%95%EB%A6%AC%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4-activity-7378610580112228353-peGC?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQRO6EBVuLBNtunTd3oFxqQ7dKWdLdOoNs"
authorship: self
published_at: 2025-09-30
---
Claude Sonnet 4.5 와 함께 발표된 모든 기능을 정리했습니다. 너무 길어서 댓글로 이어서.. <<Memory Tool, Context Editing (이건 정말 미쳤습니다), Claude Code 2.0, Claude Agent SDK, Imagine>>. 모델의 성능은 이제 지루하기도 하고, 체감의 영역인 것 같아요. 하지만 엄청 편리한 기능들이 나와서 이건 반드시 보셨으면 좋겠습니다.

1. Memory Tool
- **영구 메모리**: 컨텍스트 윈도우 외부에 정보 저장
- **세션 간 지속**: 게임, 프로젝트 등에서 정보 유지

"컨텍스트 바깥에 존재한다"는 것은 컨텍스트 윈도우(context window) 외부에 정보를 저장한다는 의미입니다.

AI 모델이 한 번에 처리할 수 있는 토큰(텍스트 조각)의 한계 (Claude Sonnet 4.5의 경우 약 200k 토큰) 때문에 대화가 길어지면 이 한계에 도달하여 초기 대화 내용이 잊혀져요.

전통적 방식 (컨텍스트 윈도우 내부):
[대화1] [대화2] [대화3] ... [대화N] ← 모두 컨텍스트 윈도우 안에 존재 (토큰 한계 도달 시 초기 대화 삭제됨)

Memory Tool 방식 (컨텍스트 윈도우 외부):
컨텍스트 윈도우: [현재 대화]
			↓ 저장
메모리 파일: /memories/project_context.xml
		 /memories/user_preferences.xml
		 /memories/opponent_strategies.xml ← 파일로 관리

Anthropic은 이번 발표에서 "75분 동안 수천 개의 이벤트가 발생해도"
- 컨텍스트 윈도우는 Context Editing으로 최신 정보만 유지
- 중요한 전략 정보는 메모리 파일에 영구 저장
- 다음 게임에서도 이 정보를 불러와서 사용 가능

https://lnkd.in/geGN2Gqc

2. Context Editing (컨텍스트 편집)
- **자동 정리**: 토큰 한계에 도달하면 오래된 도구 호출 및 결과를 컨텍스트 윈도우에서 자동 제거
- **지능적 관리**: 관련성이 낮은 정보를 선별적으로 제거
- **예시**: 75분간의 Catan 게임에서 수천 개의 이벤트 처리 후에도 컨텍스트가 깨끗하고 집중적으로 유지
https://lnkd.in/g6Habmvt

영상에서 이해하면 좋습니다.
https://lnkd.in/gsuReZhY

2. Claude Code 2.0
/rewind 체크 포인트 시스템. 그동안 Claude Code 에서는 되돌리는 기능이 없어서 불편했는데 추가
/usage 주간 사용량 추적.. 그런데 사용 리밋이 많이 줄어든 것 같다는 느낌을 받았습니다. 숨이 턱 막히더라고요

native VS code extention: 그냥 더 이뻐졌습니다. pass
https://lnkd.in/g58JPYgU

3. Claude Agent SDK: Claude code의 성능과 안정성을 그대로 커스텀 에이전트로 변경
- 금융 에이전트 (Finance agents)
- 개인 비서 에이전트 (Personal assistant agents)
- 고객 지원 에이전트 (Customer support agents)
- 심층 연구 에이전트 (Deep research agents)
- 사이버 보안 및 컴플라이언스 에이전트

다양한 Agent 를 쉽게 만들 수 있는 기능인데요. Claude Code SDK 에서 진화(?)했습니다. 개인적으로 Claude Code 를 다른 도메인의 에이전트로 사용할 때 자주 사용하던 기능인데 업데이트돼서 기쁘네요! 다른 것들보다 이걸 정말 정말 추천드립니다. 프롬프트와 MCP 만 세팅하면 성능과 안정성을 모두 잡은 에이전트를 10분 안에 배포할 수 있어요. 

4. Imagine
"중간 단계를 제거한 소프트웨어 구축" - 코드를 작성하는 대신 Claude가 소프트웨어를 직접 생성합니다. 클릭할 때마다 인터페이스의 새 부분을 즉시 생성해요. 이건 말로 하는 것보다 직접 써보시는 걸 추천드립니다.
https://lnkd.in/gSUbme8V

5. Claude for Chrome
Dia, Comet 처럼 브라우저와 인터랙션하는 기능인데요. 아직 max 구독자 중에서도 일부에게만 풀려서 저도 아직 못 써봤습니다. 하지만 비슷한 서비스를 써봤을 때 레이턴시가 느릴 때 제일 불편하더라고요. Claude 모델은 똑똑한데 느려서 솔직히 답답할 것 같긴합니다.

Claude 4부터 OSworld computer use 벤치마크를 같이 제공하는데요. computer use 라는 개념을 처음 제시했고, MCP 도 만든 Anthropic 이다보니 이쪽으로 자부심이 있는 것 같습니다.

https://lnkd.in/gKhXhQi8
기능 사용 신청은 여기에서 할 수 있습니다: https://lnkd.in/gQjCxiwk
