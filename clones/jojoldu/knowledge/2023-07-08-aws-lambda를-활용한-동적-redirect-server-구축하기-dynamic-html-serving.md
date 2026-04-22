---
topic: "AWS Lambda를 활용한 동적 Redirect Server 구축하기 (Dynamic HTML Serving)"
source_type: other
source_url: "https://jojoldu.tistory.com/724"
authorship: self
published_at: 2023-07-08
---
[본문 바로가기](https://jojoldu.tistory.com/724#content)

DevOps

# AWS Lambda를 활용한 동적 Redirect Server 구축하기 (Dynamic HTML Serving)

by 향로 (기억보단 기록을)2023\. 7. 8.

반응형

기존 프로젝트에서 신규로 페이지를 만들었지만, 해당 페이지의 공유 링크는 기존 프로젝트의 meta tag가 아니라 신규 페이지 전용 meta tag 가 필요할 때가 종종 있다.

카톡방 공유 링크의 미리보기나 여러 크롤러들의 수집등에 유리함을 얻기 위해서는 [Server Side에서 meta tag를 만들어서 HTML을 내려주는 것이 좋다](https://stackoverflow.com/questions/64197301/does-setting-meta-tags-in-javascript-work-without-server-side-rendering).

하지만 아래와 같은 환경이라면 이렇게 Server Side를 동적으로 그려내기가 어려울 수 있다.

- 기존 프로젝트의 레거시로 인해서 동적으로 Server Side에서 meta tag를 수정하기가 어렵거나
- SPA로 구축되어 단일 HTML로만 관리되고 있어 Server Side에서 meta tag 를 수정하기 어렵거나

그래서 **원하는 meta tag를 가진 공유 링크만 담당하는 Redirect 서버** 가 있으면 유용하다.

![intro](https://blog.kakaocdn.net/dna/CsI9g/btsmRnMKKlY/AAAAAAAAAAAAAAAAAAAAAPXkFp3DRt4XGEmTeaaYQjfOGOoKIo4iQc3Vh3XE7Y_t/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=D6DnZOdl45t06jdIVVkHx9mkZI8%3D)

이런 Redirect 서버는 24시간 내내 실행될 필요가 없지만, 많은 트래픽이 들어왔을때 이에 대해 SLA가 보장될 필요가 있다.

그래서 AWS Lambda를 활용하기에 적절하다.

이번 시간에는 **AWS Lambda를 활용하여 동적으로 HTML을 제공** 하는 환경을 구축하고자 한다.

## 해결

AWS Lambda 콘솔로 접속하여 "블루프린트 사용" 을 선택하여, `server` 를 검색해보면 아래와 같이 `server-side rendered web page` 를 찾을 수 있다.

해당 블루프린트를 선택한다.

![1](https://blog.kakaocdn.net/dna/boECHT/btsmRsAiaA7/AAAAAAAAAAAAAAAAAAAAAKMgNDI2f4ju66phTWFB8k6SPGLnI2pAm2FvCwv8H4xA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=5KT7dWIuVu%2FHOqrAk6B7SDAw07Y%3D)

해당 Lambda가 URL을 가질 수 있도록 함수 URL 의 승인 박스를 체크한다.

![2](https://blog.kakaocdn.net/dna/dKlJpK/btsmSuEDF4c/AAAAAAAAAAAAAAAAAAAAAGG0VgjTE3l3I-fkYm5lkG3w7npsJ3TyUo4GRBJFzxLC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=0g%2BZF9nB16%2F67JxSi19ZvFnEz9E%3D)

해당 블루프린트는 node 14 환경이다.

이대로 진행해도 무방하나, node 버전을 업데이트하여 좀 더 최신의 문법을 사용할 수 있도록 한다.

런타임 설정 -\> 편집 으로 이동하여

![3](https://blog.kakaocdn.net/dna/xENcJ/btsmOK3jOr9/AAAAAAAAAAAAAAAAAAAAALbQIpsaHxlQ4IeZ6rCW5PLKoe75MaannzeXYc0UE7z2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=j7%2BNgtg6vugn8S%2F4i43JdaUVo38%3D)

Node 18을 선택한다.

![4](https://blog.kakaocdn.net/dna/lraPF/btsmQpK6lIN/AAAAAAAAAAAAAAAAAAAAANZOpuFlyHqMFHmVsCm6rbH74CrR6QRH7wS738I0c2W-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=zpjkl60ahqzZiwRPJG8AC4s4Jbo%3D)

Server Side Rendering 을 지원하기 위해 기본적으로 `index.html` 과 `index.js` 가 생성되어있다.

ESM을 쓰기 위해 `index.js` 파일의 확장자를 `.mjs`로 교체해준다.

![5](https://blog.kakaocdn.net/dna/VWpx3/btsmRmmM3xx/AAAAAAAAAAAAAAAAAAAAAA-IdgInTa0FhhW-kmxffg5dwHyTHIbAu9ebFpYnOOXt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=zqirbv0iSZXIcCiAsMGP0rqwbrE%3D)

이제 원하는 대로 렌더링 결과물을 내려줄 수 있도록 코드 작업을 진행한다.

### 코드

코드 작업에서는 크게 2가지 요구조건을 달성한다.

- Request Parameter 에 맞춰 meta tag가 Server Side에서 동적으로 생성된다.
- 렌더링된 HTML 페이지 접근시 원하는 다른 페이지로 리다이렉트 한다.
  - 여기서는 `https://inflearn.com?id={id}` 로 리다이렉트 한다.
- 렌더링 되는 페이지에도 파라미터를 전달한다.

실제 로직을 수행할 `.mjs` 파일의 코드는 다음과 같다.

**index.mjs**

```
import fs from "fs";
const html = fs.readFileSync('index.html', { encoding:'utf8' });

export const handler = async (event, context) => {
    console.log(`event: ${JSON.stringify(event)}`);

    const id = event.queryStringParameters?.id;
    const userName = event.queryStringParameters?.name;
    const body = html
                .replace(/{userName}/g, userName || '')
                .replace(/{id}/g, id || '');

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        body,
    };
    return response;
};
```

- `event.queryStringParameters`가 Request Parameter 객체이므로, 여기서 원하는 파라미터값을 가져온다.
- index.html을 가져와서 (`fs.readFile`) 전달받은 파라미터로 내용물을 교체 (`html.replace`) 한다.
- HTML로 응답 (`'Content-Type': 'text/html'`) 을 내려준다.

다음은 실제 서버에서 렌더링될 HTML이다.

**index.html**

```
<!DOCTYPE html>
<html lang='ko'>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta property='og:title' content='{userName} 님을 위한 인프런의 초대'>
    <meta property='og:description' content='{userName} 님을 인프런으로 초대합니다.'>
    <meta property="og:image" content='https://cdn.inflearn.com/public/courses/331266/cover/ac7b8703-f6c3-4ae6-b1e7-2073e458b0d5/331266-1.png' />
    <title>인프런 바로가기</title>
    <script type="text/javascript">
      window.location.replace('https://inflearn.com?id={id}')
    </script>
</head>
</html>
```

- 각종 meta tag들을 `.mjs` 파일과 매칭될 수 있는 변수로 등록한다.

  - `{userName}`, `{id}` 등등
- 원하는 페이지로 리다이렉트 되도록 `script`를 작성한다.

이외에도 필요한 여러가지 로직을 `index.mjs`, `index.html` 등에 추가할 수 있다.

작성이 완료되었다면 "Deploy" 버튼을 클릭하여 배포하고, Lambda 페이지 우측 상단에 있는 "함수 URL" 를 복사하여 필요한 파라미터와 함께 카톡으로 전달해본다.

![6](https://blog.kakaocdn.net/dna/b7ilnc/btsmP6SwD8g/AAAAAAAAAAAAAAAAAAAAAKCTe-7GoLRtub5oQLta-JRwlOKJIR2aNBef1HpPZ9AW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=CCNrCeWwXKbaBAuj%2FfYTnWNAguw%3D)

여기서는 파라미터로 `id` 와 `name` 을 사용하였는데, 이들과 함께 URL을 만들어서 전달해보면, 다음과 같이 각종 메타 태그가 잘 생성된 것을 알 수 있으며

![7](https://blog.kakaocdn.net/dna/bz368S/btsmQpEl7f2/AAAAAAAAAAAAAAAAAAAAAGH0ioQSy0tQpHkb6POl3y4xcm2lmaqNoeW_0Bo1lhHX/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=nGrCu%2Fqz9kpdLf1iNr0QnJ%2FHAPM%3D)

해당 링크 클릭시 원하던 페이지로 리다이렉트까지 되는 것을 확인할 수 있다.

![8](https://blog.kakaocdn.net/dna/4L9GR/btsmQpEl7iJ/AAAAAAAAAAAAAAAAAAAAAIDhmmWuMMpKOT4X4qok6GmxU1g6gxTO5xjZfOtuH_PY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=9yznDSiYgBG8W32ZavC5kKHlSDQ%3D)

### 추가

이렇게 만든 Lambda Redirect 서비스에 Custom Domain을 붙이는 것도 `Route53 + CloudFront`를 활용하면 가능하다.

- [Configuring a custom domain for AWS Lambda Function URLs](https://medium.com/@walid.karray/configuring-a-custom-domain-for-aws-lambda-function-url-with-serverless-framework-c0d78abdc253)

## 마무리

AWS Lamda가 단순히 API의 대체제 역할만 하는 것은 아니다.

관리를 위임한 서버 환경이라고 생각해보면 그동안 애플리케이션 서버가 해주던 많은 역할들을 손쉽고 \+ 신경쓸게 적은 환경을 구축할 수 있다.

반응형

좋아요7

공유하기

URL 복사카카오톡 공유페이스북 공유엑스 공유

게시글 관리

_구독하기_ **기억보단 기록을**

## 태그

[AWS Lambda](https://jojoldu.tistory.com/tag/AWS%20Lambda), [dynamic rendering](https://jojoldu.tistory.com/tag/dynamic%20rendering), [Server Side Rendering](https://jojoldu.tistory.com/tag/Server%20Side%20Rendering), [SSR](https://jojoldu.tistory.com/tag/SSR)

## 관련글

- [![](https://t1.daumcdn.net/tistory_admin/static/images/xBoxReplace_250.png)AWS RDS PostgreSQL에서 Slow, Error, DDL 쿼리 발생시 Slack 발송하기](https://jojoldu.tistory.com/711?category=777282)
- [![](https://t1.daumcdn.net/tistory_admin/static/images/xBoxReplace_250.png)Giscus 댓글, 텔레그램 (Telegram) 으로 알람 받기](https://jojoldu.tistory.com/705?category=777282)
- [![](https://t1.daumcdn.net/tistory_admin/static/images/xBoxReplace_250.png)Utterances 에서 Giscus 로 마이그레이션하기](https://jojoldu.tistory.com/704?category=777282)
- [![](https://t1.daumcdn.net/tistory_admin/static/images/xBoxReplace_250.png)Jira Release 발생시 Slack에 Release Notes 발행하기](https://jojoldu.tistory.com/670?category=777282)

[기억보단 기록을](https://jojoldu.tistory.com/) [**IT 분야 크리에이터**](https://notice.tistory.com/2648) [좋은 애플리케이션 구현 & 설계 / 데이터베이스 / 클라우드 / 스타트업 이야기 등을 이야기합니다.](https://jojoldu.tistory.com/) 구독하기

giscus

#### [반응 0개](https://github.com/jojoldu/blog-comments/discussions/908)

#### [댓글 2개](https://github.com/jojoldu/blog-comments/discussions/908)

_– Powered by [giscus](https://giscus.app/)_

- 오래된 순
- 새로운 순

작성하기미리보기

[마크다운 형식 지원](https://guides.github.com/features/mastering-markdown/ "마크다운 형식 지원")

[GitHub으로 로그인](https://giscus.app/api/oauth/authorize?redirect_uri=https%3A%2F%2Fjojoldu.tistory.com%2F724)

[![@mystyle2006](https://avatars.githubusercontent.com/u/18185890?u=11201c3919f1830abf8accca6f21e14ec87c79bf&v=4)mystyle2006](https://github.com/mystyle2006) [2023년 7월 10일](https://github.com/jojoldu/blog-comments/discussions/908#discussioncomment-6399622)

와~ 제가 전 직장에서 근무할 때 비슷한 상황이 있어 cloud front + lambda 트리거로 처리했던 경험이 있는데 그 당시 이렇게 해도 되나 했던 방식을 여기서 보니 매우 신기하네요!! :)

1

답글 0개

[![@dhksrl997](https://avatars.githubusercontent.com/u/65860735?u=83c563bbc552cdcf4e452f99d6bfcdfa8bb7ad51&v=4)dhksrl997](https://github.com/dhksrl997) [2023년 7월 11일](https://github.com/jojoldu/blog-comments/discussions/908#discussioncomment-6411519)

저도 예전에 람다 사용할 때, 장애가 크게 발생했었는데 찾아보니

람다에 계정별로 동시성 제한이 있던데, 프로비저닝해서 사용하신건가요?

1

답글 0개

* * *

## 티스토리툴바

**기억보단 기록을** _구독하기_

닫기

## 단축키

### 내 블로그

| 내 블로그 \- 관리자 홈 전환 | `Q`<br>`Q` |
| 새 글 쓰기 | `W`<br>`W` |

### 블로그 게시글

| 글 수정 (권한 있는 경우) | `E`<br>`E` |
| 댓글 영역으로 이동 | `C`<br>`C` |

### 모든 영역

| 이 페이지의 URL 복사 | `S`<br>`S` |
| 맨 위로 이동 | `T`<br>`T` |
| 티스토리 홈 이동 | `H`<br>`H` |
| 단축키 안내 | `Shift` \+ `/`<br>`⇧` \+ `/` |

\\* 단축키는 한글/영문 대소문자로 이용 가능하며, 티스토리 기본 도메인에서만 동작합니다.
