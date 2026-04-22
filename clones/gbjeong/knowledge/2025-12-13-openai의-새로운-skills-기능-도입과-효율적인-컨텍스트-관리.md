---
topic: "OpenAI의 새로운 'Skills' 기능 도입과 효율적인 컨텍스트 관리"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_openai-%EB%8F%84-%EC%8A%A4%ED%82%AC%EC%9D%84-%EB%8F%84%EC%9E%85%ED%95%A9%EB%8B%88%EB%8B%A4-%EC%9D%B4%EB%AF%B8-chatgpt%EC%97%90-%EB%AC%B8%EC%84%9C-%EC%B2%98%EB%A6%AC-skills%EA%B0%80-activity-7405716903291285504-q0et?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQPmXcB7og_o6GjhLe7A7V6QGKhdQ09Ae8"
authorship: self
published_at: 2025-12-13
---
OpenAI 도 스킬을 도입합니다... 이미 ChatGPT에 문서 처리 skills가 들어가있어요. ChatGPT에서 스킬 폴더를 얻어서 github에 올렸습니다. 찾아보니 Codex CLI에도 2주 전에 skills 를 사용하는 기능이 추가됐더라구요. 

Skills는 MCP 처럼 거창한 프로토콜이 아닙니다. 사실 AI 잘 쓰는 사람들은 대부분 이렇게 쓰고 있었을거에요. 프롬프트 잘 깎아서 마크다운 파일로 관리하고, reproduce 하도록 스크립트도 같이 운용하는거죠.

대신 Skills 가 대단한 점은, Skill.md 에 있는 토큰을 필요할 때에만 로드하게 설계한 것입니다. 컨텍스트를 중요하게 생각하는 원칙입니다. 덕분에 수많은 스킬을 한 번에 로드할 수 있게 됐어요. MCP를 몇 개만 연결해도 컨텍스트가 가득 차버리는 것과는 다른 접근 방식입니다.

처음으로 추가한 skills 의 종류도 docs, pdfs, spreadsheets 3가지 인 점도 재미있습니다. 문서 처리하는 스킬이고 Claude 의 Skills 도 이런 스킬이 제일 먼저 추가됐죠. 아마 사용자들이 이런 문서 처리를 많이 요청하는데, AI가 한 번에 해결하기 어려워서 그런 것 같아요.

유명한 블로거 simon willison 가 이미 샤라웃했고요. 저도 똑같은 방식으로 ChatGPT에 물어봐서 내장된 스킬을 얻을 수 있었습니다. 그 자리에서 직접 파일을 생성해서 zip 파일을 준 게 아닙니다. 파일이 꽤 많은데, 응답이 엄청 빨랐거든요. 한 번 살펴보시고 codex를 주로 사용하시는 분들은 skills 를 직접 사용해보시는 것도 추천드립니다!
