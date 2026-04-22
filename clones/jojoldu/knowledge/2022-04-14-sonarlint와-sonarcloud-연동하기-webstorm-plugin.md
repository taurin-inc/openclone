---
topic: "SonarLint와 SonarCloud 연동하기 (WebStorm Plugin)"
source_type: other
source_url: "https://jojoldu.tistory.com/665"
authorship: self
published_at: 2022-04-14
---
# SonarLint와 SonarCloud 연동하기 (WebStorm Plugin)

**Author:** 향로 (기억보단 기록을)
**Date:** 2022. 4. 14.

[지난 시간](https://jojoldu.tistory.com/662) 에 프로젝트와 SonarCloud 연동을 했습니다.

이번 시간에는 프로젝트와 연결된 SonarCloud를 개발환경인 WebStorm의 SonarLint 플러그인과 연동해서 **IDE로 개발 중에도 SonarCloud 검증이 되도록** 설정해보겠습니다.

## 1. 설정

먼저 [SonarLint 플러그인](https://plugins.jetbrains.com/plugin/7973-sonarlint) 을 설치합니다.

![plugin1](https://blog.kakaocdn.net/dna/bznhuo/btrzi3QDQ8F/AAAAAAAAAAAAAAAAAAAAAHrcaLnKTXYkv5gGHy9bsRMBpAsmhmJts5mvsgAK-8o1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=i00%2FV%2FNmpcuYHoiVhkIO0bkqXkg%3D)

설치된 SonarLint 플러그인의 설정을 열어봅니다.

아래와 같이 Action 검색 (`CMD + Shift + A`) 을 통해 검색합니다.

![plugin2](https://blog.kakaocdn.net/dna/cIwhat/btrzkyWHI0t/AAAAAAAAAAAAAAAAAAAAABCpilNW0I_eR9RLPOtx3U1w3Znza1qEdJVxU-7PahNx/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=vMMq8OHjjywoLekltKnPyYYhFVQ%3D)

다음과 같이 커넥션 연결 화면이 나온다면 `Configure the connection` 을 선택합니다.

![plugin3](https://blog.kakaocdn.net/dna/bIox42/btrzmjEJizy/AAAAAAAAAAAAAAAAAAAAAGniiNx6dhZD1nYw2nOhQ_yF37y0gz27fkxklgEhHYLc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=YZLTsGsdwMETh2jIu%2BCI2dAYYEw%3D)

SonarQube / SonarCloud connections의 `+` 버튼을 클리해서 새로운 커넥션을 추가합니다.

![plugin4](https://blog.kakaocdn.net/dna/l4HzI/btrziD5MvLQ/AAAAAAAAAAAAAAAAAAAAADyXKZnQQSNO3isRWRbZZ4aWRqzCeTFAPXJa3VBaR2hV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=44H7QO8OAcewMD1X5c3tqHaihfU%3D)

여기서는 SonarCloud를 쓰고 있으니 SonarCloud를 선택합니다.

![plugin5](https://blog.kakaocdn.net/dna/TGojU/btrzldY39Dk/AAAAAAAAAAAAAAAAAAAAAMDHaxqGd9sB37DOrXQDnBtMapoHBlHBqZwBc552tNq8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Ob89v5dlQfcdVyIfuj3TY51mzYk%3D)

Next로 넘어가면 Token 입력창이 등장합니다.

해당 Token 발급을 위해 다시 SonarCloud 로 넘어갑니다.

SonarCloud의 (우측상단) Profile -> My Account로 차례로 이동합니다.

![plugin6](https://blog.kakaocdn.net/dna/cjVnWj/btrzigiKkjB/AAAAAAAAAAAAAAAAAAAAAKmCgTuaPU7yXijrXJfh9G5lqplMFfz89CPANfW5tU7D/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=l%2FuUKBa4EEgqqsZor%2BRQaSSZIXo%3D)

Security 탭을 보면 Token을 생성할 수 있습니다.

해당 페이지에서 Token을 생성한 뒤,

![plugin7](https://blog.kakaocdn.net/dna/baJQki/btrzmkDCrfo/AAAAAAAAAAAAAAAAAAAAAHmO42QHUznSq_o3Su56HA3bJqovzKXK7LQtqiNu72XD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=MugNvub6RB1v1FUjVMKLUEaipH8%3D)

IDE Connection 입력창에서 Token을 등록합니다.

![plugin8](https://blog.kakaocdn.net/dna/HRUT3/btrzndqKA8b/AAAAAAAAAAAAAAAAAAAAABcORag9C9yyMklxj3BvhEDoGRWksnK2VN7tPy7bdgc7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=UlmxrhK6olh%2FQniQ4kcAAa0aGLY%3D)

그럼 다음과 같이 SonarCloud의 Organization 항목이 나오는데 이를 선택합니다.

![plugin9](https://blog.kakaocdn.net/dna/bXFb5n/btrzjZ1iYCz/AAAAAAAAAAAAAAAAAAAAALga9Vw4TkNuqUrDWE_XkdgWiFPmycGbYWBIi3d2QpXU/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=oh4qBtR7bN10NgA412Nv42NYD7M%3D)

그럼 Connection은 완료되었고, 남은 것은 Project key 입니다.

Project key는 `Information` -> `Project Key, Organization Key` 에서 확인할 수 있습니다.

![projectkey](https://blog.kakaocdn.net/dna/C7GGG/btrzmiTk4fy/AAAAAAAAAAAAAAAAAAAAAOgFShZOoTtqJH5y1bSmFhUUMk1G-m7AItzEOXiZP7qk/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=i05a564jXPSgjOmggIPyn73hlsU%3D)

그럼 다음과 같이 설정이 마무리됩니다.

![plugin10](https://blog.kakaocdn.net/dna/bL8D6E/btrzn8CIvuQ/AAAAAAAAAAAAAAAAAAAAAC1ABGJbrbHSEJDLnW65j9vAGUR6bTLLYSj-ddGPixXu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=C7Mf%2Bm3%2FNSsuydOqymENvAWtEEY%3D)

## 2. 마무리

이렇게 설정이 끝나면 이제 SonarCloud(혹은 SoncarQube) 가 잡아주는 여러 규칙들을 IDE에서도 만날 수 있습니다.

![plugin11](https://blog.kakaocdn.net/dna/ux4UR/btrzmkKp81H/AAAAAAAAAAAAAAAAAAAAADiW2s9NkmGs68aas-MYhltEjsdSVC6KqoWOAQR7lwn2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=yzHKzCQVcSnn14YKLBsAXhRaTs8%3D)

위 Sonar 규칙은 SonarCloud(혹은 SoncarQube)와 동일한 것을 확인할 수 있습니다.

![plugin12](https://blog.kakaocdn.net/dna/dtngDd/btrzlecA8lv/AAAAAAAAAAAAAAAAAAAAAAEjPcyRfISKAGXyOLykJUu9cvUGqw7LAD9IBJF0k7NP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=5Q%2BAMrP6piLF8r8y346Rlz74Lm0%3D)
