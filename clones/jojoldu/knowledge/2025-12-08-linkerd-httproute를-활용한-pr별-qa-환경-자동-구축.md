---
topic: "Linkerd HTTPRoute를 활용한 PR별 QA 환경 자동 구축"
source_type: social
source_url: "https://www.linkedin.com/posts/jojoldu-%EC%9D%B4%EB%8F%99%EC%9A%B1_argo-cd-linkerd-%EA%B8%B0%EB%B0%98-qa-%EB%B3%91%EB%AA%A9-%EC%A0%9C%EA%B1%B0-pr-preview-activity-7403927513703428096-I7Dc?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGLkNq4BYFfSk8KptVnDLzKe5tkMW5_irGs"
authorship: self
published_at: 2025-12-08
---
단일 서비스를 여러 조직 혹은 여러 사람이 관리할 경우 Pull Request 마다 QA 의 복잡도가 높아집니다.
여러 사람이 본인들의 코드가 반영된 버전의 테스트를 원하기 때문인데요.
그럴때마다 'A 서비스 QA 환경 지금 테스트 해도 되나요?' 를 매번 물어보며 QA를 진행하기도 했습니다.

물론 기능 플래그 (Feature Flag) 를 통해 일부 불편함을 해결할 수도 있고, 
실제로 저희도 기능 플래그 (Feature Flag) 를 적극 사용하곤 했는데요.
그럼에도 아래와 같은 경우는 여전히 불편했습니다.
- 기능이 다양한 영역에 걸쳐 있어서 플래그로 감싸기가 난감한 경우
- 종속 패키지 버전의 업데이트 등 서버 수준의 교체가 필요한 경우

그래서 EKS로 전환이 끝나고 빠르게 Pull Request 마다 QA 환경이 자동으로 구성되는 환경으로 개선을 진행했습니다.

Linkerd HTTPRoute를 활용하여 '쿠키 기반 트래픽 라우팅' 을 적용하여 PR 마다 QA 환경을 자동으로 구축한 과정을 정리해보았습니다 :) 

https://lnkd.in/gXJkHV-m

저희와 같은 불편함을 겪는 분들에게 도움이 되길 바랩니다 :)
