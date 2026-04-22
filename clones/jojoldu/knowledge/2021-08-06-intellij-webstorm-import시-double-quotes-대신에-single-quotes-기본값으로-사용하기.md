---
topic: "IntelliJ & Webstorm import시 double quotes 대신에 single quotes 기본값으로 사용하기"
source_type: other
source_url: "https://jojoldu.tistory.com/589"
authorship: self
published_at: 2021-08-06
---
# IntelliJ & Webstorm import시 double quotes 대신에 single quotes 기본값으로 사용하기

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 8. 6.

IntelliJ나 Webstorm을 통해 JS / TS를 개발하다보면 `import` 구문에서 `"` 로 인해 불편할때가 많은데요.

이를테면 팀 컨벤션으로 `import`를 Single Quotes 로 해놓은 경우에는 자동 `import` 를 통해 `"`로 `import` 되면 매번 수동으로 Single Quotes 로 바꿔야만 합니다.

## 1. Auto Import 하는법

먼저 Jetbrains IDE의 Auto Import 는 다음과 같이 사용할 수 있는데요.

아래와 같이 Import되지 않는 클래스나 function에 포커스를 두고, 단축키를 통해 `import`를 수행합니다.

![1](https://blog.kakaocdn.net/dna/dF1etp/btrbtoWo3a5/AAAAAAAAAAAAAAAAAAAAAKBMt7K-yS4vtYXgUWgdzTk9Lw6-R9lpqbO1mS-Yuq-p/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=wLpqODbm8N0fCjmPuM0gH3MJt4c%3D)

*   `option` + `Enter`: 제안 목록 보기
*   `option` + `shift` + `Enter`: 전체 full import

여기서 단일 `import`인 `option` + `Enter`를 사용하면 아래와 같이 여러 제안 항목들이 나오는데, 이 중 `Add import statement`를 선택하시면 import 구문이 자동 생성됩니다.

![2](https://blog.kakaocdn.net/dna/blUMWu/btrbhYZIspU/AAAAAAAAAAAAAAAAAAAAAE6qCnVqZYhZqtfpWDhN4RWlz7IJrRZQYaEcBfFwX0pt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=28HDxY5w5CwnHCvqwVId67n4KnY%3D)

아직까지 세팅 안되어있는 상태 (Default) 에서는 아래와 같이 `"`로 `import` 구문이 생성됩니다.

![3](https://blog.kakaocdn.net/dna/cIw2fv/btrbljPQliJ/AAAAAAAAAAAAAAAAAAAAAB3WqN69TehG3Ps8waRbuMC7ubTAosOHJMo8OcWmtV5Q/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7DemMNyWFBz99RTKFmLJXM7se8w%3D)

개인 IDE 때문에 팀 컨벤션을 변경하는 것은 어려우니 IDE의 세팅을 변경해보겠습니다.

## 2. Single Quotes Import로 교체

아래의 순서를 따라 진행합니다.

*   `Preferences` (`Settings`) -> `pun` 검색 -> `Editor` -> `Code Style` -> `JS` 혹은 `TS` 선택 -> `Punctuation` 이동

여기서 `Use` 항목의 `double`을 `single`로 교체합니다.

![4](https://blog.kakaocdn.net/dna/b6vtge/btrbgo5seR2/AAAAAAAAAAAAAAAAAAAAAISBmIuwzgSP7dqe1gtd_tUEt2L0CMAD37l3jQka5PWq/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=soTvbO6YEY8Uu2l%2B8Xr8pM9%2FsFU%3D)

설정을 저장하신뒤, 다시 1번의 방식으로 `import`를 수행해보시면?

![5](https://blog.kakaocdn.net/dna/bLtpx3/btrbmxNUewx/AAAAAAAAAAAAAAAAAAAAAKuETYx-twy05bo1kG3_A9lnnaXigOT3LrgcOHYxR7Ga/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7pwmxGWCiTAd6yOfB%2F3L7okArhA%3D)

Single Quotes로 `import` 구문이 잘 생성된 것을 볼 수 있습니다.
