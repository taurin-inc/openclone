---
topic: "AI 코딩 툴(Claude Code, Codex) 활용을 위한 베스트 프랙티스 분석"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code-codex-%EA%B0%99%EC%9D%80-%ED%88%B4%EC%9D%80-%EC%9D%98%EC%8B%9D%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%82%AC%EC%9A%A9%EB%B2%95%EC%9D%84-%EC%9D%B5%ED%98%80%EC%95%BC-activity-7411152720650227712-A1i3?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-12-28
---
Claude Code, Codex 같은 툴은 "의식적으로" 사용법을 익혀야 합니다. 잘 쓰는 사람과 못 쓰는 사람의 격차가 점점 벌어지고 있습니다.

올해를 돌아보며, OpenAI와 Anthropic이 내부 활용 사례로 만든 공식 문서를 다시 찾아봤습니다.
둘 다 몇 달 된 문서라 outdated 된 내용이 있지만, official 문서는 클래식이죠.

"How OpenAI uses Codex" (12p) https://lnkd.in/gUTKxxcH
- 7개 use case: 코드 이해, 리팩토링, 성능 최적화, 테스트, 개발 속도, 몰입 유지, 탐색
- 핵심: "1시간 분량, 수백 줄 코드" 정도의 well-scoped task에 최적화
- 팁: Ask Mode로 계획 → Code Mode로 구현

"How Anthropic teams use Claude Code" (22p) https://lnkd.in/gxt_8i6Y
- 10개 팀 사례: 개발팀뿐 아니라 마케팅, 디자인, 법무팀까지
- 핵심: 비개발자도 "나도 개발자가 됐다" 경험

두 문서의 공통점

1. 코드 이해가 1순위
낯선 코드베이스 탐색, 온보딩, 인시던트 대응에서 가장 큰 효과
2. 문서화 파일이 핵심
AGENTS.md, Claude.md "문서화를 잘 해놓을수록 성능이 좋다"
3. Plan → Code 워크플로우
바로 코드 짜달라고 하지 말고, 먼저 계획을 세우게 하라
4. 자주 커밋, 롤백 준비
"슬롯머신처럼 써라. 안 되면 리셋하고 다시 시작"
5. 백그라운드 활용
회의 중에도 에이전트가 작업. 컨텍스트 스위칭 비용 감소

이제 AI를 잘 쓰려면 "어떻게 쓰는게 Best Practice인지"를 의식적으로 배워야 합니다. 딸깍해서 나오는 시기는 끝났습니다.
