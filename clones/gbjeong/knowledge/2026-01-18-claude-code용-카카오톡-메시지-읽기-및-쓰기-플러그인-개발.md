---
topic: "Claude Code용 카카오톡 메시지 읽기 및 쓰기 플러그인 개발"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code%EB%A1%9C-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-%EB%A9%94%EC%8B%9C%EC%A7%80%EB%A5%BC-%EC%9D%BD%EA%B3%A0-%EC%93%B8-%EC%88%98-%EC%9E%88%EB%8A%94-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4-activity-7418781762107138048-cxE5?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-18
---
Claude Code로 카카오톡 메시지를 읽고 쓸 수 있는 플러그인을 만들었습니다.

1. 맥락을 파악하고 허락을 맡습니다.
무턱대로 메시지를 보내는게 아니라 이전 메시지를 읽고 적절한 메시지로 만듭니다. 그리고선 바로 보내는게 아니라 반드시 ask user question 으로 유저에게 반드시 메시지 내용을 보여주고 허락을 받습니다.

2. macOS에서 Accessibility API를 통해 카카오톡 앱을 직접 제어합니다.
System Settings > Privacy & Security > Accessibility에서 Terminal을 허용해야 동작합니다.

3. 알아둘 점이 있습니다. 실행하면 커서와 클립보드를 하이재킹 당합니다.
카카오톡 창이 앞으로 튀어나오고, 키보드 입력이 자동으로 일어납니다.
그래서 실행 중엔 가만히 있어야 합니다.

더 스무스한 방법을 찾아볼까 했는데, 메시지를 직접 보낼 때 내 눈 앞에서 잘못된 행동을 바로 잡기에는 바로 종료시킬 수 있는 환경이 더 나은 것 같아 이렇게 구현했습니다.

4. 기본으로 "sent with claude code" 시그니처가 붙습니다.
일부러 그렇게 만들었습니다.
물론 --no-signature로 뗄 수 있습니다.


카카오톡 읽고 답장하는 것 자체가 은근히 인지 부담입니다.
맥락 파악하고, 메시지 구성하고, 보내기까지.
이걸 Claude Code한테 넘기면 머리 안 쓰고 답장할 수 있습니다.

이제 바빠도 카톡 밀리지 말고 잘 답장해봐요!
https://lnkd.in/gYUeFY9P
