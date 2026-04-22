---
topic: "샘 알트만은 왜 Sora에 귀중한 GPU를 쓸까? OpenAI의 AGI 전략 분석"
source_type: social
source_url: "https://www.linkedin.com/posts/leekh929_sam-altman-on-sora-energy-and-building-activity-7381954495167197184-2goe?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGMNrtwBpXfYKm2n2FZHqWv7GeTF_SMtUQY"
authorship: self
published_at: 2025-10-09
---
샘 알트만은 왜 귀중한 GPU를 밈 생성기(Sora)에 쓸까요?

사람들의 반응이 갈렸습니다. 한쪽에서는 신기한 비디오를 만들며 열광하지만, 다른 한쪽에서는 의문을 제기합니다. “친구들과 재미있는 밈이나 만드는 도구가 AGI 개발과 무슨 관련이 있지?” “귀중한 GPU를 왜 이런 데 쓰는 거지?”

실제로 X에서는 이런 비판이 적지 않았습니다. 하지만 샘 알트만의 최근 인터뷰를 보면, Sora는 겉보기와 달리 OpenAI의 AGI 전략에서 핵심적인 역할을 하고 있을 가능성이 있어 보입니다.

1. World Model: AGI는 세상을 이해해야 한다

샘 알트만은 인터뷰에서 이렇게 말합니다.

“Sora does not look like it’s AGI relevant, but I would bet that if we can build really great world models, that’ll be much more important to AGI than people think.”

언어 모델의 근본적 한계가 있습니다. “공이 떨어진다” 다음에 “바닥에 닿는다”는 문장이 자주 나온다는 걸 압니다. 하지만 왜 떨어지는지, 어떻게 움직이는지는 이해하지 못합니다. 물리 법칙, 인과관계, 3D 공간 개념이 없습니다.

비디오 모델은 다릅니다. Sora가 일관된 영상을 생성하려면 중력, 관성, 충돌 같은 물리 법칙을 학습해야 합니다. 시간적 연속성, 즉 프레임 간 자연스러운 전환도 필요합니다. 카메라 각도가 바뀌어도 같은 장면이 유지되는 공간적 일관성, 재질과 빛과 그림자의 상호작용까지. 세상이 어떻게 작동하는지 내재화되어 있습니다.

GPT는 인간 지식의 언어적 압축이었고, o1은 논리적 추론 능력을 더했습니다. Sora는 물리적 세계 이해를 담당합니다. 이 셋이 통합되면 생각하고 행동하는 AGI가 됩니다. 더 나아가서는 로봇 foundation model의 기반이 될수 있습니다.

2. 실시간 렌더링 인터페이스: AI와 대화하는 새로운 방식

샘은 미래의 인터페이스에 대해 이렇게 말합니다.

“You can imagine a world where the interface is just constantly real-time rendered video.”

현재 텍스트 인터페이스의 한계는 분명합니다. 복잡한 개념을 설명하려면 긴 프롬프트를 작성해야 하고, AI의 답변도 텍스트로만 나옵니다.

실시간 비디오 렌더링은 이를 근본적으로 바꿉니다. “새 주방 디자인 보여줘”라고 말하면 AI가 실시간으로 3D 주방을 렌더링하고, “창문을 더 크게”라고 하면 즉시 변경된 영상을 보여주고, “오후 햇빛이 들어오는 모습은?“이라고 물으면 시간대별 조명 시뮬레이션을 보여줍니다.

정보 전달량이 폭발적으로 증가합니다. 텍스트는 초당 수십 단어 정도지만, 비디오는 초당 수백만 픽셀입니다. 인간이 원래 소통하는 방식입니다. 우리는 말하고, 가리키고, 보면서 대화합니다. Sora는 이 자연스러운 소통을 AI와 가능하게 만드는 첫걸음입니다.

iPhone이 터치 인터페이스를 혁신했듯, AI 시대에는 새로운 인터페이스가 등장합니다.

3. 수직적으로 모두 통합하는 플라이휠

샘의 인터뷰 중 매우 흥미로운 의견이 있었습니다.

“I was always against vertical integration, and I now think I was just wrong about that.” 

특히 iPhone을 언급하며 이렇게 말합니다.

“The iPhone is the most incredible product tech industry has ever produced, and it is extraordinarily vertically integrated.”

이 이야기만 보면 OpenAI는 모델 레이어에만 머무를 것 같지 않습니다. 버티컬로 가능한 모든 것을 확장 할 수 있습니다.

Sora는 수직 통합의 선순환을 만듭니다. Sora 제품이 수백만 사용자를 확보하면, 어떤 영상을 만들고 싶어하는지, 어떤 편집을 하는지에 대한 독점 데이터가 쌓입니다. 이 데이터로 World Model이 개선되고, 인간 의도를 반영한 물리 시뮬레이션이 정교해집니다. 그러면 Stargate 데이터센터나 자체 칩 개발 같은 막대한 인프라 투자를 정당화할 수 있고, 이것이 다시 더 강력한 Sora로 이어집니다.

왜 수직 통합이 중요할까요?

첫째, 피드백 속도입니다. 사용자 행동에서 모델 개선까지의 사이클이 일 단위, 주 단위로 돌아야 하는데 API 고객에게 의존하면 너무 느립니다.

둘째, 데이터 주권입니다. 어떤 비디오를 만들려 했는지는 가장 귀중한 학습 신호인데, 이를 외부와 공유하면 경쟁력을 잃습니다.

셋째, 경제성입니다. Inference 비용이 매우 높아서 자체 인프라 없이는 수익성이 나오지 않습니다.

4. 그래서 “밈 생성”이 왜 중요한가?

표면적으로는 친구들과 재미있는 영상을 만드는 것처럼 보입니다.

하지만 이는 World Model 학습의 실전 데이터입니다. 수억 개의 영상 생성 요청, 물리적으로 말이 되는 장면과 안 되는 장면, 인간의 시각적 직관에 대한 대규모 피드백이 모입니다. 동시에 인터페이스 실험의 장이기도 합니다. 사람들이 어떻게 비디오로 표현하고 싶어하는지, 어떤 편집 방식이 자연스러운지를 배우면서 실시간 렌더링으로 가는 중간 단계를 밟고 있습니다.

무엇보다 이것이 플라이휠의 시작점입니다. 사용자 확보 없이는 데이터가 없고, 데이터 없이는 개선이 없습니다. “재미있는 기능”이 실은 전략의 핵심인 셈입니다.

ChatGPT도 처음엔 “신기한 챗봇”으로 보였습니다. 하지만 그것이 언어 모델을 개선하고 사회를 준비시키는 데 얼마나 중요했는지 지금은 압니다. Sora도 마찬가지일 수 있습니다.

https://lnkd.in/gZ2fqhYp
