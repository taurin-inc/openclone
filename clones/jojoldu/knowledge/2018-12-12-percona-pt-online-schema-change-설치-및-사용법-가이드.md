---
topic: "Percona pt-online-schema-change 설치 및 사용법 가이드"
source_type: other
source_url: "https://jojoldu.tistory.com/358"
authorship: self
published_at: 2018-12-12
---
# [mysql] Percona pt-online-schema-change 설치 및 사용하기

**작성자:** 향로 (기억보단 기록을)
**작성일:** 2018. 12. 12.

Mysql에서 몇억건 이상의 대량의 데이터를 갖고 있는 테이블을 **수정** 하는것은 쉬운일이 아닙니다.

단순히 `alter table`을 해버리면 4시간, 5시간 이상 수행되기 떄문인데요.

이를 해결 하기 위해 `create select` 방법을 사용하곤 합니다.

> 참고: [MySQL 대용량 테이블 스키마 변경하기](https://jojoldu.tistory.com/244)

하지만 이 방법에는 큰 문제가 있는데요.

FK (Foreign Key) 변경이 어렵습니다.

**FK는 기존에 맺어져있던 테이블에 계속 유지** 되기 떄문입니다.

이외에도 여러 문제들이 있는데, 이를 해결하기 위해 percona의 pt-online-schema-change을 사용할때가 많습니다.

이번 시간에는 이 pt-online-schema-change 사용법을 정리하겠습니다.

> percona는 XtraBackup 등 Mysql 을 운영하기 위한 여러 툴을 제공하는 회사입니다.
> [사이트](https://www.percona.com/)

## 0. 소개

Percona의 pt-online-schema-change는 **트리거를 활용하여 테이블을 수정** 하는 방법입니다.

pt-online-schema-change 스크립트를 실행할 경우 아래와 같이 스크립트가 진행됩니다.

1. 대상 테이블을 복사하되, **변경할 스키마 내용이 적용된** 형태로 생성됩니다.
2. 지정한 chunk-size만큼 혹은 unique key 기준으로 데이터를 끊어 원본 테이블 데이터 전체를 신규 테이블로 복사합니다.
3. 데이터 복사가 끝나면 기존 테이블과 신규 테이블 이름을 변경하여 최종적으로 온라인 스키마 변경이 완료됩니다.

위 내용은 개발자가 직접 진행해도 됩니다만, Percona는 이미 이 모든 과정을 다 스크립트화 했으니 저희는 편하게 사용만 해보겠습니다.

## 1. 설치

pt-online-schema-change 스크립트는 공식 사이트에서 rpm 파일을 제공합니다.

rpm으로 설치하면 아주 간편하겠지만, 가끔 rpm 파일이 설치가 안될 때가 있습니다.

그럴때를 대비해 여기서는 `tar.gz`로 설치하는 방법을 소개드리겠습니다.

pt-online-schema-change의 스크립트는 **perl 기반** 입니다.

그래서 perl에 관련된 패키지들을 설치하겠습니다.

### Perl 패키지 설치

아래 스크립트들을 차례로 실행하겠습니다.

```
sudo yum install perl-DBI
```

```
sudo yum install perl-DBD-MySQL
```

```
sudo yum install perl-TermReadKey
```

```
sudo yum install perl perl-IO-Socket-SSL perl-Time-HiRes
```

```
sudo yum install perl-devel
```

### percona-toolkit 설치

perl 관련 패키지들이 모두 설치되셨다면, percona-toolkit을 설치합니다.

여러가지 도움이 되는 툴들이 많지만, 여기서는 pt-online-schema-change 을 실행할 스크립트를 설치한다고 보시면 됩니다.

보통 `.rpm`, `.deb` 파일을 받아서 즉시 설치하면 되지만, 이 글을 쓰는 시점에서 `.rpm` 설치가 안되어 `tar.gz` 파일로 대체해서 진행하겠습니다.

먼저 tar 파일을 다운 받습니다.

```
wget percona.com/get/percona-toolkit.tar.gz
```

다은 받은 파일의 압축을 해제합니다.

```
tar xzvf percona-toolkit.tar.gz
```

압축이 해제된 폴더로 이동합니다.

![install1](https://t1.daumcdn.net/cfile/tistory/99E6B54A5C1045FB22)

```
cd percona-toolkit-3.0.12
```

그리고 아래 3개 스크립트로 install을 시작합니다.

```
perl ./Makefile.PL
make
sudo make install
```

설치가 다 되셨다면, 전역에서 실행할 수 있게 `.bashrc`에 등록하겠습니다.

```
# bashrc을 열어서
vim ~/.bashrc

# 아래 코드를 등록합니다.
alias pt-online-schema-change="/home/ec2-user/percona-toolkit-3.0.12/bin/pt-online-schema-change"
```

![bashrc](https://t1.daumcdn.net/cfile/tistory/99B297495C1045FB24)

## 2. 사용

설치된 pt-online-schema-change은 아래의 명령어로 사용할 수 있습니다.

```
pt-online-schema-change --alter "변경할 Alter 정보" D=데이터베이스,t=테이블명 \
--no-drop-old-table \
--no-drop-new-table \
--chunk-size=500 \
--chunk-size-limit=600 \
--defaults-file=/etc/my.cnf \
--host=127.0.0.1 \
--port=3306 \
--user=root \
--ask-pass \
--progress=time,30 \
--max-load="Threads_running=100" \
--critical-load="Threads_running=1000" \
--chunk-index=PRIMARY \
--charset=UTF8 \
--alter-foreign-keys-method=auto \
--preserve-triggers
--execute
```

- `--no-drop-old-table`: 마이그레이션 후, 기존 테이블을 삭제 하지 않겠다는 옵션 입니다.
- `host, port, user`: 스크립트를 실행할 대상 DB 정보입니다.
- `chunk-size`: 한번에 복사할 데이터양을 얘기합니다.
- `--charset=UTF8`: 필수로 넣으셔야 합니다. 안넣을 경우 한글명 데이터들이 이관하면서 깨지는 경우가 생깁니다.
- `--alter-foreign-keys-method=auto`: FK도 복사할것인지 여부입니다. 옵션값이 `auto`일 경우 최적화된 방식으로 FK를 복사합니다.

위 샘플을 토대로 진행해본다면 다음과 같이 실행해볼 수 있습니다.

```
pt-online-schema-change --alter "add column test varchar(255) default null" D=point,t=point_detail \
--no-drop-old-table \
--chunk-size=500 \
--chunk-size-limit=600 \
--host=point-pt-online-schema-20181129.cbopabdh50kn.ap-northeast-2.rds.amazonaws.com \
--port=3306 \
--user=point \
--ask-pass \
--progress=time,30 \
--charset=UTF8 \
--alter-foreign-keys-method=auto \
--preserve-triggers
--execute
```

그러면 아래와 같이 % (진행율) 가 올라가는 로그를 보실 수 있습니다.

![execute2](https://t1.daumcdn.net/cfile/tistory/99A050475C1045FB23)

## 3. 삭제 및 재시작

스크립트 진행 도중 종료 되었다면, 재시작이 필요합니다. 다만, 트리거와 복사 테이블을 만들어 놓은 상태라, 바로 재시작을 하면 실패합니다.

먼저 새롭게 생성된 테이블들을 삭제합니다.

![remove1](https://t1.daumcdn.net/cfile/tistory/9929D4385C1045FB1E)
(보통 `_기존테이블명_new` 형식으로 복사본 테이블이 생성됩니다.)

추가로 트리거도 생성 되었기 때문에 아래와 같이 오류가 발생하면서 재실행이 안될것입니다.

이럴 경우 pt-online-schema-change로 생성된 트리거를 확인하고 **강제로 삭제** 하면 됩니다.

트리거 목록 확인:
```
show triggers like 'table이름'\G
```

prefix로 `pt_`가 붙은 트리거들을 모두 삭제합니다.
```
drop trigger trigger이름;
```

해당 테이블에 더이상 트리거가 보이지 않는다면 다 삭제가 되었으니 다시 실행해보시면 됩니다.

## 속도

테스트 환경:
- RDS r3.2xlarge (vCPU 8 core, RAM 61 GB)
- EC2에서 RDS로 **remote** 로 명령어 실행
- chunk-size=1000 기준
- **Replication** 되어 있는 상태

### 1600만건 / FK X
- 약 12분 소요
- RDS CPU 약 17% 유지

### 1700만건 / FK O
- 약 12분 소요
- RDS CPU 약 20% 유지

### 1억건 / FK X
- 약 1시간 26분 소요
- RDS CPU 약 20% 유지

### 1억건 / FK O
- 약 2시간 소요
- RDS CPU 약 20% 유지
- `--alter-foreign-keys-method=auto` 옵션으로 인해 FK를 맺은 자식 테이블 건수가 1억건이 넘을 경우 **새로운 FK가 생성** (`drop_swap` 발생 시 애플리케이션 코드 변경 필요 가능성 있음)

## 참고
- [소소한 데이터 이야기 – pt-online-schema-change 편](http://gywn.net/2017/08/small-talk-pt-osc/)
