---
topic: "Ansible (앤서블) 로 전체 서버 계정 추가하기 - CLI로 계정 추가하기"
source_type: other
source_url: "https://jojoldu.tistory.com/433"
authorship: self
published_at: 2019-07-23
---
# 2. Ansible (앤서블) 로 전체 서버 계정 추가하기 - CLI로 계정 추가하기

**Author:** 향로 (기억보단 기록을)
**Publish Date:** 2019. 7. 23.

이번 시간엔 앤서블 CLI를 통해 각 호스트에 **루트 권한을 가진 계정을 추가** 해보겠습니다.

## 2-1. 모듈?

실습에 들어가기 앞서 앤서블의 모듈에 대해 간단하게 소개하겠습니다.

앤서블의 [공식 홈페이지](https://docs.ansible.com/ansible/latest/user_guide/modules_intro.html) 에선 모듈에 대해 다음과 같이 소개합니다.

> 모듈 (Task 플러그인, 라이브러리 플러그인 이라고도 함) 은 CLI나 플레이북 작업에서 사용할 수 있는 **별도의 코드 단위** 입니다.

공식 홈페이지에서 소개한것과 같이 모듈은 일종의 **라이브러리 플러그인** 입니다.

- OS 작업 (패캐지 설치/사용자 관리 등)
- 파일 작업 (복사 등)
- 데이터베이스 작업 (사용자/테이블 관리 등)

등의 작업들이 모듈이라는 **미리 정의된 플러그인** 으로 쉽게 작업할 수 있습니다.

여기서 한가지 의문이 드실텐데, **쉘 스크립트로 명령 수행해도 다 할 수 있는 일들인데?** 라고 생각할 수 있습니다.

근본적으로 쉘로 직접 수행하기 보다는 모듈을 통해서 작업하는 이유는 다음과 같습니다.

- 멱등성을 보장해줍니다.
  - 앤서블의 모듈은 작업을 실행하기 전에 그 시점의 상태를 확인하고 **변경이 있을때만 실제의 작업을 수행하도록** 설계되어있습니다.
  - 즉, 중복 실행되서 문제가 될 여지가 사전 차단 됩니다.
  - 이걸 쉘로 구현하기에는 너무 부담스럽겠죠?
- 가독성이 좋습니다.
  - 명확한 파라미터가 있어 쉘 명령어를 외울 필요가 없습니다.
- 부가 정보도 확인 가능합니다.
  - 이 명령어가 수행되어서 실제로 변경이 되었는지 등을 확인 가능합니다.
- 리눅스 배포판간 호환성 보장이 됩니다.
  - 하나의 앤서블 파일 혹은 명령어로 **서로 다른 리눅스 배포판에서 호환이 가능** 합니다.
  - 쉘 스크립트는 결국 배포판에 맞게 명령어를 작성해야하니 호환하기가 어렵습니다.

자 그럼 이제 이 모듈을 통해서 계정 추가를 진행해보겠습니다.

## 2-2. user 모듈로 계정 추가

ansible에선 `user`라는 모듈이 계정 추가/삭제 기능을 지원하고 있습니다.

이 모듈을 사용해서 다음과 같이 명령어를 수행하면 계정이 생성됩니다.

( **앤서블 서버에선 root계정 상태** 입니다.)

```bash
ansible all -m user -a "name=jojoldu" -u ec2-user
```

- `-m user`
  - 사용할 모듈 (Module) 을 지정합니다.
  - 여기서는 앤서블의 [user](https://docs.ansible.com/ansible/latest/modules/user_module.html) 모듈을 사용합니다.
- `-a "name=jojoldu"`
  - user 모듈에 사용될 파라미터를 지정합니다.
  - user 모듈에는 name 이라는 기본 파라미터가 있습니다.
  - 이 name 파라미터가 실제 생성될 계정명을 나타냅니다.
  - `파라미터=값` 으로 지정하면 해당 모듈에서 값을 인식해서 사용됩니다.

명령어를 수행하시면 아래와 같이 **권한 거부** 에러가 발생합니다.

![1](https://t1.daumcdn.net/cfile/tistory/998C214E5D379B6121)

이는 현재 호스트 접근 계정인 ec2-user에 `sudo` 권한이 없기 때문입니다.

이를 해결하기 위해 ec2-user가 아닌 **root 계정으로 접근하기엔 부담** 스럽습니다.

그래서 명령어를 수행할때마다 `sudo` 가 함께 수행될 수 있게 설정값을 추가해보겠습니다.

아래 명령어로 `ansible.cfg` 을 열어서

```bash
sudo vim /etc/ansible/ansible.cfg
```

아래와 같이 `[privilege_escalation]` 항목을 설정합니다.

```bash
[privilege_escalation]
become=True
```

![2](https://t1.daumcdn.net/cfile/tistory/99CCB33F5D379B6129)

- ansible.cfg은 앤서블의 설정 파일입니다.
- /etc/ansible/ansible.cfg 은 글로벌 설정 파일입니다.
  - 우선 순위가 가장 낮습니다.
  - 이보다 높은 우선 순위는 현재 디렉토리 (`ansible.cfg`), 현재 사용자의 홈 디렉토리 (`~/.ansible.cfg`) 이 있습니다.
  - 글로벌 설정을 피하고 싶다면 위 설정 위치를 사용하시면 됩니다.

설정이 다 되셨다면 다시 명령어를 수행해봅니다.

![3](https://t1.daumcdn.net/cfile/tistory/996F9F485D379B6121)

정상적으로 계정이 생성된 것을 확인할 수 있습니다!

실제로 각 서버에 계정이 추가되었는지 확인도 ansible로 해봅니다.

```bash
ansible all -m shell -a "tail -n 1 /etc/passwd" -u ec2-user
```

그럼 다음과 같이 home 디렉토리에 계정이 추가된 것을 확인할 수 있습니다.

![4](https://t1.daumcdn.net/cfile/tistory/99B6793C5D379B622B)

## 2-3. 임의 추가된 계정 삭제하기

다음으로 방금 추가한 계정을 삭제해보겠습니다.

삭제는 간단합니다.

기존 계정 생성 명령어에 `state=absent remove=yes` 만 추가하면 됩니다.

```bash
ansible all -m user -a "name=jojoldu state=absent remove=yes" -u ec2-user
```

![5](https://t1.daumcdn.net/cfile/tistory/9922BE475D379B621F)

다시 삭제되었는지 확인 해봅니다.

![6](https://t1.daumcdn.net/cfile/tistory/99B1DC3E5D379B6126)

더이상 마지막 계정 표기에 jojoldu가 아닌 `ec2-user`만 노출된다면 정상적으로 삭제 된 것입니다.

테스트로 추가된 계정은 이렇게 삭제하면 되겠죠?

## 2-4. 패스워드 추가하기

자 그럼 계정을 생성하고 해당 계정에 비밀번호를 추가해보겠습니다.

(기존 계정의 비밀번호 변경도 같은 방법으로 가능합니다.)

2-2에서 계정을 삭제했다면 다시 같은 계정을 생성해주시고, 삭제하지 않으셨다면 그대로 진행하시면 됩니다.

아래 명령어로 **본인이 원하는 비밀번호** 로 변경합니다.

```bash
ansible all -m user -a "name=jojoldu update_password=always password={{ '변경하고싶은 비밀번호' | password_hash('sha512') }}" -u ec2-user
```

저는 간단하게 1234 라는 비밀번호를 사용했습니다.

![7](https://t1.daumcdn.net/cfile/tistory/996F29485D379B6121)

비밀 번호가 추가되었으면 한번 확인해보겠습니다.

호스트 서버들에 접속하신뒤 신규 생성 (+비밀번호가 추가된) 계정으로 로그인해봅니다.

![8](https://t1.daumcdn.net/cfile/tistory/99B2863E5D379B6126)

> 제가 사용한 ec2 접속기는 [ec2-gauza](https://github.com/leejaycoke/ec2-gazua) 입니다.
>
> 자세한 설치법은 [이전 포스팅](https://jojoldu.tistory.com/311) 을 참고해주세요.

로그인이 잘 되신다면 비밀번호가 정상적으로 추가 된 것입니다!

## 2-5. sudo 권한 추가

마지막으로 신규 추가된 계정에 sudo 권한을 추가해보겠습니다.

기본적으로 리눅스의 경우 sudo 권한이 필요할시에 `/etc/sudoers` 파일에 계정을 추가해서 사용합니다.

다만, 이 파일이 너무 **크리티컬한 파일** 이라서 잘못 수정했다가는 서버를 포맷해야되는 일이 발생할 수 있습니다.

그래서 직접 이 파일을 손대지는 않고, 계정만 안전하게 추가할 수 있는 방법이 있습니다.

바로 `/etc/sudoers.d/` 에 계정의 권한을 가진 파일을 추가하는 것입니다.

해당 디렉토리에 포함된 파일이 아래와 같은 양식을 가지면 해당 계정은 `sudo`를 실행할 수 있습니다.

```bash
계정명 ALL=(ALL) NOPASSWD:ALL
```

- 여기서 `NOPASSWD:ALL`은 **sudo 실행시 패스워드를 입력받지 않겠다** 는 의미입니다.

실제로 본인의 서버에서 한번 확인해보시면 다음과 같이 `root` 계정이 등록되있는 것을 확인할 수 있습니다.

![9](https://t1.daumcdn.net/cfile/tistory/993DCF4A5D379B6121)

그래서 원래의 구조라면 모든 호스트 서버에 접속하여 아래의 명령어를 수행해야만 합니다.

```bash
echo 'jojoldu   ALL=(ALL)   NOPASSWD:ALL' > /etc/sudoers.d/jojoldu
```

하지만 앤서블을 사용하게 되면 한번에 가능합니다.

위의 쉘 명령어를 그대로 앤서블 쉘 명령어로 사용하면 아래와 같습니다.

```bash
ansible all -m shell -a "echo 'jojoldu   ALL=(ALL)   NOPASSWD:ALL' > /etc/sudoers.d/jojoldu"
```

하지만 실제 업무에서 위와 같이 쉘 명령어를 쓰진 않습니다.

이유는 글 최상단에서 한번 언급했으니 다시 참고하셔도 좋습니다.

최대한 **앤서블이 지원하는 모듈** 로 해결합니다.

그래서 앤서블이 지원하는 **파일 복사** 모듈을 쓰면 다음과 같습니다.

```bash
ansible all -m copy -a "content='jojoldu ALL=(ALL) NOPASSWD: ALL' dest=/etc/sudoers.d/jojoldu mode=0644 validate='/usr/sbin/visudo -c -f \'%s\''"
```

- [copy](https://docs.ansible.com/ansible/latest/modules/copy_module.html)
  - 앤서블의 파일 복사 모듈입니다.
- `content`
  - **복사할 문자열** 파라미터입니다.
  - 해당 문자열을 지정된 (`dest`) 곳으로 복사합니다.
  - 보통은 A 라는 파일을 복사하는데 이때는 `src` 파라미터를 사용하면 됩니다.
- `dest`
  - 복사할 위치입니다.
  - content에 있는 내용을 각 호스트 서버의 `/etc/sudoers.d/jojoldu` 로 복사합니다.
- `mode`
  - 복사할 파일의 권한을 관리합니다. (`chmod`를 생각하시면 됩니다.)
- `validate`
  - 복사하기 전에 실행할 유효성 검사 명령입니다.
  - 유효성을 검사 할 파일의 경로는 `'%s'` 로 전달됩니다.
  - 쉘 명령어나 파이프라인 (`|`) 등이 수행되지 않도록 보호합니다.

위 명령어를 수행해보시면 아래와 같이 각 호스트에 파일 복사가 잘 이루어졌음을 알 수 있습니다.

![10](https://t1.daumcdn.net/cfile/tistory/992256475D379B621F)

그리고 호스트 서버에 접근해서 신규 계정으로 `root` 계정 변환을 시도해보면!

![11](https://t1.daumcdn.net/cfile/tistory/99C4453C5D379B612A)

비밀번호 없이 잘 변경된 것을 확인할 수 있습니다.

## 2-6. 마무리

이번 시간에는 앤서블 CLI로 계정을 추가하는 모든 과정을 진행했습니다.

다음 시간에는 이 앤서블 CLI를 **플레이북** 으로 변경하는 과정을 진행해보겠습니다.
