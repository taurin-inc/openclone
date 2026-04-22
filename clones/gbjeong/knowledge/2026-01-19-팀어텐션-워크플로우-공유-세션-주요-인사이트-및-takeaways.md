---
topic: "팀어텐션 워크플로우 공유 세션 주요 인사이트 및 Takeaways"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%EC%A0%80%ED%9D%AC%EB%8A%94-%EC%9D%BC%EC%A3%BC%EC%9D%BC%EC%97%90-%ED%95%9C-%EB%B2%88%EC%94%A9-%EA%B0%81%EC%9E%90%EC%9D%98-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0%EB%A5%BC-%EA%B3%B5%EC%9C%A0%ED%95%98%EB%8A%94%EB%8D%B0%EC%9A%94-%EC%98%A4%EB%8A%98%EC%9D%80-%EB%B0%B0%EC%9A%B4%EA%B2%8C-activity-7419144131610009600-NNQG?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2026-01-19
---
저희는 일주일에 한 번씩 각자의 워크플로우를 공유하는데요. 오늘은 배운게 많아서 팀어텐션에서 takeaway한 것을 기록합니다.

Takeaways

Jake Park
	- 직접 만든 SDD(Spec Driven Dev) 워크플로우는 단계를 지나면서 스펙을 계속 컴파운드한다.(=쌓는다)
	- 요구사항에 따라 워크플로우를 그때그때 생성하는 스킬을 실험 중

HoYeon Lee 
	- 메인 에이전트가 각 작업을 하는 에이전트 spawn
	- 플래닝에서 중요한 건 E2E 테스트 제대로 만드는 것
	- skills 등 워크플로우를 테스트할 수 있는 플레이그라운드를 만드는게 중요하다.

Changhoi Kim
	- 스킬을 시퀀셜하게 연결하고, input output 스키마를 지정해서 함수처럼 동작하게 했다.
	- Auto Review Loop을 accept 될 때까지 돌려서 퀄리티를 올린다. 이 단계를 빡세게 돌려봤는데 유저 리뷰를 안 해도 괜찮을 정도였다.
	- implement를 시킬 때에는 plan을 최대한 똑같이 하라고 지시한다.
	- clarify - plan - implement - review 단계를 거친다.
	- agent 는 step by step agent 하나 뿐이고, 
	- skill 을 context fork arg로 써서 서브에이전트처럼 사용한다.

+토론과 수렴
간단한 작업도 복잡한 워크플로우를 태우는 게 정답일까?
-> 컴파운드하려면 문서를 남겨야 한다. = 간단한 작업도 워크플로우를 태워서 컨텍스트를 채워야한다. 정답은 아닐지라도 시도할 가치가 있다.
