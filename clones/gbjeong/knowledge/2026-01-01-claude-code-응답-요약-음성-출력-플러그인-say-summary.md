---
topic: "Claude Code 응답 요약 음성 출력 플러그인: say-summary"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code%EC%9D%98-%EC%9D%91%EB%8B%B5%EC%9D%84-%EC%9A%94%EC%95%BD%ED%95%B4%EC%84%9C-%EC%9D%8C%EC%84%B1%EC%9C%BC%EB%A1%9C-%EB%93%A4%EC%9D%84-%EC%88%98-%EC%9E%88%EB%8A%94-hooks-activity-7412609821390249984-ekCd?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-01
---
Claude Code의 응답을 요약해서 음성으로 들을 수 있는 Hooks 플러그인을 만들었습니다.
say-summary 입니다.

[왜 만들었냐면요.]
저는 voice input을 정말 많이 쓰고 싶습니다. 타이핑보다 빠르거든요.
근데 이상하게 voice input을 잘 안 쓰게 됩니다. 왜 그런지 생각해봤어요.

Claude는 텍스트로 응답하는데, 나만 음성으로 말하니까 어색한 거였습니다. 대화가 아니라 혼잣말하는 느낌이랄까요.

그래서 Claude의 응답을 일부러 음성으로 만들었습니다. Claude가 음성으로 말하면, 나도 음성으로 다시 대답하기 좋을 것 같아서요.
결과는 대성공입니다. 지금 voice input을 엄청 많이 쓰고 있어요.

[동작 원리는 이렇습니다.]
1. Stop hook으로 Claude가 응답을 완료하면 트리거
2. transcript 파일에서 마지막 assistant 메시지를 추출
3. Claude Haiku가 3-10단어로 요약
4. macOS say 명령어로 음성 출력

백그라운드에서 돌아가기 때문에 Claude Code 작업을 방해하지 않습니다.

[재밌는 건 한/영 자동 감지입니다.]
한국어가 포함되면 Yuna 음성을, 영어면 Samantha 음성을 씁니다.
Claude Code를 한국어로 쓰는 분들도 자연스럽게 들을 수 있어요.

이제 저는 Claude Code 쓸 때 화면을 계속 안 봐도 됩니다.
작업이 끝나면 "파일 수정 완료", "테스트 통과" 이런 식으로 알려주니까요.

voice input을 많이 활용해보세요. 타이핑 안 하고 코딩하는 경험, 생각보다 좋습니다.

GitHub: https://lnkd.in/gvEKVRRj

귀엽게 새해 인사를 녹음해봤습니다 :)
