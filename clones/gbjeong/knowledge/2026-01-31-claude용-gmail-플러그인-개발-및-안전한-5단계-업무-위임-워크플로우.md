---
topic: "Claude용 Gmail 플러그인 개발 및 안전한 5단계 업무 위임 워크플로우"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_gmail-%EC%8A%A4%ED%82%AC%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EC%84%9C-plugins-for-claude-natives%EC%97%90-activity-7423492787066707968-WBZQ?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-31
---
Gmail 스킬을 만들어서 plugins-for-claude-natives에 플러그인으로 배포했습니다. 만들고/사용하면서 깨달은 것: "테스트해도 안전한 환경"을 구축하기 위해 5단계 워크플로우를 설계가 필요했습니다.

메일을 보내달라고 했을 때 Claude가 바로 보내버리는건 무섭더라구요. 받는 사람 이름 틀리거나, 맥락 파악을 잘못하거나, 포맷이 이상할 수 있잖아요. 그래서 5단계 워크플로우를 설계했습니다.

1. 요구사항 맥락 파악
Explore SubAgents 병렬로 실행합니다. 로컬에서 수신자 정보, 관련 프로젝트, 배경 맥락을 동시에 탐색해요. 이게 생각보다 중요합니다. "박대리한테 메일 보내줘"라고 했을 때, 박대리가 누군지, 최근에 무슨 일이 있었는지 파악해야 제대로 된 메일이 나오거든요.

2. 이전 대화 맥락 파악
"to:박대리 OR from:박대리 newer_than:90d"로 검색합니다. 이전에 주고받은 메일이 있으면 답장할지 새 메일을 쓸지 물어봐요.

3. 드래프트 작성
초안을 쓰고 사용자에게 보여줍니다. 여기서 Human in the loop가 들어갑니다. "이대로 괜찮아요?" 확인받고 넘어가요.

4. 테스트 발송
이게 핵심입니다. 실제 수신자한테 보내기 전에 나한테 먼저 보냅니다. 제목 앞에 "[테스트]"를 붙여서요. Gmail 웹에서 열어보고 확인합니다. Claude 가 정확히 보낸 메일함을 열어서 GUI를 확인시켜줍니다.

5. 실제 발송
테스트 통과하면 그제서야 진짜 보냅니다. 하지만 "Sent with Claude Code" signature를 붙여놓았어요.

*설정은 setup-guide.md 참고하세요. Google Cloud에서 OAuth 설정하고, accounts.yaml에 계정 등록하면 됩니다.

*지금 구현한 건 mock에 가깝습니다. 테스트 발송이 "완전한 샌드박스"는 아니에요. 실제 메일이 나가긴 하거든요. 더 나은 방법을 찾고 싶습니다. 미리보기 전용 환경이나, 발송 취소 가능 시간을 두는 방식이요.

AI에게 업무를 위임할 때, 실수해도 복구 가능한 환경을 먼저 만드는 게 정말 필요합니다. 메일뿐 아니라 Slack 메시지, 캘린더 일정, 문서 수정 다 마찬가지입니다. 개발할 때 일반적으로 사용하는 개념을 비개발 업무에도 적용해야 합니다.

gmail skills: https://lnkd.in/gdcEYasN
