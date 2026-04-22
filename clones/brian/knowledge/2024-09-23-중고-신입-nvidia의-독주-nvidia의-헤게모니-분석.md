---
topic: "중고 신입 NVIDIA의 독주: NVIDIA의 헤게모니 분석"
source_type: other
source_url: "https://www.kakao.vc/blog/the-story-behind-nvidia-success"
authorship: about_organization
published_at: 2024-09-23
---
# 중고 신입 NVIDIA의 독주
**[제로가 직접 말아주는 딥테크 이야기] 4. NVIDIA의 헤게모니**

**저자:** Kakao Ventures, 김영무 심사역
**날짜:** 2024년 9월 23일

---

벌써 날씨가 시원해지기 시작하는 가을이 다가오고 있습니다. 계절이 바뀌며 출근길 사람들의 옷차림도 조금씩 달라지고 있는데요. 눈 깜빡할 사이에 시간이 빠르게 지나가는 것 같습니다.

최근 짧은 기간 동안 정말 많은 변화가 있었던 기업이 한 곳 있었습니다. 바로 **NVIDIA** 입니다.

![지난 10년간 주가 상승 191배의 NVIDIA, 동기간 123배 상승한 비트코인을 상회](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FvfgOZwRTmIGCQ7VSbwki_wDBboo.png&w=1920&q=75)
*지난 10년간 주가 상승 191배의 NVIDIA, 동기간 123배 상승한 비트코인을 상회*

아주 짧은 시간 동안 (주식 시장에서) 비트코인을 상회하는 수직 곡선을 보여주기도 했던 NVIDIA.

최근에는 다시금 그 상승세가 꺾이며 폭락을 겪기도 했습니다. 그러다가 다시 그 주가 그래프가 요동치며, 사람들은 NVIDIA의 성장에 갑론을박을 펼치고 있습니다.

**NVIDIA에게 무슨 일이 있었기에 이런 급등과 급락이 벌어지는 것일까요?**

이번 화에서는 **NVIDIA가 지금까지 만들어낸 급등의 모멘텀이 어디서 시작되었는지** 알아보고자 합니다.

---

## 1. NVIDIA의 시작, "게임용 GPU"

NVIDIA라는 회사는 어릴 때부터 게임을 즐겨한 제게 매우 익숙한 기업입니다.

왜냐하면 **NVIDIA는 원래 게임에 필요한 GPU(Graphic Processing Unit)를 개발하던 곳**이었기 때문인데요.

![브런치 글 이미지 2](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FO2MKBJFZQjdgn1u3IH-I-iNlvIo.jpg&w=1920&q=75)

> **겨우 게임 하나 플레이하려고 컴퓨터를 새로 만들기까지 해야 하나요?**

아주 좋은 질문인데요!

게임 작동 방식을 이해하면 GPU라는 것이 왜 필요한지 알 수 있습니다.

GPU란 **Game** Processing Unit이 아니라, **Graphic** Processing Unit인데요. 이름에서 알 수 있듯 GPU는 본래 **그래픽 연산**을 위해 사용됩니다.

여기서 말하는 그래픽은 휘황찬란하고 멋진 CG 기술뿐만 아니라, 우리가 시각적으로 컴퓨터를 쓸 수 있게 해주는 GUI도 포함하는 개념입니다.

![그래픽 기술 기반으로 구현되는 이미지 기반의 UI](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FRSdFjBy8IQA8QQ0ZH_qm9BVvwVw.png&w=1920&q=75)
*그래픽 기술 기반으로 구현되는 이미지 기반의 UI*

**그래픽 기술이 없던 시절**에는 마우스나 터치를 통해 컴퓨터를 조작하지 못했죠.

아래 사진처럼 검은 화면에 녹색 명령어를 입력하며 오직 키보드만으로 컴퓨터를 조작해야 했습니다.

![오직 텍스트로만 표현되는 컴퓨터의 초기 UI](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FMjTMQyOkwWmi-5sgs4M7wSbhjQg.jpg&w=1920&q=75)
*오직 텍스트로만 표현되는 컴퓨터의 초기 UI*

시간이 흘러 **마우스와 그래픽 기술이 등장**하게 되면서 우리는 과거보다 훨씬 편하게 컴퓨터를 사용할 수 있게 됩니다.

물론 **그래픽 기술 초창기에는 GPU와 같은 거창하고 새로운 컴퓨터나 반도체 칩이 필요하진 않았습니다.** 간단히 화면 UI만 표현해 주면 되었기 때문이죠.

> **하지만 기술은 언제나 시장 논리를 따라갑니다.**

한편, 3D 그래픽 기술에 대한 시장의 강렬한 요구로 인해 새로운 컴퓨터가 필요해졌는데요. 바로 **게임 시장의 등장**이 그 배경입니다.

![더 성능 좋은 게임기를 가지고 오라 요구하는 게임 플레이어와 고통받는 컴퓨터 개발자들](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FnIvNf7meHU0AmsR49RvNgS7kIwM.jpg&w=1920&q=75)
*더 성능 좋은 게임기를 가지고 오라고 요구하는 게임 플레이어와 고통받는 컴퓨터 개발자들*

---

언제부터였을까요?

사람들은 본래 고도의 연산을 수행하기 위해 만들어진 **최첨단 컴퓨터**를 보면서 이런 생각을 합니다.

> **음... 저거로 게임도 만들 수 있겠는걸?**

1972년 아타리에서 오락용 게임으로 개발된 최초의 게임 **PONG**을 시작으로 **컴퓨터를 활용한 비디오 게임 시장은 점차 커져갔습니다.**

![최초의 비디오 게임, 아타리의 PONG](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FeFr1_VrEmg6WNyQXM3YFzgTC37A.jpg&w=1920&q=75)
*최초의 비디오 게임, 아타리의 PONG*

수많은 아타리 경쟁사들이 나타나면서 거대한 게임 시장이 형성되었고, 오락실용 게임기뿐만 아니라 가정용 콘솔, 가정용 컴퓨터 기반 게임까지 여러 제품군이 출시됩니다.

다만, 당시 컴퓨터 하드웨어(HW) 기술 수준은 높지 않았고, 게임 하나의 용량이 지금 핸드폰에 저장된 이미지 하나보다도 더 적었던 시절이었습니다.

당연히 게임에 사용되던 그래픽 기술은 **2D 그래픽을 기반으로 하는 오늘날 기준으로는 간단한 기술이었죠.**

시간이 흘러 게임 시장 침체기였던 아타리 쇼크*에 살아남은 **게임사들 간의 경쟁은 치열해졌고 소비자들의 눈은 높아져갔으며, 5세대 게임기들이 출시되기 시작**했습니다.

세가, 닌텐도, 소니 등 현시점에서도 게임 시장의 대가들로 유명한 그들의 게임 기술 연구는 고도화되었고, **1993년에 이르러 현대 FPS 게임의 아버지이자 3D 그래픽 기반으로 비주얼 쇼크를 보여줬던 전설작, 'DOOM(둠)'이 출시됩니다.**

> **\*아타리 쇼크(Atari Shock)**
>
> 품질 낮은 게임의 과잉 공급으로 인해 북미 비디오 게임 시장이 급격히 침체된 사건입니다. 이로 인해 많은 게임 회사들이 도산하거나 철수하게 되면서 비디오 게임 산업은 큰 타격을 입게 됩니다. 이후 닌텐도와 같은 새로운 기업들이 엄격한 품질 관리와 혁신적인 게임 콘텐츠를 선보이며 시장이 재건되었습니다.

![PONG과 달리 3D 시점으로 플레이가 가능했던 DOOM](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FAzzb100F10MD74XN3PCmBd9mciA.webp&w=1920&q=75)
*PONG과 달리 3D 시점으로 플레이가 가능했던 DOOM*

둠의 성공 이후 3D 그래픽 기반 게임 시장이 열리게 되었고, 다시 한번 혁신적인 3D 그래픽을 보여준 '퀘이크 2'가 출시되며 **3D 그래픽 게임은 본격적으로 흥행가도를 달리는 모습을 보며 사람들은 생각하게 됩니다.**

> **3D 그래픽 게임을 위한 그래픽 전용 칩이 필요하겠는걸?**

그 이유는 **3D 그래픽의 경우 기존 2D 그래픽 대비 요구되는 연산량이 아주 많기 때문**입니다.

![3D 그래픽 구현을 위해 필요한 행렬 연산](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2F3jd3TAmplRWf_DzExcvPzYKXrAY.png&w=1920&q=75)
*3D 그래픽 구현을 위해 필요한 행렬 연산*

3D 그래픽의 경우 수많은 행렬곱을 수행해야 합니다.

그런데 이 **행렬곱이라는 것은 아주 단순한 곱셈과 덧셈을 아주 많이 반복해야 하는 형태**인데요. 기존 컴퓨터에서 **연산을 주로 담당하는 CPU는 이 연산 수행을 아주 버거워했습니다**.

![아주 복잡하게 구성되어 있는 CPU 구조](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2Fa3Z6P_kcSn_3QttrMplQUwgjpp4.jpg&w=1920&q=75)
*아주 복잡하게 구성되어 있는 CPU 구조*

CPU란 **Central Processing Unit**으로, 컴퓨터 내에서 중심을 잡으며 다양하고 복잡한 어려운 연산을 만능으로 수행할 수 있도록 설계된 Chip입니다.

다만, CPU는 똑똑하지만 한 번에 하나의 일밖에 처리하지 못합니다. 마치 **아주 똑똑한 박사 한 명과 같은 녀석**이죠.

**3D 그래픽 연산은 단순한 곱셈과 연산으로 이루어져 있습니다. 단지 그 수가 엄청나게 많을 뿐**인데요. 이런 일에 한 번에 한 가지 일밖에 하지 못하는 똑똑한 박사 한 명을 할당한다면, 시간이 너무 오래 걸려 오히려 박사의 재능이 아까울 겁니다.

차라리 **곱셈과 연산만 할 줄 아는 초등학생 100명이 있으면 더 빠르게 일을 수행**할 수 있을 텐데요. 그런 원리로 만들어진 것이 바로 **GPU**입니다.

![CPU와 달리 단순한 구조가 반복되어 수없이 많이 들어가져 있는 GPU](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FenTPrfn8x5j0s9WrGuN3Fbc0wvU&w=1920&q=75)
*CPU와 달리 단순한 구조가 반복되어 수없이 많이 들어가져 있는 GPU*

GPU는 CPU와 달리 다양한 형태의 복잡한 연산을 수행하지 못하지만, **행렬 연산을 동시에 병렬적으로 진행할 수 있는 병렬 연산 기능**을 갖추고 있습니다.

그 결과, 3D 그래픽 연산에 필요한 방대한 양의 행렬 연산을 CPU 대비 획기적으로 빠르게 처리할 수 있게 되었죠.

![NVIDIA의 GeForce256](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FXu9I98PLvVzMGuAtDVBcS1J6x_w.jpg&w=1920&q=75)
*NVIDIA의 GeForce256*

**최초로 개발된 GPU는 게이머라면 누구나 들어봤을 GeForce 시리즈의 첫 번째 제품인 GeForce 256입니다.** 그리고 이 칩을 개발한 곳은 **바로 NVIDIA**입니다.

---

## 2. NVIDIA의 핵심 기술, 그리고 코인 채굴 "병렬연산 가속기"

1999년, NVIDIA는 GeForce 256을 개발하는 동안 3D 그래픽 기술의 **핵심 과제 중 하나였던 T&L 기술*을 하드웨어적으로 구현하는 데 성공**했습니다.

당시 절대 강자였던 3Dfx 사의 Voodoo 대비 GeForce는 압도적인 퍼포먼스를 보여주며 큰 인기를 끌게 되었는데요. 이후 성능에서나 가격에서나 경쟁에 밀린 3Dfx사는 결국 파산하게 되었습니다.

**NVIDIA는 3Dfx의 기술 자산을 인수하며, 21세기에 접어들면서 GPU 절대 강자의 자리를 차지하게 되는데요.** **그렇게 NVIDIA의 시대가 시작됩니다.**

> **\*T&L 기술(Transformation and Lighting)**
>
> 3D 그래픽 처리에서 중요한 역할을 하는 기술로, 3D 객체의 변환(Transformation)과 조명(Lighting) 계산을 GPU가 전담하여 수행하는 것을 의미합니다. 이 기술의 도입으로 CPU의 부담을 줄이고, 보다 복잡한 3D 그래픽을 빠르게 처리할 수 있게 되었습니다.

![브런치 글 이미지 12](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FwCi6z3oz_a-b5PduZf8PXpYJoVs&w=1920&q=75)

그러다 2010년대에 들어서면서 NVIDIA에게 시장으로부터 새로운 니즈가 발생하게 됩니다. 바로 **암호화폐 채굴**이죠.

> **암호화폐와 그래픽이 무슨 관련이 있어요?**

사실 얼핏 들었을 때는 **암호화폐 채굴과 그래픽 기술이 무슨 관련이 있을까** 의아할 수 있습니다. 다만 이 둘의 공통점은 **단순 연산의 대량 수행**에 있습니다.

암호화폐 채굴을 위해서는 컴퓨터를 활용해 **작업 증명(PoW)**을 수행해야 합니다. 이 작업 증명 과정은 그래픽 연산처럼 단순 연산이 대량으로 필요한 형태입니다.

그렇기 때문에 **GPU를 활용한다면 작업 증명을 병렬적으로 수행해 빠르게 채굴할 수 있고, 그러면 더 많은 암호화폐를 채굴할 수 있으니 암호 화폐 채굴자들에게 GPU는 큰 인기를 끌게 됩니다.**

![암호 화폐 채굴 공장, 대량의 GPU들을 연결해서 작업 증명을 수행하고 있음](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FF3VmVt0jNiFgFpRIle9NB_mZaFw.JPG&w=1920&q=75)
*암호 화폐 채굴 공장, 대량의 GPU들을 연결해서 작업 증명을 수행하고 있다.*

NVIDIA는 게임용 GPU 시장에서 단순한 연산의 대량 반복을 아주 빠르게 수행하는 **병렬 연산 가속기 기술**을 가졌습니다.

그렇기에 **이 핵심 기술을 잘 응용만 할 수 있다면, 더 이상 게임 시장뿐만 아니라 비슷한 작업을 수행해야 하는 다른 시장으로의 확장 역시 가능하다**는 사례를 보여준 것이죠.

**원천 기술 확보가 중요한 이유 중 하나입니다.**

그렇다면 NVIDIA는 게임용 GPU 시장처럼 코인 채굴 시장도 제패했을까요?

정답은 이미 아시겠지만 **NVIDIA는 코인 채굴 시장에 큰 관심을 두지는 않았습니다.** 왜냐하면 **양날의 검**이었기 때문이죠.

**NVIDIA는 코인 채굴 시장의 수요를 감당할 만큼의 공급량을 준비해두지 않았습니다.** 그렇기에 **그래픽카드 채굴 대란 사태**까지 발생하게 된 것인데요.

NVIDIA가 제공하는 정가 대비 2배 이상의 가격에 GPU가 거래되기 시작하면서 시장은 혼잡해지기 시작합니다.

![채굴이 절정에 달하던 2017~2018년, GPU는 시장가(MSRP) 대비 2배 이상의 가격으로 거래되었음](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2F-SvH17-la_gvDcHREAYH8bYDRFs.png&w=1920&q=75)
*채굴이 절정에 달하던 2017~2018년, GPU는 시장가(MSRP) 대비 2배 이상의 가격으로 거래되었다.*

그렇게 **NVIDIA가 본래 타깃하는 게임 시장의 고객들이 GPU를 사지 못하는 현상이 발생하면서, NVIDIA에게는 오히려 위기로 다가오게 됩니다**.

이로 인해 강제로 채굴을 금지하는 기능을 추가하고, 채굴을 위한 전용칩인 CMP를 따로 제작해 판매하는 등 과열된 시장을 잠재우기 위해 노력했습니다.

> **수요가 많은데 그냥 팔면 되는 거 아니에요?**

반도체 시장은 현물을 생산해서 판매하는 시장이기 때문에, 대량 주문을 통해 가격을 맞추는 것이 중요한 요인 중 하나입니다.

**갑작스럽게 늘어난 수요를 즉각적으로 생산 라인에서 대비하기도 어렵고, 수요에 맞춰 공급을 늘렸다가는 오히려 나중에 수요가 급감한다면 악성재고가 되어버리거나 늘린 생산 라인의 CAPEX가 고스란히 부채가 될 수도 있습니다.**

암호 화폐 채굴은 무한정 지속되는 시장이 아닌 언젠가 고갈되는 시장이었기 때문에 공급을 무작정 늘리는 것은 어려운 결정이었을 것입니다.

특히, 단기적인 시장 과열로 인해 기존 고객을 놓치는 것은 훨씬 더 큰 리스크를 감수해야 하는 결정이었겠죠.

![2019년 4분기 급감한 그래픽카드 매출](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FhuNrLgqIX4AcQaMERXJx3fONmno.jpg&w=1920&q=75)
*2019년 4분기 급감한 그래픽카드 매출*

실제로 **채굴 대란 이후 시장에 풀린 GPU들은 과잉 재고로 남게 되어 중고로 거래되었고, 회계연도 기준 2019년 4분기부터 본격적인 팬데믹 시작 전까지 그래픽 카드 부문 매출은 급감 후 정체**됩니다.

---

## 3. NVIDIA의 생태계 레버리지로 꽃피운 헤게모니 "데이터센터용 AI Chip"

> **그렇다면 NVIDIA는 병렬 연산 가속기라는 원천 기술을 가지고 무엇을 대비하고 있었을까요?**

NVIDIA는 암호화폐 채굴 시장이 아닌 어떤 시장에 더 큰 관심을 가지고 있었을까요?

모두 정답을 알고 계실 겁니다. 바로 **AI를 위한 데이터센터(AIDC)용 GPU**입니다.

![폭발적으로 성장한 NVIDIA의 매출과 주가를 견인하는 것은 AIDC용 GPU](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FK1iJb46jJKbYH6w5sWQJSOBdAKo.png&w=1920&q=75)
*폭발적으로 성장한 NVIDIA의 매출과 주가를 견인하는 것은 AIDC용 GPU*

NVIDIA의 새로운 매출원은 정말 놀랍습니다.

아무리 NVIDIA가 직접 공장을 운영하지 않는 팹리스 기업이라고 해도 영업이익률이 46%에 육박하기 때문입니다.

![브런치 글 이미지 17](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2F4crOJHuFx6Pk0KrKtwuzF415GT4.png&w=1920&q=75)

이러한 영업이익률은 순전히 데이터센터 부문 매출의 증가에서 고스란히 발생하게 된 것입니다. 정말 NVIDIA 입장에서는 황금알을 낳는 거위 수준이죠.

여기서 궁금한 것은 **'NVIDIA는 어떻게 이렇게 빠르게 AI 시장에 대응해서 절대 강자의 자리에 다시 한번 올랐을까'**입니다. 게이밍 시장에서 벌어들인 막대한 돈을 단기간에 쏟아부으며 성공한 걸까요?

22년 ChatGPT가 시장에 나오게 된 이후 NVIDIA의 분기별 R&D 지출 추이입니다.

![브런치 글 이미지 18](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2F_qs2T4bm15L1MMBp3UO_ufmoa2c.png&w=1920&q=75)

**매년 10조 원에 달하는 엄청난 비용을 R&D에 사용하지만, 점진적인 증가 추이를 보이고 있고 단기간에 갑작스럽게 증가한 추이는 보이고 있지 않습니다.**

이러한 추이는 지난 10년 간의 데이터로 확장해도 마찬가지입니다. R&D 지출이 많이 늘어난 현 시점의 2024년 데이터로 계산해도, Meta, Google과 같은 타 빅테크 기업의 R&D 비용과 비교하면 4~5배가량 낮은 수준입니다.

**NVIDIA는 무슨 마법을 부렸을까요?**

> **왕도란 없다.**

정답은 간단합니다.

**NVIDIA는 지금으로부터 10년보다도 이전에 AI 시대에 대비하고 있었습니다.**

**그리고 NVIDIA는 이러한 플레이를 처음 하는 게 아니라는 겁니다.**

게임용 GPU 시장에서 병렬연산 가속 기술을 확보한 덕분에 NVIDIA가 경쟁에서 승리했다고 말씀드렸습니다.

하지만 조금 더 깊게 파고들어 보면, **NVIDIA는 가속 기술만 만들지 않았습니다**.

![NVIDIA의 발전사 속에서 찾아보는 그들의 성공 전략](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2Fk1Aqf0omWTiCagcIEwKmduLGsfo.png&w=1920&q=75)
*NVIDIA의 발전사 속에서 찾아보는 그들의 성공 전략*

---

### 1. SLI 메모리 통신 기술

3D 그래픽을 도입한 게임의 경우 기존의 게임보다 더 큰 용량을 지니게 되었습니다. 따라서 **연산해야 하는 메모리의 양 역시 방대**해졌는데요. GPU 칩 자체의 연산 능력뿐만 아니라, **이 방대해진 메모리를 빠르게 주고받을 수 있는 네트워크 기술도 필요해졌습니다.**

여기서 등장한 기술이 SLI(Scalable Link Interface)입니다. SLI는 본래 NVIDIA가 아닌 3Dfx라는 회사가 개발한 기술이었지만, 3Dfx가 파산하면서 NVIDIA가 이 기술을 인수하게 되었는데요. 그 결과, NVIDIA가 **고용량 메모리를 병렬 처리할 수 있는 네트워크 인터페이스 기술**을 확보하게 됩니다.

### 2. 개발자용 SW 개발 환경

또 하나 **NVIDIA가 만든 것은 게임 개발자들을 위한 개발 환경**입니다.

NVIDIA가 만든 GeForce칩에서도 게임이 원활하게 돌아가기 위해서는 해당 칩을 고려한 게임 개발이 필요했습니다. 그래서 **NVIDIA는 게임 개발자들이 게임을 더 쉽고 편하게 만들 수 있도록 개발 환경을 구축하고 무료로 배포했습니다**.

덕분에 개발자들은 NVIDIA 칩을 더 잘 활용할 수 있게 되었고, NVIDIA의 개발 환경 속에서 경험을 쌓은 주니어 개발자들은 NVIDIA의 칩에 락인되었죠. 이렇게 NVIDIA는 단순한 칩 제조사를 넘어 **개발자 기반의 기술 생태계를 자체적으로 구축**했습니다.

---

> **어디서 많이 본 것 같은데요?**

그렇게 느끼셨다면, 맞습니다. 지금 NVIDIA가 AI, 특히 AIDC 운영이 필요한 LLM 시장에서 펼치고 있는 전략과 같습니다.

### 1. NVLink 메모리 통신 기술

AI의 성능을 높이기 위한 연구는 점점 더 큰 모델을 만드는 방향으로 나아가며 **LLM의 시대**가 시작되었습니다. 결국 기존보다 **훨씬 큰 메모리 용량을 다뤄야 하게 되는 시대**가 오게 된 건데요. GPU 칩의 AI 가속 능력뿐만 아니라 **이 방대해진 메모리를 빠르게 주고받을 수 있는 네트워크 기술의 중요성이 다시금 대두**된 것입니다.

**NVLink는 본래 NVIDIA가 게임 시장에서 확보한 SLI의 연장선에 있는 기술**입니다. 본래 대용량 게임을 위해 다수의 GPU 칩 간 통신을 지원하기 위한 기술이었지만, 수년 뒤 LLM을 위한 통신 기술로도 사용되게 된 것이지요. NVIDIA의 NVLink는 지금도 가장 높은 스펙을 보여주는 통신 기술로서 그 자리를 굳건히 유지하고 있습니다.

**과거 게임 시장에서 존재했던 기술적 허들인 대용량 메모리 처리 솔루션이 현 AI 시장에서도 똑같이 허들로 나타났고, NVIDIA는 본래 보유했던 원천 기술을 통해 그 문제를 잘 해결했다고 볼 수 있을 것 같습니다.**

### 2. ML 엔지니어용 AI 개발 환경(CUDA)

또 하나 **NVIDIA가 만든 것은 ML 엔지니어들을 위한 개발 환경**입니다.

NVIDIA가 만든 DGX1 같은 데이터서버용 GPU에서 AI가 원활하게 돌아가기 위해서는, **하드웨어 구조를 고려하고 수많은 Library를 활용한 ML 엔지니어링 작업**이 필요했는데요. 그래서 **NVIDIA는 ML 엔지니어들이 AI를 더 쉽고 편리하게 연구할 수 있도록 'CUDA'라는 것을 만들어 무료로 배포했습니다**.

그 결과, ML 엔지니어들은 NVIDIA의 딥러닝 시스템을 더 잘 활용할 수 있게 되었고, CUDA 개발 환경 속에서 경험을 쌓은 주니어 개발자들은 NVIDIA의 생태계에 락인되었습니다. 결과적으로, NVIDIA는 ML 엔지니어를 위한 **자체 AI 개발 생태계**를 구축하게 된 것입니다.

게임 시장에서 이미 한번 했었고, 이미 승리했던 것처럼 말이죠. 이렇듯 **NVIDIA는 이미 생태계를 구축해서 헤게모니를 형성하는 분야에 잔뼈가 굵은 중고신입**인 것입니다.

---

![AlexNet의 시작과 함께한 NVIDIA](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2Fv1NAYuUu41O6ukx8eMDEW5vav58.png&w=1920&q=75)
*AlexNet의 시작과 함께한 NVIDIA*

AI 성능에 대해 시장에 큰 충격을 주었던 2016년 알파고와 이세돌의 대국 그 이전부터 NVIDIA는 이미 AI에 관심이 많았습니다. 현대 AI의 신호탄이 되어준 2012년 **AlexNet** 모델 연구에 GPU가 사용되었는데, 이 연구에 GPU를 스폰해 준 기업이 바로 NVIDIA입니다. 생태계를 만드는 데 가장 큰 역할을 해준 **CUDA도 NVIDIA가 2007년에 출시**한 SW였습니다.

**즉, NVIDIA는 이미 10년도 더 된 옛날부터 꾸준히 문제를 풀어온 것입니다.** 당일치기로 공부한 학생이 절대로 꾸준히 공부해 온 학생을 이길 수는 없겠죠.

이렇게 꾸준히 장기간 준비해 오던 상황 속에서 만들어지기 시작한 강한 흐름에 올라타는 것은 너무나도 쉬운 일이었을 겁니다. 그리고 그 누구도 단기간에 넘볼 수 없는 자리였을 것이고요.

> **장기적으로 한 가지 믿음을 가지고 꾸준히 무언가를 해온 기업과 그들이 만든 생태계의 중요성을 아주 잘 보여주는 사례라고 생각합니다.**

**그렇게 우리는 NVIDIA의 시대에 살게 되었습니다.**

**하지만, Pax NVIDIAna는 길게 가지 않을 것입니다.**

NVIDIA을 향한 비관론. 수많은 NVIDIA 생태계를 향한 견제와 도전. 그리고 숫자로 보이기 시작하는 흔들리는 조짐이 이어지고 있습니다.

결국 NVIDIA의 멈추지 않을 것 같던 상향 그래프는 꺾이기 시작했습니다. 도대체 무슨 일이 벌어진 걸까요?

다음 시리즈에서 공유 드리고 싶은 주제는 'NVIDIA의 한계와 앞으로의 기회'에 대한 내용입니다. 감사합니다.

![카카오벤처스 김영무(Zero) 심사역](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FELdlNYgcJ021c1itCexwKIwCljc.png&w=1920&q=75)
*카카오벤처스 김영무(Zero) 심사역*
