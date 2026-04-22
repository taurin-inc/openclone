---
topic: "이호연님의 Universal content subscriber: 모든 웹사이트를 구독하는 혁신적 방법"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EC%9D%B4%ED%98%B8%EC%97%B0%EB%8B%98%EC%9D%80-%EC%9D%B4%EC%83%81%ED%95%9C-%EC%82%AC%EB%9E%8C%EC%9E%85%EB%8B%88%EB%8B%A4-%EC%A0%9C-%EC%BB%A8%ED%85%90%EC%B8%A0-%EB%B0%9C%EA%B5%B4-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98%EC%9D%84-%ED%95%B4%ED%82%B9%ED%95%B4%EC%84%9C-%EC%84%9C%EB%B9%84%EC%8A%A4%EB%A5%BC-activity-7408649981424828416-NWTV?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-12-21
---
이호연님은 이상한 사람입니다. 제 컨텐츠 발굴 알고리즘을 해킹해서 서비스를 만들고 있어요. 제가 매일 아침 확인하는 곳 입니다. HoYeon Lee

x.com 에서 OpenAI, Anthropic, Deepmind 랩의 주요 스피커 트윗을 받을 수 있게 세팅해뒀습니다. Cursor까지 봅니다
Anthropic youtube: https://lnkd.in/g8tb4e5x
Anthropic engineering blog: https://lnkd.in/g-ytnSwW
AI Engineer youtube 딱 실용적인 영상이 많아서 와장창 올라올 때 대부분 보고, 걸으면서 듣고 합니다. https://lnkd.in/gKdefGmN
sudoremove youtube 로봇은 이것만 봅니다. 저한테는 속도가 아주 충분해요: https://lnkd.in/gKs48Vfv
드와케시 팟캐스트는 너무 길기 때문에 대부분 그 자리에서 못 보고 요약을 읽은 다음 찬찬히 봅니다. 드와케시가 직접 편집한 클립 채널은 다 보는 편이고요: https://lnkd.in/gSqDsZv5
노정석님 유튜브는 일부러 보는게 아니라 그냥 제일 위에 뜹니다 ㅎㅎ.. https://lnkd.in/gshkWFqH
Demis Hassabis 가 미디어에 나오면 몰아서 나오는 편인데 지금 엄청 많이 나옵니다. 데미스는 검색해서 봅니다. https://lnkd.in/gPNxZt4b
every.to 라는 회사도 흥미롭게 팔로업하고 있습니다. https://lnkd.in/gGp_yfbg
pragmatic engineer: https://lnkd.in/gqvv7Tvh
ycombinator: https://lnkd.in/gXtgVMu7

"볼 때마다 혹시 놓친 거 없나?" 불안한데요. 옆에서 호연님이 "봉님, 그거 왜 매번 직접 다 돌아다녀요?"라고 물으시더니 Universal content subscriber를 만들고 있어요.

RSS 없이도 모든 웹사이트를 구독하는 서비스.
핵심은 4단계 폴백 전략입니다.
1. Static + Selector → 가장 빠른 방식으로 시도
2. Dynamic + Selector → 안 되면 Playwright
3. Dynamic + Structural → 클래스를 포기하고 위치 기반
4. Dynamic + URL-based → 그래도 안 되면 공통 부모 추적  

웹사이트가 어떻게 생겼든 상관없습니다. 클래스명이 매번 바뀌어도요. 결국 찾아냅니다.

그리고 매시간 자동으로 돌면서 AI가 요약하고 일일 다이제스트까지 만들어줍니다. "읽어야 할 것"이 아니라 "이미 정리된 것"을 받아보는 거죠. 대부분의 RSS 리더가 사실상 무용지물이에요. 구독하고 싶은 사이트는 RSS가 없고 RSS 있는 사이트는 별로 안 궁금하고. 호연님은 이 문제를 정면돌파했습니다.

아직 내부에서만 쓰고 있는데 솔직히 저는 중독됐습니다. 매일 아침 10개 사이트 순회하던 시간이 다이제스트 한 번 읽는 것으로 바뀌었거든요.
