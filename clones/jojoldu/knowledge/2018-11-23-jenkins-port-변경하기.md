---
topic: "Jenkins Port 변경하기"
source_type: other
source_url: "https://jojoldu.tistory.com/354"
authorship: self
published_at: 2018-11-23
---
# Jenkins Port 변경하기

**저자:** 향로 (기억보단 기록을)
**작성일:** 2018. 11. 23.

Jenkins의 기본 포트는 8080입니다.

사정상 한대의 서버에 이것저것 설치해서 쓸 경우 8080포트는 사용하기 어렵습니다.

(Upsource, Tomcat 등 대부분의 소프트웨어는 8080 포트를 기본으로 쓰고 있습니다)

그래서 Jenkins의 기본 포트를 변경할 필요가 있다면 다음과 같이 진행해보세요.

Jenkins가 설치된 서버로 이동하신뒤 다음 명령어로 설정 파일을 엽니다.

```bash
# jenkins config 열기
sudo vim /etc/sysconfig/jenkins
```

그리고 아래와 같이 JENKINS_PORT를 수정합니다.

저는 9090으로 수정했습니다.

![포트 수정 이미지](https://t1.daumcdn.net/cfile/tistory/993485345BF7D1C42B)

이렇게 설정하신후 jenkins를 다시 실행해보시면 9090으로 정상적으로 수행된 것을 확인할 수 있습니다.

![결과 확인 이미지](https://t1.daumcdn.net/cfile/tistory/9971D6375BF7D22123)
