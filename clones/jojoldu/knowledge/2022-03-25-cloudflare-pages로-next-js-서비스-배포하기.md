---
topic: "CloudFlare Pages로 Next.js 서비스 배포하기"
source_type: other
source_url: "https://jojoldu.tistory.com/657"
authorship: self
published_at: 2022-03-25
---
# CloudFlare Pages로 Next.js 서비스 배포하기

**작성자:** 향로 (기억보단 기록을)
**게시일:** 2022. 3. 25.

CloudFlare의 정적사이트 플랫폼인 CloudFlare Pages가 출시되었다.

![intro](https://blog.kakaocdn.net/dna/bOIma8/btrxezb5qfV/AAAAAAAAAAAAAAAAAAAAAN6sJT1glNiFeTJzhJ9hWqrQ3WSiGbQmcrzqTaZMa3Eb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=C7TptkCDmY9TCy9fm816R5R5cD8%3D)

- [https://pages.cloudflare.com/](https://pages.cloudflare.com/)

이미 [Netlify](https://jojoldu.tistory.com/546) 와 같이 정적 사이트 플랫폼이 많은데 굳이 CloudFlare를 써야하나? 싶었다.

(저도 그동안은 Netlify을 썼기 때문에)

그럼에도 써봐야하는 이유는 Free Plan의 구성이 말도 안되게 좋기 때문이다.

![cf0](https://blog.kakaocdn.net/dna/cZlMUv/btrxfvgdQL3/AAAAAAAAAAAAAAAAAAAAAJsZz9vOBvCoF8sJSyf18MoaBxFM5CvKoEotXxoNrcdI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=PpruoO5aFvfXSKc4YnLvhfjbpQk%3D)

- 무제한 사이트 발행
- 무제한 요청
- 무제한 대역폭

Free Plan 라고는 믿을수 없을만큼의 좋은 혜택을 제공한다.

대부분의 정적 사이트가 저정도 혜택은 유료 Plan인걸 고려하면 선택하지 않을 이유가 전혀 없다고 생각했다.

## 1. Next.js App 생성

먼저 간단한 Next.js App을 생성한다.

> 여기서 사용된 코드는 모두 [Github](https://github.com/jojoldu/react-in-action) 에 있다.

```
npx create-next-app react-in-action --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
```

- react-in-action 으로 프로젝트를 생성한다.

![next](https://blog.kakaocdn.net/dna/6saR7/btrxeziRP6I/AAAAAAAAAAAAAAAAAAAAAOqAx-cd5Tq8zBSumz7MNoBubQGU5E9oGmsF0JFfCfRJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=e8WOlxgmWs17gf7jARsl7%2BybKoQ%3D)

이렇게 생성된 샘플 프로젝트에 아래 2가지 설정을 추가한다.

### 1-1. export 추가

생성된 프로젝트의 `package.json` 을 열어서 아래와 같이 `build` 에 `next export` 를 추가한다

```json
{
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build && next export",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  }
}
```

- build 한 결과물을 static HTML로 추출하기 위해 `export` 명령어를 추가한다.

추가되었다면 아래 명령어로 잘 작동하는지 확인한다

```
yarn build
```

- `npm`을 쓴다면 `npm run build`

```
yarn run v1.22.10
$ next build && next export
...
info  - Copying "static build" directory
info  - No "exportPathMap" found in "undefined". Generating map from "./pages"
info  - Launching 11 workers
info  - Copying "public" directory
info  - Exporting (2/2)
Export successful. Files written to /Users/jojoldu/git/react-in-action/out
✨  Done in 4.31s.
```

성공적으로 `build` 와 `export`가 되었다면 아래와 같이 `out` 디렉토리가 생성되야만 한다.

![out](https://blog.kakaocdn.net/dna/SaHf4/btrxbOn2JhU/AAAAAAAAAAAAAAAAAAAAADol9LaJrD7jF8quxR-jb-XiBQ7v8ehHstGMJqz9K-uM/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2Bmj51kB8ws8mFeoDNqbUZ1PQVTY%3D)

### 1-2. Node 버전 설정

만약 Node 버전을 12.x 이상 사용해야 한다면 `.nvmrc` 를 통해 Cloudflare Node 버전을 정할 수 있다.

여기서는 `16.4.0` 버전을 사용한다.

![nvmrc](https://blog.kakaocdn.net/dna/cvBMNq/btrxaPtXfwi/AAAAAAAAAAAAAAAAAAAAAB_yrMptKGgHmlUFQV05CGmPX3FphKTpn2jp00wx1PyA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=a4Wt2Rj5H%2F%2BnEA3piuXuNDLKJds%3D)

작업이 끝났다면 해당 코드를 Github에 Push 한다.

![gh](https://blog.kakaocdn.net/dna/ZutkD/btrxfvAxJiz/AAAAAAAAAAAAAAAAAAAAAPS4aq8rucO-qGzesLfvloBOXPIpNXxnXXDK_Bb0DTmh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=mC9hAqPfdVmkCdNedMeXRXQjsrE%3D)

## 2. Cloudflare Pages 설정

Github에 올라간 코드를 배포하기 위해 Cloudflare Pages 에 가입한다

- [https://pages.cloudflare.com/](https://pages.cloudflare.com/)

### 2-1. Github Repository 연결

1에서 올린 Github Repository를 연결한다.

![cf1](https://blog.kakaocdn.net/dna/1IKuD/btrxfvgdQJ5/AAAAAAAAAAAAAAAAAAAAAF73cfRsqKVfEOUemv2M2qEg92KQMSHIe5fvG2X2hs-A/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ubRJke3enS2BfgxujabhWXuqKaI%3D)

1에서 올린 Github Repository가 있는 계정 혹은 org를 선택한다.

![cf2](https://blog.kakaocdn.net/dna/8orNC/btrxfuO8jT8/AAAAAAAAAAAAAAAAAAAAAIRgEUZ7CI6PWPwYj19EMqw5FALHTUyXiOa_JOFzJt0X/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=3FUdEwGtg4NuzkJ1Q0Ms2rcKrq8%3D)

특정 repository를 선택해도 되지만, 이후에도 자주 사용할 예정이기 때문에 전체 repository를 선택한다.

![cf3](https://blog.kakaocdn.net/dna/bQOnFA/btrxfvUPCf4/AAAAAAAAAAAAAAAAAAAAANhAYe-MfRRuPdih56GjRR-i-HU-9fOR4ls5kRD-Z7Rs/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=2%2B5uYOWZNVgDtTncoCMAw2mzEec%3D)

1에서 올린 repository를 선택한다

![cf4](https://blog.kakaocdn.net/dna/nOhFC/btrxbNvUmkC/AAAAAAAAAAAAAAAAAAAAAAVPREnSsz5Q8u0rXKPQ-q9K9fUlybXa7_7FgJymunih/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=afHS1k8RK0VI%2BKEN0LpcOBfgfyg%3D)

- 아쉽게 repository를 검색하는 기능이 없어서 한 페이지씩 넘어가면서 검색해야한다

### 2-2. 배포 설정

Github Repository를 선택했다면, 배포 설정을 한다.

![cf5](https://blog.kakaocdn.net/dna/zLm5U/btrxcxzmcXI/AAAAAAAAAAAAAAAAAAAAAMH_gAaJHXPYWlYjaDZvDKd-UEOArUTikqR1ZgRlVrl_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Hb6ilE%2F5gE2nx%2BIw3D%2Ft89rC6JA%3D)

- 서비스가 Next.js로 이루어져있어 Next.js를 선택한다
- 1-1 에서 설정한 `build` 명령어를 빌드 명령어로 등록한다
- `export` 할 경우 기본적으로 `out` 디렉토리에 static HTML이 생성되기 때문에 `out` 디렉토리를 등록한다

정상적으로 설정이 끝나고 빌드를 수행하면 다음과 같이 빌드가 수행된다.

![cf6](https://blog.kakaocdn.net/dna/PK3Dc/btrxbNvUmgO/AAAAAAAAAAAAAAAAAAAAAOXonT-U-JyXUlhBR6jBRxPj02-cJU5nxSv-lpxtGdin/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=lv5%2F4BTV%2BQAhDpJTu%2FEPlqdFGHM%3D)

빌드가 성공했다면, cloudflare에서 제공해주는 URL로 접속해본다

![cf7](https://blog.kakaocdn.net/dna/bnLalC/btrxdO1HrwQ/AAAAAAAAAAAAAAAAAAAAAGCiLkqM4xOeuZ8XzB_9v1WAI2o4Nunc3T7yOxZ97iiE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=QW6D0SVtalN%2F%2BWTLUd%2F10M7U1dk%3D)

아래와 같이 정상적으로 접속이 된다면 모든 설정이 완료 된 것이다.

![cf8](https://blog.kakaocdn.net/dna/bYF9Vf/btrxcaj35gZ/AAAAAAAAAAAAAAAAAAAAAEi3vJMmBwcQDQTcgcoiQWalekfboGwZPLTPqIvjTZGb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ZWBIK%2BbgkDPCYtQcK%2BbviwRcyEE%3D)

## 마무리

규모가 작지만 방문자는 많은 정적 서비스를 하시는 분들이라면, 혹은 사이드 프로젝트를 진행했다가 생각보다 방문자가 많아진 분이라면 Cloudflare Pages는 충분히 좋은 대안이라고 생각한다.
