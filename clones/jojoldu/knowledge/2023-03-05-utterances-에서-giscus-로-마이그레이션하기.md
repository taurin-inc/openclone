---
topic: "Utterances 에서 Giscus 로 마이그레이션하기"
source_type: other
source_url: "https://jojoldu.tistory.com/704"
authorship: self
published_at: 2023-03-05
---
# Utterances 에서 Giscus 로 마이그레이션하기

**Author:** 향로 (기억보단 기록을)
**Date:** 2023. 3. 5.

블로그의 댓글을 [Utterances](https://utteranc.es/) 에서 [Giscus](https://giscus.app/ko) 로 마이그레이션 했다.

![result](https://blog.kakaocdn.net/dna/dK7wlO/btr1Xy2sx70/AAAAAAAAAAAAAAAAAAAAAAkPox0Ae3J7DVf4mZvAcS4iByE3KTJ0wGvgrn6DD4bn/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=8mVn0zEohdLSTcYLyVp%2BbWKt4eM%3D)

기존 댓글을 잘 사용하고 있었지만, 장점이 훨씬 많은 Giscus로 이관하게 되었다.

## 1. Giscus 장점

[Giscus](https://giscus.app/ko) 는 [Utterances](https://utteranc.es/) 에 비해 많은 장점들이 있다.

### 대댓글

![adv1](https://blog.kakaocdn.net/dna/eOLmKy/btr1VdR5hw8/AAAAAAAAAAAAAAAAAAAAAKga4-XQa1Jn2N9fdQk7aLgciTZg5Rtdif4-ddSws72v/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=pMKrp6ER%2FTrznFIcLjmp93V2HwQ%3D)

### 댓글 수, 댓글 정렬, 게시물에 대한 반응

![adv2](https://blog.kakaocdn.net/dna/0jeo9/btr1Uu0RiRL/AAAAAAAAAAAAAAAAAAAAAE252Gocg2kI58pCi4I2c_9HnA8G7-fCmYU2lvdLr7Z1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Sj5I8vfwRqyBCDjueC5EzU10R4Q%3D)

### 다양한 테마

생각보다 많은 테마와 사용자가 직접 생성한 테마를 적용할 수 있다.

![adv3](https://blog.kakaocdn.net/dna/4eGfx/btr1QxDlIz7/AAAAAAAAAAAAAAAAAAAAAK0G-soPhJFT5J0aoc1Gyb7TBZLiI7TUdwjZOl72vair/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=omPKE4yv7NoP9wQxZhyQ1BqOGmc%3D)

블로그에 적용된 테마는 `Github Light High Contrast` 테마이다.

(High Contrast 테마는 JetBrains IDE에서도 사용하는 애정하는 테마이다.)

### 그 외 장점

- 지연 로딩 댓글
- 다국어 (한국어 포함)
- 봇 자체 호스팅
- 기타 등등 여러 다양한 옵션들이 존재

가장 중요한건 실제로 계속해서 **관리가 되고 있는 오픈소스라** 는 것이다.

(대조적으로 Utterances는 몇달 업데이트가 없기도 했다. - 요즘은 업데이트를 확인하지 않았다.)

기존 Utterances는 다음과 같이 **동일 이슈가 중복 생성** 되는 버그 등이 존재한다는 점을 생각해보면 옮겨야할 이유가 많았다.

![problem1](https://blog.kakaocdn.net/dna/bpHkvd/btr1WzHpoSj/AAAAAAAAAAAAAAAAAAAAANX1J5MBS6IWmD51PUHsqkFPfupV5b2zmBsaFrXV-E6d/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Rbt4f%2BS9Lf7TG29HaoRInLn8oaQ%3D)

그래서 나처럼 기존 [Utterances](https://utteranc.es/) 에 부족함을 느꼈다면 [Giscus](https://giscus.app/ko) 로 마이그레이션을 진행하자.

## 2. Giscus 설치

### 2-1. 저장소 준비

먼저 기존에 댓글을 issue로 관리하던 Github 저장소의 Discussion을 활성화시켜야 한다.

(Giscus가 Github의 Discussions 기반)

**Settings** -> **General**

![install1](https://blog.kakaocdn.net/dna/y8n86/btr1TSgFjhj/AAAAAAAAAAAAAAAAAAAAAPwD41e6f__kbYdPbJq9DHU1Y4wM9bySQ4ZvlLdecUFc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=gRvHzMxxc%2BN7p%2FTamfO7csM1d74%3D)

**Feature** -> **Discussions** 체크

![install2](https://blog.kakaocdn.net/dna/cSzaRB/btr1Y8oFWGr/AAAAAAAAAAAAAAAAAAAAAIGyscyMiApHW3V9mCqxbpAmmUz62ni-EM2NRp4kDRRb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=6Wy2%2FXKOVGeVC%2Bu7On5ADHA3JsY%3D)

### 2-2. Discussions 에 신규 카테고리 추가

활성화된 Discussions 로 가서 댓글들을 담을 신규 카테고리를 생성한다.

![category1](https://blog.kakaocdn.net/dna/dLdMtl/btr16jXIcuh/AAAAAAAAAAAAAAAAAAAAACpCQi7pYtTTcuZ_G3wwkTBfPdBxdTwPClix1eHz5-KW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=VAR1%2BWMyexZI%2BJmhmwIUj69hDho%3D)

에디터 버튼 (펜 모양) 을 클릭후 **New category** 를 클릭 한다.

![category2](https://blog.kakaocdn.net/dna/cgxjM2/btr16jcjR6u/AAAAAAAAAAAAAAAAAAAAAEfcSS8h25vWsjnvUbSWGEKk_t4Ei8WvmnZ54PQ-Gzzz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=hPqMB3LfeTLNGqzsC9ak%2BuwOOQs%3D)

카테고리명을 `Comments` 로 하고, **Announcement** (소유자만 새 토론을 생성할 수 있지만, 댓글과 대댓글은 누구나 가능한 포맷)를 선택하여 생성한다.

![category3](https://blog.kakaocdn.net/dna/o5K8h/btr1XyuFKWE/AAAAAAAAAAAAAAAAAAAAAAzJ8gHvIEeIrXqXnRcQXPFR9JxAkJ8UtOGSxIlovAKx/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=PMVyMbs144Eh%2BrPxktO42aFE8bM%3D)

그 외 카테고리들은 혹시 모를 상황을 대비해 공지사항 용도의 일부만 남겨두고 다 제거한다.

![category4](https://blog.kakaocdn.net/dna/k5T1F/btr1Vdq2zDp/AAAAAAAAAAAAAAAAAAAAAFfkCbCfTH1QPkg-xOGApDMMTWvhagrcFXDT29-TETca/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2FtGi6zchj%2FrrfkgBgxWsdcSnJnY%3D)

앞으로 만들어질 댓글들은 모두 이 `Comments` 카테고리에서 토론으로 관리 된다.

### 2-2. 앱 설치

이제 위에서 설정한 저장소에 Giscus App을 설치한다.

아래 링크로 가서 등록한다.

- [App 설치 페이지](https://github.com/apps/giscus)

![app1](https://blog.kakaocdn.net/dna/qucec/btr1TUep2bm/AAAAAAAAAAAAAAAAAAAAAMRSbTGdJ4iW8FGdy4-MQH78EOP7gpqokdD2OurOpBu-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=MjP65zgXobREHEBE1v8UPU5N54g%3D)

Giscus가 굳이 전체 저장소의 권한을 가질 필요는 없으니, 댓글 저장소에 대한 권한만 가지도록 설정한다.

![app2](https://blog.kakaocdn.net/dna/pe54q/btr1Y7wxtEa/AAAAAAAAAAAAAAAAAAAAABZyuq8lqy8PpMJbVSSaoDlIAvzSP8EIwZvyM4UjmFs7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2F6MjeswtPjWriQql1x4x5HOyABQ%3D)

이제 App을 설치했으니 [Giscus App 페이지](https://giscus.app/) 로 이동해서 내 마음에 맞는 댓글 시스템을 구성해본다.

**언어 및 저장소 설정**

![config1](https://blog.kakaocdn.net/dna/yYjjT/btr1XQaLeiF/AAAAAAAAAAAAAAAAAAAAAPWSufgXFKvXvU2EBWpW6xCNVsapAWy8LkpdkhTQh-6M/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=U%2B4SYOf1yUc4wCbuG0ENQlel1A0%3D)

게시글과 Discussion을 매핑할 방법을 선택한다.

`제목이 페이지 경로를 포함`을 선택하는 것이 이후 **Issue에서 Discussion으로 마이그레이션 하기 쉬우므로** 가능한 위 방법을 선택한다.

(물론 마이그레이션할 게 없다면 원하는 방법을 선택한다.)

새로 만든 `Comments` 카테고리를 선택한다.

![config2](https://blog.kakaocdn.net/dna/uASGw/btr2gjivcUi/AAAAAAAAAAAAAAAAAAAAAIk6dGfBEekVWy3b7IC94Zib4ZqjJEUkGIzPNVREbwnb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=bAYDha%2FutyAfRvGQRjfejGNvfRQ%3D)

그 외 기타 등등 옵션들을 선택한다.

(지연 로딩 등등의 활성화)

마지막으로 **테마를 선택** 하면, 모든 설정은 끝난다.

설정이 다 마무리 되면 다음과 같이 임베딩 시킬 수 있는 JavaScript 코드를 생성해준다.

![config3](https://blog.kakaocdn.net/dna/cnQREB/btr1Xyakq0H/AAAAAAAAAAAAAAAAAAAAANr35J0st_WzGdoalbMoYsunqYC98o7BcZCFckB5n8-0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=FhRoYsYxGQBGlNQeovepRg5C5XA%3D)

해당 코드를 복사해서 본인의 블로그에 붙여넣는다.

### 2-4. 티스토리 교체

> 티스토리가 아니면 본인의 블로그에 맞는 적절한 위치의 코드를 교체하면 된다.

본인 블로그의 기존 `Utterance` 스크립트를 주석처리 하고 위에서 만든 Giscus 스크립트를 붙여넣는다.

![tistory1](https://blog.kakaocdn.net/dna/6IlrX/btr1Mjk3pVT/AAAAAAAAAAAAAAAAAAAAAL9eqyLOwiEQqLABhw5JucspFzBKoOi3qEVO4_XPGCZf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=B3MX8rqjiDFqRswDRMU1s7zRp6g%3D)

단, Giscus는 `class="giscus"` 영역에 레이아웃을 그리기 때문에 위 그림처럼 `<div class="giscus"></div>` 코드를 댓글의 위치에 꼭 넣어줘야한다.

이렇게 하면 Giscus를 블로그에 설치하는 것은 끝이다.

## 3. 마이그레이션

기존 Utterance에서 생성된 댓글들 (Issue) 을 Discussions으로 옮겨야한다.

하지만… 아쉽게도 현재 Github 시스템에서는 **대량으로 issue를 discussions으로 옮기는 기능을 지원하지 않는다**.

- [공식 문서](https://docs.github.com/en/discussions/managing-discussions-for-your-community/moderating-discussions#converting-an-issue-to-a-discussion)

> 전체 선택해서 한번에 이관하는 버튼이 있을줄 알았는데…. 없었다…

그래서 2가지 방법이 있다.

- Github 오픈 API를 활용한 스크립트를 만들어서 옮긴다
- 손으로 직접 하나씩 옮긴다.

게시글이 수백개인 분들은 많지 않으니 일단 수동으로 옮기는 방법을 소개한다.

> 스크립트 작성해서 옮길까 했지만, 손으로 해도 30분이면 될것같아서 크롬 단축키 쓰면서 수동 이관 했다.

기존 Issue 를 하나 클릭해보면 우측 하단에 다음과 같이 **Convert to discussion** 버튼이 있다.

![mig1](https://blog.kakaocdn.net/dna/dfjPQA/btr115MbeME/AAAAAAAAAAAAAAAAAAAAAOlQPJmQWGvD690Dhri7pz5nNVawbEpZ8mF9Frb_vQn1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=J3CP9xH0sk8FeOwQRyumlNY9mOY%3D)

해당 버튼을 클릭하면 다음과 같이 카테고리를 선택해서 Convert를 진행한다.

![mig2](https://blog.kakaocdn.net/dna/OE1XE/btr1WmgIccg/AAAAAAAAAAAAAAAAAAAAAOBAL_nMdrYvBRT4UaTHQX08lCZp9RAdKKetnD4hApfH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=QzSQfe3TqitS9vczHYdJFVhrMhY%3D)

그럼 다음과 같이 Discussions으로 마이그레이션된 것을 확인할 수 있다.

![mig3](https://blog.kakaocdn.net/dna/by3IRG/btr1Vfbjrbo/AAAAAAAAAAAAAAAAAAAAANT40dVsSf8CZpgIAsG_rOdHL1GaijaajJC1yCqWKa-s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=knFMcaHO7IAcM3EP04%2BxUtN%2BQRE%3D)

실제 블로그에 방문해보면 정상적으로 댓글이 노출되는 것을 확인할 수 있다.

![mig4](https://blog.kakaocdn.net/dna/N01Yk/btr16iYNqiJ/AAAAAAAAAAAAAAAAAAAAABEkacKrEihzQAvSy_oo4tCL6HfYVvEXOOn4vRu2PTHT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=bERLZPVOR1FYSiPB24w59SxyHwE%3D)

참고: [Giscus 댓글, 텔레그램 (Telegram) 으로 알람 받기](https://jojoldu.tistory.com/705)
