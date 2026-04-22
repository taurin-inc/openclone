---
topic: "AWS Advanced JDBC Wrapper 오류 추적 및 해결 과정 공유"
source_type: social
source_url: "https://www.linkedin.com/posts/jojoldu-%EC%9D%B4%EB%8F%99%EC%9A%B1_jdbc-setreadonly-%ED%98%B8%EC%B6%9C-%EC%9D%B4%EC%8A%88-%ED%95%B4%EA%B2%B0%EA%B8%B0-activity-7256471348238024704-RJse?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGNs6OQB4TjQGTp2gDwgCG4TiR5gXKbIO-w"
authorship: self
published_at: 2024-10-28
---
https://lnkd.in/gAFZ6UpJ

저희팀의 일부 중요 서비스에서는 JVM (Java/Kotlin/Spring) 을 사용하고 있습니다.
이번에 AWS Advanced JDBC Wrapper 드라이버를 사용하면서 간혈적으로 터지는 오류를 하나하나 추적해나가는 과정을 기술 블로그로 정리하였습니다 :) 
JVM 경력이 거의 없는 Node.js 개발자들끼리 IntelliJ IDEA와 네이버 핀포인트 모니터링 도구를 통해 차근차근 드라이버 문제에 접근하고 해결을 진행하였는데요.

비슷한 환경에 계신 분들에게, 
좋은 디버그 도구를 활용하는 방법이 궁금하신 분들에게 도움이 되시길 바랩니다 :)
