---
topic: "[IntelliJ] Mac에서 IntelliJ CMD+SHIFT+A 눌렀을때 터미널이 켜지는 문제 해결"
source_type: other
source_url: "https://jojoldu.tistory.com/420"
authorship: self
published_at: 2019-06-03
---
# [IntelliJ] Mac에서 IntelliJ CMD+SHIFT+A 눌렀을때 터미널이 켜지는 문제 해결

**작성자:** 향로 (기억보단 기록을)
**게시일:** 2019. 6. 3.

언제부터인가 IntelliJ에서 Command + Shift + A (Action 검색)를 누르면 아래와 같이 터미널이 오픈되었습니다.

![문제](https://t1.daumcdn.net/cfile/tistory/994B844A5CF49AC927)

이 문제는 Mac이 업데이트되고나서 Man 페이지를 보는 기능의 단축키가 Command + Shift + A로 변경되었기 때문인데요.

이 때문에 IntelliJ를 쓰는게 여간 불편한게 아닙니다.

해결책은 간단합니다.

**Mac의 단축키를 비활성화** 하는 겁니다.

시스템환경설정 -> 키보드 -> 단축키 -> 서비스 탭으로 이동합니다.

**터미널에서 man 페이지 인덱스 검색** 항목을 찾습니다.

![해결1](https://t1.daumcdn.net/cfile/tistory/99CDDB4D5CF49AC911)

해당 항목을 아래와 같이 **비활성화** 합니다.

(체크해제 하시면 됩니다.)

![해결2](https://t1.daumcdn.net/cfile/tistory/9921E54C5CF49AC929)
