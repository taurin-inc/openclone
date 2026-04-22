---
topic: "Mac OS 업데이트 후 npm install gyp 오류 해결 방법"
source_type: other
source_url: "https://jojoldu.tistory.com/566"
authorship: self
published_at: 2021-04-23
---
# Mac OS 업데이트 후, NPM install시 gyp 오류날 경우

**작성자:** 향로 (기억보단 기록을)  
**게시일:** 2021. 4. 23.

Mac OS를 업데이트 이후 (BigSur) 로 `npm install`이 정상적으로 작동안될 수가 있습니다.

보통 아래와 같은 에러 메세지가 발생할때인데요.

```bash
gyp: No Xcode or CLT version detected! gyp ERR! configure error  gyp ERR! stack Error: `gyp` failed with exit code: 1
```

이럴 경우 `node-gyp`를 글로벌/로컬을 다 지우고 다시 설치하는 방법도 있겠지만, `X-code`를 재설치하는 것이 가장 편하고 빠르게 되는 방법이라 추천드립니다.

간단하게 아래 2개 커맨드를 차례로 실행시키시면 됩니다.

```bash
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

설치가 끝나시면 설치가 잘 되었는지 확인해봅니다.

```bash
xcode-select --print-path
```

그럼 아래와 같이 정상적으로 Path가 나오면 다시 `npm install` 을 수행하시면 됩니다.

```bash
/Library/Developer/CommandLineTools
```

## 참고

- [why-is-node-gyp-rebuild-failing-on-mac-osx-el-capitan](https://stackoverflow.com/questions/38058386/why-is-node-gyp-rebuild-failing-on-mac-osx-el-capitan)
