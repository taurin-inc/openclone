---
topic: "Git 및 GitHub 활용 팁 모음 (Git _8_)"
source_type: other
source_url: "https://jojoldu.tistory.com/category/Git"
authorship: self
published_at: 2022-03-05
---
# Git _8_

**작성자:** jojoldu (기억보단 기록을)

---

### Github 기능 미리 써보기 (Code Review시 디렉토리 미리보기)
**게시일:** 2022. 3. 5.

Github 에는 앞으로 출시할 기능 (Beta) 을 미리 써볼 수 있는 옵션이 있습니다. 특히 최근에 Pull Request시 파일 트리를 볼 수 있는 기능이 베타 출시되었는데요. 코드리뷰시에 굉장히 큰 도움을 주기 때문에 바로 적용해서 써보시는 것을 추천드립니다. 이 포스팅은 2022.03.05에 작성된 것이기 때문에, 소개되는 베타기능들은 이후에 대부분 정식 출시된 상태일 것입니다. 설정 Github 우측 상단의 프로필 아이콘을 클릭하신뒤, Feature preview를 선택합니다. 그럼 아래와 같이 Modal이 나오는데, 이때 원하시는 베타 기능들을 선택하시고 Enable 을 누르시면 됩니다. (Enable을 클릭하면 아래와 같이 Disable로 버튼이 변경됩니다.) 저는 여기서 Command P..

---

### Git에서 원하는 커밋만 제거하기 (feat. SourceTree)
**게시일:** 2021. 11. 5.

Git을 사용하다보면 특정 커밋들만 날리고 싶을때가 있습니다. 근데 하필 그게 한참 전 커밋들이거나, 중간 커밋들이면 reset으로 골라내기가 쉽지 않은데요. 이럴때 rebase interactively 를 사용하기가 좋습니다. 해결방법 예를 들어 아래와 같이 REC-296 커밋 2개를 모두 빼고 싶은 상황이라고 가정해봅니다. 그럼 그 직전 커밋을 선택합니다. 해당 커밋을 우클릭을 하신뒤, Rebase children of ... interactively 을 선택합니다. 그럼 아래와 같이 리베이스 화면이 나오는데, 여기서 삭제를 원하는 커밋을 선택한뒤, 하단의 Delete를 클릭합니다. 그럼 해당 커밋을 삭제 표기가 됩니다. 지우고싶었던 2개의 커밋을 모두 delete를 하고, OK를 누르시면 그때부터 ..

---

### gitbook CLI 실행시 cb.apply 발생할 경우
**게시일:** 2021. 9. 9.

외부 강의를 위해 gitbook을 처음 사용해보았습니다. 설치나 사용법 자체는 워낙 다른 블로그들에서 소개를 많이 해주기 때문에 여기서 소개하지는 않겠습니다. 간단하게 다음과 같이 설치와 프로젝트를 구성할 수 있습니다. `npm install -g gitbook-cli` 문제 설치가 잘되었는지 확인을 해보면 `gitbook -h` 다음의 에러를 만나게 됩니다. Installing GitBook 3.2.3 /usr/local/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287 if (cb) cb.apply(this, arguments) TypeError: cb.apply is not a function at ..

---

### Github 패스워드 교체시 로컬 비밀번호도 변경하기
**게시일:** 2019. 12. 17.

Github 패스워드 변경시 기존에 패스워드 인증 방식을 사용하는 프로젝트들은 인증실패로 push와 같은 원격 명령어가 정상적으로 수행되지 않습니다. 그래서 비밀번호를 다시 등록하는 방법을 소개드립니다. 먼저 해당 프로젝트로 이동한 뒤 `cd 프로젝트위치` Github 인증을 리셋시킵니다 `git config --unset credential.helper` 그리고 다시 Github push를 진행해봅니다. `git push` 그럼 아래와 같이 username과 password를 입력하라는 화면이 등장합니다. 새로운 비밀번호를 입력하시면 정상적으로 비밀번호가 변경되어 사용됩니다. Username for 'https://github.com': Password for 'https://jojoldu@github.com':

---

### Github Two Factor 인증 설정하기 (feat. Authenticator)
**게시일:** 2019. 9. 10.

보안상 문제로 사내 계정 혹은 그룹 계정 등은 Two Factor (2FA) 를 적용해야만 합니다. 다른 분들의 블로그에선 대부분 SMS 인증 + Git 터미널 방식에 대해서만 소개되어 있어, OTP + GUI Client 에서의 적용 방법을 정리했습니다. 0. 들어가기 전에 들어가기 전에 크롬 확장 프로그램이 설치되어 있어야만 합니다. Authenticator 라고 불리는 2FA 코드 발급기입니다. 굳이 Github의 2FA 때문이 아니더라도 AWS 2FA 등 여러 2FA 에서 유용하게 사용되니 이번 기회에 한번 설치해보시는것도 좋습니다. (물론 1password가 있으시면 1password를 쓰면 되지만, 유료 도구이기 때문에 여기서는 무료 플러그인을 사용하겠습니다) 일단 이 플러그인 설치 후 다음으..

---

### .gitignore가 작동하지 않을때 대처법
**게시일:** 2018. 6. 23.

.gitignore가 제대로 작동되지 않아서 ignore처리된 파일이 자꾸 changes에 나올때가 있습니다. git의 캐시가 문제가 되는거라 아래 명령어로 캐시 내용을 전부 삭제후 다시 add All해서 커밋하시면 됩니다. 

```bash
git rm -r --cached .
git add .
git commit -m "fixed untracked files"
``` 
참고
