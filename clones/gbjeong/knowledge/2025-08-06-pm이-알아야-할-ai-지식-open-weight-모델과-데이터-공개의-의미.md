---
topic: "PM이 알아야 할 AI 지식: Open-weight 모델과 데이터 공개의 의미"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_pm%EC%9D%B4-%EC%95%8C%EC%95%84%EC%95%BC%ED%95%A0-ai-%EC%A7%80%EC%8B%9D-open-weight-%EB%AA%A8%EB%8D%B8%EC%9D%80-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%EC%95%8C%EB%A0%A4%EC%A3%BC%EC%A7%80-activity-7358856650394386433-YPsv?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQRO6EBVuLBNtunTd3oFxqQ7dKWdLdOoNs"
authorship: self
published_at: 2025-08-06
---
<PM이 알아야할 AI 지식> open weight 모델은 데이터를 알려주지 않는다

1. gpt-oss는 “어디서나 실행하고 어떤 용도에도 맞춤형으로 쓸 수 있는 open-weight 모델”이라고 설명합니다. 두 모델의 가중치는 Apache 2.0 라이선스로 공개되어 상업적 배포나 파인튜닝에도 제약이 없습니다.

2. open-weight란 학습이 끝난 파라미터를 공개하는 방식을 말합니다. 학습 데이터나 전 과정의 로그는 제공하지 않으므로 ‘맨땅에서부터 완전한 재현’은 불가능하지만, 제품에 바로 넣어 돌리거나 추가 데이터로 파인튜닝을 할 수는 있습니다.

3. open-weight는 흔히 오픈소스와 혼동되지만 둘 사이엔 결정적 차이가 있습니다. 오픈소스는 가중치·코드뿐 아니라 학습 데이터, 체크포인트, 로그까지 모두 공개해 누구나 처음부터 재학습하고 정확히 검증할 수 있게 합니다. 반면 open-weight 모델만을 보고는 다시 재현할 수 있는 수준으로 이해하는 건 불가능합니다.

4. paper를 공개했던 곳도 절대 학습데이터가 정확히 어떻게 생겼는지는 안 알려줬다는 것입니다. Deepseek은 reasoning의 비밀을, 최근 Kimi K2도 paper가 정말 좋지만 데이터만은 알려주지 않아요. 어쩌면 데이터야말로 Frontier 모델을 만들기 위한 진짜 시크릿 소스라고 할 수 있습니다.

5. 하지만 이번 openai의 모델카드는 데이터에 대해 꽤나 많은 점을 공개했습니다. 입력한 데이터의 포맷을 생성하는 코드까지 알려줬어요. 그래서 파인튜닝을 매우 디테일하게 할 수 있을 것 같아요. 

6. 사실 제일 기대되는 점은 라이센스입니다. 이번 gpt-oss는 아파치 2.0이라 부담 없이 어떤 종류의 서비스든 출시할 수 있습니다. 그래서 한동안 Qwen 기반으로 파인튜닝한 모델이 많았었는데 gpt-oss를 기반으로 좋은 모델이 많이 나올 것 같아요. 어쩌면 한국 소비자 입장에서는 openai 라는 브랜드 이미지가 좋아서 Qwen(알리바바)보다 선호할 것 같기도 하고요!

7. 써보세요!
- 모델을 써보시려면 openai 에서 직접 올려준 곳에서 써보는게 제일 편리합니다. https://gpt-oss.com/
- 더 자세한 정보는 openai 와 github에서 보시면 좋습니다. 
https://lnkd.in/gkGc9SPg
https://lnkd.in/gE7r34P5
