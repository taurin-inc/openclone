---
topic: "Eclipse MAT 메모리 할당 크기 조정 방법 (Mac OS)"
source_type: other
source_url: "https://jojoldu.tistory.com/738"
authorship: self
published_at: 2023-10-08
---
# Eclipse Mat 메모리 할당 크기 조정 (Mac OS)

**Author:** 향로 (기억보단 기록을)  
**Date:** 2023. 10. 8.

Heap Dump를 분석하기 위해 Eclipse mat를 종종 사용한다.

너무 큰 덤프 파일을 불러오면 다음과 같이 OOM 이슈가 발생한다.

```
An internal error occurred during: "Parsing heap dump"  Out of Memory
```

mat 에 할당된 메모리를 높여야만 대용량의 덤프 파일을 불러 올 수가 있다.

이를 위한 설정은 다음과 같다.

## 설정

> 모든 설정은 MAC OS를 기준으로 한다.

mat 설정은 `/Applications/mat.app/Contents/Eclipse/MemoryAnalyzer.ini` 위치에 존재한다.

그래서 필요한 에디터로 (여기서는 `vi`) 해당 파일을 열어서

```bash
vim /Applications/mat.app/Contents/Eclipse/MemoryAnalyzer.ini
```

원하는 크기 만큼의 메모리를 할당한다.

나는 2048mb 를 할당했다.

(기본값은 1024mb)

![ini](https://blog.kakaocdn.net/dna/pbGt6/btsxsQYDEbJ/AAAAAAAAAAAAAAAAAAAAAM37muG32MzzaBUE2MAOjAAZRc6o6bz1tsyPazYKovyW/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=ssMxNQBw6n6x%2Bg10f%2BQWmj76IF8%3D)

**mat 을 재시작** 하고 정상적으로 적용되었는지 확인해본다.

실행된 mat의 `Help -> About Eclipse Memory Analyzer` 를 클릭해서

![review1](https://blog.kakaocdn.net/dna/JVXVE/btsxLkLcZUf/AAAAAAAAAAAAAAAAAAAAAMaTKH5dUZSKOcitZCxQ0ixGhQEeErdRAbNtAO6h-CGI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=khJvBTOqlMDdftn3FDqUJRJYSV4%3D)

About 창이 열리면 `Installation Details` 를 클릭한다.

![review2](https://blog.kakaocdn.net/dna/dsQetF/btsxqAvmiYS/AAAAAAAAAAAAAAAAAAAAAENFMUzd_XecwHDKqXEH9VdVnBiT925w3zWtOrOaHLIS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=HTMOMjUgtoDGOO3Ai5%2B8lyy8PfA%3D)

Details 창에서 `Configuration` 탭에서 설정한 내용이 적용되었는지 확인할 수 있다.

![review3](https://blog.kakaocdn.net/dna/b4FLbp/btsxh4KYACF/AAAAAAAAAAAAAAAAAAAAAAHeeYmmlExR1OTwAigx_tP0QeNeYjhBASgCJlcYn_8d/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=WEDtH%2FvY%2BgB%2FaG6xJCFDzw%2FsQEQ%3D)
