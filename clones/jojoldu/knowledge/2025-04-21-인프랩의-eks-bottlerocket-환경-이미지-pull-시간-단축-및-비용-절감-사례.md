---
topic: "인프랩의 EKS/Bottlerocket 환경 이미지 pull 시간 단축 및 비용 절감 사례"
source_type: social
source_url: "https://www.linkedin.com/posts/jojoldu-%EC%9D%B4%EB%8F%99%EC%9A%B1_%EC%9D%B8%ED%94%84%EB%9E%A9%EC%97%90%EC%84%9C%EB%8A%94-%EC%B5%9C%EA%B7%BC-%EC%9D%BC%EB%B6%80-%EC%9D%B8%ED%94%84%EB%9D%BC%EB%A5%BC-eks-bottlerocket-%ED%99%98%EA%B2%BD%EC%9C%BC%EB%A1%9C-activity-7320218048030744576-w95J?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAGLkNq4BYFfSk8KptVnDLzKe5tkMW5_irGs"
authorship: self
published_at: 2025-04-21
---
인프랩에서는 최근 일부 인프라를 EKS, bottlerocket 환경으로 옮기며 "이미지를 데이터 볼륨에 캐시하는 방법" 을 적용하여 
"컨테이너 실행시 최대 15분 걸렸던 이미지 pull 과정을 10초 내로 단축"하고,  
"컨테이너 준비 시간 동안 소비되는 EC2 비용, 네트워크 비용 또한 70% 이상 대폭 절감" 하였습니다.

ML, 데이터 처리 목적으로 일부 파이프라인에서 GB 단위의 큰 용량 이미지를 사용할때면 컨테이너를 띄우기 위해선 이미지 pull 및 압축 해제에 수분이 소요되기도 합니다.

특히 노드 재생성이 빈번한 Spot 인스턴스 환경에서 실행되는 파이프라인에서 이 점이 비효율적입니다. 이미지 pull 시간동안 고사양 인스턴스를 불필요하게 더 오래 점유하기도 하고, 네트워크 등 리소스도 더 사용하니 낭비되는 자원이 아쉬웠습니다.

이걸 저희 인프랩에서는 어떻게 해결했는지,
bottlerocket 환경 컨테이너 작업에서 다양한 목적으로 큰 파일을 사용할 때 pull 작업으로 인한 비용을 아끼기 위해 이미지가 캐시된 볼륨 스냅샷을 만들어 사용하는 방법, 그리고 적용 과정에서 알게된 내용을 블로그에 정리해보았습니다 :)
