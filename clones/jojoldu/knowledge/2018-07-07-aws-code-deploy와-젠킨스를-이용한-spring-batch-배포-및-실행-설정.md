---
topic: "AWS Code Deploy와 젠킨스를 이용한 Spring Batch 배포 및 실행 설정"
source_type: other
source_url: "https://jojoldu.tistory.com/315"
authorship: self
published_at: 2018-07-07
---
# 3. AWS Code Deploy로 배포 Jenkins에서 배치 Jenkins로 Spring Batch 배포하기 - 젠킨스 연동

by 향로 (기억보단 기록을) 2018. 7. 7.

## 4. 배포 Jenkins 환경 설정

여기서는 **Batch가 아닌 배포 Jenkins** 페이지로 이동합니다.

배포 Jenkins에서 Github에 올라간 코드를 가져오려면 Github과 연동이 필요합니다.

> Jenkins와 Github 연동은 [이전에 작성된 포스팅](http://jojoldu.tistory.com/291) 를 참고해서 진행하시는것을 추천드립니다.

**연동이 되셨으면** 배포 Job을 생성하겠습니다.

![deploy1](https://t1.daumcdn.net/cfile/tistory/99105F445B4072C635)

![deploy2](https://t1.daumcdn.net/cfile/tistory/99CD343C5B4072C615)

매개변수 (파라미터)에는 **Choice Parameter** 를 선택합니다.

![deploy3](https://t1.daumcdn.net/cfile/tistory/99FCF9435B4072C609)

*   여기서는 member-batch 모듈만 있어서 member-batch 만 등록했지만, member-api, member-admin 등 여러 모듈이 있다면 다 등록하시면 됩니다.

소스코드 관리에서는 배포할 프로젝트의 Github 주소를 등록합니다.

![deploy3](https://t1.daumcdn.net/cfile/tistory/997A9C3B5B4072C61E)

배포 스크립트 내용은 좀 길어서 아래 코드를 그대로 복사해주세요.

![deploy4](https://t1.daumcdn.net/cfile/tistory/999331355B4072C615)

```bash
DEPLOY_DIR_NAME=code-deploy-${PROJECT_NAME}
APP_NAME='dwlee-member-deploy'
BUCKET='dwlee-member-deploy'
ZIP_NAME=${PROJECT_NAME}-${GIT_COMMIT}-${BUILD_TAG}.zip

./gradlew :${PROJECT_NAME}:clean :${PROJECT_NAME}:build

echo "    > 배포.zip 생성"
mkdir -p ${DEPLOY_DIR_NAME}
cp ${PROJECT_NAME}/code-deploy/*.yml ${DEPLOY_DIR_NAME}/
cp ${PROJECT_NAME}/code-deploy/*.sh ${DEPLOY_DIR_NAME}/
cp ${PROJECT_NAME}/build/libs/*.jar ${DEPLOY_DIR_NAME}/

cd ${DEPLOY_DIR_NAME}
zip -r ${DEPLOY_DIR_NAME} *

echo "    > AWS S3 업로드"
aws s3 cp ${DEPLOY_DIR_NAME}.zip s3://${BUCKET}/${ZIP_NAME} --region ap-northeast-2

echo "    > AWS CodeDeploy 배포"
aws deploy create-deployment \
--application-name ${APP_NAME} \
--deployment-group-name ${PROJECT_NAME} \
--region ap-northeast-2 \
--s3-location bucket=${BUCKET},bundleType=zip,key=${ZIP_NAME}

echo "    > 생성된 디렉토리 삭제"
cd ..
rm -rf ${DEPLOY_DIR_NAME}
```

*   `./gradlew :${PROJECT_NAME}:clean :${PROJECT_NAME}:build`
    *   멀티 모듈 프로젝트이기 때문에 **지정한 프로젝트만** ( `${PROJECT_NAME}` ) Build 합니다.
*   배포.zip 생성
    *   하위 프로젝트의 `code-deploy` 디렉토리 안에 있는 yml, sh파일과 build된 jar파일을 하나의 zip으로 묶습니다.
*   AWS S3 업로드
    *   S3에 배포.zip 파일을 올립니다.
*   AWS CodeDeploy 배포
    *   업로드한 S3 파일로 Code Deploy 배포를 진행합니다.

코드가 3-3 에서 작성한 코드와 거의 유사하기 때문에 크게 어렵지 않으실것 같습니다.

### 4-2. 배포 Jenkins 테스트

방금 생성한 배포 Job을 한번 테스트 해보겠습니다.

![deploytest1](https://t1.daumcdn.net/cfile/tistory/99F05E345B4072C612)

![deploytest2](https://t1.daumcdn.net/cfile/tistory/99EB3D4B5B4072C614)

Jenkins에서 노출되는 로그를 보면

![deploytest3](https://t1.daumcdn.net/cfile/tistory/997DA5435B4072C612)

d-VBEUTT8GS로 배포가 실행된 것을 알 수 있습니다.

Code Deploy로 가서 확인해보시면!

![deploytest4](https://t1.daumcdn.net/cfile/tistory/999BDF395B4072C609)

배포가 성공했음을 알 수 있습니다.

마찬가지로 배포 될 대상인 Batch Jenkins에도 jar가 잘 배포된 것을 확인할 수 있습니다.

![deploytest5](https://t1.daumcdn.net/cfile/tistory/991EC9405B4072C633)

마지막으로!

이렇게 배포된 Batch jar를 어떻게 실행하면 될지 소개드리겠습니다.

## 5. 배포 및 배치 실행

Batch Jenkins에서 `sampleBatch`를 실행할 수 있도록 새로운 Item을 생성합니다.

![job1](https://t1.daumcdn.net/cfile/tistory/994867425B4072C618)

배치 실행시 파라미터 중복 오류를 피하기 위해 `version` 이라는 임시 파라미터를 등록합니다.

![job2](https://t1.daumcdn.net/cfile/tistory/993D3B365B4072C624)

Build 항목에선 아래의 코드를 사용합니다.

![job3](https://t1.daumcdn.net/cfile/tistory/99816B4D5B4072C613)

```bash
ORIGIN_JAR=$(readlink /home/jenkins/member-batch/application.jar)
echo "    > ORIGIN_JAR: ${ORIGIN_JAR}"
java -jar ${ORIGIN_JAR} \
--job.name=sampleBatch \
version=${version}
```

*   `readlink`
    *   `application.jar`에 링크된 원본 jar 파일을 찾습니다.
    *   Batch 실행시 원본 jar를 실행하기 때문에 **배포로 application.jar에 링크된 파일이 변경되도 실행중이던 Batch가 종료되지 않습니다**.

자! 이제 모두 세팅되었습니다.

그럼 Batch를 한번 실행해보겠습니다.

![job4](https://t1.daumcdn.net/cfile/tistory/99C20D3E5B4072C61B)

실행해보시면!

이렇게 아주 이쁘게 원본 Batch.jar를 실행하는 로그와

![job5](https://t1.daumcdn.net/cfile/tistory/991171425B4072C61C)

배치가 성공적으로 수행됐음을 보여주는 로그를 볼 수 있습니다!

![job6](https://t1.daumcdn.net/cfile/tistory/99C2A33F5B4072C601)

## 후기

어떠셨나요?

많은 쉘 스크립트로 복잡하게 느끼셨지 않을까 걱정도 되지만, 그래도 차근차근 따라오셨으면 충분히 적용 하실것이라 생각합니다.

다음 시간에도 Code Deploy를 통해 좀 더 다양한 배포 환경을 소개드리겠습니다.

긴 글 끝까지 읽어주셔서 감사합니다 :)
