---
topic: "국민연금 가입자 수 조회를 위한 Claude MCP 개발"
source_type: social
source_url: "https://www.linkedin.com/posts/gb-jeong_%ED%81%B4%EB%A1%9C%EB%93%9C-%EA%B7%B8-%ED%9A%8C%EC%82%AC-%EB%AA%87-%EB%AA%85%EC%9D%B4%EC%95%BC-%EA%B5%AD%EB%AF%BC%EC%97%B0%EA%B8%88-%EA%B0%80%EC%9E%85%EC%9E%90-%EC%88%98%EB%A5%BC-%EC%95%8C%EB%A0%A4%EC%A3%BC%EB%8A%94-mcp%EB%A5%BC-activity-7362303425432178688-F71g?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGQRO6EBVuLBNtunTd3oFxqQ7dKWdLdOoNs"
authorship: self
published_at: 2025-08-16
---
"클로드, 그 회사 몇 명이야?" 국민연금 가입자 수를 알려주는 MCP를 만들었습니다. 1시간이 안 걸려서 클로드코드로 만들었어요. 딱 한 줄이면 AI가 공공 API 를 직접 조회할 수 있습니다.

새로운 고객이 B2B 리드로 들어오면 적절한 서비스를 제공하기 위해서 회사의 규모를 파악하는데요. 혁신의 숲에서 조회하거나 구글에서 여기저기 사이트를 조회해보는데 꽤 번거로웠어요. 혁신의 숲도 이번에 임직원 조회 탭이 깊숙히 숨어버렸더라구요.

그래서 Claude Desktop / Claude code / Openai codex cli 에서 바로 붙여서 사용할 수 있는 mcp 서버를 직접 만들었습니다. 
특히 claude code 에는 딱 한 줄이면 연동돼요.

claude mcp add nps-business \
 --env API_KEY="cm+2VqVacqFCywI02FjjnrdNN2TeQS0FE+JRKoO2FuEXGGjHImnWNHBAHWlrtaadj3D+Y87e5bfn6th8q3Nzkw==" \
 -- uvx mcp-nps-business-enrollment

자세한 가이드는 댓글로 github link 붙여넣겠습니다.
