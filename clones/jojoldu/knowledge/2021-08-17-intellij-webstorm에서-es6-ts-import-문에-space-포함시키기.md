---
topic: "IntelliJ & WebStorm에서 ES6(& TS) Import 문에 space 포함시키기"
source_type: other
source_url: "https://jojoldu.tistory.com/595"
authorship: self
published_at: 2021-08-17
---
# IntelliJ & WebStorm에서 ES6(& TS) Import 문에 space 포함시키기

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 8. 17.

IntelliJ나 WebStorm의 기본 `import` 구문은 `space`가 없는 형태인데요.

![1](https://blog.kakaocdn.net/dna/Uv44c/btrcecvyeIg/AAAAAAAAAAAAAAAAAAAAAAY7lze9rWnv7IfgirT0wRx_1f1a3sAsjEIDbWSTfMYe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=VMKAy%2Bm2%2B1YuKp%2FnR0FlpRkoRyA%3D)

NestJS를 비롯해서 사내 프로젝트등의 Lint 규칙이 `space`가 포함된 형태라면 import 템플릿을 변경할 필요가 있습니다.

## import 템플릿 변경

IntelliJ나 WebStorm에서 아래를 따라 체크박스를 해줍니다.

- `Preferences` -> `Editor` -> `Code Style` -> `JavaScript` / `TypeScript` -> `Spaces` -> `Within` -> `ES6 import/export braces`

![settings](https://blog.kakaocdn.net/dna/MLPHj/btrb9RZPdpf/AAAAAAAAAAAAAAAAAAAAAMQB-r7NO2jtMjVQNNnCpuXYOirgy58BPC3xSiG_l8eu/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=QrqKO58K4xTyrddU56BZdxPzFZA%3D)

그럼 아래와 같이 **import** 시에도 자동으로 `space`가 포함된 형태가 됩니다.

![2](https://blog.kakaocdn.net/dna/dMnuRT/btrcp1ztkXv/AAAAAAAAAAAAAAAAAAAAAGF1CpkLC7T1QSsq5-xQMcNUHFImW2gg7T9jNJD3OCGe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=0wLYW2PLKrMQJVebuDk9Qxtdb%2BY%3D)
