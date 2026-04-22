---
topic: "Qodana 무료로 시작해보기 및 SonarQube와의 비교 분석"
source_type: other
source_url: "https://jojoldu.tistory.com/759"
authorship: self
published_at: 2023-11-23
---
# Qodana 무료로 시작해보기 (2023.11)

**Author:** 향로 (기억보단 기록을)
**Date:** 2023. 11. 23.

JetBrains에서 SonarQube와 같은 정적 분석 도구를 출시했다.

- [Qodana](https://www.jetbrains.com/ko-kr/qodana/)

JetBrains 에서 출시하는 제품들은 일단 관심을 가지게 된다.

IntelliJ, WebStorm, DataGrip 등을 몇년간 계속해서 사용하면서 충분히 만족감을 느꼈고 (불편함이 없진 않았지만), 최근에 출시한 [Writerside](https://www.jetbrains.com/ko-kr/writerside/) 도 VSCode를 대체한 마크다운 에디터로 잘 사용하고 있다.

그만큼 DX를 가장 신경쓰는 제품을 만드는 회사라는 확신이 있기 때문에 이번 Qodana 역시 기존의 Sonar 제품들을 잘 대체할 수 있을까 하는 기대감에 사용해보게 되었다.

그리고 기존에 잘 사용하던 SonarQube의 대체제를 고민하던 시점이기도 했다.

Qodana는 SonarQube에 비해 어떤 장점이 있을까?

눈여겨 본 가장 큰 이유가 **가격 경쟁력** 이였다.

![price1](https://blog.kakaocdn.net/dna/4h703/btsAL57iBCN/AAAAAAAAAAAAAAAAAAAAABVvSk2X7VWSNat2r2fpgoqCrQyZNbynSpKoTb587Bb8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=82EErlzlblm9Caq6G549t4LVtXc%3D)

2개의 도구는 서로 다른 조직에 적합하다.

- **SonarQube**
  - **전체 라인수** 비례 가격
  - 개발자가 많지만 프로젝트는 분산되지 않은 경우
  - 단일 프로젝트에 여러명의 개발자가 활동하는 경우
  - 반대로, 프로젝트가 여러개면 이에 따른 **비즈니스 외 코드들도 그만큼 늘어서 라인수가 기하급수적으로 늘어난다**.
- **Qodana**
  - **활성화된 사용자수** 비례 가격
  - 개발자에 비해 프로젝트 수가 많은 경우
  - 개발자가 많은 것에 비해 프로젝트 수가 적으면 한명 한명 채용될때마다 부담스럽다.
    - SonarQube와는 완전히 반대상황이다.

현재 우리 조직은 거대한 레거시 하나를 작은 레거시 프로젝트 여러개로 나눠서 **개발인원 / 팀 규모에 비해 라인수가 상당히 높다**.

실제 우리팀의 현 상황은 다음과 같다.

- 26명의 개발자
- 94만 라인수

![price2](https://blog.kakaocdn.net/dna/rzoNY/btsAMW9SuNQ/AAAAAAAAAAAAAAAAAAAAAJKycF3qbo2DhePXP5drqNNYXGZt5FqNwqtTUtC0rv4O/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=2DhPFhfN0suF1AWpLYlYaW0otbI%3D)

이때 2개 서비스의 가격을 비교해보면 (연간 $4,000 / 517만원) 만약 여기서 조금만 프로젝트 규모가 커지면 다음 플랜의 가격은 100% 상승한다. (1m 다음 플랜이 바로 2m이다.)

반면 Qodana로 비교하면 (연간 $60 * 26 = $1,560 / 200만원) 개발 팀원이 40명으로 늘어난다 하더라도 $2,400 (310만원) 이다.

현재 기준으로는 **1/3 가격으로 정적 분석 도구를 사용** 할 수 있다.

Qodana로 연간 $8,000 정도가 되려면 **개발팀원이 130명이상 되어야만** 하는데, 여기까지 가려면 아직 한참 시간이 남았다.

소수의 인원으로 다양한 프로젝트를 해야하는 (웹/앱/서버) 스타트업 특성상 Qodana의 가격 정책은 굉장히 합리적이다.

그래서 일단 개인 계정으로 무료로 한번 사용해보자.

## 1. Qodana Cloud 생성 및 프로젝트 연결

[JetBrains 계정](https://www.jetbrains.com/ko-kr/) 이 있다고 가정하고, [Qodana Cloud](https://qodana.cloud/) 에 접속하여 로그인한다.

접속을 하면, Team을 만들어야 한다. (Team 안에 여러 Repo를 연동시킬 수 있다.)

team를 만들었다면, 다음과 같이 프로젝트를 연결할 수 있다. 해당 team을 클릭해 들어가면 `Create project` 버튼이 있는데, 이를 클릭하여 해당 team에서 관리하고자 하는 Github Repo를 연결한다.

Project 생성시에 `SSH URL` 을 요구한다. 이는 Github Repository의 `Code > SSH` 에서 확인할 수 있다.

해당 정보를 등록 한 뒤, 바로 아래에 있는 `Public key` 는 Github의 해당 Repo에 `Deploy Key`로 등록해야한다.

이제 Github Repository에 들어가서 `Settings > Deploy keys` 에서 `Add deploy key` 를 클릭한다. `Title` 은 아무거나 입력해도 되고, `Key` 에는 위에서 복사한 `Public key` 를 붙여넣는다.

단, 여기서는 **저장소 코드만 스캔 하는 것을 목표로 하기 때문에** 굳이 해당 옵션을 체크하지 않는다.

이제 다시 Qodana Cloud로 돌아와서 보면 `Project` 가 생성된 것을 확인할 수 있다.

이후부터는 어느 도구로 Qodana를 연동할 것인지 가이드가 나온다. 여기서 하단의 Key는 **Github Action에서 사용해야할 Key** 이다.

그래서 Github Repository의 `Settings > Security -> Secrets and variables -> Actions` 에서 등록해야한다. `Name` 은 `QODANA_TOKEN` 으로, `Value` 는 위에서 복사한 `Key` 를 붙여넣는다.

이제 모든 환경 설정은 끝이났다. Github Action 의 연동으로 PR / Push가 발생할때마다 코드 분석이 되도록 진행한다.

## 2. Github Action 연동

프로젝트 기준으로 `./github/workflows/qodana.yml` 파일을 생성한다. (파일명은 아무거나 상관없다.) 그리고 아래 내용을 붙여넣는다.

```yaml
name: qodana

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - "**"

jobs:
  qodana:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      checks: write
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.sha }}  # to check out the actual pull request commit, not the merge commit
          fetch-depth: 0
      - name: Use Node.js 18.x
        uses: actions/setup-node@v2
        with:
          node-version: 18.x
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install

      - name: 'Qodana Scan'
        uses: JetBrains/qodana-action@v2023.2
        with:
          pr-mode: false
          args: --apply-fixes
          push-fixes: pull-request
        env:
          QODANA_TOKEN: ${{ secrets.QODANA_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- master push, 모든 pull Request에 대해 실행
- TS & ESLint를 사용하고 있어서 Node.js 18.x / yarn을 사용

이제 Github Action을 통해 코드 분석이 진행된다. 분석이 완료되면, Github Repository의 `Actions > qodana` 에서 결과를 확인할 수 있다.

Qodana Cloud로 다시 이동해보면 Scan 결과를 확인할 수 있다. 특정 코드의 문제점 역시 함께 상세하게 분석해준다.

## 3. IDE (IntelliJ, WebStorm 등) 연동

Qodana Cloud의 분석 결과를 실시간으로 IDE에서도 확인할 수 있다. Sonar에 비해 Cloud에서 분석한 결과를 IDE로 내려주는 방식이라, 로컬에서 실시간 분석을 위해 자원을 소모하지 않는다는 장점이 있다.

IDE에서 `Tools -> Qodana` 를 선택한다. (만약 없다면 `Plugins` 에서 `Qodana` 를 설치한다.)

Log In 버튼 클릭후 로그인을 하면, 연동된 프로젝트가 나타난다. 해당 프로젝트를 선택하고 `Apply` 를 클릭하면 분석 결과를 실시간으로 확인할 수 있다.

연동이 완료되면 Qodana와 동일한 분석 결과를 IDE에서 실시간으로 받아볼 수 있다.

## 후기

무료플랜으로는 막상 사용하기가 애매하다. 언어쪽은 TS로 된 프로젝트도 측정해주는것 같다.

다만, **테스트 커버리지 측정이 안된다는 것** 이 무료 버전의 큰 단점이다. 공개된 프로젝트에서는 대부분의 기능을 사용할 수 있는 SonarCloud에 비해 Qodana에서는 그런 기능이 유료플랜에만 지원하는것 같다.

이런 정적 분석 도구들은 최대한 많은 분석 자료들이 쌓이면 좋을텐데, 공개 프로젝트들에 한해서는 최대한 많은 기능을 오픈해주는게 어떨까 하는 아쉬움도 든다.

이후에 JetBrains 오픈소스 라이센스를 얻어서 풀 기능으로 제대로 비교를 해봐야할것 같다.
