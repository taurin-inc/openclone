---
topic: "스케일링 가능한 Ngrinder 환경 구축하기 (feat. AWS Beanstalk)"
source_type: other
source_url: "https://jojoldu.tistory.com/581"
authorship: self
published_at: 2021-06-18
---
# 스케일링 가능한 Ngrinder 환경 구축하기 (feat. AWS Beanstalk)

**Author:** 향로 (기억보단 기록을)  
**Publish Date:** 2021. 6. 18.

네이버의 [Ngrinder](https://github.com/naver/ngrinder) 는 대표적인 성능 부하 테스트 도구입니다.

개인적으로는 다른 테스트 도구들에 비해서 설치 과정이 조금 번거롭다는 단점에 비해 사용성과 UI/UX가 너무 직관적이라는 장점으로 인해서 오랫동안 애정하고 있는 제품인데요.

- [서버 퍼포먼스 테스트 툴 사용후기](https://tech.madup.com/performance_test_tool/)

설치형을 지원하다보니 **동적으로 Agent 수를 늘리고싶을때** 마다 설치된 이미지로 서버를 재생성하는 방식으로 늘리는게 참 불편했습니다.

이럴 경우 AWS를 통해서는 보통 2가지 방법으로 해결할 수 있는데,

- 오토스케일링 그룹
- Beanstalk

등 동적으로 동일한 서버 환경을 편하게 증설할 수 있습니다.

이번 시간에는 AWS Beanstalk을 이용하여 스케일링 가능한 Ngrinder 환경 구축하기를 진행해보겠습니다.

## 1. EC2에 Controller 설치하기

가장 먼저 Ngrinder의 Agent를 관리하고, 성능 테스트 전체를 관리하는 Controller를 EC2에 설치해보겠습니다.

![architecture](https://blog.kakaocdn.net/dna/w6PMQ/btq7CjmadYY/AAAAAAAAAAAAAAAAAAAAABgS7iKpUi2Y7ySuuewFXrBKjWWG-O6fsiRml8aaR34C/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=CPCNLTGx4SRXksR3Z6m2RYmBv%2FY%3D)

Ngrinder의 release 페이지를 가보시면 현재 사용 가능한 버전들을 볼 수 있는데요.

- [Ngrinder release](https://github.com/naver/ngrinder/releases)

현재 3.5.5가 최신이니, 3.5.5 버전을 사용하겠습니다.

> 당연한 얘기지만, AWS EC2에서 진행됩니다.  
> AWS EC2환경을 먼저 구축하고 해당 서버에서 SSH 접속후 진행해주세요.

아래처럼 `war` 파일을 우클릭하여 **링크주소를 복사** 합니다.

![controller1](https://blog.kakaocdn.net/dna/OzyA4/btq7FhtcE2C/AAAAAAAAAAAAAAAAAAAAAAbxQqZ3drRc7bZ5qEbJhZRznZbE32Ru87qRREeQFKgh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=C%2BN5O1N6flwbY9OCbAQGvz1CTSA%3D)

복사한 링크 주소를 `wget`으로 다운 받습니다.

```bash
wget https://github.com/naver/ngrinder/releases/download/ngrinder-3.5.5-20210430/ngrinder-controller-3.5.5.war
```

다운받은 war를 실행하기 편하도록 버전명을 제거한 이름으로 변경하겠습니다.

> `link`를 하셔도 무방합니다.

```bash
mv ngrinder-controller-3.5.5.war ngrinder-controller.war
```

해당 war를 세션 종료 방지 & 백그라운드 실행을 위해 `nohup &` 으로 실행하겠습니다.

```bash
nohup java -jar ngrinder-controller.war >/dev/null 2>&1 &
```

(만약 잘 실행이 안된다면 `java -jar ngrinder-controller.war` 만 수행해서 console로 로그를 확인해서 수정후 다시 `nohup &`으로 실행하시면 됩니다.)

명령어 실행 후, Java 프로세스를 확인해봅니다.

```bash
ps -ef | grep java
```

아래와 같이 실행한 `war` 프로세스가 잘 보인다면 성공입니다.

```text
ec2-user  2601  2528 21 15:06 pts/0    00:00:00 java -jar ngrinder-controller.war
ec2-user  2614  2528  0 15:06 pts/0    00:00:00 grep --color=auto java
```

실행이되면 `8080` 포트로 해당 웹 사이트를 접근할 수 있습니다.

![controller2](https://blog.kakaocdn.net/dna/zrV2N/btq7Fh7Ohen/AAAAAAAAAAAAAAAAAAAAAMcwNC3IB8O8ECTCUcfPxNUM-8Y0_pS1z0ecidPeyrLg/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2B6a6tiHKU%2BbwKYS9ymg0ACtH3cc%3D)

> 초기 ID/PW는 `admin/admin` 입니다.

로그인까지 확인되시면 바로 Controller쪽 설정은 끝났습니다.

## 2. Security Group 생성

Ngrinder의 정상적인 연동을 위해선 Agent가 Controller에 접근이 가능해야만 하는데요.

그래서 둘 간의 통신을 위한 보안그룹을 별도로 생성합니다.

> 서로 다른 EC2간의 통신에 대한 내용은 [기존 포스팅](https://jojoldu.tistory.com/430) 을 참고하시면 좋습니다.

**NGRINDER_AGENT**

![sg1](https://blog.kakaocdn.net/dna/mR6Nt/btq7FiySH6R/AAAAAAAAAAAAAAAAAAAAAOxhf6lYTdJ2YQwRdNU6ktzKh7bGjdhnmDTWNBV8an1k/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=tTd1D3gjRcNUyxQVVKqGNnTYJRA%3D)

- agent 전용 보안그룹에는 별도의 인바운드가 없어도 됩니다.
- agent의 `ssh` 접근을 위한 보안그룹인 `NGRINDER_AGENT` 외에 **별도로 관리** 하시길 추천드립니다.
  - ex) `EC2_SSH` 등의 보안그룹을 별도로 만들어서 agent EC2에 2개의 보안그룹을 둘다 추가하셔도 좋습니다.

이렇게 만들어진 agent 보안그룹을 controller 보안그룹의 인바운드로 추가하면 됩니다.

**NGRINDER_CONTROLLER**

![sg2](https://blog.kakaocdn.net/dna/ccMCKj/btq7C5t0bhV/AAAAAAAAAAAAAAAAAAAAAN22Vy7VKmil_NZRFMkJ-0TyqdxIVCV7fIUBsCnqNzGN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=4EonYzRrCqnpkIzpYNUnzeFr%2F5I%3D)![sg3](https://blog.kakaocdn.net/dna/dC8VEz/btq7BfxwFhd/AAAAAAAAAAAAAAAAAAAAAHLqDYtlMEgHCVjo-A7QldLvrvDA142rM7EZjprHtED9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=fEV1n8I52iGWZ6D3PcBIk3%2FriSM%3D)

- `80` 포트는 `wget`을 통해 agent가 **controller의 agent 설치 파일을 다운** 받기 위해 추가합니다.

그리고 이렇게 만들어진 보안 그룹은 각 서버에 추가하겠습니다.

- Controller는 1에서 구축되었으니, 바로 추가하시면 됩니다.
- Agent는 아래에서 Beanstalk 환경 진행시 같이 추가합니다.

## 3. Beanstalk에 Agent 설치하기

자 이제 동적으로 서버를 스케일링 할 수 있는 Beanstalk에 Agent를 설치해볼텐데요.

### 3-1. Agent 설치 링크 가져오기

먼저 Agent 설치 파일 다운로드 링크를 받아와야 합니다.

Agent는 Controller 페이지에서 직접 제공합니다.

Controller에서 우측 상단 프로필을 클릭후 `Agent Management`를 선택합니다.

![controller3](https://blog.kakaocdn.net/dna/Nlrj6/btq7DsCuyux/AAAAAAAAAAAAAAAAAAAAADs5IESICiEvDdbFdix8u3b2XpxvlRVm59XpjD1oo7Dw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=sNOqC82ms35ZlpSCQ96Ysm4JB8I%3D)

그럼 아래와 같이 Download 링크가 나오는데 이를 우클릭하여 **링크주소복사** 를 합니다.

![controller4](https://blog.kakaocdn.net/dna/bvSbyZ/btq7FhzYdt8/AAAAAAAAAAAAAAAAAAAAAPNKMzvjPbHa8yrFCRhnG8dQ_Y4sFdSswFq7WohiifhQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ufgQ1oq9dJIb50K055YZgwBYp%2F0%3D)

이렇게 가져온 링크는 아래 Beanstalk config 파일에서 사용할 예정이니, 별도 텍스트 파일에 복사해놓으시면 됩니다.

### 3-2. Beanstalk 설정하기

> AWS Beanstalk에 대해서 어느정도 사용해본적이 있다고 가정하고 진행합니다.

본인의 환경에 맞게 Beanstalk을 생성하시면 되는데, 하나만 기존과 다르게 진행해주시면 되는데요.

![eb1](https://blog.kakaocdn.net/dna/bxO1MF/btq7DVxCPZ7/AAAAAAAAAAAAAAAAAAAAAMcFbuBG1IF9U-huTZLJhSYV0AT6wPYEy75fk_9CYZ96/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=tB218kHnMjGGcEz%2FMjgebxXkUbw%3D)

Agent의 보안그룹으로 `2. Security Group 생성`에서 생성했던 NGRINDER_AGENT 보안그룹만 하나더 추가해주시면 됩니다.

![eb-sg](https://blog.kakaocdn.net/dna/RIZmB/btq7Edrjq5x/AAAAAAAAAAAAAAAAAAAAAIdrZtrm-656H_OIF4uSmd5OtngXc6C4Vksqw041gCTj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=164Igg9FiX7hh1VQbnXp%2B7HrXCw%3D)

(다른 보안그룹 없이 이것만 하라는 의미가 아니라, **이것도 함께 추가** 입니다.)

- 이 보안그룹이 추가되어야만 Controller가 Agent를 인식할 수 있습니다.

기본적인 Beanstalk 환경이 구성되었다면, 이제 Config 파일을 만들어보겠습니다.

### 3-3. Beanstalk config

> 모든 코드는 [Github](https://github.com/jojoldu/ngrinder-in-action) 에 있습니다.

Agent에 사용될 프로젝트는 다음과 같은 구조를 가집니다.

```text
📦 ngrinder-in-action
├─ .ebextensions
│  ├─ 01-appstart.config
│  ├─ 02-system-tuning.config
│  └─ 03-timezone.config
├─ .gitignore
├─ .platform
│  └─ nginx
│     └─ nginx.conf
├─ Procfile
├─ deploy.sh
├─ README.md
```

각각의 파일은 다음과 같습니다.

**.ebextensions/01-appstart.config**

```yaml
files:
    "/sbin/appstart" :
        mode: "000755"
        owner: webapp
        group: webapp
        content: |
            #!/usr/bin/env bash
            COLLECTOR="collector ip"
            AGENT_FILE_HOST="agent download link"
            wget ${AGENT_FILE_HOST} -P /var/app/current
            tar -xvf /var/app/current/ngrinder-agent-*.tar

            killall java
            /var/app/current/ngrinder-agent/run_agent.sh -ch ${COLLECTOR}
```

- agent 파일을 실행할 `appstart` 스크립트를 생성합니다.
- collector ip는 **private ip** 를 등록합니다.
- `AGENT_FILE_HOST` 에는 3-1 에서 가져온 Agent 링크를 넣습니다.
- Agent의 실행 자체는 크게 어렵지 않습니다.
  - 다운 받은 agnet.tar 파일의 압축을 풀고 (`tar -xvf`) 이를 `run_agent.sh` 로 실행만 하면 됩니다.
  - `-ch ${COLLECTOR}` 는 Agent가 데이터를 보낼 Controller의 위치를 지정하는 옵션입니다.
  - 기본값은 `localhost`라서 외부에 연결할 경우 이번처럼 `ch` 옵션을 사용하면 됩니다.

**.ebextensions/02-system-tuning.config**

```yaml
files:
  "/etc/security/limits.conf":
    content: |
      *           soft    nofile          65535
      *           hard    nofile          65535

commands:
  01:
    command: "echo \"10240 65535\" > /proc/sys/net/ipv4/ip_local_port_range"
  02:
    command: "sysctl -w \"net.ipv4.tcp_timestamps=1\""
  03:
    command: "sysctl -w \"net.ipv4.tcp_tw_reuse=1\""
  04:
    command: "echo \"net.ipv4.tcp_max_tw_buckets=2000000\" >> /etc/sysctl.conf"
  10:
    command: "sysctl -p"
```

- agent가 최대한의 성능을 내기 위해 기본적인 OS 성능 튜닝 설정을 합니다.
- 각 설정에 대한 상세한 내용은 [AWS Beanstalk을 이용한 성능 튜닝 시리즈](https://jojoldu.tistory.com/319) 을 참고하시면 됩니다.

**.ebextensions/03-timezone.config**

```yaml
commands:
  01remove_local:
    command: "rm -rf /etc/localtime"
  02link_seoul_zone:
    command: "ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime"
```

- 성능 테스트시 시간 오차를 방지하기 위해 타임존을 KST로 변환합니다.

**.platform/nginx/nginx.conf**

```nginx
user                    nginx;
error_log               /var/log/nginx/error.log warn;
pid                     /var/run/nginx.pid;
worker_processes        auto;
worker_rlimit_nofile    65535;

events {
    use epoll;
    worker_connections  1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

  include       conf.d/*.conf;

  map $http_upgrade $connection_upgrade {
      default     "upgrade";
  }

  server {
        listen        80 default_server;

        # (1) health check
        location / {
            return 200 'ok';
        }

        access_log    /var/log/nginx/access.log main;

        client_header_timeout 60;
        client_body_timeout   60;
        keepalive_timeout     60;
        gzip                  off;
        gzip_comp_level       4;

        # Include the Elastic Beanstalk generated locations
        include conf.d/elasticbeanstalk/healthd.conf;
  }
}
```

(1) `location /`

- Beanstalk의 Load Balancer Health Check 기본 주소가 `/` 입니다.
- Ngrinder의 Agent가 Health Check 대상이 되기 보다는 Nginx에서 바로 `/`로 200 응답을 주게 하여 Health Check를 통과하도록 구성합니다.
- Agent는 별도로 API 응답을 할 용도가 아니기 때문에 이런 기본적인 헬스체크에 대해서는 Nginx에서 처리합니다.

이렇게 구성이 다되셨으면 실제로 배포를 진행해보겠습니다.

## 4. 배포하기

위 `3-3. Beanstalk config` 에서 설정한 내용 그대로 배포용 zip 파일을 만들면 되는데요.

매번 수동으로 쉘 명령어를 치기보다는 빠르게 스크립트를 만들어서 진행합니다.

**deploy.sh**

```bash
#!/usr/bin/env bash

DIR=deploy

if [ -d "$DIR" ]; then rm -Rf $DIR; fi

mkdir $DIR
cp -r .ebextensions ./deploy/
cp -r .platform ./deploy/
cp -r Procfile ./deploy/
cd deploy
zip -r agent.zip .
mv agent.zip ../
```

작성이 다 되시면 `chmod +x ./deploy.sh` 로 **실행권한** 을 줍니다.

그리고 스크립트를 실행해보시면 아래와 같이 차례로 명령어가 수행되어 `agent.zip` 파일이 생성됩니다.

```bash
$ ./deploy.sh
adding: .ebextensions/ (stored 0%)
adding: .ebextensions/03-timezone.config (deflated 31%)
adding: .ebextensions/02-system-tuning.config (deflated 52%)
adding: .ebextensions/01-appstart.config (deflated 47%)
adding: Procfile (stored 0%)
adding: .platform/ (stored 0%)
adding: .platform/nginx/ (stored 0%)
adding: .platform/nginx/nginx.conf (deflated 54%)
```

이렇게 생성된 zip 파일을 수동으로 Beanstalk에 배포해봅니다.

![upload1](https://blog.kakaocdn.net/dna/c4fwq2/btq7Ee4M3JL/AAAAAAAAAAAAAAAAAAAAACRrbMEONcAGZr-KbtLi3LJEXybWs_uC2tsy1WJCuq5D/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=J9SLxG9g2BW4k0VblZdd6fXrNB8%3D)

여기서 파일 선택으로 해당 `agent.zip` 파일을 선택해서 **배포** 를 합니다.

![upload2](https://blog.kakaocdn.net/dna/bw5nOn/btq7Fh02EjT/AAAAAAAAAAAAAAAAAAAAAP3NO1ch1SsqZxcQp6gARrls2q7XobOah0UU6i-77XG3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=VnLau%2FNpYcIT2KGFDvRleVGLCPI%3D)

정상적으로 배포가 되시면 다음과 같이 Success 상태를 확인할 수 있습니다.

![upload3](https://blog.kakaocdn.net/dna/7vo6T/btq7FhGJWGP/AAAAAAAAAAAAAAAAAAAAAPt0APgTr_Q7nHb_hnzhxFg2CEya6XfrvaWeTlAujxO1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=YTRQKqUKMz7D%2Bm7%2ByxWpTKnMKOM%3D)

최종적으로 Controller의 Agent Management에서도 **Agent가 표기** 되면 성공입니다!

![upload4](https://blog.kakaocdn.net/dna/QT8yw/btq7C49F5je/AAAAAAAAAAAAAAAAAAAAAF8qKe06FkGZ3Paw5HnFOJVFNUBx5YIDhcm0fTZwGayK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=0ti%2Bdofnfzk5zdQFSpf4NS%2FEx%2BQ%3D)
