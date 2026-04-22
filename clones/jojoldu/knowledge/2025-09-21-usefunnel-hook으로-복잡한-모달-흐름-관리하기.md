---
topic: "useFunnel Hook으로 복잡한 모달 흐름 관리하기"
source_type: other
source_url: "https://tech.inflab.com/20250921-react-funnel-hook"
authorship: self
published_at: 2025-09-21
---
# useFunnel Hook으로 복잡한 모달 흐름 관리하기

**작성자:** 럭끼 (Luc77y)  
**날짜:** 2025년 9월 21일

안녕하세요, 인프랩의 프론트엔드 개발자 럭끼입니다.

인프런 강의실에서는 특정 시점에 다양한 함수 및 모달 노출 로직이 실행됩니다. 예를 들어, 강의 수강 중 특정 진도율을 달성하면 수업 영상 일시정지, 수강평 작성 모달 노출, 축하 메시지 모달 노출 로직이 순서대로 실행됩니다.

하지만 이러한 로직들의 복잡한 실행 순서와 조건 분기 때문에 코드가 점점 복잡해지고 유지보수가 어려워지는 문제를 겪었습니다. 이 문제를 퍼널(Funnel) 패턴을 활용한 `useFunnel` hook으로 해결한 경험을 공유드리겠습니다.

## 문제 상황: 모달들의 꼬리에 꼬리를 무는 지옥

### 기존 구조의 문제점

인프런 강의실에서는 상황에 따라 다양한 모달과 팝오버 UI가 연쇄적으로 나타납니다:

1.  **강의 시작 시**: 시작 축하 메시지 → 강의실 튜토리얼 팝오버
2.  **수업 완료 시**: (지식공유자가 설정한) 수업 완료 메시지 → 다음 수업 안내
3.  **특정 진도율 달성 시**: 진도율 달성 축하 메시지 → 수강평 작성 모달 → 수업 종료 안내

> **강의(Course)**: 여러 개의 ‘수업’이 모여 하나의 커리큘럼을 이루는 단위입니다.
>
> **수업(Unit)**: ‘강의’를 구성하는 각 개별 영상, 자료, 또는 학습 콘텐츠를 의미합니다.

기존에는 각 모달 컴포넌트의 `handleClose` 함수에서 다음 모달을 직접 호출하는 방식을 사용했습니다:

```tsx
// 수강평 모달 컴포넌트
const ReviewModal = () => {
  // 수강평 작성 완료시
  const handleConfirm = () => {
    ... // 수강평 작성 API 호출
    handleClose();
  };

  // 모달 닫기 버튼 클릭시
  const handleClose = () => {
    closeReviewModal(); // 수강평 모달 닫기
    if (isFromComplete) { // 수강평 모달이 강의가 완강되어서 노출된 경우
      setIsFromCompleteModal(false); // 완강 관련 전역 상태 수정
      findAndNavigateToNextCourse(); // 완강 후 다음 강의를 탐색하는 로직 실행
    }
  };
};
```

위의 코드는 다음과 같은 문제를 야기합니다.

**1. 강한 결합도**

각 모달이 다음에 실행될 모달을 직접 알고 호출해야합니다. 모달 노출 순서를 바꾸거나 새로운 모달을 중간에 삽입하려면 관련된 컴포넌트를 모두 수정해야합니다.

예를 들어 A → B → C 순서로 모달을 노출하다가 A → C → B 순서로 바꿔야한다면,
A는 B 대신 C를 열도록 수정하고, B는 C를 열지 않도록 코드를 삭제하고, C는 B를 열도록 코드를 추가해야합니다.

**2. 조건 분기의 확산**

`isKo`(한국어 페이지에서만 노출되어야하는지), `isReviewable`(수강평 작성이 가능한 상태인지), `isFromComplete`(방금 완강을 했는지) 등 특정 조건에 따라 모달을 노출하지 않고 넘어가야하는 경우가 있습니다. 기존 방식은 조건 분기 로직이 각 모달 컴포넌트에 흩어져 있어 정책이 바뀔 때마다 관련된 컴포넌트들을 찾아 수정해야합니다.

특히 저희는 기능 플래그를 사용하기 때문에 조건 분기 로직이 추가되거나 삭제될 일이 잦았습니다.

### 복잡성 예시

실제로 다음과 같은 간단한 요구 사항에도 코드 작업량은 생각보다 많아집니다.

> **AS-IS**: 진도율 n% 달성 축하 메시지 모달 → 수강평 작성 모달
>
> **TO-BE**: 진도율 n% 달성 축하 메시지 모달 → 수강평 작성 모달 → (진도율 100% 달성(완강)일 경우) 다음 학습 강의 추천 모달 추가 노출

이 요구사항을 구현하려면:

1.  진도율 100% 달성 시(`progress`가 최초로 100이 되었을 때) `isFromComplete` 변수를 true로 설정
2.  수강평 작성 모달에서 `isFromComplete`가 true면 강의 추천 모달 open
3.  수강평 작성 모달에서 `isFromComplete`가 false면 바로 return

```tsx
// 수강평 작성 모달
const ReviewModal = () => {
  const handleClose = () => {
    closeReviewModal();
    if (isFromComplete) {
      openRecommendationModal(); // 수강평 작성 모달에서 isFromComplete가 true면 강의 추천 모달 open
      return ;
    }
    ...
  };
};
```

이런 복잡성이 발생하는 근본적인 이유는 다음과 같습니다:

-   `isFromComplete`(방금 완강을 했는지)라는 **context** 내에서만 유효한 분기이므로 해당 context를 전역 상태 등으로 관리해야 합니다.
-   요구 사항이 ‘강의 추천 모달’에 관한 것이라면 강의 추천 모달을 호출하는 곳이 ‘수강평 작성 모달’이라는 것을 파악하고, 그곳에서 분기 코드를 추가해야 합니다.
    -   수강평 모달 대신 강의 추천 모달 안에서 `isFromComplete` 분기를 직접 처리할 수는 있지만 모달 흐름 파악과 코드 파악이 더 어려워집니다.

```tsx
const ReviewModal = () => {
  const handleClose = () => {
    closeReviewModal();
    openRecommendationModal(); // 수강평 작성 모달에서 분기하지 않고 무조건 강의 추천 모달을 열면,
  };
};

const RecommendationModal = () => {
  useEffect(() => {
    // 강의 추천 모달에서 직접 분기 로직을 처리해야함
    if (!isFromComplete) {
      closeRecommendationModal(); // 완강이 아닌 경우 모달을 바로 닫기
      return;
    }
    // 완강인 경우에만 실제 추천 로직 실행
  }, []);

  /**
   * 새로운 문제
   * 1. 수강평 모달이 close된 다음 강의 추천 모달이 open 된다는 전체적인 흐름을 파악하기 더 어려워짐
   * 2. 강의 추천 모달이 다른 요인(ex> 유저의 액션)에 의해 open될 경우에도 isFromComplete 분기를 검사하기 때문에 버그가 발생할 수 있음
   */
};
```

## 로직 개편 결정과 전수조사

### 리팩토링 결정

정책을 변경할 때마다 여러 컴포넌트를 수정해야 하는 구조는 지속 가능하지 않아 보였고, 특히 자동 메시지 기능 추가 작업를 진행하면서 기존 모달 흐름에 자동 메시지 모달을 끼워넣어야 하는 요구사항이 생겼습니다.

> 자동메시지: 수업 시작/종료, 특정 진도율 달성 등 특정 시점에 지식공유자가 설정한 메시지를 노출하는 기능

![자동메시지 예시](https://tech.inflab.com/static/77a22f4c14faed3fa421284505b5a62f/ebf47/auto-message-example.png)

자동 메시지는 다양한 시점의 모달 흐름에 끼어들어야했고 노출 조건이 복잡하며 기능 플래그도 사용해야했습니다. 이에 자동 메시지 스프린트 동안 리팩토링을 병행하기로 결정했습니다.

### 기존 로직 전수조사

본격적인 리팩토링에 앞서 강의실 모달 관련 로직을 모두 조사했습니다. 조사 결과, **10여 개의 컴포넌트들이 복잡하게 서로 얽혀 있는 구조임을 확인했습니다.**

**모달 컴포넌트들:**
-   `StartMessageModal` (시작 메시지)
-   `CompleteModal` (완강 메시지)
-   `ReviewModal` (수강평 모달)
-   `NextUnitModal` (다음 수업 보기)
-   …

**모달 노출 로직 진입점:**
-   강의 시작 시
-   수업 종료 시: 영상 재생 종료, 봤어요 버튼 클릭
-   완강 시
-   특정 진도율 달성 시
-   …

위 로직을 조사하면서 모달들이 서로 복잡하게 얽혀있으며 하나의 정책 변경이 여러 파일 수정으로 이어지는 구조라는 것을 다시금 느낄 수 있었습니다.

### 퍼널 패턴 도입 결정

이 복잡한 현실을 마주하고 나서, **퍼널(Funnel) 패턴** 을 도입하기로 결정했습니다.

토스의 [SLASH 23 발표](https://youtu.be/NwLWX2RNVcw?si=xmvAVjF9-t4m3ErT) 에서 영감을 받아, 각 컴포넌트를 하나의 **Step** 으로 보고, 여러 Step들을 순서대로 노출하는 **Funnel** 방식이 이 상황에 적합하다고 판단했습니다.

하지만 강의실의 경우 각 step이 UI 컴포넌트가 아닐 수 있고(자동 실행되는 콜백), 기존 컴포넌트들을 하나의 `<Funnel>` 아래로 모으기 어려운 제약(라이브러리 종속성 등)이 있었습니다. 그래서 강의실 상황에 맞게 새로운 퍼널을 설계했습니다.

## 해결책: 새로운 useFunnel Hook 설계 및 구현

### useFunnel Hook 설계

```typescript
// useFunnel hook return 타입
const useFunnel: () => {
  startFunnel: (type: string) => void; // 특정 타입의 퍼널 실행을 시작합니다.
  nextStep: () => void; // 현재 퍼널의 다음 step을 실행합니다.
}
```

```typescript
// 퍼널 Step 인터페이스
interface FunnelStep {
  name: string; // step 이름
  /*
   * modal: 컴포넌트에서 '다음'/'닫기' 버튼을 누를 때 nextStep 함수 실행
   * function: 콜백 함수 실행 후 바로 nextStep 함수 자동 실행
   */
  type: 'modal' | 'function';
  condition: () => boolean; // step 실행 조건 (충족하지 않으면 자동 skip)
  action: {
    fire: () => void; // 해당 step을 시작할 때 실행할 콜백 함수
    cleanup?: () => void; // 해당 step을 종료할 때 실행할 콜백 함수
  };
}
```

### 선언적 퍼널 정의

이제 기존의 복잡한 조건 분기를 **선언적으로** 정의할 수 있게 되었습니다:

```typescript
const 완강퍼널 = (): FunnelStep[] => {
  return [
    {
      name: '자동메시지',
      type: 'modal',
      condition: () => isKo && isAutoMessageFeatureFlagOn,
      action: { fire: openCompleteModal },
    },
    {
      name: '수강평모달',
      type: 'modal',
      condition: () => isReviewable,
      action: { fire: openReviewModal },
    },
    {
      name: '다음수업보기모달',
      type: 'modal',
      condition: () => isVideoUnit,
      action: { fire: openNextUnitModal },
    },
    {
      name: '로드맵관련함수',
      type: 'function',
      condition: () => isKo && isInRoadmap,
      action: { fire: findNextCourse },
    },
  ];
};
```

### 핵심 로직

`useFunnel` Hook은 큐를 통해 퍼널을 관리하며 `processStep`에서 조건을 체크하고 `fire` 함수를 호출합니다. `function` 타입은 자동으로 `nextStep`을 호출하고, `modal` 타입은 유저의 액션을 기다립니다.

### Context를 통한 전역 사용

`useFunnel` Hook을 여러 컴포넌트에서 사용할 수 있도록 Context로 제공하여 어디서든 `startFunnel`과 `nextStep`에 접근할 수 있게 했습니다.

### 모달 컴포넌트의 단순화

이제 모달 컴포넌트는 다음 모달이 무엇인지, 어떤 상황에서 열렸는지 알 필요 없이 본연의 역할만 수행합니다.

**TO-BE: 단순한 구조**
```tsx
const ReviewModal = () => {
  const handleClose = () => {
    closeReviewModal(); // 수강평 모달 닫기
    nextStep(); // 다음 step 실행
  };
};
```

## 추가적인 기능들

### 1. prepareCondition으로 API 대기

조건(`condition`) 판단 전에 API 응답을 기다려야 하는 경우 `prepareCondition`을 사용해 비동기 로직을 처리할 수 있도록 했습니다.

### 2. 중첩 퍼널

퍼널 A의 진행 도중 특정 조건에서 퍼널 B를 끼워 넣어 실행할 수 있는 기능을 구현했습니다. 이를 통해 복잡한 시나리오도 유연하게 대응 가능해졌습니다.

![중첩 퍼널 예시](https://tech.inflab.com/static/28d8c41a6f566a56c774f9fe45441671/bb630/nested-funnel-example.png)

## 도입 결과

### 해결된 문제들

1.  **모달 간 약한 결합**: 각 모달은 `nextStep()`만 호출하면 됩니다.
2.  **조건 로직의 중앙화**: 모든 실행 조건이 퍼널 정의 부분에 모여 정책 변경 시 한 곳만 수정하면 됩니다.
3.  **순서 변경의 용이성**: 배열의 순서만 바꾸면 됩니다.
4.  **가독성**: 퍼널 정의 코드만 보면 전체 흐름을 한 눈에 파악할 수 있습니다.

### 일반적인 퍼널 개념과의 차이점

이번에 구현한 퍼널은 사용자 이탈보다는 **순차 실행을 보장**하는 구조에 가깝습니다. 강의실의 특성상 로직 누락 없이 순차적으로 처리하기 위함이며, 실질적으로는 `Stepper`에 가깝지만 익숙한 용어인 `Funnel`을 채택했습니다.

## 마무리

강의실의 복잡한 모달 흐름을 퍼널 패턴으로 리팩토링하면서 **선언적인 코드의 힘**을 다시 한 번 느꼈습니다. 비즈니스 로직이 중앙화되면서 유지보수성이 비약적으로 향상되었고, 새로운 요구사항 추가 시의 고통에서도 벗어날 수 있었습니다.

물론 완벽한 구조는 아니겠지만, 기존 컴포넌트의 수정을 최소화하면서도 러닝 커브가 낮은 리팩토링이었기에 좋은 판단이었다고 생각합니다. 읽어주셔서 감사합니다.
