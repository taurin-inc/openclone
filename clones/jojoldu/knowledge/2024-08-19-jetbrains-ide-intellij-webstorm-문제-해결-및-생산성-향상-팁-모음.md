---
topic: "JetBrains IDE (IntelliJ, WebStorm) 문제 해결 및 생산성 향상 팁 모음"
source_type: other
source_url: "https://jojoldu.tistory.com/category/IDE"
authorship: self
published_at: 2024-08-19
---
# IDE _54_
**작성자:** jojoldu

---

## IntelliJ 등에서 메모리 점유율이 계속 높아질 때 (feat. vanilla JBR)
**날짜:** 2024. 8. 19.

silicon M1 맥북을 사용하고나서 IntelliJ를 계속 켜놓고 있으면 끝도 없이 메모리가 올라가는 이슈가 발생했다. 현재 내 IntelliJ VM Option 에서 메모리 설정은 다음과 같다. (PC는 M1 Pro 16GB)

-Xms1024m
-Xmx4096m

위와 같이 설정하고 IntelliJ를 켜두고 오랜 시간이 지나면 IntelliJ의 자체 Memory 분석 도구에서는 여전히 아래와 같이 정상적인 사용량이 노출되는 반면, 실제 IntellIJ의 메모리 사용량은 다음과 같이 설정한 VM Option을 크게 초과해서 사용하는 것을 확인할 수 있다. 16GB RAM을 가진 PC에서 14GB에 가까운 메모리를 사용중인데, 이건 더 높은 메모리 사양을 가진 맥북을 사용하면 더 크게 메모리를 점유한다. (테스트 결과..

---

## JetBrains IDE AI Assistant EAP 후기 (2023.07.12)
**날짜:** 2023. 7. 12.

2023년 6월 26일, JetBrains에서 AI Assistant 기능이 추가 되었다. JetBrains IDE의 AI Assistant 현재 (2023.07.12) 까지 정식 기능은 아니며 EAP 버전에서만 사용 가능하다. GPT 채팅이 있어서 IDE에서는 어떤 차별점이 있을까 궁금해서 EAP 버전을 설치해서 사용해보기 시작했다. 아래 모든 단축키는 Mac을 기준으로 한다.

1. 설치
IntelliJ나 WebStorm 등 IDEA 에서는 다 지원하기 때문에 어떤 IDE라도 EAP 버전을 설치하면 바로 사용할 수 있다. EAP 버전을 설치하는 방법은 JetBrains Toolbox 를 설치하고, 이를 실행해보면 다음과 같이 설치된 IDE들의 목록이 나온다. 여기서 EAP 버전을 설치하고 싶은 IDE의..

---

## IntelliJ (Kotlin) 매 파일마다 newline 자동으로 추가하기 (feat. EditorConfig)
**날짜:** 2022. 6. 4.

Github 의 코드리뷰를 보면 다음과 같이 No newline at end of file 메세지를 보여준다 이는 파일 끝에 개행문자(newline)이 없습니다 라는 의미인데, POSIX 기반의 규칙에 기반한다. EOF 가 없으면 컴파일 에러가 나는 상황을 대비한 규칙이다. 요즘 그럴일은 없지만 그래도 의도한대로 파일이 작동되는 것을 보장하기 위해 웬만해선 자동으로 규칙을 정해놓고 관리하는 것을 추천한다. 이를 매번 파일 생성때마다 수동으로 계행문자를 넣는 것은 꽤나 불편한 일이다.

그래서 자동으로 해결하는 방법은 크게 2가지이다.
1. IDE 설정으로 해결하기: 가장 쉬운 방법은 IDE의 설정으로 항상 파일 끝에 newline을 추가하도록 하는 것이다. IDE 설정 (Settings/Preferences..

---

## WebStorm에서 TypeScript 파일 단독으로 실행하기
**날짜:** 2022. 4. 26.

WebStorm에서 기본적으로는 TypeScript 파일만 단독으로 실행할 수는 없다. 단독으로 실행이 필요할 경우 JS 파일로 컴파일 후, 실행해야만 한다. Run server-side TypeScript with Node.js 이 과정이 개발의 흐름을 많이 끊기 때문에 일반적인 JavaScript 파일을 실행하듯이 TypeScript 실행 환경이 필요하다.

개선: TypeScript 파일만 단독으로 수행하기
개별 플러그인만 설치하면 가능하다. Run Configuration for TypeScript 해당 플러그인 설치후, 프로젝트에 ts-node 를 설치한다. `yarn add --dev ts-node` 그리고 TS 파일을 다시 한번 우클릭 해보면? 다음과 같이 Run/Debug 실행 버튼이 생성된 것을..

---

## WebStorm (IntelliJ IDEA) 에서 this.cliEngineCtor is not a constructor 이슈 발생시 (feat. ESLint 8.0)
**날짜:** 2022. 3. 13.

ESLint 8.0 이상 버전을 사용할 경우 기존에 사용중인 WebStorm, IntelliJ 등에서 다음과 같이 에러가 발생하곤합니다.
`TypeError: this.cliEngineCtor is not a constructor`

아래 로그를 보시면 this.cliEngineCtor is not a constructor 내용을 볼 수 있는데요.
`TypeError: this.cliEngineCtor is not a constructor at ESLintPlugin.invokeESLint (/Users/seojeong-kuk/Library/Application Support/JetBrains/Toolbox/apps/WebStorm/ch-0/211.7628.25/WebStorm.app/Contents/plugi..`

---

## 추천하는 WebStorm Plugin
**날짜:** 2021. 12. 22.

WebStorm (웹스톰)의 경우 JavaScript 개발을 목적으로한 IDE이기 때문에 기본 환경으로도 개발하는데 충분합니다. 그렇기 때문에 플러그인이 필수는 아닙니다. 다만, 좀 더 생산성있는 개발을 위해서는 적절한 플러그인을 사용하는 것을 권장합니다. 특히 일부의 플러그인들은 거의 필수제로 사용되니, 아래 플러그인들을 확인해보시고 필요한 항목들은 설치해보시는 것을 추천드립니다.

기본적인 .env, .ignore 등의 플러그인은 다 설치되어있다고 가정했습니다. 생산성에 도움이 되는 플러그인들만 작성했습니다. 테마 / 아이콘 / progress bar / power mode 등 UX에 관한 것들은 모두 배제했습니다.

String Manipulation 플러그인 링크: 문자열을 다루는데 여러 편의기능을 제..
