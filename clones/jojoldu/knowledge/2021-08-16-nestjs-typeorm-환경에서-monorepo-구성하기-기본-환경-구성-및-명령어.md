---
topic: "NestJS & TypeORM 환경에서 Monorepo 구성하기 - 기본 환경 구성 및 명령어"
source_type: other
source_url: "https://jojoldu.tistory.com/594"
authorship: self
published_at: 2021-08-16
---
# 1. NestJS & TypeORM 환경에서 Monorepo 구성하기 - 기본 환경 구성 및 명령어

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 8. 16.

지난 시간에 [yarn workspace](https://jojoldu.tistory.com/585) 를 활용한 Monorepo를 소개 드렸는데요.

이번 시간에는 NodeJS의 대표적인 MVC/DI 프레임워크인 [NestJS](https://docs.nestjs.com/) 를 활용한 모노레포 구성을 진행해보겠습니다.

> 가끔 NestJS를 Spring 프레임워크와 비교하는데요.
>
> NestJS는 Spring 중에서도 Spring MVC와 같은 역할을 하는 것이지 Batch / Cloud / Security / Data 등을 모두 지원하는 엔터프라이즈 프레임워크인 **Spring 프레임워크 전체와 비교하기엔 어렵습니다**.
>
> 누가 더 뛰어난 프레임워크를 이야기하는건 아니지만, 100% 대칭된다고 보기는 어려워서 오해하시는 분들이 계셔서 먼저 말씀드립니다.

이번 편에서는 TypeORM 등의 다른 프레임워크까지의 통합은 배제하고, NestJS만으로 진행하겠습니다.

> 모든 코드는 [Github](https://github.com/jojoldu/monorepo-nestjs-typeorm) 에 있습니다.

## 1. 프로젝트 구성

직접 모노레포을 구성해도 되지만, NestJS에서는 이미 **CLI로 모노레포 구성** 을 지원하기 때문에 CLI로 진행하겠습니다.

아직 NestJS CLI를 설치하지 않으셨다면 아래 명령어로 설치합니다.

```
npm install -g @nestjs/cli
```

설치가 다 되셨다면, CLI로 NestJS로 프로젝트를 생성합니다.

```
nest new monorepo-nestjs-typeorm
```

그럼 아래와 같이 기본적인 NestJS 프로젝트가 구성됩니다.

![new](https://blog.kakaocdn.net/dna/bqCzjL/btrcgPTRcDP/AAAAAAAAAAAAAAAAAAAAACE9q7WNDOWpl9bE1NQCCI56zDSvdiYs_kWMUeKF7nqT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=EWb86z6UzfD31W0GxcNyXwNLMpg%3D)

## 2. 모듈 추가

이렇게 구성된 프로젝트가 실제 깃헙 저장소와 연결이 될 예정이고,

이 하위에 각각의 모듈들이 추가될 예정인데요.

전체적인 모듈 구성은 다음과 같이 됩니다.

![module](https://blog.kakaocdn.net/dna/cV23Tn/btrb7x8fDsl/AAAAAAAAAAAAAAAAAAAAANjo2XD8vS9bsrY2pSzH2_zYFnlZqmJ4q5ZWNyCougKL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=N7nzIrWbEhAhqaZFkKxCphqMk5A%3D)

- apps
  - **별도의 서버로 배포될 애플리케이션** 들입니다.
  - 하나 하나가 단독 실행 가능한 모듈입니다.
- libs
  - 공유 라이브러리로 보시면 되는데요.
  - apps 에서 이들을 의존해서 사용합니다.

먼저 애플리케이션으로 사용할 `api` 모듈을 생성해봅니다.

### 2-1. apps 추가

NestJS CLI로 아래와 같이 실행하면 `apps`에 `api` 모듈이 추가됩니다.

```
nest g app api
```

![new-api](https://blog.kakaocdn.net/dna/bjjz6N/btrb9Q65yn2/AAAAAAAAAAAAAAAAAAAAAI0lZ3VAsnuC-BpQGFUr2sZOTPqqPXmIRSynLjff7wfz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=fnKoBDQd%2FHyr1%2Fo4WTEMLqEicL0%3D)

동일한 Workspace 내에서 기존 모듈과 함께 하위 모듈을 생성합니다.

모노레포 속 하위 모듈들은 동일한 `node_modules` 폴더(단일 버전 정책) 및 구성 파일(예: tsconfig.json및 nest-cli.json)을 공유합니다.

구성은 공통으로 관리되지만, 실행 및 배포는 별도로 가능합니다.

admin 모듈을 추가해봅니다.

```
nest g app admin
```

이렇게 별도로 실행할 app 모듈을 추가했다면,

이제 이들 app 모듈들이 공통으로 사용할 lib 모듈을 추가해보겠습니다.

### 2-2. libs 추가

마찬가지로 라이브러리 모듈 생성은 아래 명령으로 가능합니다.

```
nest g lib entity
```

![new-entity](https://blog.kakaocdn.net/dna/bqFFWk/btrb8gyro6T/AAAAAAAAAAAAAAAAAAAAAOc-Kgfg1OoFMCZ_LPATWfPoxeUwNsQC5vs4oA6etylO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=gRAf3yDAtzzRyS%2F%2BecWLJk7iWmE%3D)

이 두 명령 (`nest g app 모듈명`, `nest g lib 모듈명`) 은 모두 `nest-cli.json` 에서 `projects` 를 **자동으로 업데이트** 해줍니다.

즉, 일반적으로 **내용을 수동으로 편집할 필요는 없습니다**.

(기본 파일 이름 등을 변경하는 경우 제외).

> NestJS의 모노레포에 대한 좀 더 상세한 내용은 [공식문서](https://docs.nestjs.com/cli/monorepo) 에서 찾아볼 수 있습니다.

### 2-3. 기존 모듈 제거

이제 `api` 와 `admin` 모듈로 서비스를 할 예정이니, 처음 생성할 때 있었던 모듈은 제거하겠습니다.

제거할 곳은 2군데 입니다.

첫번째는 **모듈 디렉토리** 입니다.

![remove1](https://blog.kakaocdn.net/dna/do4C2f/btrcgP7nG0q/AAAAAAAAAAAAAAAAAAAAAIszfQCNK2kck-4nqyaqp9apX6BPlj4WT8PiZNisFRpb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=auMxKt8eGgmvIBJtcnCCwLoRRg4%3D)

두번째는 `nest-cli.json` 에서 `projects` 에서 모듈 메타데이터 입니다.

![remove2](https://blog.kakaocdn.net/dna/cxZRy3/btrb7zruys4/AAAAAAAAAAAAAAAAAAAAAAyaEu8h28mN4oDMFHPAF8bNc6l9OCh7RB0n2nTjgrZJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7FhwdBeOvj0HQj2dziCQak843Dc%3D)

둘 모두 제거 하셨다면, 이제 더이상 해당 모듈은 모노레포 관리 대상이 아니게 됩니다.

## 3. 시작

하위 모듈만 별도로 실행하는 방법은 아래 명령어로 가능합니다.

```
nest start api
```

만약 **watch 실행** 가 필요하면 다음과 같이 watch로 실행 가능합니다.

```
nest start api --watch
```

모듈별 실행도 확인되셨다면, 이제 공통 라이브러리인 `libs/entity` 모듈을 사용해보겠습니다.

### 3-1. libs 모듈 의존성

간단하게 `libs/entity` 의 `entity.service.ts` 파일에 함수를 추가하여, 이를 `api` 모듈이 DI (의존성 주입) 받아 사용하는 코드를 작성해보겠습니다.

**libs/entity/src/entity.service.ts**

![add-entity0](https://blog.kakaocdn.net/dna/ba9ylS/btrclH14lJq/AAAAAAAAAAAAAAAAAAAAAB81WsJSKXS6ZEUjFL97K7r7elcPUQPg5APVJnFqvSm7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=K%2BdB3fRwXRKVv2QEe0aEEDG89Mg%3D)

**apps/api/src/api.module.ts**

![add-entity1](https://blog.kakaocdn.net/dna/6cg9N/btrcgPzx8XN/AAAAAAAAAAAAAAAAAAAAAO8MmK5jGvgxC4WjmNiAN4DI9N1PfQRSK-0DeVy_GD5-/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=xpSDlyWleSp1qBXJlchSO9SmrRM%3D)

**apps/api/src/api.controller.ts**

![add-entity2](https://blog.kakaocdn.net/dna/d41AGf/btrb7z55TjP/AAAAAAAAAAAAAAAAAAAAADgU6_Aul36PMDgOXsGVBc0BGS2FWoqZ1j0xArcDkWN8/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=5Ux%2FNWdhBPkYRule29Ym3xHVcb8%3D)

그리고 다시 `api` 모듈을 실행해보면?

![add-entity3](https://blog.kakaocdn.net/dna/blLBkc/btrb82mnQfp/AAAAAAAAAAAAAAAAAAAAAHdHs1msuCIbyQJeemyqAlYhaIX_j94FXB-m2-YFm-zf/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=fn7itnx7cd4IsRoVOjDG9xzsRMY%3D)

서비스 모듈이 잘 추가되어 사용할 수 있음을 확인할 수 있습니다.

## 4. 빌드

각 모듈별로 배포하기 위해 **모듈별 빌드가 필요할 경우** 아래 명령어로 가능합니다.

```
nest build api
```

이렇게 할 경우 아래와 같이 **실행 가능한 단일 파일** 이 생성 됩니다.

![build1](https://blog.kakaocdn.net/dna/cYowdE/btrb7zSxifl/AAAAAAAAAAAAAAAAAAAAAAcfDJEE4OrWbkJdHmMYJR55hAoZSf6qvgq0xr4i1EEr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=sLCinpca8yRM8Yi1%2Fiu%2BMY21n3Q%3D)

즉, EC2 서버마다 `yarn install`을 할 필요 없이, CI 서버에서 빌드를 끝내고 나면 각 서버들은 이제 해당 단일 파일을 실행만 시키면 됩니다.

![build2](https://blog.kakaocdn.net/dna/blSmVh/btrb8hxoKJI/AAAAAAAAAAAAAAAAAAAAAOvADeqitmm-K1RAVwghqtThAAd6fHYYCdPHDidgELNA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=xNlApeogTzTEB7%2FrAQpmgABimR4%3D)

그럼 아래와 같이 정상적으로 앱이 실행된 것을 확인할 수 있습니다.

![build3](https://blog.kakaocdn.net/dna/bxYfbp/btrcb9rMvRN/AAAAAAAAAAAAAAAAAAAAAHP5mWBUpICzNEofD60LRK3vO62sKdr2Aum9M_xR3TJF/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=1VBbvtztdkl%2BGm2SM2tMQf6GtTk%3D)

## 5. 마무리

확실히 다른 프레임워크의 모노레포 구성 보다, NodeJS 진영의 모노레포 구성은 쉽다고 생각합니다.

물론 직접 구성한다면, 훨씬 더 어렵겠지만 워낙 CLI를 통한 작업 방식이 발전해서 그런지 CLI로 편하게 생성해보니 이런 점들은 다른 진영에서도 적용되면 좋겠다는 생각이 듭니다.

다음 시간에는 현재 프로젝트에 TypeORM을 곁들여 모노레포를 구성해보겠습니다.
