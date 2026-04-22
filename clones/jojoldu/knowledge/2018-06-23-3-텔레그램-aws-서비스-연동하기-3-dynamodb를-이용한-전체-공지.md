---
topic: "3. 텔레그램 & AWS 서비스 연동하기 - 3) DynamoDB를 이용한 전체 공지"
source_type: other
source_url: "https://jojoldu.tistory.com/308"
authorship: self
published_at: 2018-06-23
---
thoughtful
Extract main article content.
Comments, related posts, ads, sidebar widgets, subscription buttons, share buttons, author bio at the bottom.
Title, main content, author name, publish date.
Markdown.
Preserve original language (Korean).

    *   *Title:* 3. 텔레그램 & AWS 서비스 연동하기 - 3) DynamoDB를 이용한 전체 공지
    *   *Author:* 향로 (기억보단 기록을)
    *   *Date:* 2018. 6. 23.
    *   *Content Sections:*
        - Introduction to Telegram's lack of a built-in mass notification feature.
        - Step 1: ID Registration using DynamoDB (Creation, Partition Key, Schema).
        - Lambda implementation for registration/unsubscription.
        - Code snippets for `/subscribe` and `/unsubscribe`.
        - Full Lambda handler code.
        - IAM Role configuration.
        - Testing registration.
        - Step 2: Notice Lambda (New function creation, scan DynamoDB, sending messages).
        - Code for the notification Lambda.
        - Environment variables and timeout settings.
        - Testing the notification.
        - Step 3: API Gateway integration (Creating POST method, link to Lambda, API Deployment).
        - API Key setup for security.
        - Final test using `curl`.
        - Conclusion.

    *   Structure the Markdown with the title, author/date at the top.
    *   Use correct Markdown formatting for headers (##, ###), code blocks, and lists.
    *   Remove navigation links ("본문 바로가기"), "반응형" placeholders, social share sections, and tag lists.

    *   *Title:* # 3. 텔레그램 & AWS 서비스 연동하기 - 3) DynamoDB를 이용한 전체 공지
    *   *Meta:* **Author:** 향로 (기억보단 기록을) | **Date:** 2018. 6. 23.
    *   *Body:* Ensure all code blocks and image descriptions are kept.

    *   Removed sidebar widgets? Yes.
    *   Removed related posts? Yes.
    *   Kept author/date? Yes.
    *   Markdown format? Yes.
    *   Original language? Yes.# 3. 텔레그램 & AWS 서비스 연동하기 - 3) DynamoDB를 이용한 전체 공지

**Author:** 향로 (기억보단 기록을)
**Date:** 2018. 6. 23.

이번 시간에는 Telegram의 전체 공지 기능을 구현해보겠습니다.

Telegram에는 **전체 공지 기능이 없습니다**.

그래서 챗봇을 쓰는 모든 유저에게 메세지를 전송하기 위해선 **별도의 공간에 채팅방 ID를 저장하고, 이 ID별로 메세지를 전송** 해야만 합니다.

그 과정을 하나씩 소개드리겠습니다.

## 1. ID 등록

저희의 챗봇을 사용하는 사용자들의 채팅방 ID (chat_id)를 저장해야만 합니다.

저장소는 DynamoDB를 선택합니다.

*   복잡한 트랜잭션이 필요하지 않으며
*   JSON 형태로 저장하기 쉽고
*   고성능의 저장소

> AWS의 MongoDB 정도로 보시면 됩니다.

비용은 아래 보시는것처럼 개인이 쓰기에 충분한 양입니다.

![freetier](https://t1.daumcdn.net/cfile/tistory/99F1E3435B2DAB1422)

(참고: [Amazon DynamoDB 프리티어로 시작하기](https://www.slideshare.net/awskorea/amazon-dynamodb-freetier))

### DynamoDB 생성

서비스에서 DynamoDB를 검색해서 이동하신뒤, 테이블 만들기를 클릭합니다.

![dynamo1](https://t1.daumcdn.net/cfile/tistory/999EC73A5B2DAB1328)

아래 이미지대로 항목을 선택/입력 합니다.

![dynamo2](https://t1.daumcdn.net/cfile/tistory/995A9E485B2DAB131A)

*   파티션키는 RDB로 치면 PK로 보시면 됩니다.
*   **번호** 를 선택해야 합니다.
    *   chat_id가 숫자이기 때문에 기본값인 문자열로 할 경우 숫자 -> 문자로 형변환 하는 코드가 추가되어야해서 불편합니다.

생성이 완료 되시면 아래처럼 한번 확인해봅니다.

![dynamo3](https://t1.daumcdn.net/cfile/tistory/99536A435B2DAB131D)

자 chat_id를 저장할 장소가 완성 되었습니다.

이제 이곳에 가입할 수 있는 기능을 추가해보겠습니다.

### 기존 Lambda 기능 추가

이 포스팅에서 Lambda는 크게 2가지 변화가 있습니다.

*   기존에 생성한 챗봇 Lambda에 DynamoDB 저장/삭제 기능 추가
*   DynamoDB에 저장된 모든 chat_id에 일괄 메세지 전송하는 신규 Lambda 추가

첫번째로 기존 Lambda에 DynamoDB 저장/삭제 기능을 추가해보겠습니다.

*   `/subscribe`: 구독 등록 (DynamoDB save)
*   `/unsubscribe`: 구독 취소 (DynamoDB delete)

추가할 코드는 아래와 같습니다.

```js
const TABLE_NAME = process.env.TABLE_NAME;

const AWS = require('aws-sdk'),
    docClient = new AWS.DynamoDB.DocumentClient();

...
    else if(requestText === "/subscribe") {
        const payload = {
            TableName: TABLE_NAME,
            Item: {
                "chat_id": chatId
            }
        };

        docClient.put(payload, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                const postData = {
                    "chat_id": chatId,
                    "text": "등록에 실패했습니다.\n잠시후 다시 시도해주세요."
                };
                sendMessage(context, postData);
                throw err;
            } else {
                const postData = {
                    "chat_id": chatId,
                    "text": "등록되었습니다."
                };
                sendMessage(context, postData);
            }
        });
    } else if(requestText === "/unsubscribe") {
        const payload = {
            TableName: TABLE_NAME,
            Key: {
                "chat_id": chatId
            }
        };

        docClient.delete(payload, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                const postData = {
                    "chat_id": chatId,
                    "text": "등록 해제에 실패했습니다.\n잠시후 다시 시도해주세요."
                };
                sendMessage(context, postData);
                throw err;
            } else {
                const postData = {
                    "chat_id": chatId,
                    "text": "등록 해제 되었습니다."
                };
                sendMessage(context, postData);
            }
        });

    }
```

> AWS Lambda에는 `aws-sdk`가 내장되어 있어, 언제든지 require하여 사용할 수 있습니다.

*   `docClient.put`
    *   DynamoDB에 데이터를 등록합니다.
*   `docClient.delete`
    *   DynamoDB에 데이터를 삭제합니다.

> 아시다시피 NodeJS를 모든 외부 통신이 비동기로 진행됩니다.
>
> 그래서 DynamoDB에 대한 명령 실행후 응답은 콜백 or Promise로 처리해야만 합니다.
>
> 여기선 많은 분들이 이해하실 수 있게 콜백으로 처리합니다.

이 코드를 **기존 Lambda에 추가** 하겠습니다.

```js
const TOKEN = process.env.TOKEN;
const JSON_URL = process.env.JSON_URL;
const TABLE_NAME = process.env.TABLE_NAME;

const https = require('https');
const util = require('util');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const AWS = require('aws-sdk'),
    docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context) => {
    console.log('event: ', JSON.stringify(event));
    const chatId = event.message.chat.id;
    const requestText = event.message.text;

    // /recruits로 오면 db.json 내용 반환
    if(requestText === "/recruits"){
        https.get(JSON_URL, (res) => {
            res.on('data', (d) => {
                const strJson = decoder.write(d);
                const recruits = JSON.parse(strJson).recruits;
                const content = {
                    "chat_id": chatId,
                    "text": toMessage(recruits)
                };
                sendMessage(context, content);
            });
        });
    } else if(requestText === "/subscribe") {
        const payload = {
            TableName: TABLE_NAME,
            Item: {
                "chat_id": chatId
            }
        };

        docClient.put(payload, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                const postData = {
                    "chat_id": chatId,
                    "text": "등록에 실패했습니다.\n잠시후 다시 시도해주세요."
                };
                sendMessage(context, postData);
                throw err;
            } else {
                const postData = {
                    "chat_id": chatId,
                    "text": "등록되었습니다."
                };
                sendMessage(context, postData);
            }
        });
    } else if(requestText === "/unsubscribe") {
        const payload = {
            TableName: TABLE_NAME,
            Key: {
                "chat_id": chatId
            }
        };

        docClient.delete(payload, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                const postData = {
                    "chat_id": chatId,
                    "text": "등록 해제에 실패했습니다.\n잠시후 다시 시도해주세요."
                };
                sendMessage(context, postData);
                throw err;
            } else {
                const postData = {
                    "chat_id": chatId,
                    "text": "등록 해제 되었습니다."
                };
                sendMessage(context, postData);
            }
        });
    } else {
        // 나머지 메세지는 온 그대로 전달
        const content = {
            "chat_id": chatId,
            "text": requestText
        };
        sendMessage(context, content);
    }
};

function toMessage(recruits) {
    return recruits
        .map( (r) => r.team + "("+r.link+")")
        .join("\n");
}

function sendMessage(context, content) {
    const options = {
        method: 'POST',
        hostname: 'api.telegram.org',
        port: 443,
        headers: {"Content-Type": "application/json"},
        path: "/bot" + TOKEN + "/sendMessage"
    };

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
           context.done(null);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(util.format("%j", content));
    req.end();
}
```

코드가 다 추가되셨으면 아래처럼 **환경변수에 테이블명을 추가합니다.**

![save1](https://t1.daumcdn.net/cfile/tistory/993BDC455B2DAB1315)

여기서 잠깐 저장합니다.

현재는 Lambda가 DynamoDB에 접근할 수 없습니다.

권한이 없기 때문인데요.

**Lambda에서 DynamoDB를 사용** 할 수 있도록 권한을 추가하겠습니다.

### IAM Role에 DynamoDB 접근 권한 추가

새 탭을 열어 기존 IAM Role에 DynamoDB 접근 권한을 추가하겠습니다.

아래처럼 기존에 Lambda에서 사용중인 Role을 확인하신후

![role1](https://t1.daumcdn.net/cfile/tistory/99FF44335B2DAB1327)

해당 Role에 DynamoDB 정책도 추가합니다.

![role2](https://t1.daumcdn.net/cfile/tistory/9995E63A5B2DAB1328)

![role3](https://t1.daumcdn.net/cfile/tistory/99161E4A5B2DAB1323)

여기까지 최종 저장하시면 등록/등록취소 기능은 완성됩니다.

### 등록/등록 취소 기능 테스트

Bot 채팅창에 `/subscribe` 을 입력해보시면 응답이 오는걸 확인할 수 있습니다.

![test1](https://t1.daumcdn.net/cfile/tistory/99330D355B2DAB1329)

DynamoDB에도 잘 들어간걸 볼 수 있습니다.

![test2](https://t1.daumcdn.net/cfile/tistory/9901D9385B2DAB131D)

등록/등록 취소가 완료되었으니 전체 공지를 진행해보겠습니다!

## 2. 공지 람다 추가

공지는 새로운 Lambda를 생성하겠습니다.

> 기존에 생성했던 Bot Lambda에서 쓰기엔 노출 위험이 크기 때문입니다.

기존 Lambda와 같은 값으로 설정해서 생성합니다.

![notify1](https://t1.daumcdn.net/cfile/tistory/993114355B2DAB131B)

> 서비스 역할은 기존 Lambda에서 쓰던 Role 그대로 선택합니다.

그럼 아래처럼 DynamoDB 에 접근할 수 있는 Lambda 함수가 생성됩니다.

![notify2](https://t1.daumcdn.net/cfile/tistory/999C4F355B2DAB1315)

그럼 아래로 내려가 함수에 코드를 등록합니다.

```js
const TOKEN = process.env.TOKEN;
const TABLE_NAME = process.env.TABLE_NAME;

const https = require('https');
const util = require('util');
const AWS = require('aws-sdk'),
    docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context) => {
    console.log(JSON.stringify(event));
    const requestText = event.message.text;
    const payload = {
        TableName: TABLE_NAME,
    };

    docClient.scan(payload, (err, data)=> {
        if(err){
            throw err;
        }
        console.log("총 발송인원: "+data.Items.length);
        console.log(JSON.stringify(data.Items));

        data.Items.forEach(subscriber => {
            const postData = {
                "chat_id": subscriber['chat_id'],
                "text": requestText
            };
            sendMessage(context, postData);
        });
    });
};

function sendMessage(context, postData) {
    const options = {
        method: 'POST',
        hostname: 'api.telegram.org',
        port: 443,
        headers: {"Content-Type": "application/json"},
        path: "/bot" + TOKEN + "/sendMessage"
    };

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('[전송성공] '+ content['chat_id']);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(util.format("%j", postData));
    req.end();
}
```

코드는 앞에서 진행했던 코드와 크게 차이나지 않습니다.

*   `docClient.scan`
    *   DynamoDB를 풀스캔 (전체 조회) 합니다.

전체 조회한 결과를 하나씩 `for`를 통해 메세지를 전송합니다.

코드가 다 등록되셨다면 아래의 환경 변수값을 등록합니다.

TOKEN은 Telegram Token을 쓰시면 됩니다.

![notify3](https://t1.daumcdn.net/cfile/tistory/996BE2385B2DAB1325)

환경 변수 아래에는 기본 설정이 있습니다.

여기서 **제한 시간은 5분** 을 지정합니다.

![notify4](https://t1.daumcdn.net/cfile/tistory/999EF2385B2DAB1322)

기본값은 3초이지만, 저장된 전체 chat_id를 조회해서 발송하다보면 제한 시간을 초과할때가 있습니다.

초과하게 되면 발송 도중에 Lambda가 종료되기 때문에 넉넉하게 잡겠습니다.

> 5분이 최대값입니다.

여기까지 되셨으면 한번 테스트를 해보겠습니다.

### 테스트

Lambda 상단 우측의 **테스트 이벤트 구성** 을 클릭합니다.

![notify5](https://t1.daumcdn.net/cfile/tistory/99EBA33B5B2DAB1325)

그리고 아래와 같이 테스트 코드를 생성합니다.

![notify6](https://t1.daumcdn.net/cfile/tistory/9951CC3F5B2DAB122D)

```js
{
  "message": {
    "text": "안녕하세요"
  }
}
```

테스트 코드가 완성이 되셨으면 한번 테스트를 실행해봅니다.

테스트가 실행되시면!

![notify7](https://t1.daumcdn.net/cfile/tistory/99832D435B2DAB131A)

이렇게 Telegram에 바로 테스트 메세지가 전달 됩니다.

Lambda 메인을 보시면 로그도 아주 이쁘게 찍혀있는것을 볼 수 있습니다.

![notify8](https://t1.daumcdn.net/cfile/tistory/992D73365B2DAB1332)

자 이제 공지 Lambda까지 완성되었습니다!

대망의 마지막 API를 진행하겠습니다!

## 3. 전체 공지 API 추가

위에서 만든 Lambda를 URL 주소를 가진 API로 만들어보겠습니다.

### 3-1. API Gateway와 Lambda 연동

AWS의 API Gateway 서비스로 이동한뒤, API 작성 버튼을 클릭합니다.

![api1](https://t1.daumcdn.net/cfile/tistory/9957084A5B2DAB121F)

새로운 API를 생성합니다.

![api2](https://t1.daumcdn.net/cfile/tistory/996DB33D5B2DAB1328)

API가 생성되셨다면 아무것도 없을텐데요.

상단에 있는 **작업** 버튼을 클릭 한뒤, 메소드 생성을 선택합니다.

![api3](https://t1.daumcdn.net/cfile/tistory/9945944D5B2DAB1225)

여기서 HTTP Method를 선택하는데요.

POST를 선택하고 바로 옆의 체크버튼을 클릭합니다.

![api4](https://t1.daumcdn.net/cfile/tistory/99E194405B2DAB1325)

본인이 만든 공지 Lambda를 선택합니다.

![api5](https://t1.daumcdn.net/cfile/tistory/996C47475B2DAB1323)

그럼 아래와 같이 해당 POST 메소드의 전체 Flow가 생성됩니다.

하단의 테스트 버튼을 클릭해서 Lambda와 잘 연결되었는지 간단한 테스트를 진행해보겠습니다.

![api7](https://t1.daumcdn.net/cfile/tistory/99AFDA465B2DAB131B)

방금전에 사용한 Lambda의 테스트 메세지를 그대로 복사하여 요청 본문에 입력합니다.

![api8](https://t1.daumcdn.net/cfile/tistory/9936784C5B2DAB1321)

입력 되셨으면 테스트를 한번 실행해봅니다.

그럼!

아래처럼 Telegram 메세지가 잘 오는것을 확인할 수 있습니다!

![api9](https://t1.daumcdn.net/cfile/tistory/9990324D5B2DAB1312)

API와 Lambda가 잘 연결된걸 확인했습니다.

이제 이 API를 실제 배포 해보겠습니다.

### 3-2. API 배포

API Gateway는 일반 웹 어플리케이션처럼 **배포** 개념이 있습니다.

즉, 저장만 한다고 바로 반영 되는것이 아니라 항상 배포를 해야만 실제 환경에 반영이 됩니다.

배포전까지는 API URL도 할당받지 못하기 때문에 배포를 진행하겠습니다.

방금 전 화면에서 메소드 요청 버튼을 클릭합니다.

![api10](https://t1.daumcdn.net/cfile/tistory/999F19365B2DAB132B)

여기서 **API 키가 필요함을 true** 로 지정합니다.

![api11](https://t1.daumcdn.net/cfile/tistory/991072365B2DAB1324)

> 조금 있다가 진행할 인증키를 위한 부분입니다.

여기까지 다 하셨으면 저장하신뒤, 상단에 있는 **작업** 버튼을 클릭해 **API 배포** 를 클릭합니다.

![api12](https://t1.daumcdn.net/cfile/tistory/99B362375B2DAB1315)

**새 스테이지** 를 선택하신뒤 원하시는 내용으로 각 항목을 채웁니다.

![api13](https://t1.daumcdn.net/cfile/tistory/99118E345B2DAB131C)

배포를 클릭하시면! 아래처럼 이 API를 호출할 수 있는 URL 주소를 할당받게 됩니다.

![api14](https://t1.daumcdn.net/cfile/tistory/99D785445B2DAB120F)

이 URL을 어딘가 기록하신뒤, 다음 단계로 가겠습니다.

### 3-3. API Key 등록

이 API는 그대로 쓰기에 무리가 있습니다.

**외부에서 URL 주소만 알면 요청** 할 수 있기 때문인데요.

이를 방지하기 위해 API Key를 사용해 **인증된 Key를 보낼때만 호출** 될수 있도록 하겠습니다.

API Gateway의 좌측 하단을 보시면 **API 키** 항목이 있습니다.

클릭합니다.

![api15](https://t1.daumcdn.net/cfile/tistory/996AB3425B2DAB1212)

그럼 API 키를 생성할 수 있는데요.

작업 -> API 키 생성을 차례로 클릭합니다.

![api16](https://t1.daumcdn.net/cfile/tistory/997B8E3C5B2DAB1327)

키는 자동생성으로 선택합니다.

![api17](https://t1.daumcdn.net/cfile/tistory/99BDC4395B2DAB1221)

그럼 아래처럼 API Key가 생성됩니다!

이 API Key도 메모장에 잘 저장해놓고 다음 단계로 가겠습니다.

![api18](https://t1.daumcdn.net/cfile/tistory/99B6CB3F5B2DAB1227)

이제는 이 API Key와 방금 생성한 API를 연동하겠습니다.

API Key와 마찬가지로 **좌측 하단의 사용량 계획** 을 클릭합니다.

![api19](https://t1.daumcdn.net/cfile/tistory/99894F3D5B2DAB1218)

생성 버튼을 클릭 하신뒤, 아래 이미지대로 각 수치를 입력합니다.

![api20](https://t1.daumcdn.net/cfile/tistory/99DE664C5B2DAB1227)

> AWS 가이드 문서를 보시면 기본 값으로 100/200/5000으로 잡고 있습니다.
>
> 하루에 1건도 보낼까 말까 할때는 과한 양이긴 합니다만, 혹시 모르니 이정도 수치로 잡고 가겠습니다.

다음으로 넘어가시면 연결할 API를 선택하라고 합니다.

API 스테이지 추가를 클릭합니다.

![api21](https://t1.daumcdn.net/cfile/tistory/999EA0385B2DAB1323)

앞에서 만든 API를 선택합니다.

이렇게 하시면 사용량 계획도 생성되었습니다.

![api22](https://t1.daumcdn.net/cfile/tistory/99D0C8335B2DAB1229)

다시 **API 키** 로 넘어가셔서 사용량 계획을 연결합니다.

![api23](https://t1.daumcdn.net/cfile/tistory/99C04A365B2DAB1329)

그럼 아래처럼 API, API 키, 사용량 계획 3가지가 모두 잘 연결되었음을 확인할 수 있습니다.

![api24](https://t1.daumcdn.net/cfile/tistory/99357A365B2DAB1222)

모든 작업이 끝났습니다!

이제 이 API가 잘 작동하는지 테스트를 해보겠습니다.

### 3-4. 테스트

저는 `curl`을 사용할 예정입니다.

*   HTTP Method는 POST
*   HTTP Header는 `x-api-key`를 사용합니다.

아래 양식대로 채워서 한번 발송해보시면!

```bash
curl -X POST 본인 API Gateway주소 \
    -d '{ "message":{ "text":"안녕하세요" } }' \
    -H "x-api-key: 본인 API Key"
```

![api25](https://t1.daumcdn.net/cfile/tistory/99BEB2405B2DAB1327)

이렇게 Telegram 메세지가 오는 것을 확인할 수 있습니다.

![api25](https://t1.daumcdn.net/cfile/tistory/993B4A435B2DAB121E)

만약 **Header에 API Key를 추가하지 않고** 보내신다면!

![api26](https://t1.daumcdn.net/cfile/tistory/993EEC3C5B2DAB132B)

이렇게 403 Forbidden 오류를 반환합니다.

즉, **API Key를 모르는 외부에선 절대 이 API를 사용할 수 없겠죠**?

보안 기능도 포함된 Telegram 전체 공지 기능이 완성되었습니다!

## 마무리

이 전체 공지 API는 여러 곳에서 사용 가능합니다.

*   관리자 페이지에서 이 API를 통해 전체 공지를 할 수 있습니다.
*   curl, POSTMAN 등 여러 HTTP Client를 통해서 편하게 전체 공지를 할 수도 있습니다.

원하시는 어떤 방법을 쓰시더라도 **HTTP API를 사용할 수 있는 환경** 이라면 언제든지 쓸수 있습니다.

생각보다 캡처 양이 많아서 시간이 오래걸린것 같습니다!

긴 글 끝까지 읽어주셔서 너무나 감사합니다!

다음에 뵙겠습니다!
