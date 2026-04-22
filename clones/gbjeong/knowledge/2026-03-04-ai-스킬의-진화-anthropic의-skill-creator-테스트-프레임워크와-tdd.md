---
topic: "AI 스킬의 진화: Anthropic의 skill-creator 테스트 프레임워크와 TDD"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_improving-skill-creator-test-measure-and-activity-7435085433027469313-NzXf"
authorship: self
published_at: 2026-03-04
---
스킬에는 두 가지 종류가 있습니다. 모델이 좋아지면 필요 없어지는 스킬과, 모델이 아무리 좋아져도 남는 스킬. Anthropic이 skill-creator에 테스트 프레임워크를 추가하면서 이 구분이 데이터로 판단 가능해졌습니다.

Anthropic은 이걸 Capability Uplift와 Encoded Preference로 나눕니다. Capability Uplift는 모델이 못 하는 걸 보완하는 스킬입니다. 모델이 발전하면 자연 소멸합니다. Encoded Preference는 "우리 팀은 이렇게 일한다"를 담은 스킬입니다. 모델이 아무리 좋아져도 팀의 프로세스는 모델이 알 수 없으니까요.

코드에 TDD가 있듯, 스킬에도 TDD가 온 겁니다.

저는 30개 넘는 스킬을 매일 씁니다. LinkedIn 글쓰기, 캘린더 관리, 슬랙 동기화, 미팅록 정리. 문제는 모델이 업데이트될 때마다 조용히 깨지는 스킬이 있다는 겁니다. 어제까지 잘 되던 게 안 되는데, 테스트가 없으니 사고가 난 다음에야 알게 됩니다.

이번에 추가된 eval 프레임워크는 코드 없이 테스트를 정의합니다. 벤치마크 모드로 pass rate, 시간, 토큰을 추적하고, 모델이 바뀔 때마다 돌려서 비교합니다. 멀티 에이전트가 클린 컨텍스트에서 병렬로 테스트를 돌리고, A/B 비교 에이전트는 두 버전을 블라인드로 평가합니다.

실제 skill-creator 플러그인 구조를 보면 이런 식입니다.

skill-creator/
  SKILL.md
  scripts/
    run_eval.py
    run_loop.py
    aggregate_benchmark.py
    improve_description.py
    generate_report.py
    package_skill.py
  agents/
    analyzer.md
    comparator.md
    grader.md
  references/
    schemas.md
  eval-viewer/
    generate_review.py
    viewer.html

eval 실행, 벤치마크 집계, description 최적화, 리포트 생성까지 스크립트로 갖추고 있고, analyzer/comparator/grader 세 종류의 전용 에이전트가 붙어 있습니다.

동작 방식이 영리합니다. run_eval.py는 스킬의 description을 임시로 등록한 뒤, eval set의 각 쿼리에 대해 claude -p를 실행합니다. Claude가 그 스킬을 트리거하는지 스트림을 실시간으로 모니터링합니다. "자막 생성해줘"라는 쿼리에 자막 스킬이 트리거되면 PASS, 엉뚱한 스킬이 트리거되면 FAIL. 쿼리당 3회씩 병렬 10개 프로세스로 돌려서 trigger rate를 산출합니다. improve_description.py는 이 결과를 바탕으로 description을 자동 개선합니다. 실제로 공개 문서 생성 스킬 6개 중 5개의 트리거링이 이 방식으로 개선됐습니다.

PDF 스킬에서 텍스트 좌표 배치가 틀어지는 버그도 eval로 발견됐고요.

저는 이게 핵심이라고 생각합니다. "되는 것 같다"에서 "된다고 증명할 수 있다"로 바뀌는 것. 그리고 eval이 있으면 내 스킬이 Capability Uplift인지 Encoded Preference인지도 데이터로 판단할 수 있습니다. 스킬 없이 베이스 모델만으로 eval을 통과하기 시작하면, 그 스킬은 역할을 다한 겁니다.

Anthropic 블로그의 이 문장이 인상적입니다. "Eventually, that description may be the skill itself." 구현 방법이 아니라 원하는 결과만 기술하면 되는 세상. 스킬이 코드에서 스펙으로 진화하는 겁니다.

테스트 없는 코드가 부채인 것처럼, 테스트 없는 스킬도 부채입니다.

improving-skill-creator-test-measure-and-refine-agent-skills: https://lnkd.in/gDrVfJqq
