---
topic: "1인 개발자 관점에서의 AWS와 Cloudflare DX 비교"
source_type: social
source_url: "https://www.linkedin.com/posts/jojoldu-%EC%9D%B4%EB%8F%99%EC%9A%B1_aws-%EA%B0%80-%EC%A2%80%EB%A7%8C-%EB%8D%94-%EA%B0%9C%EC%9D%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%EC%84%9C%EB%B9%84%EC%8A%A4%EB%82%98-dx%EA%B0%80-%EA%B0%9C%EC%84%A0%EB%90%98%EB%A9%B4-%EC%A2%8B%EA%B2%A0%EB%8B%A8-%EC%83%9D%EA%B0%81%EC%9D%B4-activity-7241463700212121602-NW7L?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGNs6OQB4TjQGTp2gDwgCG4TiR5gXKbIO-w"
authorship: self
published_at: 2024-09-16
---
AWS 가 좀만 더 개인 개발자를 위한 서비스나 DX가 개선되면 좋겠단 생각이 든다.
인증 기능을 가진 정적 사이트를 간단하게 사이드 프로젝트로 구현하려고 하면

- AWS는 S3 + CloudFront + Lambda@Edge 
- Cloudflare는 Workers와 Pages

로 구현 가능하다.

이 2개만 비교해보면 네트워크 제약, 제품 가격, 로컬 개발 환경 구성과 DX, GIthub과의 연동성 등을 고려했을때 "1인 개발" 에서는 Cloudflare 를 거의 선택할 수 밖에 없다.

1인 개발에 있어 중요한 점들이 Cloudflare가 너무 좋다보니 개인적으로 필요한 도구를 만드는게 취미인 개발자들은 자연스레 Cloudflare 로 손이 자주 가게 된다.
그렇게 시간이 날때마다 다루던 Cloudflare가 자연스레 더 편해지고 숙련도가 높아지게 된다. 
종국엔 회사에서 급하게 무언가 해야하는 상황이 닥치면 상대적으로 훨씬 익숙한 Cloudflare를 선택하게 된다.

물론 회사에서 AWS로 모든 것을 해결하고 있다면 AWS 숙련도를 올리는게 맞다.

다만, 취미로 하는 작업과 일로 하는 작업이 연결되었을때의 시너지를 고려한다면 가능하면 비슷한 환경으로 사이드 프로젝트를 구현하는 것이 개인에게도 클라우드사에게도 좋다고 본다.

그런면에서 AWS가 이렇게 국내에서 강세인 상황에서도 Cloudflare 의 저력은 정말 대단한 것 같다.

이미 AWS를 오래 써온 사람들도 
1인 개발, 사이드 프로젝트는 Cloudflare를 사용하게 만드니 말이다.
그리고 그게 AWS에 참 아쉬운 부분이기도 하고 말이다.
