---
topic: "원영적 사고로 극복하는 Memory Wall: HBM과 3D 적층 기술"
source_type: other
source_url: "https://www.kakao.vc/blog/memory-wall-hbm-3d-lamination"
authorship: about_organization
published_at: 2024-07-18
---
# 원영적 사고로 극복하는 Memory Wall
**[제로가 직접 말아주는 딥테크 이야기] 3. HBM과 3D 적층**

**Author:** Kakao Ventures, 김영무 심사역  
**Date:** Jul 18, 2024

---

> **"하..."**

요즘 출근길 지하철에서 여기저기서 탄식이 들립니다.

다들 핸드폰을 붙잡고 한숨을 푹푹 쉬고 있는데요. 슬쩍~ 눈동자를 굴려서 무슨 일인가 보면 다들 주식 창을 보고 계시더라고요.

그런데 사실, 주식 자체가 떨어져서 내쉬는 한숨보다는 **NVIDIA** 라는 빠르게 성장하는 거대한 흐름을 놓쳐서 내쉬는 한숨인 것 같습니다.

NVIDIA는 **데이터센터향 AI 반도체** 를 주력으로 만들며 짧은 시간 동안 가파르게 성장하고 있는 기업입니다.

![NVIDIA 24년 2분기 Revenue Breakdown](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FCY0SmLDsWQZkOhrlxS_oSiIFebI.PNG&w=1920&q=75)
*NVIDIA 24년 2분기 Revenue Breakdown*

NVIDIA는 게임용 GPU 역시 판매하고 있지만, 대부분의 매출이 데이터센터향 AI 반도체에서 나오고 있는데요. **LLM의 열풍에 힘입어 엄청난 모멘텀을 가지고 끝이 어디일지 모르게 달려가고 있습니다.** 최근에는 무려 **전 세계 시가총액 1위** 를 기록하기도 했죠.

반면 데이터센터향 AI 반도체 시장 뒤 저 너머에서는 **NVIDIA의 수주를 받기 위한 치열한 전쟁** 이 벌어지고 있습니다. 바로 SK 하이닉스, 삼성전자, 마이크론을 주축으로 치열하게 경쟁 중인 **HBM(메모리 반도체)**입니다.

![HBM 산업 속 치열한 전쟁 (출처 : 한국경제)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FR2IUEATzE2iJ3ZeNF-m4TRLpqFE.jpg&w=1920&q=75)
*HBM 산업 속 치열한 전쟁 (출처 : 한국경제)*

HBM 역시 **시장의 변혁에 따라 새롭게 나온 차세대 반도체** 중 하나인데요. 이번 글에서는 **어쩌다가 HBM이 이렇게 주목받게 되었는지** 돌이켜보려 합니다.

---

## 1. 메모리 반도체의 느린 성장, 'Memory Wall'

HBM이 주목을 받게 된 경위를 파악하기 위해서는 **Memory Wall** 이라는 개념에 대해 알아야 합니다.

**Memory Wall이란?**

![비메모리와 메모리의 분리 구조인 폰 노이만 구조](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FeehlVZEO5xg23u26T8_F9vV2toY&w=1920&q=75)
*비메모리와 메모리의 분리 구조인 폰 노이만 구조*

반도체는 크게 2가지 종류가 있습니다. **비메모리 반도체** 와 **메모리 반도체** 인데요.

간단하게 비메모리 반도체는 연산을 담당하고, 메모리 반도체는 저장을 담당하고 있다고 생각하면 될 것 같습니다. 연산을 담당하는 비메모리 반도체를 대변하는 것이 CPU이고요. 이렇게 저장과 연산이 분리된 컴퓨터 구조를 **폰 노이만 구조** 라고 합니다.

![메모리와 CPU 간 발전 속도의 차이 (출처 : SK하이닉스)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FoLS733ltwa4Zs5DoYSiCPXDq58Q.png&w=1920&q=75)
*메모리와 CPU 간 발전 속도의 차이 (출처 : SK하이닉스)*

문제는 **메모리 반도체와 CPU 간의 발전 속도에는 큰 차이가 있다** 는 것입니다.

컴퓨터의 연산 처리 속도는 날이 갈수록 빨라져 가는데, 메모리 처리 속도의 개선은 지지부진한 것이죠. 위의 차트에서 볼 수 있듯이 일반적으로 많이 사용하는 **D램(DRAM)** 의 발전 속도는 CPU의 발전 속도 대비 1990년대부터 아주 큰 격차가 벌어지기 시작했습니다.

그 이유는 메모리 반도체와 비메모리 반도체의 **소자 구조의 차이**를 보면 알 수 있습니다.

![메모리 중 DRAM 구조(좌)와 비메모리 중 NAND Gate 구조(우)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2F0MENmsIreAd7D4oJeApLtZuQ0DE.png&w=1920&q=75)
*메모리 중 DRAM 구조(좌)와 비메모리 중 NAND Gate 구조(우)*

위의 회로도에서 왼쪽에 있는 것이 메모리 반도체를 담당하는 DRAM, 오른쪽에 있는 것이 비메모리 반도체 내 **NAND Gate** 의 구조입니다.

맞습니다. 언뜻 보았을 때는 오른쪽에 있는 비메모리 NAND Gate가 더 복잡해 보이는데, **왜 메모리 반도체의 발전 속도가 더 느린지** 의문이실 것 같네요.

하지만, 주의 깊게 봐야 하는 것은 메모리 DRAM 구조 속에 존재하는 **Capacitor**입니다. 왼쪽 메모리 반도체의 구조는 한 개의 Transistor(트랜지스터)와 한 개의 Capacitor의 구조를 가지고 있습니다. 반면, 오른쪽 비메모리 반도체의 구조는 4개의 트랜지스터로 이루어져 있죠.

**그렇다면 Capacitor의 집적도는 어떨까요?**

**아쉽게도 Capacitor는 그 소자의 특성상 Transistor만큼이나 작게 만들기 힘든 것이 현실** 입니다.

그렇기 때문에 DRAM 속 Transistor의 집적도를 아무리 높여도 Capacitor의 존재 때문에 성능 향상에 한계가 있는 건데요. 이러한 문제점 등으로 인해 CPU에 사용되는 공정 수준은 3nm에도 도전하고 있지만, 메모리는 여전히 10nm 이상의 Conventional한 공정에 의지하고 있습니다.

결과적으로, 메모리 반도체와 비메모리 반도체로 구성된 **컴퓨터의 발전 속도가 메모리 반도체의 비교적 느린 발전 속도로 인해 성장에 병목이 생긴 현상** 을 **Memory Wall(메모리 병목 현상)**이라고 합니다.

---

## 2. LLM으로 인해 강력하게 요구되는 Memory Wall의 극복 노력과 한계

![가파른 성장 속도의 처리 가능 연산량(FLOPS) 대비 완만한 성장 속도의 처리 가능 메모리양(BW) (출처 : UC Berkeley)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FseLDikR90H1SCOxJyyFeBdjbd6g&w=1920&q=75)
*가파른 성장 속도의 처리 가능 연산량(FLOPS) 대비 완만한 성장 속도의 처리 가능 메모리양(BW) (출처 : UC Berkeley)*

지금까지는 이 Memory Wall 자체가 엄청난 이슈는 아니었습니다. 하지만 **LLM의 등장 이후** 이 Memory Wall은 **지금 바로 뛰어넘어야 하는 현 시점의 문제** 가 되었습니다.

HBM 이전에 메모리 반도체, 특히 DRAM이 발전된 방식은 **LPDDR** 제품 중심의 성능 향상이었습니다. LPDDR은 'Low Power Double Data Rate'의 줄임말로, 간단히 말해 **저전력으로 2배의 데이터를 주고받는다** 는 뜻입니다.

**저전력과 2배의 데이터가 무슨 관련이 있나요?**

컴퓨터에는 **Clock**이라는 개념이 있습니다. 컴퓨터 내에는 수없이 많은 트랜지스터를 비롯한 소자들이 있기 때문에, **복잡한 구조 속에서도 문제없이 소자 간에 정보를 주고받는 것이 중요** 합니다.

![Clock Cycle에 따른 Double Data Rate의 원리](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FhNncTIoAbjBUd7jVXV6-3CNmj4Q.png&w=1920&q=75)
*Clock Cycle에 따른 Double Data Rate의 원리*

컴퓨터도 **정해진 타이밍에 맞춰서 데이터를 전달하고 계산을 수행** 하는 형태로 작동되며, **이 타이밍을 초침처럼 재주는 것** 이 바로 **Clock** 입니다.

여기서 Clock이 꺼졌다 켜지기를 반복하는데, Clock cycle 속에서 **켜질 때만 공(데이터)을 넘기는 것을 SDR(Single Data Rate)**, **켜질 때와 꺼질 때 둘 다 공을 넘기는 것을 DDR(Double Data Rate)** 이라고 합니다.

문제는, 공을 2배로 넘기면 당연히 에너지가 많이 소모될 것입니다. 그렇기 때문에 **저전력의 DDR**이 필요합니다. LPDDR의 성능 향상은 **저전력으로 초당 주고받는 데이터의 횟수를 높이는 방식** 으로 이루어져 왔습니다.

그런데 여기에도 한계가 있습니다. 아무리 저전력으로 정해진 타이밍에 공을 던진다 해도, **횟수가 많아지고 속도가 빨라지면 실수로 놓치는 공도 많아지고 팔도 다시 아파질 것** 입니다. 심지어 **미세공정으로 집적도가 높아지면서 공을 주고받는 통로는 점점 좁아져** 만 갑니다. 바늘구멍만 한 틈으로 1초에 수백만 번 공을 주고받아야 하는 상황인 겁니다.

이제는 단순히 더 빨리 던지고 더 자주 받는 식의 방식만으로는 부족합니다. **지금까지와는 전혀 다른 방식의 성능 향상 방법론이 필요해졌습니다.** 그리하여 **LPDDR 방식과는 다른 새로운 패러다임의 메모리 반도체**, 바로 **HBM** 이 현 시장에 데뷔하게 됩니다.

---

## 3. Memory Wall을 허물어주기 위해 나타난 구세주, HBM

반도체는 2D Integration의 한계로 3D Stacking의 시대가 시작되었습니다. **HBM 역시 마찬가지입니다.** 집적도를 높이는 대신 **메모리 반도체를 위로 쌓아 올리기** 시작한 것이죠. 현재 최신 HBM의 경우 12단까지 쌓아 올리는 데 성공했으며, 2~3년 내 16단까지 쌓아 올리는 것을 목표로 한다고 합니다.

**SK 하이닉스** 는 10여 년 전부터 **HBM 기술을 꾸준히 연구** 해 왔습니다. 삼성과 달리 HBM 연구를 중간에 멈추지 않은 믿음 덕분에 현 HBM 시장 내에서 TSMC, NVIDIA와 동맹 전선을 만들 수 있었고, 현재 시장 점유율은 무려 53%에 달합니다.

![HBM 시장 내 Top3 점유율 (출처 : 트렌드포스)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2F82WTJ8nM1dXy_0alt5V3dOdObyw.jpg&w=1920&q=75)
*HBM 시장 내 Top3 점유율 (출처 : 트렌드포스)*

물론, 삼성과 마이크론이 추격해오고 있지만, 이들은 계속해서 NVIDIA 테스트 통과에 실패하며 고배를 마시고 있는, 아직은 열위에 있는 상황입니다.

---

## 4. HBM은 LLM을 완전히 정복할 수 있을까?

그렇다면 **HBM의 성능이 어떤 방식으로 개선되어야 LLM을 극복할 수 있을까요?**

![HBM의 구조 (출처 : 서울경제)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FMVntgl4ayKalzO6IPWy3E7jMaAw.jpg&w=1920&q=75)
*HBM의 구조 (출처 : 서울경제)*

HBM의 구조를 보면 아래 Substrate(기판)이 있고, 그 위에 Interposer(인터포저), 그리고 그 위로 DRAM들이 아파트처럼 쌓여있는 것을 볼 수 있습니다. DRAM들 사이에는 TSV라는 세로로 된 통로가 있고요.

이 통로는 **메모리를 더 빠르게 주고받을 수 있도록 아예 DRAM을 관통하는 '특급 엘리베이터'** 역할을 합니다. 또한, 이 특급 엘리베이터는 2개가 아니라 무려 1,024개나 있으며 앞으로는 2,048개까지도 늘어날 계획이죠.

정리하자면, **HBM의 성능을 향상시키는 두 가지 핵심 전략** 은 다음과 같습니다.

1. **단수를 더 높이 쌓아 메모리 용량을 키우는 것**
2. **TSV의 개수를 늘려 Bandwith(전송 폭)를 넓히는 것**

하지만, 이야기는 여기서 끝이 아닙니다. **이제부터가 진짜 어려운 단계** 입니다.

![16단을 향해가는 HBM (출처 : Xperi)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0.fjpg%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2Fsf4_m8vwGwI8cIP5LOM3wexIL2I.PNG&w=1920&q=75)
*16단을 향해가는 HBM (출처 : Xperi)*

HBM의 성능을 계속해서 끌어올리기 위해서는 앞으로 **더 많은 TSV를 넣고**, **더 높게 DRAM을 쌓아야 합니다.** 그런데 이게 말처럼 쉽지 않습니다.

**더 많은 TSV가 들어갈수록** 오고 가는 데이터의 양은 많아지고, 통로는 복잡해집니다. 또한, HBM의 물리적 면적의 최댓값은 정해져 있는데 **마구잡이로 통로를 더 뚫을 수도 없습니다.** 

**위로 쌓아 올리는 것도 마찬가지** 입니다. HBM은 처음부터 위로 쌓아 올리는 것이 아닌 **DRAM을 2D 평면에 만들어낸 후 쌓아 올리는 방식** 입니다. 지금과 같은 구조로는 물리적으로 16단 이상 쌓아 올리기 힘들 것입니다. 또한 16단 이상이 되면, 레이저는 더 이상 **DRAM에 일관되게 균일한 구멍을 뚫기 어려워집니다.**

그 모든 난관을 다 극복해도 이제는 **전력량과 발열량이 문제** 입니다. HBM은 정해진 구조 속에 소자들을 꽉꽉 채워 넣으니, 당연히 전력량과 발열량이 비례해서 커질 수밖에요. **HBM은 기술적으로 아직 갈 길이 멀었습니다.**

---

## 원영적 사고가 필요한 순간

제가 기술 시장 속 한계점을 매번 말씀드리는 이유는, **기술적 한계를 넘어설 방법이 언제나 치열하게 연구되는 중** 이라는 사실을 곱씹으며, **'한계를 극복해 나가려는 움직임 속에서 새로운 시장 기회가 나온다'** 는 점을 말씀드리고 싶은 건데요.

![원영적 사고 (출처 : 이투데이)](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FKflc2TL-19n3O3PVL4MUdRa0Alo.jpg&w=1920&q=75)
*원영적 사고 (출처 : 이투데이)*

**시장의 어려움** 은 오히려 좋은 신호입니다. '원영적 사고'로 보자면 **'완전 럭키비키'** 인 것이죠. **모두가 한 가지 문제를 풀기 위한 모멘텀을 만들어 줄 것이니까요.**

**HBM의 한계** 는 다시금 새로운 시장이 열리게 만들어 줄 것입니다. 수직 적층에 유리한 신소재, 트랜지스터를 수직으로 쌓는 CFET 기술, 혁신적인 Interposer, 또는 저전력 메모리 신소자의 가능성도 기대할 수 있을 것입니다.

결국, 이 모든 변화의 중심에는 **언제나 창업자의 멀리 보는 혜안과 강력한 믿음** 이 있습니다. 누가 더 멀리, 더 깊이 기술의 본질을 바라보느냐에 따라 다음 흐름이 바뀌게 될 것이라고 생각하는데요.

SK하이닉스는 HBM에 대한 시장의 비관적인 시선에도 흔들리지 않았습니다. 멀리 보는 혜안과 믿음을 가지고 꾸준히 연구한 덕에, 지금은 HBM 시장에서 압도적인 우위를 점하고 있습니다.

저희 카카오벤처스는 후행적으로 따라오는 매출과 이익보다는, 창업가분들의 혜안과 믿음에 베팅하고자 합니다. 원천 기술과 뾰족한 솔루션을 바탕으로 암초처럼 단단히 뿌리내릴 스타트업, 그 집요한 생존력을 가진 스타트업에 투자하고 싶습니다.

다음 공유 드리고 싶은 주제는 'NVIDIA가 헤게모니를 만드는 방식'에 대한 내용입니다. 감사합니다!

![카카오벤처스 김영무(Zero) 심사역](https://image.inblog.dev/?url=https%3A%2F%2Fimg1.daumcdn.net%2Fthumb%2FR1280x0%2F%3Ffname%3Dhttp%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Fservice%2Fuser%2FbcpZ%2Fimage%2FELdlNYgcJ021c1itCexwKIwCljc.png&w=1920&q=75)
*카카오벤처스 김영무(Zero) 심사역*
