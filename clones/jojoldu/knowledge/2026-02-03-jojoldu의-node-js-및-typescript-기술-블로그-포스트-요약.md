---
topic: "jojoldu의 Node.js 및 TypeScript 기술 블로그 포스트 요약"
source_type: other
source_url: "https://jojoldu.tistory.com/category/JavaScript%20%26%20TypeScript"
authorship: self
published_at: 2026-02-03
---
# Promise Pool로 성능 개선하기 (feat. Promise.all)
**Author:** jojoldu
**Date:** 2023. 5. 5.

Node.js 환경에서는 다수의 비동기 작업을 처리하기에 적합하다. 예를 들어, 다음과 같은 상황이 있다고 가정해보자. ID 별로 조회만 가능한 외부 서비스에서 대량의 건수를 API로 조회해야하는 경우 join, subquery 로 조회시 성능과 DB의 부하가 심하여, id 별로 쿼리를 나눠서 조회해야하는 경우 대량으로 이벤트 메세지를 발행해야하는 경우 등등 다량의 Promise 작업들은 백엔드 애플리케이션 작업에서는 언제든지 발생할 수 있다. 이럴때 Node.js 환경에서는 Promise.all 을 통해 쉽게 해결할 수 있다. 여기서 Promise.all 보다 좀 더 성능을 개선할 수 있는 방법을 보자. 개요 수백개 이상의 Promise 작업들은 보통 한번에 Promise.all을 수행하지 않는다.

---

# no-return-await 는 항상 정답일까
**Author:** jojoldu
**Date:** 2023. 1. 24.

보편적으로 JS/TS 에서는 async 함수를 사용할때 return 만 필요한 경우에는 굳이 await를 명시하지 않았다. 실제로 ESLint 룰 상에서도 이에 대한 규칙을 갖고 있다. no-return-await 하지만 해당 규칙에서도 이 규칙을 적용하면 안되는 예를 소개하는데, 다음과 같다. await thenable 인 값을 나타내기 위해 사용하려는 경우 return await 회피의 성능상의 이점을 원하지 않는 경우 함수를 스택 추적에 표시하려는 경우 (디버깅에 유용함) 마지막의 "함수를 스택 추적에 표시" 가 이번 포스팅의 주제이다. Node.js를 비롯한 백엔드에서는 에러가 발생한다면 해당 에러에 대한 상세한 Trace가 거의 대부분 필요하다. Node.js에서는 await 없이 Promise 객체를 그대..

---

# Promise.all 과 Transactions (feat. Node.js)
**Author:** jojoldu
**Date:** 2022. 2. 28.

최근 팀에서 코드리뷰를 진행하던 중에 promise.all 과 트랜잭션에 대해 오해하고 있는 부분들을 발견하게 되어 정리하게 되었습니다. Promise.all (혹은 allSettled)을 사용하면 트랜잭션 내에서도 비동기로 여러 작업들이 동시에 이루어질 수 있다고 오해하는 것인데요. 실험을 해보면 그게 아니라는 것을 알 수 있습니다. 실제 코드를 가지고 검증해보겠습니다. 모든 실험 결과에 대해서 틀린 내용이 있다면 바로 댓글로 지적해주세요! 모든 지적은 저의 성장에 많은 도움이 되기 때문에 감사한 마음으로 수정하겠습니다 :) 0. 테스트 환경 테스트할 환경은 다음과 같습니다. Node.js 16.3.1 PostgreSQL 13.2 모든 코드는 Github 에 있습니다. 1. Promise.all 먼저 ..

---

# NodeJS 와 PostgreSQL Connection Pool
**Author:** jojoldu
**Date:** 2022. 1. 21.

Database에 관해 기본적인 id/pw 외에 해야할 설정들이 여러개 있는데요. 그 중 실제 서비스 운영에 가장 중요한 설정 중 하나가 이전 글인 쿼리 타임아웃 과 함께 커넥션 풀 (Connection Pool) 설정입니다. 이 커넥션풀 설정이 왜 필요한지, 어떻게 해야할지 등등을 알아보겠습니다. 1. 실험 환경 실험의 경우 아래 환경에서 진행합니다. Node 16 PostgreSQL 14 (by Docker) 간단하게 아래와 같이 Node와 PG를 사용한 코드를 하나 만들어둡니다. 실험을 위해 lint 등을 빼고 빠르게 구성했습니다. app.js const express = require('express'); const pg = require('pg'); const app = express() con..

---

# ts-jenum 으로 응집력 있는 TS 코드 작성하기 (feat. EnumClass)
**Author:** jojoldu
**Date:** 2021. 12. 14.

TypeScript의 Enum은 딱 열거형으로서만 사용할 수 있습니다. 다른 언어에서 Enum을 Static 객체로 사용해본 경험이 있는 분들이라면 이 지점이 굉장히 답답하다는 것을 느낄 수 있는데요. Enum을 객체로 활용하면 어떤 큰 장점을 얻게되는지는 배민 기술 블로그 를 참고해보시면 좋습니다. 저와 똑같이 답답함을 느끼신 분이 계시는지, 이미 TypeScript도 Java의 Enum과 같이 Static 객체로 Enum을 다룰 수 있도록 ts-jenum 을 만들어주셨습니다. 이번 시간에는 ts-jenum 을 이용해 응집력 있는 Enum 활용법을 소개드리겠습니다. 1. 설치 ts-jenum 은 Java의 java.lang.Enum 과 같은 사용성을 얻기 위해 제공하는 라이브러리입니다. 별도의 데코레이..

---

# Mustache.js 로 이메일 템플릿 구성하기 (TypeScript)
**Author:** jojoldu
**Date:** 2021. 11. 29.

이메일 기능 구현을 위해서 많은 고민을 하는 부분이 이메일 본문을 위한 템플릿 구성입니다. AWS SES 등 이메일 발송 자체는 이제 예전처럼 SMTP 서버 구축 등을 할 필요가 없어서 훨씬 난이도가 줄었습니다. 일반적으로 이메일의 본문은 HTML + Inner CSS로된 마크업코드를 작성합니다. 이메일 안에서는 CSS나 JS 파일 로드가 안되기 때문에 HTML 코드만으로 해결이 되어야 하는데요. 위에서 언급한 HTML 코드를 단순 문자열로만 진행할 경우 다음의 문제점들이 있습니다. html 코드에서 오타가 발생하는걸 찾을수가 없다. html 코드가 결국 문자열이기 때문에 태그가 1개 부족해도, 혹은 attribute 가 오타가 나도 IDE에선 전혀 감지할수가 없다. 렌더링 해야할 코드가 늘어나면 늘어날..
