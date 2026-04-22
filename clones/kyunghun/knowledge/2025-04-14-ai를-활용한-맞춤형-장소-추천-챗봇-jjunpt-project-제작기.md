---
topic: "AI를 활용한 맞춤형 장소 추천 챗봇 'Jjunpt Project' 제작기"
source_type: social
source_url: "https://www.linkedin.com/posts/leekh929_%EA%B8%88%EB%B6%95%EC%96%B4%EA%B0%80-%EB%90%98%EC%A7%80-%EC%95%8A%EA%B8%B0-%EC%9C%84%ED%95%9C-%EC%97%AC%EC%A0%95-2-jjunpt-activity-7317538031249289216-TEvf?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGMohsMBg4UcOWkn6zngc2en4jMpSXc_kVI"
authorship: self
published_at: 2025-04-14
---
"사람이 금붕어보다 1만배 똑똑한데, 곧 AI가 사람보다 1만배 똑똑해지는 시대가 올 것이다."
너무나 큰 울림을 준 손 회장님의 말씀처럼, 금붕어가 되지 않기 위해 부단히 노력하고 있습니다.

첫 시도로 AI를 활용하여 데일리 뉴스레터를 발행하고 있고, 이번에는 챗봇을 만들어보았습니다. 코딩을 못하기에 이전같으면 상상도 못하는 일이지만, 이제는 AI에 대한 접근성이 너무나 좋아졌기 때문에 어렵지 않게 만들수 있었습니다.

- Jjunpt Project - 

1. 주요 기능: 아이 연령, 날씨, 지역에 맞춘 맞춤형 장소 추천, 예) "7세 아이와 서울에서 실내 놀 곳", "비 오는 날 가족 활동" 등

2. 데이터 수집: 인스타그램의 실제 방문 후기에서 양질의 정보를 선별해 Notion DB에 저장

3. 자동화 프로세스
- Notion에 저장된 정보를 GPT로 구조화
- 벡터 임베딩 후 Supabase에 저장
- n8n으로 전체 과정 자동화

4. 기술 스택: n8n + Supabase + GPT + 채널톡
