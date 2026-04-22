# Interview workflow

How Claude conducts a clone-creation interview and consolidates the transcript into a clone file. Loaded by `/openclone new`.

## Overall shape

1. Category selection (at least one required; multiple allowed)
2. Core identity block (5–7 questions)
3. Category-specific deep dive (6–10 questions per chosen category — trim if many)
4. Speaking-style elicitation (3–4 questions)
5. Guardrails — always/never (2–3 questions)
6. Consolidation into `~/.openclone/clones/<name>/persona.md` (folder-per-clone layout)

The user can stop at any time by saying "done", "끝", "저장해" or similar. Consolidate with whatever has been captured.

## Interviewer rules (apply every question)

- Ask **exactly one** question per turn. No compound questions, no "and also…".
- Keep questions to 1–2 sentences.
- No pleasantries, no greetings, no filler. Direct and specific.
- Match the language the user is using. If the user replies in Korean, continue in Korean.
- If the user's answer is vague, do one pointed follow-up before moving on.
- Never reference "clone", "AI", "interview", "training" — frame questions as if you're getting to know a person, not building a bot.

## Stage 1 — Category selection

If the user did not supply categories (either in the command or in chat), ask:

> 어떤 카테고리인가요? 다음 중 **하나 이상** 골라주세요 — 둘 이상 맡는 사람이면 복수 선택 OK: **vc**, **tech**, **founder**, **expert**, **influencer**, **politician**, **celebrity**

Do not proceed until the user names at least one value from this list. If they pick more than one, also ask which is the **primary** category (default lens when the clone is activated). Parse inputs like `vc`, `vc, founder`, `founder+vc` etc.

If the chosen categories are genuinely distinct roles the same person plays (e.g. founder + vc), Stage 3 should cover each category briefly — do not interview for every category at full depth; prioritize the primary one plus 2–3 key questions per additional category.

## Stage 2 — Core identity (always run, any category)

Ask these in order, one per turn. Skip any that the user already covered:

1. 이 클론의 display name 과 한 줄 태그라인은 어떻게 할까요?
2. 어떤 배경/경력을 가진 사람인가요?
3. 지금 가장 몰입해 있는 질문이나 관심사는?
4. 의견을 낼 때 어떤 기준으로 판단하나요?
5. 이 사람을 아는 사람들이 "얘는 이런 사람이다" 한 줄로 말한다면?

## Stage 3 — Category-specific dive

Pull **3–6** questions from the matching block. Prioritize depth over coverage — if the user gives a rich answer, follow up.

### vc

- 주로 어떤 단계·섹터를 보나요?
- 딜 평가할 때 먼저 무엇을 보나요? (시장·팀·트랙션·제품 중 우선순위)
- 최근 놓친 딜 하나와 그 이유는?
- 창업자에게 자주 하는 "불편한 질문" 한 가지?
- 어떤 유형의 창업자를 높게 보나요?

### tech

- 주로 쓰는 언어/스택·도구와, 그 선택의 이유는?
- 설계할 때 가장 먼저 고려하는 것은? (성능·유지보수·단순성 등)
- 최근 크게 후회한 기술 결정 하나와 배운 것?
- 코드 리뷰·아키텍처 리뷰에서 절대 봐주지 않는 것은?
- "좋은 엔지니어"와 "훌륭한 엔지니어"의 차이는?

### founder

- 지금 회사의 핵심 가설과, 아직 검증 안 된 것은?
- 창업 중 가장 큰 실수와 교정 방법은?
- 팀 빌딩에서 타협하지 않는 기준은?
- 펀딩 vs 수익 중 어느 쪽을 더 중요하게 봤고 왜?
- "지금 회사를 다시 시작한다면 뭘 바꿀까?"

### expert

- 어떤 도메인·기능 영역의 전문가인가요? (마케팅·HR·재무·법무·운영 등)
- 그 분야에서 흔히 통용되는 "정석"과, 본인이 깨고 나간 지점은?
- 의뢰가 들어왔을 때 가장 먼저 묻는 질문은?
- 외부에 일반화해 말할 수 있는 가이드 vs 케이스별 자문이 필요한 영역의 경계는?
- 이 영역에서 흔히 보는 가장 큰 오해 한 가지?

### influencer

- 주력 플랫폼과 콘텐츠 포맷·길이는?
- 오디언스는 어떤 사람들이고 어떤 가치를 기대하나요?
- 후크·첫 3초·리텐션 곡선에서 본인이 검증한 패턴은?
- 수익화 구조(스폰서·자체상품·커뮤니티 등)와 신뢰 비용의 균형을 어떻게 잡나요?
- 알고리즘·플랫폼 변화에 어떻게 대응해 왔나요?

### politician

- 어떤 직책·역할이고 주요 정책 영역은?
- 의사결정할 때 가장 비중 있게 보는 이해관계자는?
- 단기적 정치 비용과 장기적 정책 성과 사이에서 결정한 한 사례?
- 본인 입장과 공식 입장이 갈라졌을 때의 처리 원칙은?
- 정책을 실제로 굴리는 데 가장 큰 제약(법·예산·관료 구조)은?

### celebrity

- 어떤 분야의 활동(연기·음악·예능·스포츠 등)이고 현재 어느 단계인가요?
- 본인 페르소나·이미지를 한 줄로 정의한다면?
- 작품·프로젝트를 고를 때의 기준은?
- 공개·비공개의 경계, 사생활 보호 원칙은?
- 팀(매니지먼트·소속사·에이전트)과의 의사결정 분담 방식은?

## Stage 4 — Speaking style

1. 글이나 대화에서 말투의 특징이 있다면? (예: 짧게 말함, 질문으로 응답, 반어법 등)
2. 절대 안 쓰는 표현이나 금기어가 있나요?
3. 예시 한 문단만 주세요 — 이 사람이 평소 쓸 법한 말투로 짧게 써보세요.

## Stage 5 — Guardrails

1. 이 클론이 **항상** 지켜야 할 원칙 2–3가지?
2. 이 클론이 **절대 하지 말아야** 할 것 2–3가지? (주제·발언·조언 등)

## Stage 6 — Consolidation

When the user signals done (or after the last stage), write the clone folder.

- Persona path: `~/.openclone/clones/<name>/persona.md`
- Ensure the folder exists: `mkdir -p "$HOME/.openclone/clones/<name>/knowledge"`
- Follow the schema in `clone-schema.md` exactly: frontmatter + Persona + Speaking style + Guidelines + Background.
- **Frontmatter must include `categories: [...]`** with every category the user chose, and `primary_category` if they named one.
- If the user picked **multiple categories** and the Stage 3 answers indicate distinct framing per role, include a `## Category-specific framing` section with one `### As a <category>` block per category. Each block: 2–4 bullets on emphasis/extra-always/extra-never that only apply in that category's context.
- Summarize the user's answers into prose; do NOT copy raw Q&A. Extract facts and rephrase in third person for Persona/Background, in imperative bullets for Speaking style/Guidelines.
- Preserve concrete facts: names, numbers, dates, specific anecdotes.
- Do not mention "interview", "AI", "clone" inside the clone body.
- Match the language the user used throughout the interview.

Also save the raw transcript as the clone's first knowledge entry:

- Path: `~/.openclone/clones/<name>/knowledge/YYYY-MM-DD-interview.md` (where `YYYY-MM-DD` is today)
- Frontmatter: `topic: interview`, `source_type: interview`, `fetched: YYYY-MM-DD`
- Format: simple `### Q:` / `A:` pairs in the user's language.

After saving, confirm to the user in one line with the final file path, and suggest:

> `/openclone <name>` 로 바로 이 클론과 대화를 시작하세요.
