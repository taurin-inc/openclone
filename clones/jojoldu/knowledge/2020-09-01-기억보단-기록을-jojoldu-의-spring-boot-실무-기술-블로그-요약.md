---
topic: "기억보단 기록을 (jojoldu)의 Spring Boot 실무 기술 블로그 요약"
source_type: other
source_url: "https://jojoldu.tistory.com/category/Spring"
authorship: self
published_at: 2020-09-01
---
# Spring _44_

**Author:** 기억보단 기록을 (jojoldu)

---

### Spring Boot에서 yyyy-MM 포맷으로 날짜 받고싶을때
**Publish Date:** 2020. 10. 2.

Spring Boot에서 Request 항목으로 년월 (2020-09, 202009 등)만 필요할때가 종종 있습니다. 2020-09-01과 같은 일자의 경우 Request Dto로 LocalDate를 사용할 수 있었는데요. Spring Boot 환경에서의 LocalDate, LocalDateTime에 대한 상세한 내용은 이전에 작성된 SpringBoot에서 날짜 타입 JSON 변환에 대한 오해 풀기을 참고해보시면 좋습니다. 년/월만 있을 경우 LocalDate로 처리할 수가 없습니다. 그래서 아래와 같이 문자열로 받고, LocalDate로 치환한 뒤에 다시 월 연산을 시작하곤 하는데요. @ToString @Getter @NoArgsConstructor public class YearMonthRequest..

---

### Spring Boot에서 AWS 파라미터 스토어로 private 설정값 사용하기
**Publish Date:** 2020. 7. 14.

이를 테면 DB의 접속정보나 암호화에 사용될 Salt Key 등은 프로젝트 코드 내부에서 관리하기엔 위험이 따릅니다. 누구나 볼 수 있기 때문이죠. 이건 사내 private 저장소를 사용해도 비슷합니다. 사내의 누구나 이 설정값을 확인할 수 있다면 위험하다고 보안 감사에서 지적 받을 수 있습니다. 그래서 실제 운영 환경에서는 이런 주요 설정들은 프로젝트 코드 밖에서 관리되는데요. 가장 흔한 방법은 서버에 직접 파일을 저장해서 사용하는 것입니다. 하지만 최근처럼 클라우드 환경이 대세인 상황에서는 동적으로 서버가 추가/삭제가 되는 상황에서는 서버에서 직접 파일 관리하기에는 어려움이 많습니다. 그래서 이에 대해서 외부에서 설정 정보를 관리하고, 애플리케이션에서는 해당 설정정보를 받아서 쓰는 방식이 선호되고 있..

---

### Get 요청시 LocalDate 필드에 2월 31일 올 경우 정상 처리 방법 (feat. @DateTimeFormat 제거하기)
**Publish Date:** 2020. 5. 25.

Spring Boot로 LocalDate를 Request Parameter로 받을 경우 예상치 못한 이슈가 발생합니다. 이번 시간에는 여러 이슈 중 하나인 초과된 날짜에 대해 LocalDate로 받으면 400에러가 발생하는 경우를 어떻게 안전하게 해결할지에 대해서 이야기해보겠습니다. 모든 코드는 Github에 있습니다. 문제 상황 예를 들어 다음과 같은 상황이 있다고 가정해봅시다. 날짜를 파라미터로 하는 API를 제공하고, 다른 팀에서 해당 API를 사용한다고 가정해봅시다. 해당 파라미터는 문자열이 아닌 LocalDate를 필드값으로 선언해서 사용합니다. 그럼 사용하는 팀에선 아래와 같은 투정(?)을 할 수 있습니다. "아니 LocalDate에 2020-02-31을 넣으면 2020년 2월 29일로 잘 반..

---

### Dto 클래스에서 MultiValueMap로 쉽게 타입 변환하기
**Publish Date:** 2020. 2. 23.

모든 코드는 Github에 있습니다 1. 문제 상황 RestTemplate의 exchange 메소드를 이용해 HTTP.GET 호출을 할때면 매번 불편한게 있습니다. 바로 Query string 처리인데요. Request Body로 데이터를 전달하는 HTTP.POST의 경우에는 아래와 같이 간단하게 Dto 인스턴스 그대로 데이터를 전달할 수 있습니다. XssRequestDto2 requestBody = new XssRequestDto2("content", expected); HttpEntity entity = new HttpEntity(requestBody, headers); // Dto 인스턴스를 그대로 HttpEntity 생성자로 주입 (Request Body로 등록된다) ResponseEntity r..

---

### Spring Boot에서 JSON API에 XSS Filter 적용하기
**Publish Date:** 2019. 12. 29.

일반적인 웹 애플리케이션에서 기본적으로 해야할 보안으로 XSS 방지가 있습니다. 기존에 많이들 알고 계시는 lucy filter의 단점은 이미 오명운 님께서 잘 정리해주셨기 때문에 한번쯤 읽어 보셔도 좋을것 같습니다. homoefficio.github.io - Spring에서 JSON에 XSS 방지 처리 하기 요약하자면, lucy 필터는 form data 전송 방식엔 유효하지만, @RequestBody로 전달되는 JSON 요청은 처리해주지 않는다 정말 친절하게 설명해주셨기 때문에 꼭 읽어보시길 추천드립니다. 다만 WebMvcConfigurerAdapter 가 스프링 부트 버전이 올라가면서 Deprecated가 되었습니다.그래서 다른 방법으로 해결해보겠습니다. 이 방식은 오명운님께서 작성해주신 방법을 응용..

---

### @Request Body에서는 Setter가 필요없다?
**Publish Date:** 2019. 2. 26.

회사에서 근무하던중 새로오신 신입 개발자분이 저에게 하나의 질문을 했습니다. POST 요청시에 Setter가 필요없는것 같다고. 여태 제가 알던것과는 달라서 어떻게 된 일인지 궁금했습니다. 정말 POST 요청시에는 Setter가 필요없을까요? 그럼 GET 요청시에는 Setter가 필요할까요? 한번 확인해보겠습니다. 모든 코드는 Github에 있으니 참고하세요 1. Post 요청 테스트 첫번째로 POST 요청시 Setter가 필요없는지 먼저 테스트해봅니다. 테스트해볼 RequestDto는 아래와 같습니다. @Getter @ToString @NoArgsConstructor public class RequestSetterDto { private String name; private Long amount; @D..
