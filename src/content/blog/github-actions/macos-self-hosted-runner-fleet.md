---
title: '남는 맥북을 GitHub Actions 빌드 머신으로 만들었다'
pubDate: 2026-08-02
description: '남는 Apple Silicon Mac 여러 대를 GitHub Actions self-hosted runner로 구성하고, 로컬 캐시를 활용해 반복 빌드를 개선하며 겪은 시행착오를 기록했다.'
heroImage: '../../../assets/heroes/macos-self-hosted-runner-fleet.jpeg'
heroImageAlt: '배경을 흐리게 처리한 여러 대의 Apple Silicon Mac 빌드 플릿 대표 이미지'
lang: 'ko'
category: 'tech'
series: 'devops-lab'
seriesOrder: 2
tags:
  - github-actions
  - self-hosted-runner
  - macos
  - buildkit
  - cicd
---

결과부터 말하면, 남아 있던 Apple Silicon Mac 여러 대를 작은 GitHub Actions 빌드 플릿으로 구성했다.

반복적인 Docker 이미지 빌드와 모바일 앱 빌드, 테스트 환경 검증 같은 작업을 맡겼다.

시작은 팀에서 남는 노트북의 활용 방법을 이야기하면서였다. AI 실험용 장비, 상시 테스트 환경, 빌드 머신 같은 후보가 나왔다.

주말 동안 개인 노트북으로 몇 가지를 직접 테스트해 봤다.

AI 모델을 로컬에서 실행하는 방식은 장비 사양에 비해 실용성이 낮았다. 상시 테스트 환경도 의미가 있었지만, 반복적으로 실행되는 CI 작업을 옮기는 편이 가장 직접적인 도움이 됐다.

이미 반복적으로 실행되는 작업이었고 hosted runner 사용 비용도 발생하고 있었다. 무엇보다 self-hosted runner에서는 로컬 디스크를 유지할 수 있으니 빌드 캐시를 활용할 수 있었다.

처음에는 남는 맥북에 GitHub Actions Runner만 설치하면 끝날 줄 알았다.

실제로 해보니 아니었다.

이 작업은 남는 노트북을 재활용하는 일이 아니라, 작은 CI 인프라를 직접 운영하는 일이었다.

## 작은 실험이 플릿이 되기까지

| 단계 | 진행한 일 |
| --- | --- |
| 후보 검토 | 남는 장비로 할 수 있는 작업을 비교 |
| 단일 장비 실험 | self-hosted runner와 반복 빌드 가능성 확인 |
| 환경 표준화 | 여러 Mac에 모바일과 Docker 빌드 환경 구성 |
| 테스트 환경 검증 | 이미지 빌드부터 배포 확인까지 제한된 경로 검증 |
| 운영 준비 | 캐시, 장애 복구, 보안, 저장 공간 원칙 정리 |

한 대로 테스트할 때와 여러 대를 공용 장비로 운영할 때는 고민해야 하는 문제가 완전히 달랐다.

한 대에서는 “빌드가 되는가”만 보면 됐다.

여러 대에서는 다음 질문에 답해야 했다.

- 어떤 작업을 어떤 Mac에 배정할 것인가?
- 다른 Mac에 배정돼도 캐시를 재사용할 수 있는가?
- Docker가 죽었는데 Runner만 Online이면 어떻게 할 것인가?
- 이전 빌드의 인증 정보가 머신에 남지는 않는가?
- 모든 Mac이 사용 중이면 어떻게 복구할 것인가?
- 캐시가 계속 쌓여 디스크를 가득 채우지는 않는가?
- iOS 인증서와 Keychain 상태를 실행마다 어떻게 원복할 것인가?

이때부터 노트북은 더 이상 그냥 노트북이 아니었다.

## 왜 GitHub Actions였나

남는 장비를 활용한다는 관점에서만 보면 할 수 있는 일은 많다.

Local LLM을 실행할 수도 있고, 모니터링 서버나 개발용 Kubernetes 클러스터를 만들 수도 있다.

하지만 이번에는 세 가지 기준을 두었다.

1. 지금 팀이 반복적으로 비용을 내고 있는 작업인가?
2. 남는 Mac의 특성을 잘 활용할 수 있는가?
3. 운영 부담보다 얻는 효과가 큰가?

GitHub Actions는 세 조건에 모두 잘 맞았다.

GitHub-hosted runner는 깨끗한 환경을 매번 제공한다. 직접 관리할 필요가 없고, 이전 실행의 상태가 다음 실행을 오염시키지 않는다는 장점이 있다.

하지만 실행할 때마다 새로운 환경에서 의존성을 내려받고, 소스를 컴파일하고, Docker layer를 다시 구성해야 한다.

반면 self-hosted runner는 우리가 직접 관리해야 하지만 디스크가 유지된다.

이 차이가 중요했다.

특히 우리 프로젝트처럼 Gradle, Kotlin, KSP, Docker BuildKit을 함께 사용하는 환경에서는 이전 빌드 결과를 안전하게 유지할 수만 있다면 반복 빌드에서 줄일 수 있는 시간이 많았다.

그리고 macOS 장비는 Android 빌드뿐 아니라 Xcode가 필요한 iOS 빌드에도 사용할 수 있다.

이미 가지고 있는 Apple Silicon Mac을 활용한다면 별도의 장비 구매 없이 다음 작업을 한 플릿에서 처리할 수 있었다.

- macOS ARM64 작업
- Android 빌드
- Xcode 기반 iOS 빌드
- Colima 기반 Linux ARM64 Docker 이미지 빌드
- 테스트 환경 검증

## 여러 Mac을 하나의 플릿으로 묶었다

모든 Mac은 GitHub 조직의 공용 Runner group에 등록했다.

일반적인 작업은 다음 조건으로 Runner를 선택한다.

```yaml
runs-on:
  group: <runner-group>
  labels:
    - self-hosted
    - macOS
    - ARM64
    - <capability-label>
```

처음에는 Android, iOS, Docker 용도를 각각 별도 라벨로 나누려고 했다.

하지만 모든 장비가 공통 작업을 실행할 수 있도록 구성하고 나니 기능별 라벨은 Runner를 구분하지 못했다. 워크플로만 복잡해질 뿐이었다.

그래서 공통 기능은 하나의 라벨로 묶고, 메모리가 많이 필요한 Docker 빌드만 최소 자원 라벨을 추가하도록 했다.

자원이 많이 필요한 작업에는 장비 모델 대신 최소 자원 등급을 뜻하는 라벨을 추가했다.

```yaml
runs-on:
  group: <runner-group>
  labels:
    - self-hosted
    - macOS
    - ARM64
    - <capability-label>
    - <resource-tier-label>
```

정확한 Mac 모델이나 전체 메모리를 워크플로에서 지정하지 않았다.

워크플로가 알아야 하는 것은 정확한 장비 모델이 아니라 “이 작업에 필요한 최소 자원을 제공할 수 있는가”이기 때문이다.

이렇게 해야 나중에 새로운 Mac을 추가하거나 기존 장비를 교체해도 워크플로를 수정하지 않아도 된다.

## macOS 위에서 Linux Docker 이미지를 빌드하기

일부 백엔드 작업은 Linux ARM64 Docker 이미지를 만든다.

macOS에서 Docker를 실행하기 위해 각 Mac에 Colima를 구성했다.

전체 경로는 대략 다음과 같다.

```text
GitHub Actions
        │
        ▼
macOS ARM64 self-hosted runner
        │
        ├── Xcode
        ├── Android SDK
        └── Colima
                │
                ▼
        Linux ARM64 VM
                │
                ▼
        Docker Buildx / BuildKit
                │
                ▼
          private registry
                │
                ▼
      test deployment platform
```

이 구조에서는 모든 작업을 macOS로 옮길 수 있는 것은 아니다.

GitHub Actions의 `container:` 또는 `services:`가 필요한 작업은 별도의 Linux runner가 더 적합할 수 있다. 이미 안정적으로 동작하는 플랫폼 의존 작업도 처음부터 무리해서 옮기지 않았다.

이번 실험에서는 이미지 build, push, 테스트 배포처럼 Mac의 장점을 확인할 수 있는 제한된 경로만 옮겼다. 다른 작업은 기존 경로에 남겨 경계를 단순하게 유지했다.

처음부터 모든 것을 한 번에 바꾸기보다, Mac의 장점을 실제로 얻을 수 있는 범위만 먼저 옮겼다.

## 운영 적용 전 테스트 환경부터 시작했다

처음부터 운영 배포를 self-hosted runner로 바꾸지는 않았다.

기존 운영 경로는 그대로 두고 테스트 환경의 제한된 워크플로만 분리했다.

```text
운영 환경
└── 기존의 검증된 배포 경로 유지

테스트 환경
└── macOS self-hosted runner
    ├── Docker build
    ├── private registry push
    ├── 테스트 배포
    └── 배포 검증
```

이렇게 나눈 이유는 간단했다.

빌드가 한 번 성공한 것과 운영 가능한 것은 다르기 때문이다.

Mac이 재부팅됐을 때도 복구되는지, 다른 Mac에 배정됐을 때 어떻게 동작하는지, 캐시가 잘못된 산출물을 재사용하지 않는지 확인해야 했다.

또한 build, push, deploy는 가능한 한 하나의 job에 묶었다.

self-hosted job을 여러 개로 분리하면 각 job이 서로 다른 Mac에 배정될 수 있다. 그러면 중간 산출물을 artifact로 올렸다가 다시 내려받아야 하고, 같은 Runner의 로컬 상태를 이용한다는 장점도 줄어든다.

모바일 빌드도 같은 이유로 최종 패키징까지 하나의 job에서 연속으로 처리했다.

## 진짜 목적은 캐시였다

단순히 GitHub-hosted runner를 self-hosted runner로 바꾸는 것만으로도 사용 중인 Runner 비용 일부를 줄일 수 있다.

하지만 개발자가 직접 체감하는 차이는 빌드 속도에서 나왔다.

GitHub-hosted runner에서는 다음 실행이 시작되면 이전 실행의 로컬 상태가 없다.

self-hosted runner에서는 선택적으로 상태를 남길 수 있다.

우리가 남기고 싶었던 것은 다음과 같았다.

| 캐시 | 재사용하려는 것 |
| --- | --- |
| BuildKit cache | 변경되지 않은 Docker layer |
| Gradle User Home | 내려받은 dependency와 Gradle 상태 |
| 프로젝트 `.gradle` | task history와 증분 빌드 상태 |
| Kotlin build output | 변경되지 않은 Kotlin compile 결과 |
| KSP output | 변경되지 않은 generated source |
| Ruby bundle cache | iOS 빌드에 사용하는 gem |

Docker BuildKit은 이름이 고정된 persistent builder를 사용했다.

```yaml
- uses: docker/setup-buildx-action@v4
  with:
    name: <persistent-builder>
    driver: docker-container
    keep-state: true
```

여기서 중요한 점이 하나 있었다.

Mac에 persistent builder가 존재한다고 해서 워크플로가 자동으로 그 캐시를 사용하는 것은 아니었다.

`docker/setup-buildx-action`이 만든 builder를 실제 이미지 빌드 단계에 명시적으로 전달해야 했다. 워크플로가 매번 새로운 builder를 만들거나 기본 builder로 빠지면, 호스트에 남아 있는 캐시는 아무 의미가 없었다.

## 증분 빌드와 오래된 산출물은 함께 남는다

프로젝트의 `.gradle`과 `build` 디렉터리를 남기면 Kotlin과 KSP의 증분 빌드를 이어갈 수 있다.

대신 새로운 문제가 생긴다.

이전 실행의 JAR이 남아 있을 수 있다.

캐시를 활용하겠다고 workspace 전체를 그대로 남기면, 빌드가 일부 실패했는데도 이전에 만들어진 JAR이 Docker context에 들어갈 가능성이 있다.

그래서 증분 빌드 상태와 최종 배포 산출물을 분리했다.

빌드를 시작하기 전에는 기존 실행 JAR을 삭제한다. 빌드가 끝난 뒤에는 다음 조건을 확인한다.

- 실행 가능한 JAR이 정확히 하나인가?
- `plain.jar`가 아닌가?
- 파일 크기가 0보다 큰가?
- Spring Boot application class를 포함하는가?
- 최종 산출물의 SHA-256을 기록했는가?

캐시된 중간 결과는 재사용하지만, 실제 배포할 산출물은 매번 다시 만들고 검증한다.

캐시를 쓰는 것보다 어떤 상태까지 믿을 것인지 정하는 일이 더 중요했다.

## 캐시는 남기고, 인증 흔적은 지운다

self-hosted runner는 실행이 끝나도 머신이 초기화되지 않는다.

이것이 성능 측면에서는 장점이지만, 보안 측면에서는 가장 큰 위험이기도 하다.

그래서 운영 원칙을 한 문장으로 정리했다.

> 캐시는 남기고, 인증 흔적은 지운다.

남기는 것과 지우는 것을 명확하게 구분했다.

| 남기는 것 | 실행마다 지우는 것 |
| --- | --- |
| BuildKit layer cache | registry 로그인 정보 |
| Gradle dependency cache | 임시 cloud 인증 정보 |
| Kotlin/KSP 증분 상태 | package manager 인증 파일 |
| Android SDK와 tool cache | 임시 모바일 서명 정보 |
| Ruby bundle cache | 실행 중 변경한 서명 환경 상태 |
| 검증된 공용 빌드 도구 | 이번 실행에서 만든 임시 파일 |

인증 파일은 작업별 임시 영역에 만들고, 성공 여부와 상관없이 종료 단계에서 삭제하도록 했다.

Registry 로그인도 job 범위를 벗어나지 않도록 격리했다.

Runner에는 개인 계정을 저장하지 않고, 빌드에 필요한 최소한의 서명 정보만 실행 시점에 전달했다.

신뢰하지 않은 코드는 persistent runner에서 실행하지 않고, 격리된 일회성 환경으로 분리해야 한다.

깨끗한 VM이 아닌 장비에서는 “어떤 코드를 실행하게 허용할 것인가”도 캐시만큼 중요한 문제였다.

## 캐시는 많을수록 빠르다고 생각했다

Runner가 여러 대라면 한 가지 문제가 생긴다.

첫 번째 빌드와 다음 빌드가 서로 다른 Mac에 배정되면 앞선 장비의 로컬 BuildKit 캐시는 사용할 수 없다.

처음에는 이 문제를 해결하기 위해 GitHub Actions cache에 BuildKit layer를 `mode=max`로 저장했다.

저장소, 브랜치, 플랫폼처럼 안전하게 분리할 수 있는 범위도 함께 검토했다.

이 방식은 다른 Mac에 배정돼도 공용 layer cache를 가져올 수 있다는 장점이 있었다.

실제 테스트에서도 같은 입력을 반복한 빌드는 cache 단계와 최종 이미지 단계가 모두 유의미하게 짧아졌다.

그런데 모든 빌드에서 이 방식이 더 빠른 것은 아니었다.

이미 각 Mac의 BuildKit이 로컬 상태를 유지하고 있는데도 매번 큰 layer를 GitHub Actions cache에서 가져오고 다시 올리면, 원격 전송 시간이 빌드에서 아낀 시간보다 커질 수 있었다.

캐시를 추가했는데 배포가 오히려 느려지는 실행도 나왔다.

결국 작업 특성에 따라 로컬 캐시와 원격 캐시의 역할을 나눴다.

```text
자주 실행되는 작업
└── Runner-local persistent cache 우선

초기화된 환경이나 보조 경로
└── 필요한 범위만 원격 cache 사용
```

Runner-local cache를 우선하는 경우에는 각 Mac이 한 번씩 warm-up하는 비용을 받아들여야 한다.

자주 실행되는 저장소라면 각 Runner의 로컬 캐시는 자연스럽게 따뜻해진다. 반대로 실행 빈도가 낮거나 매번 다른 Runner에 배정되는 작업이라면 GHA cache가 더 유리할 수도 있다.

캐시는 많을수록 좋은 것이 아니었다.

캐시는 저장하는 기술이 아니라, 어디에 두고 어느 범위까지 재사용할지 결정하는 기술에 가까웠다.

## Runner가 Online이라고 빌드 가능한 것은 아니었다

운영하면서 가장 위험한 상태는 GitHub에서는 Runner가 `Online`인데 실제로는 Docker 빌드를 수행할 수 없는 상태였다.

Runner 프로세스는 살아 있지만 컨테이너 런타임이나 builder가 준비되지 않았을 수 있다.

이 상태에서 job이 배정되면 checkout까지 진행한 뒤 Docker 단계에서 실패한다.

그래서 listener 상태만 보지 않고 컨테이너 런타임과 builder의 readiness도 함께 확인해야 했다.

복구 작업은 실행 중인 job을 먼저 확인해야 한다. 빌드 중인 Runner를 자동 복구한다는 이유로 재시작하면 장애를 고치는 것이 아니라 정상적인 빌드를 중단시키게 된다.

각 Mac은 무인 작업 중 잠들지 않도록 전원 정책을 조정했다.

하지만 절전 설정만으로 무인 운영이 보장되는 것은 아니었다.

재부팅 후에는 runner와 빌드 런타임이 모두 준비됐는지 장비별로 확인해야 했다.

설정 파일이 존재하는 것과 실제 빌드가 가능한 것은 달랐다.

마지막에는 항상 테스트 workflow를 실행해 확인했다.

## 디스크도 운영 대상이었다

캐시는 계속 쌓인다.

GitHub-hosted runner에서는 job이 끝나면 신경 쓰지 않아도 되던 문제다. 하지만 persistent runner에서는 Gradle, Docker, BuildKit, Android SDK, Xcode, Ruby cache가 모두 로컬 디스크를 사용한다.

무작정 정리하면 빌드 속도를 위해 남긴 캐시를 모두 잃는다.

반대로 아무것도 지우지 않으면 언젠가는 디스크가 가득 찬다.

그래서 정리 순서를 정했다.

1. 오래 사용하지 않은 tool version
2. 크기가 큰 미사용 캐시
3. BuildKit의 GC 대상
4. 완료된 workspace와 명시적인 임시 파일

Docker named volume이나 Colima VM 전체를 자동으로 지우지는 않았다.

그리고 실행 중인 job이 있으면 정리 작업도 수행하지 않았다.

캐시를 유지한다는 것은 삭제하지 않는 것이 아니라, 삭제 정책까지 관리한다는 의미였다.

## 초기 결과

아직 전체 저장소에 대한 장기간의 p50, p95 통계를 수집한 것은 아니다.

그래도 초기 실행에서 테스트 환경의 빌드·배포 경로가 동작하고, 같은 Runner에서 반복 실행할 때 캐시가 빌드 시간을 유의미하게 줄이는 것을 확인했다.

다만 이 결과만 보고 “빌드가 몇 퍼센트 빨라졌다”고 단정하기는 어렵다.

Runner가 달라질 수 있고, cold cache와 warm cache의 차이도 있으며, 변경된 소스와 네트워크 상태에 따라서도 결과가 달라진다.

모바일 빌드도 초기에는 특정 Mac에 실행이 집중됐다. 다른 Mac에서 동일한 조건으로 반복했을 때도 같은 경향이 나오는지 더 확인해야 한다.

현재 확인한 것은 다음 정도다.

- 제한된 테스트 배포 경로가 동작한다.
- 같은 Runner에서 반복 실행될 때 캐시가 유의미하게 작동한다.
- 모바일 빌드도 기존 hosted 경로보다 빨라질 가능성이 있다.
- 여러 Runner를 운영할 때는 cache hit보다 Runner 배정과 cache topology가 더 중요할 수 있다.

## 비용 절감과 빌드 속도 개선은 같은 효과가 아니다

처음에는 두 효과를 하나로 생각했다.

하지만 정리해 보면 서로 다른 문제였다.

### CI/CD 비용 절감

GitHub-hosted 또는 Large Runner에서 실행하던 작업을 이미 보유한 self-hosted 장비로 옮기면 GitHub Actions의 Runner 사용 비용을 줄일 수 있다.

### 빌드 속도 개선

self-hosted runner의 persistent disk를 활용해 BuildKit, Gradle, Kotlin, KSP 상태를 재사용하면 개발자가 결과를 기다리는 시간을 줄일 수 있다.

빌드가 빨라지면 같은 장비로 더 많은 작업을 처리할 수 있다. Runner가 부족해 hosted fallback을 사용하는 횟수도 줄일 수 있다.

다만 self-hosted runner가 공짜라는 뜻은 아니다.

이미 보유한 장비라 추가 구매 비용은 없었지만, 다음 비용은 계속 발생한다.

- 전기
- 네트워크
- 장비 고장과 교체
- macOS와 Xcode 업데이트
- Runner와 Docker 운영
- 장애 대응
- 보안 관리
- 내가 이 작업에 사용한 시간

따라서 실제 월간 절감액은 다음과 같이 계산해야 한다.

```text
월간 절감액
=
전환한 hosted runner 사용 금액
-
전기·장비·운영 비용
```

현재 단계에서는 “얼마를 절감했다”고 쓰기보다, 비용이 발생하던 작업을 self-hosted 경로로 옮길 수 있다는 것을 검증했다고 쓰는 편이 정확하다.

## 설치보다 운영이 더 오래 걸렸다

Runner 설치 자체는 어렵지 않았다.

GitHub에서 등록 토큰을 받고 Runner를 실행하면 job은 배정된다.

시간이 많이 든 것은 그 이후였다.

- 여러 장비의 환경을 동일하게 맞추기
- 안전한 원격 관리 방식 마련하기
- macOS의 sleep과 재부팅 처리
- 컨테이너 런타임 복구 정책 세우기
- persistent builder 상태 관리하기
- Xcode와 Android SDK 설치
- 모바일 서명 정보 정리
- 캐시와 디스크 사용량 관리
- 신뢰하지 않은 코드의 실행 경계 설정
- Runner가 바뀌어도 산출물이 동일한지 검증
- fleet 장애 시 보조 실행 경로 마련
- 개발자가 사용할 수 있는 문서 작성

특히 iOS는 Mac만 있다고 바로 되는 것이 아니었다.

도구 버전 선택, 서명 환경 원복, 임시 서명 정보 정리까지 실행 단위로 관리해야 했다.

persistent runner에서는 한 번의 실행이 남긴 상태가 다음 실행을 방해할 수 있다.

GitHub-hosted runner에서는 플랫폼이 대신 처리해 주던 일을 우리가 직접 책임지게 된 것이다.

## 지금 다시 시작한다면

다시 한다면 처음부터 여러 대를 한꺼번에 세팅하지는 않을 것 같다.

먼저 한 대와 하나의 테스트 workflow로 다음 항목부터 측정할 것이다.

- cold build 시간
- warm build 시간
- dependency 변경 시 빌드 시간
- source만 변경했을 때 빌드 시간
- cache import와 export 시간
- 전체 workflow 시간
- GitHub-hosted runner 비용
- queue time
- 디스크 증가량
- 장애와 수동 개입 횟수

그다음 다음 순서로 확대하는 편이 좋다.

1. 한 대에서 build-only 검증
2. 테스트 환경 배포 검증
3. 캐시 정합성 검증
4. 인증 정보 cleanup 검증
5. 재부팅과 Docker 장애 복구 검증
6. 다음 Runner 추가
7. Runner 변경 시 cold cache 동작 확인
8. fleet 전체 확대
9. 운영 환경 적용 판단

캐시 정책도 먼저 정해야 한다.

“가능한 모든 캐시를 켠다”가 아니라 다음 질문에 답해야 한다.

- 캐시의 소유자는 Runner인가, 저장소인가?
- 다른 Runner와 공유해야 하는가?
- 원격 전송 비용보다 재사용 효과가 큰가?
- 어떤 브랜치와 플랫폼 사이에서 공유할 수 있는가?
- 인증 정보가 포함될 수 있는 layer는 무엇인가?
- 오래된 산출물이 배포되지 않는다는 것을 어떻게 증명할 것인가?

이 질문 없이 캐시 옵션만 추가하면 더 빠른 빌드가 아니라 더 복잡하고 느린 빌드가 될 수 있다.

## 남는 맥북은 결국 작은 빌드 플릿이 됐다

처음 질문은 단순했다.

> 남는 맥북으로 뭘 하면 좋을까?

지금은 질문이 조금 달라졌다.

> 이 작은 빌드 플릿을 얼마나 빠르고, 안전하고, 예측 가능하게 운영할 수 있을까?

남는 하드웨어를 다시 활용했다는 점도 좋지만, 더 의미 있었던 것은 매번 초기화되던 빌드 환경에 우리가 통제할 수 있는 지속적인 상태를 만들었다는 점이다.

그 상태 덕분에 캐시를 활용할 수 있었고, 일부 hosted 작업을 대체할 수 있었으며, 서로 다른 빌드 작업을 하나의 공용 플릿으로 묶을 수 있었다.

대신 캐시, 보안, 장애 복구, 디스크, 인증서까지 직접 책임지게 됐다.

self-hosted runner는 단순히 저렴한 Runner가 아니었다.

관리 책임을 비용과 성능으로 교환하는 선택에 가까웠다.

정확한 비용 효과와 장기간의 빌드 통계는 더 모아야 한다.

그래도 지금은 남는 Mac들이 조용히 빌드하고 있다.
