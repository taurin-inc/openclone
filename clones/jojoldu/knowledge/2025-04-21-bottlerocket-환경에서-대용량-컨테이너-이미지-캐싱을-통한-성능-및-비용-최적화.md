---
topic: "Bottlerocket 환경에서 대용량 컨테이너 이미지 캐싱을 통한 성능 및 비용 최적화"
source_type: other
source_url: "https://tech.inflab.com/20250421-bottlerocket-volume-image-cache"
authorship: self
published_at: 2025-04-21
---
# Bottlerocket 환경에서 대용량 컨테이너 이미지 캐시하기

**Author:** 구피(Goofy)  
**Date:** 2025-04-21

---

안녕하세요. 인프랩 데브옵스 엔지니어 구피입니다!

인프랩에서는 ML, 데이터 처리 목적으로 몇 파이프라인에서 GB 단위의 큰 용량 이미지를 사용하고 있는데요. 이런 작업의 컨테이너를 띄우기 위해선 이미지 pull 및 압축 해제에 수분이 소요되기도 합니다.

특히 노드 재생성이 빈번한 Spot 인스턴스 환경에서 실행되는 파이프라인에서 이 점이 비효율적입니다. 이미지 pull 시간동안 고사양 인스턴스를 불필요하게 더 오래 점유하기도 하고, 네트워크 등 리소스도 더 사용하니 낭비되는 자원이 아쉬웠습니다.

따라서 인프라를 EKS, bottlerocket 환경으로 옮기며, 문제 개선을 위해 이미지를 데이터 볼륨에 캐시하는 방법을 적용했습니다.

그 결과 컨테이너 실행시 최대 **15분** 걸렸던 이미지 pull 과정을 **10초** 내로 단축할 수 있었습니다.

컨테이너 준비 시간 동안 소비되는 EC2 비용, 네트워크 비용 또한 70% 이상 대폭 절감되었습니다.

이번 글에서는 bottlerocket 환경 컨테이너 작업에서 다양한 목적으로 큰 파일을 사용할 때 pull 작업으로 인한 비용을 아끼기 위해 이미지가 캐시된 볼륨 스냅샷을 만들어 사용하는 방법, 그리고 적용 과정에서 알게된 지식과 팁을 공유하고자 합니다.

# Bottlerocket OS

우선, [Bottlerocket](https://bottlerocket.dev/) 은 AWS에서 컨테이너 호스팅에 최적화하여 제작한 Linux 기반의 오픈소스 운영체제입니다. 환경 구축시 Bottlerocket을 사용한 이유는 다음과 같습니다.

- 컨테이너 실행에 필요한 최소한의 패키지로만 구성되어 있어 가볍고, 부팅이 빠릅니다.
- 쉘이나 SSH가 존재하지 않아 보안 측면에서도 유리합니다.
  - 접근이 필요한 경우 control, admin 컨테이너를 통해서만 접근할 수 있습니다.
- 기본적으로 OS 볼륨과 컨테이너 데이터를 위한 볼륨, 두 개의 볼륨을 사용합니다.
  - OS 볼륨은 읽기 전용으로 보호되고 컨테이너 데이터는 별도 볼륨에 저장되므로, 운영체제와 데이터의 독립적인 관리와 재사용이 쉬워집니다.

Bottlerocket에서 이미지가 저장된 볼륨 스냅샷을 쉽게 활용할 수 있는 이유는 세 번째 특성 덕분입니다. 운영체제 데이터와 컨테이너 관련 데이터를 OS 수준에서 나누어 관리하기 때문에 이미지를 pull 받은 데이터 볼륨의 스냅샷을 생성하고 이를 다른 인스턴스에 복원하면 컨테이너 데이터가 동일한 구성의 볼륨으로 복원되어 바로 사용 가능한 상태가 되는 것입니다.

# 스냅샷 빌드 스크립트

이미지가 캐시된 볼륨 스냅샷은 AWS에서 공식 제공하는 스크립트를 활용해 바로 생성할 수 있습니다.

- [https://github.com/aws-samples/bottlerocket-images-cache](https://github.com/aws-samples/bottlerocket-images-cache)

이 스크립트에서 하는 역할은

1. bottlerocket EC2를 생성한 후
2. 캐시할 이미지를 pull 받고
3. 이미지가 저장된 데이터 볼륨(EBS)에 대한 스냅샷을 생성하는 것

입니다. 구체적인 과정은 다음과 같습니다.

## 1. bottlerocket EC2 및 리소스 생성

레포지토리에 포함된 CloudFormation 템플릿 yaml에 따라 볼륨 스냅샷을 생성하기 위해 AWS 리소스를 생성합니다. 이 리소스들은 스냅샷 생성이 끝나면 cleanup 과정에서 모두 삭제됩니다.

![CloudFormation 생성 결과](https://tech.inflab.com/static/66e232e932e2a65797292f31c32b29d7/37523/cloudformation-result.png)

생성된 CloudFormation 스택에서 Role, InstanceProfile, LaunchTemplate, EC2 네 가지 리소스를 확인할 수 있습니다.

이후 단계에서 이미지를 pull하기 위해선 인스턴스에 접근하여 명령어를 실행할 수 있어야 하는데, bottlerocket은 쉘에 직접 접근할 수 없기 때문에 Role과 LaunchTemplate에 관련 설정이 추가되어 있습니다.

- bottlerocket에 접근해 명령어를 실행할 때, 두 종류의 관리용 컨테이너를 사용합니다.

| control container | admin container |
| --- | --- |
| - 기본 활성화<br> - SSM으로 인스턴스에 접속<br>- apiclient 명령어로 <br>시스템 설정 조회 및 변경 | - 기본 비활성화<br>- 루트 권한이 필요한 작업 가능<br>- 호스트 파일시스템 직접 접근 가능<br>- 이미지 pull 등 고급 작업에 필요 |

- 인스턴스에 AWS SSM 권한이 부여되어있는 경우, AWS SSM을 통해 control container에 접속할 수 있습니다.
- admin container가 활성화되어있는 경우, control container에서 admin container에 접속할 수 있습니다.
- 이미지 pull을 위해선 admin container로 명령을 실행해야합니다.

따라서, 각 리소스는 아래와 같이 설정되어 있습니다.

- Role에는 캐시할 이미지를 Pull하기 위한 ECR 권한과 SSM 권한이 포함되고, 이 Role을 인스턴스 권한으로 사용합니다.
- LaunchTemplate에선 EC2 인스턴스를 부팅할 때 사용할 설정값을 지정합니다.
  - UserData 설정을 통해 Bottlerocket의 admin 호스트 컨테이너를 활성화합니다.
    - bottlerocket에선 UserData를 TOML 형식으로 정의합니다. LaunchTemplate의 아래 UserData 설정으로, 생성된 인스턴스의 admin 컨테이너가 활성화됩니다.
      ```toml
      [settings.host-containers.admin]
      enabled = true
      ```
  - BlockDevice는 각 용도로 두 개 생성합니다.
    - `/dev/xvda`(OS 데이터용, 10GB 고정)
    - `/dev/xvdb`(컨테이너 데이터용, 기본 50GB. 캐시할 데이터 용량에 따라 수정)
- EC2 인스턴스는 Bottlerocket AMI를 기반으로 부팅됩니다.
(AMI 기본값 `/aws/service/bottlerocket/aws-k8s-1.27/x86_64/latest/image_id`)

## 2. 캐시할 이미지 pull

EC2 인스턴스에 SSM 권한을 부여했으므로, 인스턴스 부팅 후 control container에서 SSM 연결이 준비되면 자동으로 접속 가능 상태가 됩니다.

SSM 상태가 확인되면, `aws ssm send-command`로 불필요한 서비스, 이미지를 지우기 위한 admin 컨테이너 명령을 실행합니다.

- 불필요한 컨테이너 동작을 막기 위해 Bottlerocket의 기본 서비스인 kubelet을 중지합니다.
```sh
apiclient exec admin sheltie systemctl stop kubelet
```

- 필요한 이미지만 캐시하기 위해 인스턴스에 있던 기존 이미지들은 삭제합니다.
```sh
apiclient exec admin sheltie ctr -a /run/containerd/containerd.sock -n k8s.io images rm $(apiclient exec admin sheltie ctr -a /run/containerd/containerd.sock -n k8s.io images ls -q)
```

정리된 상태의 인스턴스에 containerd의 CLI인 ctr로 원하는 이미지를 Pull합니다.
```sh
apiclient exec admin sheltie ctr -a /run/containerd/containerd.sock -n k8s.io images pull --label io.cri-containerd.image=managed --platform {플랫폼} {이미지} --u AWS:{ECR 로그인 패스워드}
```

## 3. 데이터 볼륨 스냅샷 생성

이미지 pull이 완료되었다면 인스턴스를 중지하고 캐시된 이미지가 저장된 볼륨(`/dev/xvdb`)의 EBS 스냅샷을 생성합니다. 이후, CloudFormation으로 생성한 스택을 모두 삭제하여 임시 리소스들을 정리합니다.

스크립트 실행이 종료되면 아래처럼 생성된 스냅샷의 id가 출력됩니다.

```sh
All done! Created snapshot in ap-northeast-2: {snapshot-id}
```

> 참고:
> 스크립트 전체 실행에는 대략 5분이 소요되었습니다.
> (이미지 용량, 스냅샷 용량 등에 따라 상이할 수 있습니다.)
> - CloudFormation stack 생성: 약 3분
> - 이미지 pull 등 명령 실행: 약 1분 이하
> - 스냅샷 생성: 약 1분

> 필요한 경우, 이미지 배포시마다 쉽게 스크립트를 실행하여 스냅샷을 새로 생성하는 파이프라인을 구축할 수 있습니다.

# 노드 생성시 볼륨 설정

스냅샷 생성이 완료되었다면, 노드 프로비저닝 시 해당 스냅샷을 기반으로 EBS 볼륨을 생성하도록 설정해야 합니다. 이를 위해 Karpenter의 EC2NodeClass 설정에서 `/dev/xvdb` 볼륨에 해당 스냅샷 데이터를 연결하도록 정의하였습니다.

이렇게 구성하면, 신규 노드가 생성될 때 볼륨에 스냅샷 데이터가 마운트되어, 이미지가 이미 캐시된 상태에서 컨테이너를 빠르게 실행할 수 있게 됩니다.

결과적으로 이미지 pull 시간을 생략하고 첫 컨테이너 시작 속도를 평균 10초 이내로 단축할 수 있었습니다.

```yaml
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: example
spec:
  blockDeviceMappings:
    - deviceName: /dev/xvdb
      ebs:
        volumeSize: 100Gi
        volumeType: gp3
        snapshotID: {snapshot-id}
---
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: example
spec:
  template:
    spec:
      ...
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: example
```

# 주의할 점: 스냅샷 볼륨 로드 성능 문제

단, 이미지가 캐시된 스냅샷을 사용할 때는 경우에 따라 볼륨 로드 성능을 주의해야 합니다.

실제로 테스트 해보았을 때, 스냅샷 볼륨에서 캐시된 이미지를 가져와 실행하면 애플리케이션 부팅 시간이 기존 대비 3배 이상 오래 걸리는 문제가 발생하였는데요.

bottlerocket-images-cache 레포지토리에도 유사한 현상에 대한 [이슈](https://github.com/aws-samples/bottlerocket-images-cache/issues/13) 가 등록되어 있었습니다. 확인 결과, 애플리케이션 부팅이 느렸던 이유는 EBS 볼륨에서 스냅샷 데이터를 lazy loading하기 때문이었습니다.

애플리케이션 시작 시 내부에서 큰 용량의 파일을 읽고 있었는데, 파일에 접근하려는 순간 스냅샷 파일을 EBS에 불러와 기록하는 작업이 시작되고, 이로 인해 긴 지연이 발생한 것입니다.

> For volumes, of any volume type, that were created from snapshots, the storage blocks must be pulled down from Amazon S3 and written to the volume before you can access them. This preliminary action takes time and can cause a significant increase in the latency of I/O operations the first time each block is accessed. Volume performance is achieved after all blocks have been downloaded and written to the volume.
> [https://docs.aws.amazon.com/ebs/latest/userguide/ebs-initialize.html](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-initialize.html)

스냅샷을 볼륨에 연결할 때 큰 파일에 접근하는 대기 시간을 줄일 해결책으로 아래 세 가지 방안을 검토했습니다.

1. [fio](https://github.com/axboe/fio) 와 같은 도구로 인스턴스 시작시 스냅샷 데이터를 EBS에 모두 로드하기
   - 노드 생성 후 볼륨을 초기 로드하는 시간만큼 대기하고, 로드가 모두 완료되었을 때 작업을 실행하는 방법입니다.
2. IOPS, Throughput 높이기
   - 스냅샷 데이터가 EBS에 로드되는 속도는 EBS의 쓰기 작업 성능. 즉, IOPS, throughput에 따라 좌우되므로, EBS의 두 성능값을 높게 설정해 더 빠르게 로드하는 방법입니다.
3. [fast snapshot restore](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-fast-snapshot-restore.html) 기능 사용하기
   - EBS에서 스냅샷을 지연없이 불러오는 fast snapshot 기능을 활용하는 방법입니다.

현재의 사용 방식에선 세 번째 방법은 이점에 비해 비용 부담이 크다고 판단했습니다. (fast snapshot을 활성화한 스냅샷 az당 월 $540)

나머지 방법 중에선, 노드 생성 후 첫 pod를 올리기 전 대기하는 것보다 파일을 실질적으로 더 빠르게 로드하는 것이 좋다고 판단해 두 번째 방식을 적용했습니다. 파일을 빠르게 로드해야하는 이유는 파이프라인 실행 시간을 줄이기 위함도 있지만 서론에서 언급한 것과 마찬가지로 고사양 EC2 실행 시간을 절약하기 위한 목적이 더 컸습니다.

영향이 작은 변수를 제외하고 각 상황의 비용을 간단한 식으로 표현하면 아래와 같은데요.

- IOPS, Throughput을 높이는 경우: 작업을 실행하는 동안 EBS 성능에 따른 추가 비용을 지출
- 높이지 않는 경우: gp3 기본 성능값에서의 파일 로드 시간과, 개선 후 시간의 차이만큼 인스턴스 비용을 지출

```text
{작업 실행 시간} * {EBS 성능 추가 비용} < {파일 로드 시간 - 개선된 시간} * {EC2 비용}
```

이 부등식에 값을 대입했을 때 좌변이 작아 IOPS, Throughput을 높이는 것이 더 비용 효율적인 선택이었습니다. (작업 실행 시간이 짧고, 고사양의 인스턴스를 사용)

> 반대로, 대용량 파일을 한 번 로드 한 후 작업을 오래 실행하거나 서버처럼 지속적으로 실행하는 경우 초기에 로드 후 컨테이너를 실행하는 것이 효율적일 수 있습니다.

따라서 EC2NodeClass의 볼륨 설정에서 아래처럼 IOPS, Throughput 값을 지정해주었습니다.

필요한 애플리케이션에서 큰 파일을 주로 읽고 있어서, Throughput 값 조정만으로 적정한 작업 시간을 달성할 수 있어 아래와 같이 설정하였습니다. 요구사항과 워크로드의 특성에 맞는 적절한 값 사용을 추천드립니다!

```yaml
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: example
spec:
  blockDeviceMappings:
    - deviceName: /dev/xvdb
      ebs:
        volumeSize: 100Gi
        volumeType: gp3
        snapshotID: { snapshot-id }
        # 필요한 로드 성능에 따라 값 조정
        iops: 3000 # gp3 기본값 3000
        throughput: 750 # gp3 기본값 125MiB/s
```

# 마무리

이번 개선 작업을 통해 Bottlerocket의 구조적 장점과 EBS 스냅샷을 효과적으로 활용하면, 컨테이너 시작 속도를 획기적으로 단축시킬 수 있다는 점을 확인하였습니다.

특히 Spot 인스턴스 환경처럼 노드 재생성이 빈번한 상황에서 대용량 이미지에 대한 캐시 전략이 큰 비용 절감과 성능 향상으로 이어질 수 있었습니다.

비슷한 문제를 겪고 있는 분들께 조금이나마 도움이 될 수 있길 바랍니다!

읽어주셔서 감사합니다 :)

---
**구피(Goofy)**  
DevOps Engineer
