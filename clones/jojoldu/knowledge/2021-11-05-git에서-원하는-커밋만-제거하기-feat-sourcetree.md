---
topic: "Git에서 원하는 커밋만 제거하기 (feat. SourceTree)"
source_type: other
source_url: "https://jojoldu.tistory.com/613"
authorship: self
published_at: 2021-11-05
---
# Git에서 원하는 커밋만 제거하기 (feat. SourceTree)

**Author:** 향로 (기억보단 기록을)
**Date:** 2021. 11. 5.

Git을 사용하다보면 특정 커밋들만 날리고 싶을때가 있습니다.

근데 하필 그게 한참 전 커밋들이거나, 중간 커밋들이면 `reset`으로 골라내기가 쉽지 않은데요.

이럴때 `rebase interactively` 를 사용하기가 좋습니다.

## 해결방법

예를 들어 아래와 같이 `REC-296` 커밋 2개를 모두 빼고 싶은 상황이라고 가정해봅니다.

![1](https://blog.kakaocdn.net/dna/bAtiPx/btrjYhhsRC8/AAAAAAAAAAAAAAAAAAAAABMe_ibpE1KdQnUyvBQdOq0YrcGPa_-EjTNdB9ynhWBT/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=3JoSVzI2HLGr%2FGch2Heb2PyTa%2F8%3D)

그럼 **그 직전 커밋** 을 선택합니다.

![2](https://blog.kakaocdn.net/dna/cmNGt6/btrjTZpg7y5/AAAAAAAAAAAAAAAAAAAAAB0uas4x__TLf-D4qxUjpDWr4Mx2ti3UfIcTBNqc2Wih/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=9rolqaZU%2FVSi%2FZ79e8HFsTMSdN8%3D)

해당 커밋을 우클릭을 하신뒤, `Rebase children of ... interactively` 을 선택합니다.

![3](https://blog.kakaocdn.net/dna/ctLtbz/btrjXDkKmsp/AAAAAAAAAAAAAAAAAAAAAO_pqL9h1f6VaXkzHBV7U0Kc0dNFI2InyFMv8oblWlEO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=S0LvoUmp2NI0Y16hXnCGI%2BLRAHg%3D)

그럼 아래와 같이 리베이스 화면이 나오는데, 여기서 삭제를 원하는 커밋을 선택한뒤, 하단의 Delete를 클릭합니다.

![4](https://blog.kakaocdn.net/dna/OOJSj/btrjWo2FK8i/AAAAAAAAAAAAAAAAAAAAAOu2MO3er7D3hvHTjJy-Ft4m9Ht-0yW6wC-mPlxKySFb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=tEKXHsJtCXSLq3wqroVJWegrEeM%3D)

그럼 해당 커밋을 삭제 표기가 됩니다.

지우고싶었던 2개의 커밋을 모두 delete를 하고, OK를 누르시면 그때부터 **Rebase가 시작** 됩니다.

![5](https://blog.kakaocdn.net/dna/bm3aiU/btrjYiAEEry/AAAAAAAAAAAAAAAAAAAAAH5QHZKC0Hi0syCevIxr16Ktru05SMDGk3tKPtjNpTCx/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=U1b192ptSW9pDGdaErSP89yuX%2F8%3D)

Rebase 중 Conflict 난 부분은 수정해서 Rebase를 마무리 합니다.

![6](https://blog.kakaocdn.net/dna/bsCtlq/btrjVBPeNqs/AAAAAAAAAAAAAAAAAAAAAH94JDsvhhvNcz6LRVHh-2Ufd9DeulinhkZjGNwhbECN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=MiDmSYR54PLcmcu1QvM553AE468%3D)

Rebase가 잘 마무리되시면?

아래와 같이 문제가 있었던 `REC-212` 커밋들이 모두 삭제된 깃 그래프를 볼 수 있습니다.

![7](https://blog.kakaocdn.net/dna/bz9h4J/btrjZNNW4b1/AAAAAAAAAAAAAAAAAAAAAIFCuxx4v0jt36MLN2WwEM-_m6nZ-QDRXzFC0LKo3caC/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=Ld87gAQc2vDm1O06SMHp7AAJeJc%3D)
