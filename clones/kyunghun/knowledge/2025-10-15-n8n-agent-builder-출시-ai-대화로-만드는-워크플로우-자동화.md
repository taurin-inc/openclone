---
topic: "n8n Agent Builder 출시: AI 대화로 만드는 워크플로우 자동화"
source_type: social
source_url: "https://www.linkedin.com/posts/leekh929_n8n-agent-builder-%EB%B0%9C%ED%91%9C-ai%EA%B0%80-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0%EB%A5%BC-%EB%A7%8C%EB%93%AD%EB%8B%88%EB%8B%A4-%EB%98%90-activity-7384132072493400064-IEY2?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGMNrtwBpXfYKm2n2FZHqWv7GeTF_SMtUQY"
authorship: self
published_at: 2025-10-15
---
n8n Agent Builder 발표: AI가 워크플로우를 만듭니다

또 새로운 발표가 있었습니다. 어제 n8n이 Agent Builder를 공개했습니다.

OpenAI Agent Builder와 Google Opal에 이어, 이번엔 워크플로우 자동화의 강자 n8n이 움직였습니다. 그리고 직접 써보니, Lovable이나 Cursor로 코딩하는 그 느낌입니다. 에러 나고, 고치고, 에러 나고, 고치고... 그래도 결국 완성됩니다.

이전에도 n8n의 워크플로우를 작성할때 ChatGPT에게 부탁해서 JSON 형태로 추출한뒤 삽입하곤 했습니다. 하지만 이때의 단점은 크리덴셜 정보나 파라미터, 프롬프트 등은 잘 입력이 안되어서 일일이 넣어주어야 되었습니다.

하지만 이번 업데이트로 가능해졌습니다.

1. 실제 사용기: 11번의 에러

요청한 태스크:
"매일 오전 5시에 AI Agent 관련 기사 찾아서 요약해서 내 이메일로로 보내줘"

(1) 에러 1: 메모리 초과
Workflow did not finish, possible out-of-memory issue

AI의 해결:
- HTML 페이지 전체를 크롤링하려다 메모리 초과
- 가벼운 RSS 피드로 전환
- HTTP Request Tool에 타임아웃 보호 추가
- Agent에게 "딱 한 번만 요청하라"고 명시

저는 그냥 "에러 났어"라고만 했는데, AI가 알아서 원인 파악하고 해결책 제시했습니다.

(2) 에러 2: JSON 파싱 에러
HTTP Request Tool received XML but expected JSON

AI의 해결:
- RSS 피드는 XML인데 JSON으로 파싱하려다 실패
- HTTP Request Tool 설정을 text/XML 수용하도록 변경
- 자동 완료

(3) 에러 3: Gmail이 작동 안 함
워크플로우는 성공했다고 나오는데 이메일이 안 왔습니다. 확인해보니 Gmail Tool을 아예 사용하지 않았습니다.

AI의 해결:
- Agent 프롬프트를 단계별로 재구성
- "STEP 4: Gmail Tool 사용 필수"로 강조
- recipientEmail 파라미터 명시적 설정
- Workflow Configuration에 이메일 주소 직접 설정
- 프롬프트에 이메일 주소 하드코딩

결국, 간단한 워크플로우이기는 하지만 총 12번의 요청이 필요했습니다.

2. 장단점

(1) 장점: 정말 편하기는 합니다.

- 노드를 전혀 건드리지 않았습니다. Schedule, HTTP Request, Gmail 같은 노드를 직접 설정할 필요 없습니다. AI가 다 해줍니다.
- 파라미터도 알아서 해줍니다. XML/JSON 설정, 타임아웃 등, 제가 몰라도 됩니다. 에러 나면 AI가 고쳐줍니다.
- Lovable/Cursor 느낌입니다. ”이거 고쳐줘" → 고쳐줌 → "이것도 고쳐줘" → 고쳐줌. 이 반복입니다. 그리고 결국 완성됩니다.
- 강력한 통합이 가능합니다. 400여개의 서비스를 매우 쉽게 연결 가능합니다.

(2) 단점: 아직은 불안정합니다.
- 에러가 많습니다. 간단한 워크플로우인데도 11번의 에러. 매번 "고쳐줘"라고 해야 했습니다.
- 디버깅은 여전히 수동으로 해야됩니다. 완성되었다고 하는데 해보면 안됩니다. 다시 테스트하도록 지시는 해야됩니다.
 - 비쌉니다. Starter 플랜 (월 3만원)의 경우 월 50크레딧을 주는 것 같은데 한개 워크플로우 만드는데 소모되는 크레딧이 다소 높습니다.

결론적으로, 아직은 베타라서 불편합니다. 12번의 대화, 11번의 에러. 간단한 "뉴스 가져와서 이메일 보내기"를 만드는 데도 꽤 걸렸습니다. 하지만 방향은 완벽한 것 같습니다. 개선되면 정말 편할 것 같습니다.

에이전트 시장, 정말 빠르게 움직입니다. 하루하루가 어질어질합니다.
