---
topic: "Jira Release 발생 시 Slack으로 릴리스 노트 자동 발행하기"
source_type: other
source_url: "https://jojoldu.tistory.com/670"
authorship: self
published_at: 2022-05-02
---
# Jira Release 발생시 Slack에 Release Notes 발행하기

**Author:** 향로 (기억보단 기록을)  
**Publish Date:** 2022. 5. 2.

회사 업무를 진행하다보면 매번 자주 하는 작업 중 하나가, 배포공유이다.

배포가 완료되고, Jira의 티켓들을 Release 하고나면, **어떤 티켓들이 이번에 운영에 배포되었는지를 Slack에 공유** 하는 것이다.

매번 하는 것이 귀찮으니, 자동화를 진행할 필요가 있다.

## 1. Jira Rule 생성

Jira에는 **자동화를 지원하는 기능** 이 있다.

[Automation](https://www.atlassian.com/ko/software/jira/features/automation) 이라는 기능인데, Jira의 굉장히 많은 기능들을 **별도의 앱 없이 자동화** 를 사용할 수 있도록 한다.

이를 이용하면 Slack / Github / Jenkins 등의 연동을 아주 쉽게 할 수 있다.

이번 글에서도 마찬가지로 Jira Automation을 이용해서 진행한다.

Jira 보드의 좌측에 있는 **Project settings** 를 선택한다.

![app1](https://blog.kakaocdn.net/dna/xv7nw/btrA33GJxQO/AAAAAAAAAAAAAAAAAAAAAE_9LHmwcwYIP1OUY66g5A6-rkuEfCnx8zcuVcDUW6bP/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=28amJXy2GUqc8ieVpac%2B6JyOOU4%3D)

이동된 좌측 사이드바의 **Automation** 을 선택한 뒤,

![app2](https://blog.kakaocdn.net/dna/diyVrR/btrAWBL87En/AAAAAAAAAAAAAAAAAAAAALsSwSj1Cz0B0xWHZ7Yr0rvu56MUqa3nWzoJu1EfBox8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=fd%2FLg5UpLtX3QTUMcrZ%2FU59rhGk%3D)

**Create rule** 을 클릭한다.

![app3](https://blog.kakaocdn.net/dna/zHDTY/btrAWzOnufm/AAAAAAAAAAAAAAAAAAAAAFQ2PbpANoEMxkujRf6c6bPP3nTYwrGPGoFV35v0jKTT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=j9mUrxJ%2FKvrqkB37XDUI%2FSWycWY%3D)

그럼 Automation의 앱을 만들수 있는 페이지로 이동하는데, When (Trigger) -> Then (Action) -> And (Action) 의 템플릿으로 생성이 가능하다.

이 Rule의 트리거는 **Jira Version이 release 되었을때** 이니, 이를 새로운 트리거로 등록한다.

![app4](https://blog.kakaocdn.net/dna/cO819f/btrA0ArXYD5/AAAAAAAAAAAAAAAAAAAAADRt-_l3lW65zkcnjlCuHN9QxoYzEymD3_ffWBwyv4ti/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=0SbfSkejrDNJmwEfLpzzlT0mfgM%3D)

해당 트리거가 발생 후, 실행할 행동을 위해 **New action** 을 선택한다.

![app5](https://blog.kakaocdn.net/dna/vMmqS/btrA4QUF3Me/AAAAAAAAAAAAAAAAAAAAAHQMDnSN6oH2Infmoykli2czUdQ3c-jQDcBOFvyUtMo4/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=xYYm3gva82BedvOPaSBKCnWgMR0%3D)

**어떤 Jira 티켓들을 슬랙으로 보낼지** 조회를 할 수 있도록 다음 행동은 **Lookup issues** 를 선택한다.

해당 액션은 **JQL을 통해 티켓들을 가져올 수 있다**.

이를 통해 **특정 프로젝트의 해당 버전에 해당하는 티켓들만** 가져올 수 있다.

![app6](https://blog.kakaocdn.net/dna/v7sz8/btrAZfaxrQ0/AAAAAAAAAAAAAAAAAAAAANaieCuoVgqs4l6xUGmvVoNDMgqqE9sGEjaJGX5MMFVc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=O%2FNwKGHg9q441NUKAa%2BTsXRiFps%3D)

특정 프로젝트의 특정 버전의 티켓들만 가져오기 위해서 다음과 같이 JQL을 작성한다.

![app7](https://blog.kakaocdn.net/dna/buscMD/btrA3rVnIEl/AAAAAAAAAAAAAAAAAAAAAAArfbElnv-nP03KvpKAjU6iwCRp7qIjHf6-g49nMda7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7290M1edasa3pGYighFIz4OgjxA%3D)

```sql
project = 프로젝트ID AND fixVersion = '{{version.name}}'
```

이렇게 가져온 Jira 티켓들의 정보를 Slack으로 보내기 위해 다음 액션을 선택한다.

![app8](https://blog.kakaocdn.net/dna/nbpnL/btrA4RTAmK1/AAAAAAAAAAAAAAAAAAAAAG5yZPvTCzhIXEY0l4uiNHQcTSsnzoL4Y_wkDG8g7Gly/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Bq6jzTr3KUX9azhX2ITTPw7%2Bamg%3D)

Slack 연동은 기본적으로 지원하는 액션이라 바로 Slack 을 검색해서 선택한다.

![app9](https://blog.kakaocdn.net/dna/br3TRY/btrA3sUjXGW/AAAAAAAAAAAAAAAAAAAAAN7ZX1akXawaul9Y52PkmOeG6ULE4zYn0sWUKNbn6qMR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=yrbi%2B%2BbgI7iZVQqveYvsPoNAp58%3D)

미리 생성해둔 Slack 웹훅 주소를 등록하고, 다음과 같이 슬랙 메세지를 작성한다.

![app10](https://blog.kakaocdn.net/dna/9Mfwk/btrAWA7yBCH/AAAAAAAAAAAAAAAAAAAAABYpZuiIz8DcbRQZoLyxuWFRzqJg0Ed9B9esOTz6QccJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2BApHE5KFkk4BiFsWCAqGh8mNY5U%3D)

```text
운영 배포 되었습니다.

version: {{version.name}}
releasedAt: {{now.jqlDateTime.convertToTimeZone("Asia/Seoul")}}

-------- 반영 티켓 --------

{{#lookupIssues}}
- <{{url}}|[{{key}}]> {{summary}}
{{/}}
```

미리 정의된 시스템 변수들은 다음의 링크들을 참고한다.

*   [https://support.atlassian.com/cloud-automation/docs/what-are-smart-values/](https://support.atlassian.com/cloud-automation/docs/what-are-smart-values/)

이렇게 Rule 생성이 끝났다면 실제로 Jira Release를 진행해본다.

## 2. 최종

Jira의 Release 페이지로 이동한뒤,

![release1](https://blog.kakaocdn.net/dna/rOgV8/btrA33zYnF4/AAAAAAAAAAAAAAAAAAAAACKi4s85dYA3z2kWIEyiRFCW_RYMX1kpDAP_P4Cy_fs5/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=jnAwmQ07Wok5vNtOHZqXKD%2Bpgmc%3D)

이번 배포에 해당하는 내용들을 Release 해보면?

![release2](https://blog.kakaocdn.net/dna/dGgIDN/btrAWANhPJj/AAAAAAAAAAAAAAAAAAAAAJWYR-M20wS1aJBBhgX-UFwTYt2BEgG1FBAv0YWg6EjD/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Qv3ghLACLg7RdmNL8gCFBxrca6I%3D)

다음과 같이 지정된 포맷대로 Jira 티켓들이 Slack 메세지에 정리되어 공유된다.

![result](https://blog.kakaocdn.net/dna/VZbfI/btrA3szY32I/AAAAAAAAAAAAAAAAAAAAAJzFlSLBGNZ0_BTzeiTuztpNzYl4xCNqxFoqdmkoiRLE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=CfAhcszRK7wJQbax3ytgKhOFy9g%3D)

## 3. 마무리

여기까지 되었다면, 이후에 본인의 CI환경에 따라 **배포가 완료되면 자동으로 Jira Release가 되도록** 하는것도 이어서 할 수 있다.

*   [Jira version Update API](https://docs.atlassian.com/software/jira/docs/api/REST/8.5.4/#api/2/version-updateVersion)

이 부분은 각자가 사용하는 CI 환경에 따라 많은 차이가 있어서 (까나리배포를 한다던가, 사용하는 도구가 Jenkins / CircleCI / Github Action 등이라던가) 개별적으로 구현한다.
