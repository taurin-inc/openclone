---
topic: "Claude Code의 새로운 세션 간 학습 기억 기능 'MEMORY'"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_claude-code%EC%97%90-%EC%B5%9C%EA%B7%BC-%EC%9E%91%EC%97%85-%EB%82%B4%EC%9A%A9%EC%9D%84-%EC%A0%80%EC%9E%A5%ED%95%98%EA%B3%A0-%EB%B6%88%EB%9F%AC%EC%98%A4%EB%8A%94-memory-activity-7433273480298782720-9uoL"
authorship: self
published_at: 2026-02-27
---
Claude Code에 최근 작업 내용을 저장하고 불러오는 MEMORY 기능이 생겼습니다. Claude Code가 이제 세션 간 학습 내용을 스스로 기억합니다. 단순한데 강력합니다. 왜 진즉 이렇게 안했을까 싶을 정도로요.

저장 경로는 ~/.claude/projects/<project>/memory/ 입니다. <project>는 git repo 루트에서 파생돼요. 같은 repo 안 서브디렉토리는 모두 하나의 메모리를 공유하고, git worktree만 별도 디렉토리를 씁니다. repo 단위로 컨텍스트를 묶는다는 설계 의도가 보입니다.

MEMORY.md가 인덱스 역할을 하고, 매 세션 시작 시 첫 200줄이 자동으로 로드됩니다. 200줄 제한이 있는 이유가 있어요. 강제로 간결하게 유지시키기 위해서입니다. 나머지 상세 내용은 debugging.md, patterns.md 같은 토픽 파일로 분리하게 설계됐고, 이 파일들은 startup 때 안 읽힙니다. Claude가 필요할 때 직접 꺼내 읽는 lazy load예요.

그리고 이 메모리는 제가 쓰는 게 아닙니다. CLAUDE.md는 내가 Claude에게 주는 지시인데, auto memory는 Claude가 스스로 작성합니다. 세션 중 배운 패턴, 디버깅 인사이트, 아키텍처 노트를 직접 파일에 기록해요. 실제로 제 MEMORY.md에는 Supabase 토큰, 비디오 자막 ffmpeg 패턴, Vercel 배포 방법, 멀티에이전트 팀 협업 패턴이 쌓여있습니다. 전부 Claude가 일하면서 스스로 기록한 것들입니다.

기억시키고 싶은 게 있으면 "pnpm 쓴다고 기억해줘"처럼 말하면 됩니다. /memory 커맨드로 직접 편집도 되고, CI 환경에서는 CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 환경변수로 끌 수 있어요.

Claude Code의 메모리는 파일 시스템 위에 있습니다. 숨겨진 게 없고, 직접 열어서 수정할 수 있습니다. 어떤 AI 도구든 결국 컨텍스트 싸움인데, 이걸 명시적으로 파일로 관리한다는 건 투명하고 통제 가능하다는 뜻입니다. 쓰는 패턴을 전체적으로 조정해줘야겠네요..
