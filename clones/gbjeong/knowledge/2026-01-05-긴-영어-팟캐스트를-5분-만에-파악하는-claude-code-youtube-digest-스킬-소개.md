---
topic: "긴 영어 팟캐스트를 5분 만에 파악하는 Claude Code 'youtube-digest' 스킬 소개"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_84%EB%B6%84%EC%A7%9C%EB%A6%AC-%EC%98%81%EC%96%B4-%ED%8C%9F%EC%BA%90%EC%8A%A4%ED%8A%B8%EB%A5%BC-5%EB%B6%84-%EB%A7%8C%EC%97%90-%ED%95%B5%EC%8B%AC-%ED%8C%8C%EC%95%85%ED%95%98%EA%B3%A0-%ED%80%B4%EC%A6%88%EA%B9%8C%EC%A7%80-%ED%92%80%EA%B3%A0-%EC%A7%81%EC%A0%91-activity-7414055598754848768-c0oy?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-05
---
84분짜리 영어 팟캐스트를 5분 만에 핵심 파악하고, 퀴즈까지 풀고, 직접 볼 가치가 있는지 판단합니다. "youtube-digest" skills 를 저는 너무 애용합니다. 너무 필요해서 직접 만들었습니다.

저는 영어 유튜브 팟캐스트를 좋아합니다. Lex Fridman, a16z, 각종 기술 인터뷰들.
문제는 영상 하나가 1-2시간씩 합니다. 다 보기엔 시간이 없고, 안 보기엔 아까웠습니다. 특히 Fomo 가요.

그래서 Claude Code 스킬을 만들었습니다. URL 하나 던지면 끝입니다.

1. 자막 추출
yt-dlp로 영상의 자막을 가져옵니다.
수동 자막이 있으면 수동 자막을, 없으면 자동 생성 자막을 씁니다.

2. WebSearch: 고유명사 교정
자동 자막의 치명적 약점이 있습니다.
고유명사를 발음대로 잘못 인식합니다.
"Claude Code"가 "cloud code"로, "Cora"가 "Kora"로 나옵니다.

웹 검색으로 영상 맥락을 파악하고, 정확한 표기로 일괄 교정합니다.
이게 없으면 번역 품질이 확 떨어집니다.

3. 요약과 인사이트
핵심 내용을 3-5문장으로 요약합니다.
주요 아이디어, 적용 가능한 점을 정리합니다.

4. 전체 스크립트 한글 번역
타임스탬프와 함께 전체 내용을 번역합니다.
필요한 부분만 골라서 읽을 수 있습니다.

5. AskUserQuestion 3단계 퀴즈
기본, 중급, 심화 총 9문제로 이해도를 테스트합니다. 틀리면 해설까지 나옵니다.
읽기만 하면 까먹는데, 퀴즈까지 하면 머릿속에 잘 남습니다.

6. Deep Research
더 깊이 파고 싶으면 웹 심층 조사까지 연결됩니다.

실제로 어제 이걸로 Boris Cherny 인터뷰를 소화했습니다.
Claude Code 창시자의 84분짜리 영상입니다.
Meta에서 IC8까지 승진한 이야기, Claude Code 탄생 배경, AI 시대 엔지니어링 조언까지. 요약 읽고, 퀴즈 풀고, 관심 가는 부분만 타임스탬프로 찾아봤습니다.

결론은요.
이 영상은 직접 볼 가치가 있다고 판단했습니다. 주말에 시간 내서 전체를 봤습니다.

이게 제가 원하던 워크플로우입니다.
빠르게 훑어보고, 볼 가치를 판단하고, 가치 있으면 시간을 투자한다.
모든 영상을 다 볼 순 없으니까요.

영어 콘텐츠 소화에 같은 고민이 있으셨다면, 한번 써보세요.
Claude Code 플러그인으로 공개해뒀습니다.

https://lnkd.in/gYUeFY9P

+boris cherney interview: https://lnkd.in/gjJW_MYi
