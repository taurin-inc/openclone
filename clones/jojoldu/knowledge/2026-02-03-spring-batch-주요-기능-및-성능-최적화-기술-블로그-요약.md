---
topic: "Spring Batch 주요 기능 및 성능 최적화 기술 블로그 요약"
source_type: other
source_url: "https://jojoldu.tistory.com/category/Spring%20Batch"
authorship: self
published_at: 2026-02-03
---
# Spring Batch

**Author:** jojoldu (기억보단 기록을)

---

### Spring Batch JpaCursorItemReader 도입되다.
**Publish Date:** 2021. 1. 25.

Spring Batch 4.3이 릴리즈 되면서 JpaCursorItemReader 가 도입되었습니다. (Spring Batch 4.3 release notes) 그 전 버전까지 (~4.2.x)는 JpaCursorItemReader가 없었음을 의미하는데요. HibernateCursorItemReader는 존재하는데, 왜 JpaCursorItemReader는 여태 없었던 것이지? 라고 의문이 들 수 있습니다. 이는 JPA 스펙 때문인데, JPA 2.1 전까지는 데이터 스트리밍이 가능한 스펙이 별도로 없었습니다. 그래서 Hibernate의 상태 비저장 세션 (StatelessSession)과 유사한 개념이 JPA에는 없어서 Cursor 기능을 구현할 수 없었습니다.

---

### Spring Batch 파티셔닝 (Partitioning) 활용하기
**Publish Date:** 2021. 1. 20.

지난 시간에 소개 드린 멀티쓰레드 Step과 더불어 파티셔닝 (Partitioning)은 Spring Batch의 대표적인 Scalling 기능입니다. 서비스에 적재된 데이터가 적을 경우에는 Spring Batch의 기본 기능들만 사용해도 큰 문제가 없으나, 일정 규모 이상이 되면 (ex: 매일 수백만 row가 추가되는 상황에서의 일일 집계) 서버를 Scalling (Up or Out) 하듯이 배치 애플리케이션 역시 확장이 필요합니다. 이런 문제를 고려해서 Spring Batch 에서는 여러 Scalling 기능들을 지원하는데요. 대표적으로 Multi-threaded Step (Single process / Local) 등이 있습니다. 단일 Step을 수행할 때, 해당 Step 내의 각 Chunk를 별도의 쓰레드에서 처리하는 방식입니다.

---

### Spring Batch에서 socket was closed by server 발생시
**Publish Date:** 2020. 9. 29.

시스템 이관을 진행하면서 각종 설정들이 기존 설정들과 달라 운영 테스트에서 여러 이슈를 만나게 되는데요. 최근 Spring Batch 환경 이관에서 기존 Job 들을 테스트 하던 중 다음과 같은 이슈를 만나게 되었습니다. 
`Caused by: java.io.EOFException: unexpected end of stream, read 0 bytes from 4 (socket was closed by server)`
기존에 잘 작동하던 Batch Job에서 왜 이런 문제가 발생하는지, 어떻게 하면 해결할 수 있는지 확인해보겠습니다. 1. 테스트 환경 상황 재현에 사용된 환경은 다음과 같습니다. Java 8, Spring Boot Data & Batch 2.3.2, Spring Batch 4.2.4, HikariCP...

---

### ListItemReader 성능상 주의사항
**Publish Date:** 2020. 9. 21.

Spring Batch를 사용하다보면 종종 ListItemReader 가 필요한 경우가 종종 있습니다. 물론 일반적으로는 ListItemReader를 사용하기 보다는 FlatFileItemReader, JdbcItemReader, MongoItemReader 등 Spring Batch에서 공식적으로 지원하는 ItemReader나 Custom ItemReader등을 만들어 사용하는 것을 추천합니다. 다만, 현재 Spring Batch의 ListItemReader에서는 성능 이슈가 하나 있는데요. 이번 시간에는 해당 성능 이슈가 무엇인지, 어떻게 해결할 수 있는지 간단하게 소개 드리겠습니다.

---

### Spring Batch ItemWriter 성능 비교
**Publish Date:** 2020. 7. 8.

대규모 데이터를 처리하는 Spring Batch 에서 배치 성능은 중요한 요소입니다. 배치 성능에 있어서 튜닝 요소는 크게 2가지로 정리 될 수 있습니다. 1) Reader를 통한 데이터 조회 2) Writer를 통한 데이터 등록/수정. Reader의 경우엔 Select Query 튜닝을 통한 개선 이야기가 많이 공유되어있습니다. Querydsl을 통한 Paging, No Offset 조회 방법은 이전 포스팅을 참고하시면 됩니다. 반면 Writer의 경우에는 Reader에 비해서는 공유된 내용이 많지 않습니다. 그래서 이번 시간에는 Spring Batch와 JPA를 사용하는 경우에 어떻게 개선할 수 있을지 실제 비교를 해가며 정리하였습니다.

---

### Spring Batch ItemReader에서 Reader DB 사용하기 (feat. AWS Aurora)
**Publish Date:** 2020. 6. 15.

일반적으로 서비스가 커지게 되면 DB를 여러대로 늘리게 됩니다. 이때 가장 첫 번째로 고려하는 방법이 Replication 입니다. 즉, 1대의 마스터 DB와 여러대의 Slave DB를 두는 것이죠. 데이터의 변경은 모두 마스터 DB에서만 이루어지고, SlaveDB들은 이 변경사항을 실시간으로 수신 받고, 성능 이슈가 심한 조회 요청에 대해서 처리합니다. 이번 글에서는 이렇게 Replication 상태에서 Spring Batch의 ItemReader가 Slave DB(Reader DB)를 사용하도록 설정하는 방법을 알아보겠습니다.
