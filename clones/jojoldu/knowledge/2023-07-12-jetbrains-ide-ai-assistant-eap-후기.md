---
topic: "JetBrains IDE AI Assistant EAP 후기"
source_type: other
source_url: "https://jojoldu.tistory.com/726"
authorship: self
published_at: 2023-07-12
---
# JetBrains IDE AI Assistant EAP 후기 (2023.07.12)

**Author:** 향로 (기억보단 기록을)  
**Publish Date:** 2023. 7. 12.

---

2023년 6월 26일, JetBrains에서 AI Assistant 기능이 추가 되었다.

- [JetBrains IDE의 AI Assistant](https://blog.jetbrains.com/ko/idea/2023/06/ai-assistant-in-jetbrains-ides/)

현재 (2023.07.12) 까지 **정식 기능은 아니며 EAP 버전에서만 사용 가능** 하다.

GPT 채팅이 있어서 IDE에서는 어떤 차별점이 있을까 궁금해서 EAP 버전을 설치해서 사용해보기 시작했다.

> 아래 모든 단축키는 **Mac을 기준** 으로 한다.

## 1. 설치

IntelliJ나 WebStorm 등 IDEA 에서는 다 지원하기 때문에 어떤 IDE라도 EAP 버전을 설치하면 바로 사용할 수 있다.

EAP 버전을 설치하는 방법은 [JetBrains Toolbox](https://www.jetbrains.com/ko-kr/toolbox-app/) 를 설치하고, 이를 실행해보면 다음과 같이 설치된 IDE들의 목록이 나온다.

여기서 EAP 버전을 설치하고 싶은 IDE의 `Settings` 버튼을 클릭해서

![install1](https://blog.kakaocdn.net/dna/bvabto/btsnhdc0cRq/AAAAAAAAAAAAAAAAAAAAAKS1eHDz8h9v1mh9y5tongObBWiRMW3dJekakC9VLLX3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=zPrZbQD8cROx2P8ZYafjrihKhVA%3D)

Settings 페이지에서 **Early Access Program** 을 체크한다.

![install2](https://blog.kakaocdn.net/dna/dyJyR6/btsniuSUItW/AAAAAAAAAAAAAAAAAAAAAERItYQXR4Km_IaZuLbIHqCEASuMjUKl0hD5i2oCFvRw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7VwMTrC1zeDH%2B5SufTuVICC3rw0%3D)

그리고 다시 IDE 목록으로 돌아가서 해당 IDE의 Update 버튼을 클릭하면 EAP 업데이트가 진행된다.

![install3](https://blog.kakaocdn.net/dna/cdLPMC/btsnondxCZj/AAAAAAAAAAAAAAAAAAAAAMy1q_5tw7FfGEcpaGQb3e_GH1oJ7kQQuNRiS_k7f0eR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Y99Ncu3TQzm54s4R94NMJN5T%2B9c%3D)

설치가 끝나고 실행해보면 아래와 같이 EAP 버전인 것을 확인할 수 있다.

![eap1](https://blog.kakaocdn.net/dna/HfWUS/btsnnfN8wI6/AAAAAAAAAAAAAAAAAAAAAJFaWuxaSw3sQA78tYARIDE8MrPtXd3zYo3kWiNPXdhx/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=0Kqmg7f1d5F22E29R4XVS6DABdc%3D)

(IntelliJ 2023 EAP)

![eap2](https://blog.kakaocdn.net/dna/bUZHJh/btsnj82PS1F/AAAAAAAAAAAAAAAAAAAAAL5XRQCO28HXqkO49AU9GBpGnDtKzn3Y9806Zh5FC4pS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=3JnIteIgXeehLWjZSW%2FEknka%2BvI%3D)

(WebStorm 2023 EAP)

실행이 완료되면 다음과 같이 우측 탭 영역에 AI Assistant가 추가된 것을 확인할 수 있다.

![enabl1](https://blog.kakaocdn.net/dna/dPA476/btsnjb6kRmo/AAAAAAAAAAAAAAAAAAAAANnzA_YWC4eQWbv1mwJIK5ppcUndfEHjxlGsQWXVlioY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=oDI4s6YGu5cUrUfO4e8kYuh%2BKLo%3D)

해당 탭을 클릭후 **Log in to JetBrains AI** 을 클릭한다.

가입한 JetBrains 계정으로 로그인을 성공하면

![enabl2](https://blog.kakaocdn.net/dna/bPd7r2/btsnnNqhsKi/AAAAAAAAAAAAAAAAAAAAAOGXNo2gO30-jeLrQvpGv7qEwiFZuADXcCJhlr3Es2re/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Y1I%2FDqoiDkDBPASQ8PhrKEbQ66Y%3D)

다음과 같이 AI Chat이 활성화 된 것을 확인할 수 있다.

![enabl3](https://blog.kakaocdn.net/dna/IUsXF/btsng8vJG3l/AAAAAAAAAAAAAAAAAAAAABQdlgReGJpxgtTzql27s32TDmdnABnzqJ6GWsE6UUDl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=GiFjjaWwuN8o8V3iLJExkfYyX38%3D)

## 2. 주요 기능

이렇게 설치된 JetBrains IDE 의 AI 주요 기능들은 다음과 같다.

- AI 채팅 & 코드 분석
- 리팩토링 & 이름 제안
- 주석 생성
- 커밋 메세지 작성

### 2-1. 기본 사용 방법

기본적으로 `Option + Enter` 로 AI 메뉴바가 활성화 된다.

![shortcut](https://blog.kakaocdn.net/dna/njV26/btsngTy2Pc0/AAAAAAAAAAAAAAAAAAAAAFKJoHAXAg1tcc7yolcAjqVDwOSuHmwjikQsX6diXPeq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Uyf2P0g5SzH60fC5plTl0DlDH%2FQ%3D)

해당 AI Actions 을 선택하면 여러가지 옵션들이 나온다.

### 2-2. AI 채팅 & 코드 분석

IDE의 우측 상단에 AI 채팅 버튼이 추가되었다.

![chat1](https://blog.kakaocdn.net/dna/TrjFW/btsngN6vPFi/AAAAAAAAAAAAAAAAAAAAALWuasDhtXMmAJtNaapeRljacqOCIQZ53xdbBWjMUQqJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=SIgQmTZfeOXgxWMm46FZcJnT1hw%3D)

해당 버튼을 클릭하면 다음과 같이 IDE 안에서 GPT와의 채팅이 가능하다.

![chat2](https://blog.kakaocdn.net/dna/cWb9w6/btsnhUdaApZ/AAAAAAAAAAAAAAAAAAAAANqtV4R7bgBa342VZ1hT7o1KX9FCokEVDD46Vua5g3i0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=QJRt0ghadn74WN%2FFbYb%2FwsOJZk8%3D)

여기서 여러가지 질문을 할 수도 있지만, 이러면 그냥 open ai chat 브라우저로 가는 것과 큰 차이가 없다.

JetBrains IDE와 AI의 결합은 개발 하는 현재 내 코드와 AI의 시너지 효과가 크다.

예를 들어 **타인이 작성한 코드를 분석** 해야할 때, 해당 코드에 대한 분석을 AI에게 요청할 수 있다.

아래와 같이 현재 보고 있는 메소드를 선택해서 `Option + Enter` 로 AI 메뉴바를 노출시킨뒤 **Explain code** 를 선택해보면

![explain1](https://blog.kakaocdn.net/dna/ljFfM/btsnj8aG7M0/AAAAAAAAAAAAAAAAAAAAAJYt6u0Vg636vD2LjusJF3R8zcEiTDY4UHoke_aIG06C/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=3mAy0Z5d133KsGGZhX%2BVNjwOxPY%3D)

다음과 같이 해당 메소드에 대해 분석과 설명을 해준다.

![explain2](https://blog.kakaocdn.net/dna/dY9ts6/btsninTs7fc/AAAAAAAAAAAAAAAAAAAAAD-OF1jbvbioDeGi5jbe32DSZRPnVcuoOX1uKXkUevnD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=odQji5zZw14ZnIkm5q%2BouqBarr0%3D)

물론 한글로의 번역을 요청하면 이 역시 잘 수행해준다.

![explain3](https://blog.kakaocdn.net/dna/boRxcr/btsnobj9Lqw/AAAAAAAAAAAAAAAAAAAAAMvp41YE2wenS0kF-WxZ9sSMR7BiINxDTIy-AwXjHHiS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=XO%2F7AM5rpm3vk0qXyWOThdC6hMU%3D)

### 리팩토링

AI 메뉴에는 **리팩토링** 도 지원한다.

이번에는 좀 더 긴 메소드를 선택해서 **Suggest refactoring** 을 선택했다.

![ref1](https://blog.kakaocdn.net/dna/bMGYo2/btsnnd3RfAg/AAAAAAAAAAAAAAAAAAAAANUNsp8vHgoLUUDlAPTrY9YwZ2Xdkj0JFkHC_dnnPyMJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=lTAH0KMwIZa14JVbydFeMylXKXQ%3D)

그러면 AI Chat 메뉴에서 다음과 같이 AI가 코드를 리팩토링 해준다.

![ref2](https://blog.kakaocdn.net/dna/t6hR8/btsnhSl8NCW/AAAAAAAAAAAAAAAAAAAAACC9VHfj9JN5SY2ukFOj41ADV13yh_LWrkHv0vok_G4t/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=U5zrt37zX5d7dEVYhH0WFiVf2o0%3D)
![ref3](https://blog.kakaocdn.net/dna/dRp94J/btsnocXFDEp/AAAAAAAAAAAAAAAAAAAAAKR32T_zDyMEOwQCjmfHk4dkjcbwmUs0yg8KDnH1NZ6M/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=6%2FvjuEsDdLFrD1H4kTX9pAYbCxo%3D)

왜 그렇게 리팩토링 하는게 좋은지에 대해서도 설명을 남겨준다.

![ref4](https://blog.kakaocdn.net/dna/cBXvPj/btsngu0nq2u/AAAAAAAAAAAAAAAAAAAAAEy2HHQKerrn4I0VTUyN-T_Ot7N1TfhOWRRyXciv7xxw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=xCtXHWSaiXbui1Qv%2BkX9%2F2Sejeg%3D)

물론 해당 리팩토링이 마음에 안들어서 **내가 원하는 방향의 리팩토링을 요청** 하면 이를 반영한 버전도 제안해준다.

![ref5](https://blog.kakaocdn.net/dna/bGJ2X9/btsnhTSR7Lf/AAAAAAAAAAAAAAAAAAAAADTB_L3htf_kwUNuOKRO6kVz4xqzbH_AeaWqbAUbxRAM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=9Y%2FQUxnYIt3WrSHsjUtvQDGs6WA%3D)
![ref6](https://blog.kakaocdn.net/dna/bUTj9Q/btsnheptBJG/AAAAAAAAAAAAAAAAAAAAACfOEM9tSG_Ptq8_JVC5NU-l6Kr8Uhy0AavSz8VuhaY5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=9dAn5Iy4m3lJufQz40FdKu%2BW1rA%3D)

이렇게 작업된 코드는 AI 메세지 내부의 우측 상단을 보면 나오는 **Insert Snippet at Caret** 버튼을 클릭하면 코드가 자동으로 현재 파일에 반영이 된다.

![ref7](https://blog.kakaocdn.net/dna/dkPTJJ/btsnkLM1Wk5/AAAAAAAAAAAAAAAAAAAAAIYKxCR6wIIgWZHrzk0SvOIkcSTP6cqunPmIA7-8EW7V/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=P1UfppQhagsA5AUeDWD3xAjghuw%3D)

### 함수, 변수명 추천

> Java, Kotlin, Python만 가능

Mac 기준으로 함수명, 변수명, 클래스명을 변경하는 단축키는 `Shift + F6` 이다.

해당 단축키로 이름을 변경하려고 하면, **AI에서 여러 이름을 추천** 해준다.

![rename1](https://blog.kakaocdn.net/dna/qI7Oi/btsng6q73eG/AAAAAAAAAAAAAAAAAAAAAJfstwX6QtoQv1KP5syHxRdhxuCeYGx2_pWo_dv8Z-Lr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=43rgUfyxFRqEJYJp%2BfolDzIypr4%3D)

### 2-3. 주석 생성

> Java, Kotlin, Python만 가능

메소드나 클래스의 코드를 분석해서 주석을 생성할 수 있다.

원하는 메소드나 클래스를 선택한 뒤에 `Option + Enter` 로 AI Actions를 선택하면

![comment1_1](https://blog.kakaocdn.net/dna/cMbvSX/btsninFX24p/AAAAAAAAAAAAAAAAAAAAABvVZ-eBVPx0aH83nmkZ5vWgI2-xl08j9WkN8CAaLEk6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=tTI7cPyzOSlMJnluyB1GaOKgIJQ%3D)

다음과 같이 선택된 코드들을 분석해서 주석을 자동으로 생성해준다.

![comment1_2](https://blog.kakaocdn.net/dna/cqxj5f/btsnhs8x7cr/AAAAAAAAAAAAAAAAAAAAAMd7XwT055j7gVzRxRGZlNABOAINvYsBGn8hIqjiuvwR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=sMAWiUPfaAWOaq0dTPlLNm8KOQk%3D)

좀 더 편하게 사용할 수 있도록 메소드나 클래스 상단에 `/**` 을 입력하면 자동으로 AI 주석을 사용할 것인지 메세지가 뜬다.

![comment2_1](https://blog.kakaocdn.net/dna/9bGqN/btsni8B0nUw/AAAAAAAAAAAAAAAAAAAAAF_pZUSmYcy_z8viRG68zhKSCeRYqqv96uu3X2KDkKtL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=lht9srGMogPnj7Dzj2%2BVJklHoEM%3D)

해당 메세지를 클릭하면 자동으로 주석이 생성된다.

![comment1_2](https://blog.kakaocdn.net/dna/CmObV/btsnim7622n/AAAAAAAAAAAAAAAAAAAAAD7jddoj6Iw0xHp5rUvXliby67ltRJneaqEq-CEEALHm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Y4jzUosBY61ibnZHhA6SVgfhuls%3D)

### 커밋 메세지 작성

commit dialog에서도 AI 버튼이 추가되었다.

**이번에 커밋할 파일들의 Diff 내용을 기반으로 커밋 메세지를 작성** 해준다.

![commit1](https://blog.kakaocdn.net/dna/cAGBGv/btsnocDlpZR/AAAAAAAAAAAAAAAAAAAAAK_Bd-DTUI5IL3Uf1r6xqQFr4uCMyHBBipdcIsLtbC9I/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=HDUjsOP%2F1N2DwlghnTYzcu0Ai9Y%3D)

위 버튼을 클릭하면 아래와 같이 메세지가 자동으로 dialog에 추가된다.

![commit2](https://blog.kakaocdn.net/dna/G5lI2/btsnnUQwyEA/AAAAAAAAAAAAAAAAAAAAAEYUwusuDV_kzRuwQA_BlHM_GvE90P1xLqBKz091T1kx/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=t%2FeyhfNP7mFU2WYnmr1qfctRAYo%3D)

> 단… 영어로만 작성된다.

## 기타

Korean Language Pack을 설치하면 AI 메세지들이 모두 한글로 번역되서 나오지 않을까 추측했지만, 한국어팩을 설치해도 그냥 영어로 주석/커밋메세지들이 작성되었다.

![korean](https://blog.kakaocdn.net/dna/G716v/btsngTeK1If/AAAAAAAAAAAAAAAAAAAAAD5o764ic_3VnilkDVpx5tVJhF4Tx9OaDYrr-OStDI3R/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=VLcm5gZWM3nROR4DnUVBSca%2FHl0%3D)

## 마무리

IDE에 AI 기능이 내장되니 확실히 도움이 된다.

- 기존 레거시 코드를 분석해야할 때
- 큰 함수를 작은 함수들로 분해 & 리팩토링 해야할때
- 적절한 함수명/변수명을 추천받고 싶을때

특히 실제 개발하는 과정에서 IDE <-> 브라우저 전환이 빈번하게 이루어지던 현상이 많이 개선 되었다.

다만 아쉬운 점은

- 주석/커밋메세지 등 각 언어에 맞게 지원해야할 부분에서 큰 효과를 보긴 어려웠다.
- JS/TS가 아직까지 미지원이라 일부 기능을 사용하지 못하는게 아쉽다.
