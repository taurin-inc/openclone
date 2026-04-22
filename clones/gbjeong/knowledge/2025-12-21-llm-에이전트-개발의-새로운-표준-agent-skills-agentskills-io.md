---
topic: "LLM 에이전트 개발의 새로운 표준, Agent Skills (agentskills.io)"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-%EA%B0%80-%EB%A7%8C%EB%93%A0-skills-%EA%B0%80-openai-cursor-%EB%93%B1%EC%9D%B4-%EB%B0%9B%EC%95%84%EB%93%A4%EC%9D%B4%EB%A9%B0-activity-7408299241556606976-Ol2y?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-12-21
---
Claude 가 만든 skills 가 OpenAI, Cursor 등이 받아들이며 agentskills.io 라는 표준이 되었습니다. 이제 SKILL.md, scripts/, references/, assets/ 구조를 따르지 않으면 성능이 떨어질 수 있습니다.
"그냥 프롬프트 길게 쓰면 되는 거 아니야?" 라고 생각하실 수 있습니다. 하지만 Agent Skills는 단순한 프롬프트 모음이 아닙니다. LLM의 컨텍스트 윈도우를 효율적으로 쓰기 위한 설계 철학이 담겨있습니다.

1. 점진적 공개 (Progressive Disclosure): 컨텍스트는 비싸다
Agent Skills의 핵심은 "필요할 때만 로드한다"입니다. 세 단계로 작동합니다:
- Discovery: 에이전트가 처음 로드할 때는 name과 description만 읽습니다 (~100 토큰)
- Activation: 태스크가 스킬의 description과 매칭되면 그제서야 전체 지시사항을 로드합니다 (<5000 토큰 권장)
- Execution: 실행 중 필요한 reference 파일이나 코드만 그때그때 로드합니다

왜 이게 중요할까요? 10개의 스킬을 가진 에이전트가 있다고 해봅시다. 모든 스킬을 한꺼번에 로드하면 50,000+ 토큰이 날아갑니다. 하지만 점진적 공개를 쓰면? 초기 로드는 1,000 토큰 정도면 충분합니다.

2. 구조화된 디렉토리: 역할 분리가 성능을 만든다

my-skill/
├── SKILL.md   # 필수: 메타데이터 + 핵심 지시사항
├── scripts/   # 실행 가능 코드 (Python, Bash, JS)
├── references/  # 온디맨드 문서 (REFERENCE.md, FORMS.md)
└── assets/    # 템플릿, 이미지, 데이터 파일

SKILL.md는 500줄 이하로 유지하세요. 상세한 API 문서나 예제는 references/에 분리하면, 에이전트가 정말 필요할 때만 로드합니다.

3. skills-ref로 Validation: 표준을 지키고 있는지 확인하세요
명세를 지키지 않은 스킬은 에이전트가 제대로 인식하지 못합니다. 다행히 검증 도구가 있습니다:

skills-ref validate ./my-skill
이 명령어 하나로 프론트매터 유효성, 명명 규칙, 디렉토리 구조를 자동 검증합니다. CI/CD에 넣어두면 잘못된 스킬이 배포되는 걸 막을 수 있습니다.

4. 왜 표준을 따라야 하는가
- Self-documenting: SKILL.md만 읽으면 스킬이 뭘 하는지 바로 알 수 있습니다
- Portable: Claude, GPT, Cursor 어디서든 동작합니다
- Extensible: 단순 텍스트부터 실행 코드까지 유연하게 확장 가능합니다

Agent 생태계가 빠르게 성장하면서, 이제 "내 방식대로 만든 프롬프트"는 통하지 않게 되었습니다. 표준을 따르는 스킬은 더 잘 발견되고, 더 효율적으로 실행됩니다.
