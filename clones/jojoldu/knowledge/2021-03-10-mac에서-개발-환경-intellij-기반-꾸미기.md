---
topic: "Mac에서 개발 환경 (IntelliJ 기반) 꾸미기"
source_type: other
source_url: "https://jojoldu.tistory.com/556"
authorship: self
published_at: 2021-03-10
---
# Mac에서 개발 환경 (IntelliJ 기반) 꾸미기

**Author:** 향로 (기억보단 기록을)  
**Date:** 2021. 3. 10.

현 회사에 오면서 처음으로 Mac을 경험하면서 윈도우보다는 훨씬 다양한 기능과 앱들을 찾아보고 경험했습니다.

다양한 앱들 덕분에 IntelliJ IDEA에서 사용하는 여러 단축키들이 충돌나서 대채제 혹은 단축키 변경등을 하기도 했는데요.

다양한 앱들을 모르는 분들도 계시고, IntelliJ 와 단축키가 충돌나서 단축키를 못쓰시는 분들에 대한 이야기도 듣게 되어 정리하게 되었습니다.

**터미널과 도커** 등의 개발 환경은 이미 subicura 님께서 블로그에 정리해주셔서 저는 그것외에 주로 사용하는 세팅과 앱들을 소개 드리겠습니다.

*   [본격 macOS에 개발 환경 구축하기](https://subicura.com/2017/11/22/mac-os-development-environment-setup.html)

---

## App

대부분의 Mac App들은 단축키를 적극 활용할 수 있도록 되어있으니, 단축키도 함께 소개드리겠습니다.

혹시나 Mac의 특수기호가 윈도우/리눅스 배열과 달라서 어색하시다면 아래 단축키 표를 한번 보시면 좋습니다.

![특수키](https://t1.daumcdn.net/cfile/tistory/990E5A45604812A319)

### Alfred (알프레드)

![alfred1](https://t1.daumcdn.net/cfile/tistory/99EEBD37604812A31A)

Mac의 기본 검색 App은 Spotlight 입니다. 해당 앱에는 몇가지 문제가 있는데요.

*   파일 인덱싱 부하가 심합니다.
*   단축키가 여러 개발도구의 자동완성 (`Ctrl` + `space`)와 겹칩니다. (변경 가능)
*   검색외 기능이 미흡합니다.

그래서 저 같은 경우에는 [Alfred](https://www.alfredapp.com/) 를 사용합니다. Alfred는 Spotlight와 마찬가지로 Mac의 전체 검색 기능을 지원하는 강력한 앱인데요. 워크플로우를 이용하여 원하는 기능을 Alfred 내에서 수행할 수 있는 기능을 지원합니다.

![alfred2](https://t1.daumcdn.net/cfile/tistory/99EA9842604812A319)

기본 단축키는 `Option` + `Space` 인데, 단축키 역시 변경이 가능합니다.

![alfred3](https://t1.daumcdn.net/cfile/tistory/9922453A604812A41A)

저 같은 경우 (`Ctrl` + `Shift` + `A`)로 두고, 여러 개발도구의 주요 단축키들과 겹치지 않도록 사용중입니다. 만약 **유료** 플랜을 구매하시게 되면 워크플로우를 비롯해 다양한 확장기능을 쓸 수 있습니다. IDE 프로젝트 검색, 파파고 연동 등을 손쉽게 Alfred 안에서 사용할 수 있습니다.

*   [귀차니즘을 해결해주는 Alfred](https://sungjk.github.io/2020/12/13/alfred-tips.html)

### Monosnap (모노스냅)

(악마의) 캡쳐 App [Monosnap](http://macnews.tistory.com/1064) 입니다.

![monosnap](https://t1.daumcdn.net/cfile/tistory/99B82335604812A319)

맥의 기본 캡쳐 기능이 아무래도 부실한데요. Monosnap 은 캡쳐와 편집에 대한 사용성이 굉장히 뛰어난 앱입니다.

기본적인 단축키는 다음과 같습니다.
*   **지정** 캡쳐: `Option` + `Command` + 5
*   **전체** 캡쳐: `Option` + `Command` + 6

위에서 악마라고 한 최악의 단점은 바로 **메모리 점유율** 입니다. 한 일주일정도 노트북을 부팅하지 않고 있으면 Monosnap이 **점유한 메모리가 5GB ~ 7GB** 인 경우가 허다합니다. 그래서 2~3일에 한번씩 프로세스를 종료하고 재실행하는 등의 초기화 작업이 필요합니다.

### Magnet

놀랍게도 맥은 **화면 분할 기능이 기본 기능이 아닙니다**.

![magnet](https://t1.daumcdn.net/cfile/tistory/99DE4746604812A319)

윈도우 보다 더욱 강력한 화면 분할 기능을 제공하는 App이 [Magnet](https://apps.apple.com/kr/app/magnet-%EB%A7%88%EA%B7%B8%EB%84%B7/id441258766?mt=12) 입니다. 아쉽게도 **유료** App이지만, 한번 사용해보시면 확실히 좋다는 것을 느낄 수 있습니다.

단축키는 `Ctrl` + `Option` 을 조합해서 사용하기 때문에 다른 앱들의 단축키와 충돌날일이 거의 없습니다.

![magnet2](https://t1.daumcdn.net/cfile/tistory/99DE4C46604812A319)

> 만약 무료로 화면 분할 기능을 쓰고 싶다면 [Spectacle](http://macnews.tistory.com/3198) 도 좋은 대안입니다.

### Scroll Reverser

![scroll1](https://t1.daumcdn.net/cfile/tistory/99A1C636604812A319)

윈도우를 사용하다 Mac 으로 넘어오면서 가장 크게 느낀 이질감이 스크롤 방향이 반대라는 것입니다. 입력 장치별로 스크롤 방향을 마음대로 바꿔줄 수 있는 상황이 필요한데, 이를 지원하는 App이 [Scroll Reverser](https://hoile.tistory.com/139) 입니다.

![scroll2](https://t1.daumcdn.net/cfile/tistory/99AE3D43604812A31A)

### Itsycal

![itsycal](https://t1.daumcdn.net/cfile/tistory/990E4B45604812A319)

Mac의 기본 캘린더 기능이 썩 마음에 들지 않을 때 발견한 것이 바로 [Itsycal](https://truesale.tistory.com/272) 입니다. 상단 메뉴바에서 바로 실행해볼 수 있으며 사용성이 굉장히 단순하고 편리합니다.

![itsycal2](https://t1.daumcdn.net/cfile/tistory/99B35335604812A31A)

### karabiner-elements

![karabiner](https://t1.daumcdn.net/cfile/tistory/999AE933604812A31A)

기본 키 매핑을 원하는 다른 키로 매핑해주고 싶다면 [Karabiner-elements](https://karabiner-elements.pqrs.org/) App을 통해 설정할 수 있습니다. 저 같은 경우 Mac의 기본 한영키가 싫어서 `Space`의 우측 `Command`를 한영키로 사용할 수 있도록 설정해서 사용합니다.

*   [우측 커맨드를 한영키로 사용하기](https://jojoldu.tistory.com/345)

---

## IntelliJ

처음 맥북을 받으면 IntelliJ 설치후 아래와 같은 세팅을 기본적으로 합니다.

### 터치바를 F1 ~ F12로 고정시키기

맥북 신형 터치바에서 IntelliJ 사용 시 F1 ~ F12 키를 사용하려면 `Fn` 키를 함께 눌러야 해서 불편합니다.

![touchbar](https://t1.daumcdn.net/cfile/tistory/999AF433604812A41A)

설정 방법은 [기존 포스팅](https://jojoldu.tistory.com/293) 을 참고하여 IntelliJ 사용 시 F1 ~ F12로 고정되도록 합니다.

### 스크롤바

맥에서 IntelliJ를 사용할 때 스크롤바가 보이지 않는다면 맥의 설정을 변경해야 합니다.

![스크롤바1](https://t1.daumcdn.net/cfile/tistory/99EA9342604812A319)

![스크롤바2](https://t1.daumcdn.net/cfile/tistory/9947CE34604812A419)
(`시스템 환경설정` -> `일반` -> `스크롤 막대보기` -> `항상` 체크)

### Smart Completion

IntelliJ의 기본 자동 완성 단축키는 `Ctrl` + `Space` 입니다. 하지만 **현재 컨텍스트에 맞는 자동완성들만 노출**되게 하는 Smart Completion (`Ctrl` + `Shift` + `Space`) 기능이 더 유용할 때가 많습니다.

![complete](https://t1.daumcdn.net/cfile/tistory/9947D334604812A418)

### cmd + shfit + A 단축키 이슈

IntelliJ Action 검색 단축키인 `Command` + `Shift` + `A`를 누르면 Mac에서 `man 페이지 인덱스` 터미널이 실행되는 경우가 있습니다.

![man](https://t1.daumcdn.net/cfile/tistory/99972248604812A31A)

맥의 기본 단축키 설정을 변경하여 해결합니다. 변경 방법은 [기존 포스팅](https://jojoldu.tistory.com/420) 을 참고합니다.

### 키보드 속도

맥의 기본 키보드 반응속도가 낮게 설정되어 있어 키 반응 속도를 최대치로 높여둡니다.

![키보드속도](https://t1.daumcdn.net/cfile/tistory/99DE5146604812A319)

---

## 마무리

이 외에도 좋은 앱들이 있는데, 이는 기억나는대로 계속 추가하도록 하겠습니다. Mac이 버전업되면서 충돌나는 단축키와 앱들이 있다면 마찬가지로 계속 반영하도록 하겠습니다.
