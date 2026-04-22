---
topic: "SpringBoot & AWS S3 연동하기"
source_type: other
source_url: "https://jojoldu.tistory.com/300"
authorship: self
published_at: 2018-06-03
---
# SpringBoot & AWS S3 연동하기

**Author:** 향로 (기억보단 기록을)  
**Publish Date:** 2018. 6. 3.

---

안녕하세요? 이번 시간엔 SpringBoot & AWS S3 연동하기 예제를 진행해보려고 합니다.

모든 코드는 [Github](https://github.com/jojoldu/blog-code/tree/master/springboot-aws-tui) 에 있기 때문에 함께 보시면 더 이해하기 쉬우실 것 같습니다.

SpringBoot로 서비스를 구축하다보면 꼭 만들어야할 것이 **정적 파일 업로더** 입니다. 이미지는 HTML과 같은 정적 파일을 S3에 제공해서 이를 원하는 곳에서 URL만으로 호출할 수 있게 하는걸 말합니다.

보통 [TUI 에디터](https://github.com/nhnent/tui.editor) 와 같은 웹 에디터에서는 꼭 같이 구현해야할 기능입니다. 클라우드가 없던 시절에는 서버 1대에 웹 서버(Apache, Nginx 등)을 설치하여 특정 디렉토리를 지정해서 구현했었는데요. 클라우드가 생기고 나서는 클라우드에서 제공하는 스토리지 서비스를 사용하면 되서 아주 편해졌습니다.

여기서는 AWS의 S3를 이용하여 구현해보겠습니다. Spring Cloud AWS와 AWS S3를 이용하여 아주 쉽게 진행하니 가벼운 마음으로 따라오시면 될것 같습니다.

## 1. 로컬 환경 구성

> 참고로 S3에 bucket이 이미 생성되어있다는 가정하에 시작합니다.

먼저 프로젝트 구성을 위해 의존성을 추가합니다. 여기서는 Gradle을 사용합니다.

### build.gradle

```groovy
repositories {
    mavenCentral()
    maven { url 'https://repo.spring.io/libs-milestone'}
}

dependencies {
    compile('org.springframework.boot:spring-boot-starter-web')
    compile('org.springframework.cloud:spring-cloud-starter-aws')

    // handlebars
    compile 'pl.allegro.tech.boot:handlebars-spring-boot-starter:0.3.0'

    compileOnly('org.projectlombok:lombok')
    testCompile('org.springframework.boot:spring-boot-starter-test')
}

dependencyManagement {
    imports {
        mavenBom 'org.springframework.cloud:spring-cloud-aws:2.0.0.RC2'
    }
}
```

> Spring Cloud AWS가 현재 (2018.06.03) 2.0.0.RC2가 최신이라 `maven { url 'https://repo.spring.io/libs-milestone'}`가 필요합니다.

뷰 템플릿은 본인이 원하시는걸 사용하시면 됩니다. (Freemarker, Thymeleaf 등) 저는 개인적으로 Handlebars를 선호하기 때문에 `compile 'pl.allegro.tech.boot:handlebars-spring-boot-starter:0.3.0'`를 추가했습니다.

### S3Uploader.java

다음으로 S3에 정적 파일을 올리는 기능을 하는 `S3Uploader.java` 파일을 생성합니다.

```java
@Slf4j
@RequiredArgsConstructor
@Component
public class S3Uploader {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        File uploadFile = convert(multipartFile)
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File로 전환이 실패했습니다."));

        return upload(uploadFile, dirName);
    }

    private String upload(File uploadFile, String dirName) {
        String fileName = dirName + "/" + uploadFile.getName();
        String uploadImageUrl = putS3(uploadFile, fileName);
        removeNewFile(uploadFile);
        return uploadImageUrl;
    }

    private String putS3(File uploadFile, String fileName) {
        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile).withCannedAcl(CannedAccessControlList.PublicRead));
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    private void removeNewFile(File targetFile) {
        if (targetFile.delete()) {
            log.info("파일이 삭제되었습니다.");
        } else {
            log.info("파일이 삭제되지 못했습니다.");
        }
    }

    private Optional<File> convert(MultipartFile file) throws IOException {
        File convertFile = new File(file.getOriginalFilename());
        if(convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }

        return Optional.empty();
    }
}
```

코드의 순서는 간단합니다.
- MultipartFile을 전달 받고
- S3에 전달할 수 있도록 MultiPartFile을 File로 전환 (S3에 Multipartfile 타입은 전송이 안됩니다.)
- 전환된 File을 S3에 **public 읽기** 권한으로 put (외부에서 정적 파일을 읽을 수 있도록 하기 위함입니다.)
- 로컬에 생성된 File 삭제
- 업로드된 파일의 S3 URL 주소를 반환

Spring Boot Cloud AWS를 사용하게 되면 **S3 관련 Bean을 자동 생성**해줍니다. 그래서 AmazonS3, AmazonS3Client, ResourceLoader 등은 직접 설정할 필요가 없습니다.

### WebController.java

```java
@RequiredArgsConstructor
@Controller
public class WebController {

    private final S3Uploader s3Uploader;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/upload")
    @ResponseBody
    public String upload(@RequestParam("data") MultipartFile multipartFile) throws IOException {
        return s3Uploader.upload(multipartFile, "static");
    }
}
```

### index.hbs

`src/main/resources/templates/`에 index.hbs 파일을 생성합니다.

```html
<!DOCTYPE HTML>
<html>
<head>
    <title> SpringBoot & AWS S3</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <script
        src="https://code.jquery.com/jquery-3.3.1.js"
        integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</head>
<body>
<h1>
    S3 이미지 업로더
</h1>
<div class="col-md-12">
    <div class="col-md-2">
        <form>
            <div class="form-group">
                <label for="img">파일 업로드</label>
                <input type="file" id="img">
            </div>
            <button type="button" class="btn btn-primary" id="btn-save">저장</button>
        </form>
    </div>
    <div class="col-md-10">
        <p><strong>결과 이미지입니다.</strong></p>
        <img src="" id="result-image">
    </div>
</div>

<script>
    $('#btn-save').on('click', uploadImage);

    function uploadImage() {
        var file = $('#img')[0].files[0];
        var formData = new FormData();
        formData.append('data', file);

        $.ajax({
            type: 'POST',
            url: '/upload',
            data: formData,
            processData: false,
            contentType: false
        }).done(function (data) {
            $('#result-image').attr("src", data);
        }).fail(function (error) {
            alert(error);
        })
    }
</script>
</body>
</html>
```

### application.yml 설정

`src/main/resources/application.yml`에 아래와 같이 설정값을 추가합니다.

```yaml
cloud:
  aws:
    s3:
      bucket: 본인 S3 bucket이름
    region:
      static: ap-northeast-2
```

AWS 환경이 아닌 로컬 환경에서 S3를 사용하기 위해 IAM 사용자에서 `AmazonS3FullAccess` 권한을 가진 사용자를 추가하고 발급받은 accessKey와 secretKey를 `aws.yml`에 저장합니다.

### aws.yml

```yaml
cloud:
  aws:
    credentials:
      accessKey: 발급받은 accessKey
      secretKey: 발급받은 secretKey
```

**중요: `.gitignore`에 `aws.yml`을 등록하여 키가 외부에 공개되지 않도록 합니다.**

### Application.java

```java
@SpringBootApplication
public class Application {

    public static final String APPLICATION_LOCATIONS = "spring.config.location="
            + "classpath:application.yml,"
            + "classpath:aws.yml";

    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class)
                .properties(APPLICATION_LOCATIONS)
                .run(args);
    }
}
```

---

## 2. 배포 환경에서 사용하기

배포 서버인 EC2에서는 `aws.yml` 파일이 없으므로 EC2의 IAM Role을 활용합니다.

### EC2에 역할 추가
1. IAM -> 역할 생성 -> 서비스: EC2 선택
2. `AmazonS3FullAccess` 정책 연결
3. 생성된 역할을 해당 EC2 인스턴스에 할당

EC2는 할당된 IAM Role에 따라 자동으로 accessKey와 secretKey를 발급받습니다.

### application.yml 추가 설정

배포 환경을 위해 `application.yml`을 다음과 같이 수정합니다.

```yaml
cloud:
  aws:
    s3:
      bucket: jojoldu
    region:
      static: ap-northeast-2
    stack:
      auto: false
    credentials:
      instanceProfile: true
```

- `cloud.aws.stack.auto: false`: CloudFormation 구성을 사용하지 않도록 설정합니다.
- `cloud.aws.credentials.instanceProfile: true`: EC2의 IAM Role(instanceProfile)을 사용하겠다는 의미입니다.

## 마무리

인터넷에 있는 많은 Spring Boot + S3 사용법이 최근 내용을 반영하지 못한것을 봤습니다. 좀 더 간결한 코드로 실제 배포환경에서도 사용할 수 있는 방식을 소개시켜드리고 싶었습니다. 도움이 되셨길 바랍니다.
