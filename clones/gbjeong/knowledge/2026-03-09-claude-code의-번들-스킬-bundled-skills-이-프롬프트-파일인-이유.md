---
topic: "Claude Code의 번들 스킬(Bundled Skills)이 프롬프트 파일인 이유"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code%EC%97%90%EB%8A%94-%EA%B8%B0%EB%B3%B8%EC%9C%BC%EB%A1%9C-%EB%82%B4%EC%9E%A5%EB%90%9C-bundled-skills%EA%B0%80-%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4-activity-7436901135912775680-EV28"
authorship: self
published_at: 2026-03-09
---
Claude Code에는 기본으로 내장된 Bundled Skills가 있습니다. /loop, /simplify, /batch 같은 기능인데요. 왜 이걸 코드가 아니라 SKILL.md라는 프롬프트 파일로 만들었을까요?

/help, /clear, /compact, /config는 빌트인 커맨드입니다. 코드로 하드코딩되어 있어요. /clear 치면 화면이 지워지는 것처럼요.

반면 번들 스킬 6개는 전부 프롬프트입니다. SKILL.md 파일 한 장에 "이렇게 해라"가 적혀 있고, Claude가 읽고 판단해서 실행합니다. 상황에 맞게 유연하게 동작할 수 있습니다.

/simplify
"변경된 코드를 리뷰하고 문제를 수정하라." 이 한 줄의 지시로 3개 에이전트가 병렬로 뜹니다. Code Reuse Agent, Code Quality Agent, Efficiency Agent. 각각 독립적으로 분석하고 결과를 종합해서 수정까지 적용합니다. 프롬프트에 "3개 리뷰 에이전트를 병렬로 생성하라"고 써있는 거예요. 이걸 코드로 짜면 언어별, 프레임워크별 분기만 수십 개입니다. 프롬프트니까 Python이든 Rust든 알아서 적응합니다.

/batch
"코드베이스를 조사하고, 5~30개 독립 단위로 분해하고, 각각 격리된 git worktree에서 에이전트를 실행하라." 이게 프롬프트 전문의 핵심입니다. 사용자 승인을 받으면 단위당 백그라운드 에이전트가 하나씩 뜨고, 각각 구현하고, 테스트하고, PR까지 엽니다. 전체 오케스트레이션이 프롬프트 한 장에 정의되어 있어요.

/loop
프롬프트 원문을 보면 파싱 규칙표가 들어있습니다. "첫 토큰이 숫자+단위면 interval, 나머지는 prompt"라는 규칙, "every로 끝나면 trailing clause로 추출"이라는 규칙, interval을 cron 표현식으로 변환하는 매핑 테이블까지. Claude가 이 표를 읽고 사용자 입력을 파싱한 다음 CronCreate를 호출합니다. 저는 /loop 1m check email을 돌려봤는데, 매분 같은 결과가 반복되더라고요. 프롬프트를 "새 메일 올 때만 알려주고, 중요하면 자기 종료해"로 바꾸니 완전히 달라졌습니다. 하드코딩이었으면 이 변경이 코드 수정이에요. 프롬프트니까 자연어 한 줄로 끝납니다.

/claude-api
프로젝트의 import문을 감지해서 해당 언어의 SDK 문서를 로드합니다. Python이면 Python SDK, TypeScript면 TS SDK. 프롬프트에 "anthropic, @anthropic-ai/sdk, claude_agent_sdk import를 감지하면 자동 활성화하라"고 적혀있어요. 슬래시 커맨드로 직접 실행할 수도 있고, 코드를 짜다 보면 알아서 켜지기도 합니다.

/debug
"세션 디버그 로그를 읽고 에러와 경고를 식별하라." 프롬프트에 로그 파일 위치, 분석 패턴, 진단 가이드라인이 담겨 있습니다. 설명을 추가하면 해당 이슈에 초점을 맞춰 분석합니다.

/keybindings-help
~/.claude/keybindings.json의 스키마, chord 바인딩 문법, 예약된 단축키 목록이 프롬프트에 포함되어 있습니다. 충돌 감지까지 해줍니다.

왜 이걸 코드가 아니라 프롬프트로 만들었을까요?

- LLM이 판단할 수 있으면 코드로 분기를 짤 이유가 없습니다. /simplify의 프롬프트는 "3개 에이전트를 띄워라"만 말합니다. 어떤 언어인지, 어떤 패턴이 나쁜지는 LLM이 알아서 판단해요. 프롬프트가 최고의 추상화입니다.
- 프롬프트는 텍스트만 고치면 다음 실행부터 반영됩니다. /loop의 파싱 규칙에 새 단위를 추가하고 싶으면 표에 한 줄 넣으면 끝이에요. 코드처럼 빌드-테스트-배포 사이클이 필요 없습니다.

Anthropic이 자기 제품의 핵심 기능을 프롬프트로 만들었다는 건, 프롬프트가 소프트웨어의 새로운 빌딩 블록이 되고 있다는 뜻입니다.
