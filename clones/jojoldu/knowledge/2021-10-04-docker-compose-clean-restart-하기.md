---
topic: "docker-compose clean restart 하기"
source_type: other
source_url: "https://jojoldu.tistory.com/604"
authorship: self
published_at: 2021-10-04
---
# docker-compose clean restart 하기

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 10. 4.

docker를 사용하다보면 한번씩 전체 컨테이너를 싹 다 지우고, 깔끔하게 다시 시작하고 싶을때가 있습니다.

![1](https://blog.kakaocdn.net/dna/bXKXlY/btrgHEHTxj2/AAAAAAAAAAAAAAAAAAAAADmBhKuYiJ-FR1M-iiS8KJc6lt7BCPiTq1rx-LHsR8LU/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=593YtzdgbLMtnXmxOwr4Zuhw%2BqM%3D)

```
FATAL:  database files are incompatible with server
DETAIL:  The data directory was initialized by PostgreSQL version xx, which is not compatible with this version yy
```

> 언제든 삭제해도 되는 데이터가 아니라, 실제로 계속 저장이 되어야 한다면 Volume에 있는 모든 데이터들을 백업해놓고 진행하셔야 합니다.
>
> 지금 같은 경우는 테스트 코드로만 수행될 컨테이너들이라서 바로 삭제할 수 있었습니다.

먼저 기존의 도커 컨테이너를 모두 삭제합니다.

(물론 실행중인 컨테이너가 있다면 `docker-compose down` 로 중지합니다.)

```bash
docker rm -f $(docker ps -a -q)
```

그리고 기존의 모든 volume 을 지웁니다.

```bash
docker volume rm $(docker volume ls -q)
```

![2](https://blog.kakaocdn.net/dna/bgb43L/btrgC6SE7wW/AAAAAAAAAAAAAAAAAAAAAJ1sSkMfII7s8vktdLsNwmVCc0omGGlLxhO7NmgLEgh9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=7mZpcYUuy6dmgy2STL5xummf2T0%3D)

그리고 다시 docker compose를 다시 시작하면 됩니다.

```bash
docker-compose up
```
