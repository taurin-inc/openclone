# openclone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-8A2BE2)](https://docs.claude.com/en/docs/claude-code)
[![Status](https://img.shields.io/badge/Status-v0.3.0-brightgreen)](CHANGELOG.md)
![Made in Korea](https://img.shields.io/badge/Made%20in-Korea-blue)

> **Claude Code 안에서 AI 페르소나 클론과 대화하는 스킬.**

## 소개

`/openclone` 한 줄로 AI 페르소나 클론을 만들고, 활성화하고, 단체 대화방이나 카테고리 패널로 여러 관점을 한 번에 들을 수 있습니다.

- **기본 클론과 바로 대화** — 설치 직후 큐레이션된 프리셋(예: `douglas`/권도균) 사용 가능
- **나만의 클론 만들기** — 인터뷰로 페르소나와 지식을 쌓아 내 전용 클론 생성
- **단체 대화방(room)** — 여러 클론을 한 방에 모으면 질문에 가장 적합한 클론이 자동 응답
- **카테고리 패널** — 같은 카테고리의 모든 클론에게 동시에 질문하고 관점을 나란히 비교
- **지식 주입** — URL·영상 자막·문서를 활성 클론에 학습시켜 로컬 파일로 보관

모든 데이터는 내 컴퓨터에 마크다운으로 저장됩니다. 서버도, 계정도, SaaS도 없습니다.

## 기본 클론

현재 저장소에 기본 포함된 프리셋 클론 목록입니다. **Official** 컬럼의 ✅ 표시는 본인이 직접 확인하고 공식적으로 수락한 클론입니다. 그 외 항목은 공개된 인터뷰·발언·글을 바탕으로 구성되었으며, 본인의 수정·제거 요청은 아래 [옵트인](#옵트인-실존-인물-클론) 섹션을 참고하세요.

| Official | 이름 | 카테고리 | 소개 |
| :---: | --- | --- | --- |
| ✅ | [장동욱 (Brian)](clones/brian/persona.md) | `vc` | 카카오벤처스 이사. 당근·한국신용데이터·퀸잇 등 60+ 초기팀 투자 |
|  | [노정석 (Chester Roh)](clones/chester/persona.md) | `founder`, `vc` | 아시아 최초 구글 인수 창업자. 6연속 창업·엔젤투자·컴퍼니빌더 25년 |
| ✅ | [김철우](clones/chulwukim/persona.md) | `vc`, `founder` | 더벤처스 대표. 셀잇→카카오 매각, 번개장터 PEF 엑싯 경험 창업자 출신 VC |
| ✅ | [권도균](clones/douglas/persona.md) | `founder`, `vc` | 프라이머 대표. 16년간 300여개사 투자한 국내 1위 액셀러레이터 |
| ✅ | [조여준 (Ethan Cho)](clones/ethan/persona.md) | `vc` | 더벤처스 CIO. 구글·퀄컴벤처스·KB인베스트먼트 출신, 두나무·토스 초기 검증 |
| ✅ | [정구봉](clones/gbjeong/persona.md) | `tech`, `founder` | 팀어텐션 대표. 자타공인 Claude Code 전문가, AI 에이전트·자동화 엔지니어 |
| ✅ | [김동현 (이드)](clones/iid/persona.md) | `expert` | 티오더 HR Director. 토스·야놀자·클래스101 거친 실행형 HR 파트너 |
| ✅ | [신재명 (Jay Shin)](clones/jayshin/persona.md) | `founder` | 딜라이트룸 창업자. 글로벌 1억 다운로드 알라미, 340억 매출 웰니스 앱 |
|  | [이동욱 (향로)](clones/jojoldu/persona.md) | `tech` | 인프랩 CTO. 기록하는 개발자, "기억보단 기록을" · "개발바닥" |
| ✅ | [조쉬](clones/josh/persona.md) | `founder`, `expert` | 빌더 조쉬 · 조쉬의 뉴스레터 · 《나는 솔로프리너다》 저자 |
| ✅ | [이경훈](clones/kyunghun/persona.md) | `founder`, `vc` | 채널코퍼레이션 부대표·CAIO. 글로벌브레인 한국 대표 출신 AI·일본 시장 전문가 |
| ✅ | [김용훈 (Levi)](clones/levi/persona.md) | `expert` | 김용훈그로스연구소 대표. 160+ 스타트업의 그로스 마케팅, M&A·IPO 경험 CMO |
|  | [이승건 (SG Lee)](clones/sglee/persona.md) | `founder`, `expert` | 토스팀 리더·비바리퍼블리카 창업자. 5년 8번 실패 뒤 9번째로 국민 슈퍼앱을 만든 사람 |
|  | [김동신 (John Kim)](clones/johnkim/persona.md) | `founder`, `expert` | 센드버드 창업자. 파프리카랩 Exit → 스마일패밀리 피봇 → 한국인 최초 실리콘밸리 B2B 유니콘. 현재 Delight.ai |

## 설치

openclone은 **Claude Code**를 1급 호스트로 지원하며, **Codex CLI**에 대한 실험적 설치도 제공합니다. 사용 중인 호스트의 섹션을 따라가세요.

### Claude Code (권장)

#### 옵션 A — Claude Code에 맡기기

Claude Code 세션에 아래 문단을 붙여넣으세요.

```text
Install openclone: run
  git clone --filter=blob:none --sparse --depth=1 https://github.com/open-clone/openclone.git ~/.claude/skills/openclone && cd ~/.claude/skills/openclone && git sparse-checkout set --no-cone '/*' '!/clones/*/knowledge/' && ./setup
then restart Claude Code (or start a new session) so the skill's hooks are picked up. Add an "openclone" section to ~/.claude/CLAUDE.md briefly explaining what openclone is: a single slash command `/openclone` that opens a home panel of AI persona clones grouped by category (vc, tech, founder, expert, influencer, politician, celebrity). Subcommands: `/openclone <name|N>` activates a clone, `/openclone room <A> <B> ...` opens a group chat where the most relevant clone auto-responds, `/openclone panel <category> "..."` broadcasts to all clones in that category, `/openclone new` creates a clone, `/openclone ingest <url|path>` feeds knowledge, `/openclone stop` exits. Knowledge for a built-in clone is lazy-fetched on first activation. Finally, confirm the skill loaded by running /openclone and show me the output.
```

Claude Code가 설치를 대신 수행하고, `~/.claude/CLAUDE.md`에 사용법 메모를 추가해 앞으로 자연스럽게 인식하도록 만듭니다.

#### 옵션 B — 터미널에서 직접

```bash
git clone --filter=blob:none --sparse --depth=1 \
  https://github.com/open-clone/openclone.git \
  ~/.claude/skills/openclone \
  && cd ~/.claude/skills/openclone \
  && git sparse-checkout set --no-cone '/*' '!/clones/*/knowledge/' \
  && ./setup
```

설치 후 Claude Code 세션을 재시작하면 `/openclone`이 바로 동작합니다.

### Node.js CLI (실험적)

기존 Claude Code 스킬 지원은 그대로 유지하면서, 같은 마크다운 클론을 일반 API 호출로 대화하는 Node.js CLI도 제공합니다. CLI는 `clones/<slug>/persona.md`와 `knowledge/*.md`를 그대로 읽으므로 마크다운 파일이 계속 single source of truth입니다.

로컬 체크아웃에서 실행:

```bash
npm install
npm run build
node dist/cli/index.js list
node dist/cli/index.js status
node dist/cli/index.js chat douglas --prompt "내 아이디어를 평가해줘"
node dist/cli/index.js chat douglas   # prompt/stdin이 없으면 Ollama run처럼 대화 모드
```

npm 패키지로 설치한 경우:

```bash
npm install -g @openclone/openclone
openclone list
openclone chat douglas
```

대화 모드에서는 프로세스가 살아 있는 동안 이전 user/assistant 턴을 in-memory history로 유지합니다. `/help`로 명령을 보고, `/compact`로 오래된 대화를 요약하고, `/clear`로 현재 대화 맥락과 요약을 비우고, `/bye`·`/exit`·`/quit`로 종료합니다.

긴 대화는 기본적으로 약 24,000자(`OPENCLONE_COMPACT_MAX_CHARS`)를 넘으면 오래된 메시지를 요약하고 최근 6턴(`OPENCLONE_COMPACT_KEEP_TURNS`)은 원문으로 유지합니다. 요약 길이는 `OPENCLONE_COMPACT_SUMMARY_MAX_CHARS`(기본 6,000자)로 조정할 수 있습니다.

#### 대화 세션 영속화

인터랙티브 대화는 매 턴 그리고 `/bye` 시점에 `~/.openclone/conversations/<slug>/<sessionId>.json`로 평문 JSON으로 저장됩니다. `sessionId`는 파일명에 안전한 ISO 타임스탬프(예: `2026-04-28T14-32-19-487Z`)이며, 같은 세션이 진행되는 동안 동일 sessionId 파일을 덮어씁니다.

저장된 세션을 불러와 이어 대화하려면 `--resume`을 사용합니다.

```bash
node dist/cli/index.js chat douglas --resume                       # 가장 최근 세션 이어가기
node dist/cli/index.js chat douglas --resume=2026-04-28T14-32-19-487Z   # 특정 세션 이어가기
node dist/cli/index.js history douglas                             # 단일 클론의 저장된 세션 목록 보기
node dist/cli/index.js history --all                               # 모든 클론의 세션을 클론별로 그룹핑해서 보기
node dist/cli/index.js history                                     # 인자 없이 호출하면 history 도움말 표시
node dist/cli/index.js history douglas --quiet                     # 컬럼 헤더와 resume 힌트 제거 (파이프용)
node dist/cli/index.js chat douglas --no-persist                   # 이번 세션은 디스크에 저장하지 않기
```

`openclone history`를 인자 없이 부르면 **도움말만 출력**됩니다. 암묵적인 active-clone fallback은 의도치 않은 결과를 부를 수 있어서 제거했습니다. 단일 클론을 보려면 `openclone history <slug>`로 명시적으로, 전체를 보려면 `--all`로 명시적으로 호출하세요.

`history --all`은 `~/.openclone/conversations/` 아래 디렉터리를 모두 훑어 클론별로 묶어 보여줍니다. 클론이 더 이상 존재하지 않는데 세션만 남아있는 경우(예: 사용자가 `~/.openclone/clones/<slug>/`를 지웠거나 built-in에서 제거된 경우) 해당 그룹에 `[orphan: clone not found]` 표시가 붙습니다.

각 세션 라인 아래에는 그대로 복사해 쓸 수 있는 `→ resume: openclone chat <slug> --resume=<SESSION_ID>` 힌트가 표시되어, sessionId가 무엇인지·어떻게 이어갈지 별도 문서를 보지 않아도 됩니다. 파이프로 다른 도구에 넘겨야 할 때는 `--quiet`로 헤더와 힌트를 모두 끌 수 있습니다.

`--resume`으로 시작하면 배너에 `[resumed: N message(s)]`가 표시되고 이전 대화의 메시지·요약이 in-memory로 복원되어 모델 호출에 포함됩니다. 그리고 **이전 대화 전체가 터미널에 그대로 다시 출력**되어, 위로 스크롤하면 그 동안 무슨 이야기를 했는지 바로 확인할 수 있습니다(요약이 있으면 `--- prior summary ---` 박스로, raw 메시지는 시간순으로 `>>>` 프리픽스의 사용자 발화와 어시스턴트 응답이 교대로 표시됩니다). 마지막엔 `--- continuing conversation ---` 구분선이 찍히고 새 `>>>` 프롬프트가 뜹니다. 종료 시점에 `[session saved: <path>]`가 출력됩니다. 세션 파일은 평문 JSON이므로 직접 열어 검토하거나 보관·삭제할 수 있습니다.

기본 provider는 Vercel AI SDK의 OpenAI-compatible provider이며 기본 모델은 `gpt-5.5`입니다. API 키 방식은 아래 환경변수를 사용합니다.

```bash
export OPENCLONE_PROVIDER="openai-compatible"
export OPENCLONE_BASE_URL="https://api.openai.com/v1"
export OPENCLONE_API_KEY="..."      # 또는 OPENAI_API_KEY
export OPENCLONE_MODEL="gpt-5.5"
```

Codex에 로그인된 환경에서는 `--use-codex-auth`로 `openai-oauth-provider` 기반 Codex OAuth transport를 사용할 수 있습니다. 이 경로는 일반 `api.openai.com/v1`이 아니라 Codex backend(`https://chatgpt.com/backend-api/codex`)로 요청을 보내며, 로컬 `~/.codex/auth.json`/`CODEX_HOME/auth.json`을 사용합니다. 로컬 개인 머신 실험용이며, hosted service나 token 공유 용도로 쓰지 마세요. Codex OAuth는 기본적으로 response item persistence를 끕니다(`store=false`). ChatGPT 백엔드가 ChatGPT 일반 사용자 토큰에 대해 `store=true` 요청을 거부하기 때문이며, 우리 CLI는 매 턴마다 전체 messages 배열을 직접 전송하므로 `previous_response_id` 없이도 멀티턴 대화가 정상 동작합니다. 만약 백엔드가 향후 다시 `store=true`를 허용하고 그 모드를 쓰고 싶다면 `OPENCLONE_CODEX_STORE=1`로 명시적으로 켤 수 있지만, 거부되면 `Store must be set to false` 400 오류가 납니다.

```bash
node dist/cli/index.js chat douglas --use-codex-auth --model gpt-5.5 --prompt "짧게 조언해줘"
```

CLI 대화도 AI SDK tool calling을 사용해 Claude Code 훅과 유사하게 동작합니다. 프롬프트에는 일부 최신/관련 knowledge snippet만 미리 넣지만, 전체 knowledge manifest를 함께 제공하고 모델이 `list_knowledge_files`/`read_knowledge_file` 도구로 필요한 로컬 마크다운 지식을 추가로 읽을 수 있습니다. 최신·외부 사실이 필요하면 `web_search`/`web_fetch` 도구를 사용할 수 있습니다.

Ollama는 전용 AI SDK provider(`ai-sdk-ollama`)로 지원합니다.

```bash
node dist/cli/index.js chat douglas --provider ollama --model llama3.2 --prompt "로컬 모델로 답해줘"
```

### Codex CLI (실험적)

> ⚠️ **현재는 파일 참조 수준의 실험 지원입니다.** `./setup`이 Claude Code 전용 경로·훅·statusline을 건드리므로 **Codex 환경에서는 `./setup`을 실행하지 마세요.** 슬래시 커맨드 `/openclone`, `UserPromptSubmit`/`SessionStart` 훅 기반 자동 주입, statusline, 백그라운드 자동 업데이트는 아직 동작하지 않으며, 현재는 `clones/<slug>/persona.md`·`knowledge/` 파일을 Codex가 읽도록 배치하는 정도만 가능합니다. 네이티브 `--host=codex` 인스톨러는 추후 릴리스 예정입니다.

레포만 Codex 스킬 경로에 sparse clone합니다.

```bash
git clone --filter=blob:none --sparse --depth=1 \
  https://github.com/open-clone/openclone.git \
  ~/.codex/skills/openclone \
  && cd ~/.codex/skills/openclone \
  && git sparse-checkout set --no-cone '/*' '!/clones/*/knowledge/'
```

이후 Codex 세션의 `AGENTS.md`(또는 프로젝트 지침)에 아래 문단을 붙여두면, Codex가 대화 맥락에 따라 해당 파일을 참조합니다.

```text
openclone 페르소나·지식이 `~/.codex/skills/openclone/clones/<slug>/` 아래에 있습니다. 사용자가
"<이름>처럼 말해봐" 또는 "openclone <slug>"라고 요청하면 `persona.md`를 읽고 해당 톤·관점을 따르세요.
사용 가능한 클론 목록은 `~/.codex/skills/openclone/README.md`의 "기본 클론" 섹션을 참고합니다.
```

특정 클론의 지식 파일이 필요하면 그때그때 lazy-fetch:

```bash
cd ~/.codex/skills/openclone && git sparse-checkout add clones/<slug>/knowledge/
```

**업데이트**: 자동 업데이트 훅이 없으므로 `git pull --ff-only`로 수동 갱신합니다. **제거**: 디렉터리 삭제(`rm -rf ~/.codex/skills/openclone`)로 충분합니다 — Claude Code처럼 settings.json을 건드리지 않기 때문입니다.

### Agent skill for CLI help

이 저장소는 Claude Code용 루트 `SKILL.md`와 별도로, 일반 에이전트가 openclone CLI 사용법을 안내할 수 있는 분리형 스킬도 제공합니다.

```text
skills/openclone-cli/SKILL.md
skills/openclone-cli/references/*.md
```

이 스킬은 npm 설치, Ollama/local model, Codex OAuth, OpenAI-compatible API, 대화 모드, knowledge 조회, 문제 해결을 reference 파일로 나눠 필요한 부분만 읽도록 설계되어 있습니다.

### npm 배포

GitHub Release를 `published` 상태로 만들면 `.github/workflows/publish-npm.yml`이 npm 배포를 수행합니다. Release tag가 npm 패키지 버전의 source of truth입니다.

- tag 예: `v0.3.1` 또는 `0.3.1`
- prerelease tag 예: `v0.4.0-beta.1`
- 일반 release는 npm `latest` dist-tag로 배포
- GitHub prerelease이거나 semver prerelease tag이면 npm `next` dist-tag로 배포
- 저장소 secret `NPM_TOKEN`이 필요합니다.

워크플로는 publish 전에 tag에서 version을 추출해 `package.json`/`package-lock.json`에 `npm version --no-git-tag-version`으로 반영한 뒤 validate/build/test/lint/audit를 통과해야 `npm publish --provenance`를 실행합니다.

### 플랫폼 지원

| 환경 | 상태 | 비고 |
| --- | --- | --- |
| macOS | ✅ 정식 지원 | 주요 개발·검증 환경 |
| Linux | ✅ 정식 지원 | |
| Windows (WSL2) | ✅ 동작 | 리눅스로 취급됨. 권장 |
| Windows (Git Bash) | ⚠️ 미지원 | 훅 실행이 환경 의존적. `session-update.sh`의 백그라운드 detach와 `dev-link.sh`의 `ln -sfn`이 특히 취약 |
| Windows (cmd / PowerShell 네이티브) | ❌ 미지원 | 훅·스크립트가 전부 bash 기반. 현재 구조로는 불가능 |

`CLAUDE_CONFIG_DIR` 환경변수로 `~/.claude` 위치를 옮긴 경우에도 `setup`/`uninstall`이 자동으로 따라갑니다. Codex CLI 호스트 지원은 현재 실험 단계이며, 위 "Codex CLI (실험적)" 섹션을 참고하세요.

<details>
<summary>업데이트·제거·자동 업데이트 끄기</summary>

**업데이트** — 세션 시작 시 백그라운드로 자동 `git pull`이 돌아갑니다(1시간당 1회). 수동으로 갱신하려면:

```bash
cd ~/.claude/skills/openclone && git pull --ff-only
```

**자동 업데이트 끄기·켜기** — 파일 플래그로 토글합니다.

```bash
touch ~/.openclone/no-auto-update    # 끄기
rm ~/.openclone/no-auto-update       # 다시 켜기
```

**제거** — 설치 디렉터리의 `./uninstall`을 실행합니다.

```bash
cd ~/.claude/skills/openclone && ./uninstall
```

내가 만든 클론과 수집한 지식(`~/.openclone/`)은 보존됩니다. 완전히 지우려면 `rm -rf ~/.openclone`.

</details>

<details>
<summary id="설치-트러블슈팅">설치 트러블슈팅 (v1 정리, 재설치)</summary>

**플러그인(0.2.0 이전) 설치에서 올라오는 경우** — 경로가 `~/.claude/plugins/marketplaces/openclone`이었습니다. 먼저 정리하고 위 옵션 A 또는 B를 실행하세요.

```bash
cd ~/.claude/plugins/marketplaces/openclone && ./uninstall
rm -rf ~/.claude/plugins/marketplaces/openclone
rm -f ~/.openclone/no-auto-update
```

`~/.openclone/` 아래 사용자 데이터는 그대로 보존됩니다.

**기존 설치가 깨지거나 업데이트가 막힌 경우** — 지우고 다시 설치하는 쪽이 빠릅니다.

```bash
cd ~/.claude/skills/openclone && ./uninstall
rm -f ~/.openclone/no-auto-update
# 이후 위 옵션 A 또는 B 재실행
```

</details>

## 이용 방법

```text
/openclone                              # 홈 패널 — 카테고리별 클론 목록
/openclone 1                            # 번호로 활성화
/openclone douglas                      # 이름으로 활성화
/openclone stop                         # 활성 클론·방 모두 종료
/openclone new hayun                    # 클론 생성 (인터뷰)
/openclone ingest https://blog/post     # 활성 클론에 지식 추가
/openclone room douglas alice bob       # 단체 대화방
/openclone room add charlie             # 방 멤버 추가
/openclone room leave                   # 방 종료 (활성 클론은 유지)
/openclone panel vc "질문"              # 카테고리 패널 — 모든 vc 클론에게 질문
```

카테고리는 `vc`, `tech`, `founder`, `expert`, `influencer`, `politician`, `celebrity` 7종입니다. 렌즈별 상세는 [references/categories.md](references/categories.md) 참고.

## 옵트인 (실존 인물 클론)

openclone에 기본 클론으로 배포되는 인물 페르소나는 **공개된 인터뷰·발언·글**만을 바탕으로 구성되며, 해당 인물의 "아바타"가 아니라 공개된 관점을 요약·재현하는 도구입니다.

본인이라면 언제든 아래 요청을 하실 수 있습니다.

- 현재 기본 클론에 포함된 자료 확인
- 특정 인용·문장·지식 파일의 수정·삭제
- 표기 정정 (`display_name`, `tagline`, 소속 등)
- 페르소나 전체 제거

**문의 경로** — 공개 요청은 [옵트인 이슈 템플릿](https://github.com/open-clone/openclone/issues/new?template=opt_in_request.md), 사적 증빙이 필요한 경우는 `hayun@rapidstudio.dev`로 부탁드립니다.

**응답 목표** — 접수 후 7일 이내 초기 응답. 제거 요청은 본인 확인 즉시 저장소에 반영하며, 사용자 로컬에는 다음 자동 업데이트 때 전달됩니다.

## 더 보기

- [CONTRIBUTING.md](CONTRIBUTING.md) — 기여 가이드 (새 클론 추가, 커맨드·훅 개발)
- [references/clone-schema.md](references/clone-schema.md) — 클론 파일 스펙
- [references/categories.md](references/categories.md) — 카테고리 렌즈·톤 가이드
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md)
- 후원: [팀어텐션 (Team Attention)](https://www.team-attention.com/)
- 라이선스: MIT — [LICENSE](LICENSE)
