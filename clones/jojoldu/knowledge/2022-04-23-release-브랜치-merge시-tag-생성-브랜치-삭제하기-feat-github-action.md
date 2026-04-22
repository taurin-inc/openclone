---
topic: "release 브랜치 merge시 Tag 생성, 브랜치 삭제하기 (feat. Github Action)"
source_type: other
source_url: "https://jojoldu.tistory.com/668"
authorship: self
published_at: 2022-04-23
---
# release 브랜치 merge시 Tag 생성, 브랜치 삭제하기 (feat. Gihtub Action)

**Author:** 향로 (기억보단 기록을)
**Publish Date:** 2022. 4. 23.

최근에 상권님의 포스팅을 보고나서 기존 프로젝트의 배포에 대한 추가 자동화를 진행했다.

- [앱 배포후 Jira에서 버전 Release처리 자동으로 하는 방법(feat. GitHub Action)](https://medium.com/prnd/%EC%95%B1-%EB%B0%B0%ED%8F%AC%ED%9B%84-jira%EC%97%90%EC%84%9C-%EB%B2%84%EC%A0%84-release%EC%B2%98%EB%A6%AC-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-feat-github-action-ab4c4ecf437d)

상권님의 포스팅에서는 다음과 같이 Github Action 의 자동화를 구성하셨다.

- Master 브랜치에서 Push가 발생하면
  - PR Merge 가 되어도 Master 에서는 Push가 발동된다
- Merge Commit으로 발생한 커밋 메세지에서 버저닝 번호만 추출해서 Tag로 생성

반면에 우리 프로젝트는 release 브랜치의 반영이 다음과 같이 진행된다.

그래서 그대로 적용할수는 없었고, 우리팀 스타일에 맞게 개조가 필요했다.

- **master Push가 아니라 PR이 merge가 되었을때만 Github Action이 작동하기**
  - 상권님의 Github Action에서는 master Push에서는 전부 Action이 실행 된다.
  - 현재 우리팀의 규칙에서는 모든 Push 를 실행 기준으로 삼지 않았다.
- **release 브랜치명에서 버전 추출하기**
  - release -> master로 반영할때 **Merge Commit을 생성하지 않는다**.
  - 그래서 Merge Commit Message에서 버전을 추출할 수가 없다.

![git-log](https://blog.kakaocdn.net/dna/S1JLl/btrAcu1arrL/AAAAAAAAAAAAAAAAAAAAAGAl0KR1JfwVkhF0dEffeTEBV0vUy7U0jeuBFmUtFTwo/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=x2bmzKhe%2FqBzq6Kt2PMdBjaqjoU%3D)

(`-ff` 로 `merge` 를 진행하며, `merge commit` 을 남기진 않는다.)

그래서 크게 2가지 다른 점이 있기 때문에 이 2가지를 우리 쪽 규칙에 맞게 변경했다.

- release 브랜치가 master 브랜치로 Merge 될 경우에만 **release 브랜치의 이름** 으로 Tag/Release 생성
- Merge가 되면 release 브랜치 삭제
  - 이 부분은 Github Action이 아니고, Github 기본 기능으로 지원된다

## 1. 브랜치명 추출하기

먼저 브랜치명 추출하기부터 진행한다.

해당 작업은 [branch-names](https://github.com/marketplace/actions/branch-names) 을 사용한다.

해당 Action으로 브랜치명이 잘 추출되는지 검증한다.

간단하게 workflow를 하나 생성한다.

![workflow1](https://blog.kakaocdn.net/dna/cky13K/btrAhdQF9TM/AAAAAAAAAAAAAAAAAAAAAPdfv_RdHzQJZLkEIfCrb8mi19fEqQQv9jm31645Ja1i/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ym%2FTC6VtoQD6eVjMq7A5Pk4WjbY%3D)

코드는 다음과 같다.

```yaml
name: echo branch Name
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Get branch names
        id: branch-name
        uses: tj-actions/branch-names@v4.9

      - name: 버전 정보 추출(from Branch Name)
        run: echo "TAG=$(echo '${{ steps.branch-name.outputs.current_branch }}')" >> $GITHUB_ENV

      - name: echo current branch name
        run: echo "current branch name - ${{ env.TAG }}"
```

핵심 로직은 다음과 같다.

- `echo "TAG=$(echo '${{ steps.branch-name.outputs.current_branch }}')" >> $GITHUB_ENV`
  - 현재의 브랜치를 `TAG` 라는 **Github 환경 변수에 저장** 한다.
  - 이렇게 저장된 환경 변수는 `${{ env.TAG }}` 와 같이 **다른 Step에서 사용할 수 있다**.
  - 실제 release 브랜치에서 버전을 추출한 것은 아니다.
  - 이는 아래 코드에서 진행한다.

저장된 환경변수 값이 잘 출력되는지 확인해본다.

![echo](https://blog.kakaocdn.net/dna/7sgDx/btrAc7djmfB/AAAAAAAAAAAAAAAAAAAAAFO0e5lQHwSDBfWi_FsFWc5Cwqs8RVHhgM6sdYWF0S25/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=M0w1IsVQyXu0rSYjGv9Mnb8%2FUzE%3D)

브랜치명 추출 작업이 잘 되는것이 확인되었으니 본격 작업에 들어간다.

## 2. Tag/Release 생성을 위한 Github Action 작성하기

다음과 같이 `release.yml` workflow 파일을 생성하고, 다음과 같이 yml을 작성한다

![workflow2](https://blog.kakaocdn.net/dna/2LiL9/btrAfDPTuv9/AAAAAAAAAAAAAAAAAAAAAKiMJDLdQ67fYDJwOnioO960JyYhE1imFymy8EX6N-3s/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7bapWO5E1%2B0NvwORjJZoQC4wo1I%3D)

```yaml
name: Release
on:
  pull_request:
    branches:
      - master
    types: [ closed ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Get branch names
        id: branch-name
        uses: tj-actions/branch-names@v4.9

      - name: 버전 정보 추출(from Branch Name)
        run: echo "TAG=$(echo '${{ steps.branch-name.outputs.current_branch }}' | egrep -o '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')" >> $GITHUB_ENV

      - name: Release & Tag 생성
        if: github.event.pull_request.merged == true
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ env.TAG }}
          release_name: ${{ env.TAG }}
```

위 코드를 해석하면 다음과 같다

```yaml
on:
  pull_request:
    branches:
      - master
    types: [ closed ]
```

- 공식적으로 Github Action에는 **PR Merge on type이 없다**
- 그래서 `on type`에서는 `Pull Reqest Closed` 를 기준으로 둔다.
  - 그 아래에서 각 Step에 `if`로 `merge` 를 걸러낸다

```yaml
- name: Release & Tag 생성
  if: github.event.pull_request.merged == true
  uses: actions/create-release@v1
```

- `if` 를 통해 **pull request가 merge 되었을때만** Tag와 Release 가 생성되도록 한다.
- 해당 조건이 없으면 **Merge가 아닌 모든 closed 이벤트에서 Tag 생성과 Release 생성** 이 진행되니 필수로 추가한다

이렇게 작성이 완료되었다면 Tag와 Release 생성에 대한 작업은 끝났다.

## 3. Merge된 release 브랜치 삭제

Merge된 release 브랜치 삭제에 대한 Github Action이 별도로 필요하진 않다.

이미 Github 에서 해당 기능을 제공하기 때문이다.

![delete](https://blog.kakaocdn.net/dna/Ervmf/btrAdYUsIKw/AAAAAAAAAAAAAAAAAAAAAF9cSBbNG6zMD0WeztyXsP4RQ1SVT8mthRCAFHwbp13W/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ZDbfluJW%2FNEn%2FQhOZEF5HriDy%2Fw%3D)

- [Github 공식 문서](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches)

모든 설정이 끝났다면 이제 검증해본다.

## 4. 검증

release 브랜치를 master에 merge하고 Tag/Release 생성과 release 브랜치가 잘 삭제되었는지 확인한다.

**Tag 생성**

![tag](https://blog.kakaocdn.net/dna/bb9t9b/btrAdXONxvz/AAAAAAAAAAAAAAAAAAAAAAz-WPqt4QGqOOMQaoeyX11PB4v6gIB5JVPyJ9fd2uIx/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=o%2BQZs61n%2BaYOF%2BRJi6%2FrkfENlfs%3D)

**Release 생성**

![release](https://blog.kakaocdn.net/dna/Cb20z/btrAdZy58VF/AAAAAAAAAAAAAAAAAAAAAIRtSKBpUJSXiMHc8vz3pttTFgBrj4p7Fp2LGh1uhCCu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ugB70JotPaFPTgIYLwQUMvCIOlM%3D)

**브랜치 삭제**

![branch](https://blog.kakaocdn.net/dna/BGXhb/btrAgpw3JqN/AAAAAAAAAAAAAAAAAAAAAO2uFen9vJEeP2qlrlqRW9lFtZjIKJDub3ICH8ooN4Z6/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=8Wo%2FCSEoNg0kZhSqW32WnONZTN4%3D)
