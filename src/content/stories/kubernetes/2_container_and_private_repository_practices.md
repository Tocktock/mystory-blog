---
title: 2. 컨테이너와 개인 저장소의 세계 -2
publishDate: 2024-01-14
description: '깃허브 액션을 통해 AWS ECR 에 이미지를 푸쉬해봅시다.'
---

# 컨테이너와 개인 저장소의 세계 -2

깃허브액션을 통해 애플리케이션 이미지를 AWS Elastic Container Registry 에 Push 해봅시다.

## AWS ECR (Elastic Container Registry)

Amazon ECR 은 AWS 가 제공하는 관리형 컨테이너 이미지 레지스트리 서비스입니다.
AWS IAM을 사용하여 리소스 기반 권한을 가진 개인 저장소를 지원합니다.

ECR 은 퍼블릭, 프라이빗 리포지토리 기능을 모두 지원하며 이미지의 버전 및 태그 관리를 쉽게해줍니다. 그 외에도
이미지의 생명주기를 관리할 수 있으며, 이미지의 취약점을 식별하기 위한 이미지 스캐닝, AZ 간, 계정간 이미지 복제, 효율적인 이미지 캐시 관리를 위한 풀 스루 기능 등이 있습니다.

그 외에도 AWS 의 ECS, EKS ,Lambda 와 같은 서비스들과 연동이 잘 되어있어서 AWS 를 사용하는 경우에는 ECR 을 사용하는 것이 좋습니다.

## Github Actions

GitHub Actions 는 GitHub 리포지토리 내에서 빌드, 테스트 및 배포 파이프라인을 자동화하는 CI/CD 플랫폼입니다.
예를 들어 특정 브랜치에 push 가 일어나면 테스트를 수행하고, 테스트가 성공하면 배포를 수행하는 등의 작업을 자동화할 수 있습니다.
GitHub 의 주요 기능 중 하나로 사용하기 편리합니다. 퍼블릭 리포지토리에서는 무료로 사용할 수 있습니다.

### 핵심 개념
- 워크플로우 (Workflow): GitHub Actions 내에서 정의된 자동화 절차입니다. .github/workflows 디렉토리에 YAML 파일 형식으로 정의됩니다.
- 이벤트 (Event): 저장소에서 발생하는 특정 활동으로 워크플로우를 시작합니다. 예를 들어, 브랜치에 커밋을 푸시하거나 풀 요청을 생성하는 것이 해당됩니다.
- 작업 (Job): 워크플로우는 하나 이상의 작업을 포함하며, 이는 동일한 러너에서 실행되는 일련의 연결된 단계들로 구성됩니다. 작업은 기본적으로 병렬로 실행되지만, 필요에 따라 순차적으로 실행되도록 설정할 수 있습니다.
- 단계 (Step): 작업 내에서 단계는 명령이나 액션을 실행하는 개별 작업 단위입니다. 단계는 쉘 명령이나 다른 작업 혹은 단계일 수도 있습니다.
- 액션 (Action): 액션은 독립적인 명령으로, 작업을 구성하는데 사용됩니다. 액션은 재사용 가능하며 GitHub 커뮤니티를 통해 생성되고 공유될 수 있습니다.
- 러너 (Runner): 러너는 저장소를 체크아웃하고 워크플로우를 실행하는 서버 기계입니다. GitHub 은 다양한 운영 체제를 갖춘 러너를 제공하며, 사용자가 직접 러너를 호스팅할 수도 있습니다.

## Application 을 AWS ECR 에 Push 해보기.

SpringBoot Application 을 AWS ECR 에 Push 해보는 예제를 진행해보겠습니다.
dockerfile 을 작성할 줄 안다면 어떤 언어로 작성된 애플리케이션도 AWS ECR 에 Push 할 수 있습니다.

### 사전 준비사항

- Application 소스코드
- AWS 계정
- Github 계정
- Dockerfile
- AWS CLI

### Dockerfile

Spring Boot Application 을 Dockerfile 로 빌드해보겠습니다.
이 예제에서는 아래와 같은 환경을 사용합니다.

- Spring Boot 3.2.0 버전입니다.
- 언어는 Kotlin 입니다.
- Gradle 을 사용합니다.
- Java 17 버전을 사용합니다.
- bootJar 설정을 통해 빌드시 생성되는 jar 파일의 이름을 app.jar 로 설정합니다.

Root 디렉토리에 Dockerfile 을 생성하고 아래와 같이 작성합니다.

```dockerfile
# Build stage
FROM gradle:8.5.0-jdk17 AS builder
WORKDIR /build/

# Utilize build cache to avoid re-downloading dependencies
COPY build.gradle.kts settings.gradle.kts ./
RUN gradle build --dry-run --no-daemon

# Copy source code and build the application
COPY src src
RUN gradle build -x test --no-daemon

RUN ls -al

# Package stage
FROM amazoncorretto:17
WORKDIR /app

COPY --from=builder /build/build/libs/app.jar .

EXPOSE 8080

# Copy the built jar file from the build stage

ENTRYPOINT ["java", "-jar", "app.jar"]
```

위 Dockerfile 은 빌드 과정과 패키징을 분리하여 빌드 캐시를 활용하고, 빌드된 jar 파일을 패키징하는 방식입니다.

### Docker Push

위에서 만든 이미지를 여러분의 ECR 에 Push 하여 이미지를 등록할 수 있습니다.
먼저 AWS 콘솔에서 Elastic Container Registry 에 접근하여 원하는 이름의 Repository 를 생성합니다.

AWS CLI 를 통해 리포지토리에 이미지를 push 하기 위해서는 적절한 Policy 를 가진 User 가 필요합니다.
이미지 push 를 위해 유저를 생성하고 Policy(EC2InstanceProfileForImageBuilderECRContainerBuilds) 를 부여합니다.
이 User 의 AccessKey 와 SecretKey 를 발급하고 잘 보관해둡니다.

위에서 만든 User 를 AWS CLI 를 통해 ECR 에 로그인 합니다. 아래 명령어로 로그인 할 수 있습니다.

```sh
aws configure
```

> AWS CLI 가 설치되어 있지 않다면 [AWS CLI 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html) 를 참조해주세요.

그리고 AWS 콘솔 ECR 에서 만든 리포지토리에 들어가게 되면 Command 를 통해 이미지를 푸쉬하는 안내하는 화면이 나옵니다.

```sh
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <accountId>.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag your-image:latest <accountId>.dkr.ecr.ap-northeast-2.amazonaws.com/<repository-name>:latest
docker push <accountId>.dkr.ecr.ap-northeast-2.amazonaws.com/calculator:latest
```

각 명령어는
1. AWS CLI 를 통해 docker 가 ECR 에 로그인하기 위해 필요한 정보를 세팅합니다.
2. 이미지에 태그를 붙입니다.
3. 이미지를 ECR 에 Push 합니다.

리포지토리에 들어갔을 때 정상적으로 이미지가 뜬다면 성공입니다.
실패하더라도 CLI 에서 오류 내용이 나오니 확인해보시면 됩니다.

### Github Actions Workflow

Github Actions 를 통해 Github 에 Push 된 코드를 자동으로 빌드하고, ECR 에 Push 하는 Workflow 를 만들어보겠습니다.

GithubActions 에서는 민감한 정보를 리포지토리 Secrets 에 등록하여 사용할 수 있습니다.
위에서 생성한 계정의 AccessKeyId 와 SecretKey 를 Github Settings 에 있는 Secrets 에 등록합니다.

- AWS_ACCESS_KEY_ID: AWS IAM User 의 AccessKeyId
- AWS_SECRET_ACCESS_KEY: AWS IAM User 의 SecretAccessKey

Github Actions 는 .github/workflows 디렉토리 아래 *.yml 파일에 정의됩니다.
이 예제에서는 image-push.yml 파일을 생성하고 아래와 같이 작성합니다.

```yaml
name: Docker

on:
  push:
    branches:
      - 'docker-test'
  pull_request:
    branches:
      - 'docker-test'
concurrency:
  group: ${{ github.ref }}
  cancel-in-progress: true

env:
  AWS_REGION: ap-northeast-2
  REPOSITORY: <your-repository>

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Log into Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3.0.0

      - name: Build and push Docker image
        id: build-and-push
        uses: docker/build-push-action@v5.0.0
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        with:
          context: .
          push: true
          tags: ${{ env.ECR_REGISTRY }}/${{ env.REPOSITORY }}:${{ env.IMAGE_TAG }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max


```

여러분이 작성한 코드를 Github 에 Push 하면 위의 Workflow 가 실행됩니다. Workflow 는 Github 의 Actions 탭에서 진행을 확인할 수 있습니다.

위의 각 step 에 대한 설명은 아래와 같습니다.
- Checkout repository: Github 에서 코드 및 메타데이터를 가져옵니다.
- Configure AWS credentials: AWS CLI 를 사용하기 위해 AWS 계정 정보를 설정합니다.
- Log into Amazon ECR: AWS ECR 에 로그인합니다.
- Set up Docker Buildx: Docker Buildx 를 설정합니다.
- Build and push Docker image: Docker 이미지를 빌드하고 ECR 에 Push 합니다.

Actions 에 대해 더 알아보고 싶다면 [Github Actions 문서](https://docs.github.com/en/actions) 를 참조해주세요.
각 step 에서 사용되는 Action(uses 에 명시된) 들에 대해서는 [Github Marketplace](https://github.com/marketplace) 에서 확인할 수 있습니다.


