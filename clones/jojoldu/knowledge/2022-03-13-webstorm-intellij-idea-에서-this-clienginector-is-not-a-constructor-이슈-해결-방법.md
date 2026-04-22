---
topic: "WebStorm (IntelliJ IDEA) 에서 this.cliEngineCtor is not a constructor 이슈 해결 방법"
source_type: other
source_url: "https://jojoldu.tistory.com/655"
authorship: self
published_at: 2022-03-13
---
# WebStorm (IntelliJ IDEA) 에서 this.cliEngineCtor is not a constructor 이슈 발생시 (feat. ESLint 8.0)

**Author:** 향로 (기억보단 기록을)  
**Date:** 2022. 3. 13.

ESLint 8.0 이상 버전을 사용할 경우 기존에 사용중인 WebStorm, IntelliJ 등에서 다음과 같이 에러가 발생하곤합니다.

```
TypeError: this.cliEngineCtor is not a constructor
```

![1](https://blog.kakaocdn.net/dna/u15KM/btrvL5rkp8m/AAAAAAAAAAAAAAAAAAAAAKKfQ7ybMzS0IXc5QaujzZXFRQxOblZlb5s1iTkVS4YC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=2lrIhOZS5aw63MM54zq9Kr3%2BftI%3D)

아래 로그를 보시면 `this.cliEngineCtor is not a constructor` 내용을 볼 수 있는데요.

```
TypeError: this.cliEngineCtor is not a constructor
    at ESLintPlugin.invokeESLint (/Users/seojeong-kuk/Library/Application Support/JetBrains/Toolbox/apps/WebStorm/ch-0/211.7628.25/WebStorm.app/Contents/plugins/JavaScriptLanguage/languageService/eslint/bin/eslint-plugin.js:103:25)
    at ESLintPlugin.getErrors (/Users/seojeong-kuk/Library/Application Support/JetBrains/Toolbox/apps/WebStorm/ch-0/211.7628.25/WebStorm.app/Contents/plugins/JavaScriptLanguage/languageService/eslint/bin/eslint-plugin.js:82:21)
    at ESLintPlugin.onMessage (/Users/seojeong-kuk/Library/Application Support/JetBrains/Toolbox/apps/WebStorm/ch-0/211.7628.25/WebStorm.app/Contents/plugins/JavaScriptLanguage/languageService/eslint/bin/eslint-plugin.js:56:64)
    at Interface.<anonymous> (/Users/seojeong-kuk/Library/Application Support/JetBrains/Toolbox/apps/WebStorm/ch-0/211.7628.25/WebStorm.app/Contents/plugins/JavaScriptLanguage/jsLanguageServicesImpl/js-language-service.js:105:39)
    at Interface.emit (node:events:390:28)
    at Interface._onLine (node:readline:487:10)
    at Interface._normalWrite (node:readline:661:12)
    at Socket.ondata (node:readline:269:10)
    at Socket.emit (node:events:390:28)
    at addChunk (node:internal/streams/readable:315:12)
Process finished with exit code -1
```

이는 ESLint 가 버전업이 됨에 따라 기존 클래스가 삭제되었기 때문인데요.

- [the-cliengine-class-has-been-removed](https://eslint.org/docs/user-guide/migrating-to-8.0.0#-the-cliengine-class-has-been-removed)

그래서 아래와 같이 **2021.2.2** 보다 낮은 버전에서는 ESLint 8.0 이상의 버전을 사용할 수가 없습니다.

![2](https://blog.kakaocdn.net/dna/c4SkLN/btrvRApRlOn/AAAAAAAAAAAAAAAAAAAAALfoq1V4uU5sAQ48l2e2pJHfUFDxDVMpp9PIXAcZlHJ1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=5rWcUw2GEx6Qqvmv6T%2BYS%2FKHygc%3D)

이를 해결 하기 위해서는 **2021.2.2 이상** 의 IDE를 사용하시면 됩니다.

이미 정식 버전이 2021.3.2 까지 나왔기 때문에 여전히 2021.1 버전을 사용하신다면 얼른 업데이트 하시는 것을 추천드립니다.

![3](https://blog.kakaocdn.net/dna/ND0VE/btrvNGSaHwW/AAAAAAAAAAAAAAAAAAAAAGLguXW7iLfY1D3T6Hbvv1XUGG1p6KTCexgY62NWdVlH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=B8AcJ1QzWKU7k2zgMb%2BNbMwtWbo%3D)

## 참고

- [ESLint 8.0 support](https://youtrack.jetbrains.com/issue/WEB-52236)
