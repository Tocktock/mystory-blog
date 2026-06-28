---
title: '2. NestJS 블로그 만들기 - CRUD 로 시작하자.'
pubDate: 2021-01-22T03:27:16.863Z
description: '저는 NestJS 전문가가 아닙니다.저 또한 NestJS 로 어플리케이션을 만들려고 한지 한달이 채 되지 않았습니다.다만 제가 공부하면서 습득하고 이해한 내용을 바탕으로 간단한 어플리케이션을 만들며 기본적인 지식을여러분께 같이 공유하는 것이 제 목적입니다.대부분의 정보'
heroImage: '../../../assets/heroes/nestjs-logo.png'
category: 'tech'
series: 'nestjs-blog'
seriesOrder: 2
tags:
  - nestjs
---

---

## 👌 NestJS 블로그 만들기 시리즈의 목적

저는 **NestJS 전문가**가 아닙니다.
저 또한 NestJS 로 어플리케이션을 만들려고 한지 한달이 채 되지 않았습니다.

다만 제가 공부하면서 습득하고 이해한 내용을 바탕으로 간단한 어플리케이션을 만들며 기본적인 지식을
여러분께 같이 **공유**하는 것이 제 목적입니다.

대부분의 정보는 **NestJS Doc** , **Github** 를 참고하고 있습니다.

이 시리즈는

- CRUD 기능
- Postgresql DataBase 연결
- Auth
- 메시지 큐
- 기타 기능 (카톡 공유, 카톡으로 로그인하기 등)

의 내용을 다룰 것 입니다.

사용하는 IDE 는 **VSCode** 입니다.

> 이후 추가할 사항이나 유용한 팁이 있다면 더 추가하겠습니다.

궁금한 사항이나 제가 틀렸다고 생각하는 부분이 있다면 언제든 피드백 해주세요.

---

## 🛴 NestJS 어플리케이션 시작하기.

NestJS 는 Javascript 기반 Typescript 언어를 주로 다룹니다.
Javascript 환경을 위해서 Node.js 가 설치되어 있는지 먼저 확인해주세요.

> [Node.js 설치하기](https://nodejs.org/en/)

NestJS 설치를 위해 다음 명령어를 터미널에서 실행해주세요.

    $ npm i -g @nestjs/cli

설치가 정상적으로 되었다면 이제 프로젝트 폴더를 만들어 봅시다. project-name 은 원하시는데로 하면 됩니다.
저희는 nestjs-practice 라고 지어보죠.

    $ nest new nestjs-practice

패키지 매니저는 npm 을 사용하겠습니다. (그대로 엔터 눌러주면 됩니다.)

## 👓구조 살펴보기

    src
      app.controller.spec.ts
      app.controller.ts
      app.module.ts
      app.service.ts
      main.ts

src 폴더에는 앱의 코드들이 모여있다고 생각하시면 됩니다.
각 역할을 보자면

- app.controller.**spec**.ts : spec 이 붙은 파일들은 **테스트 파일**입니다. 지금은 무시하셔도 됩니다.
- app.**controller**.ts : 앱의 request 와 response 를 담당하는 **라우팅** 관련 파일입니다.
- app.**module**.ts : 앱을 구성하는 **구조**의 메타데이터를 담당하는 파일입니다.
- app.**service**.ts : 앱의 **비지니스 로직**을 담당하는 파일입니다.

앞으로 모든 앱의 구성요소들은 위와 같은 형태로 만들어질거에요!!

최상의 폴더의 다른 파일들은 구성 요소를 담당하는 녀석이에요.
예를 들면 typescript 환경설정 파일 또는 패키지 의존성 관리파일 같은 것들이에요.!!

## 🔨기능 만들어보기

**nest cli** 는 정말 유용한 기능들을 많이 지원합니다.
**nest generate** 기능을 이용하면 자주 사용하는 용도의 템플릿을 생성할 수 있습니다.
다음은 **nest generate | g** 를 이용해 만들 수 있는 명령어들입니다.

      ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
      │ name          │ alias       │ description                                  │
      │ application   │ application │ Generate a new application workspace         │
      │ class         │ cl          │ Generate a new class                         │
      │ configuration │ config      │ Generate a CLI configuration file            │
      │ controller    │ co          │ Generate a controller declaration            │
      │ decorator     │ d           │ Generate a custom decorator                  │
      │ filter        │ f           │ Generate a filter declaration                │
      │ gateway       │ ga          │ Generate a gateway declaration               │
      │ guard         │ gu          │ Generate a guard declaration                 │
      │ interceptor   │ in          │ Generate an interceptor declaration          │
      │ interface     │ interface   │ Generate an interface                        │
      │ middleware    │ mi          │ Generate a middleware declaration            │
      │ module        │ mo          │ Generate a module declaration                │
      │ pipe          │ pi          │ Generate a pipe declaration                  │
      │ provider      │ pr          │ Generate a provider declaration              │
      │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
      │ service       │ s           │ Generate a service declaration               │
      │ library       │ lib         │ Generate a new library within a monorepo     │
      │ sub-app       │ app         │ Generate a new application within a monorepo │
      │ resource      │ res         │ Generate a new CRUD resource                 │
      └───────────────┴─────────────┴──────────────────────────────────────────────┘

예들 들면

    nest g module catiscute

위 명령어는 catiscute 라는 모듈을 자동으로 생성해줍니다. 어때요 정말 유용하죠? !!

자아아아 저기 저기 **CRUD** 보이시나요? **resource** 라는 명령어를 이용하시면 CRUD 에 필요한 템플릿을 얻을 수 있습니다.!!!!!
우후 ~ 박수박수 진짜 어메이징 합니다. 여러분 이 명령어로 바로 템플릿 얻는 거는 진짜 놀라운거에요!!

이제 users 라는 CRUD 기능을 만들어보죠.

    nest g res users

를 입력해봅시다. 와우 폴더 보이시나요?? !! 보이시나요!!!
한 가지 더 말하자면 **app.module.ts** 파일에 자동으로 **UsersModule** 이 추가되었습니다.!!!
와 **미쳐따 미쳐따**... 진짜 편리하다 ... 🙀

우리는 이제 유저에 관한 기본적인 CRUD 기능을 수행할 수 있습니다. 우후~

한 번 앱을 실행해볼까요??

    npm run start

어랏 ?!?!? 저는 이런 에러가 떳습니다. nest 가 생성해준 파일에 우리가 설치하지 않은 node 모듈이 있나보네요!!

    1 import { PartialType } from '@nestjs/mapped-types';
                                  ~~~~~~~~~~~~~~~~~~~~~~

다음 명령어를 통해 설치해주자구요!!

    npm install @nestjs/mapped-types --save

설치가 되면 다시

    npm run start

유후~ 이번엔 에러가 없습니다!!!!! 로그를 보시면

    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [NestFactory] Starting Nest application...
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [InstanceLoader] AppModule dependencies initialized +24ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [InstanceLoader] UsersModule dependencies initialized +2ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RoutesResolver] AppController {}: +8ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RouterExplorer] Mapped {, GET} route +4ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RoutesResolver] UsersController {/users}: +1ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RouterExplorer] Mapped {/users, POST} route +0ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RouterExplorer] Mapped {/users, GET} route +9ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RouterExplorer] Mapped {/users/:id, GET} route +0ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RouterExplorer] Mapped {/users/:id, PUT} route +1ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [RouterExplorer] Mapped {/users/:id, DELETE} route +0ms
    [Nest] 35604   - 2021-01-22 11:31:13 ├F10: AM┤   [NestApplication] Nest application successfully started +2ms

**RouteExplorer** 를 보시면 **users** 에 관련된 매핑들을 볼 수 있습니다!!

이제 편하신 브라우저를 키시고 <http://localhost:3000> 로 접속하시면!!

> 아무런 설정 안하셨으면 앱의 기본 포트는 3000 입니다!!

**Hello World!**
사실 이 페이지를 보는게 목적이 아니기 때문에 링크 뒤에 /users 를 입력해봅시다

가보자구요!! <http://localhost:3000/users>
**This action returns all users**

가보자구요!! <http://localhost:3000/users/1>
**This action returns a #1 user**

모야모야~ 벌써 된거야? 우리 뭐 한것도 없는데??

nest 정말 편한 기능들이 많습니다. 다만 우리가 원하는건 단순히 저런 문자가 아니라 진짜 유저 정보겠죠?

다음 시간에는 데이터베이스에 연결해서 진짜 유저 정보를 만들고 가져오고 수정하고 삭제하고를 배워보겠습니다.

## 🔨 좀 더 살펴보기

자 근데 우리 여기서 마치면 좀 찝찝하잖아요? 그러셔야 합니다. 그럴거에요. 그래서 준비했습니다!!

코드와 구조를 조금 더 살펴보겠습니다.

    users
        │  users.controller.spec.ts
        │  users.controller.ts
        │  users.module.ts
        │  users.service.spec.ts
        │  users.service.ts
        │
        ├─dto
        │      create-user.dto.ts
        │      update-user.dto.ts
        │
        └─entities
                user.entity.ts

**spec** 이 붙은 파일은 **테스트 파일**입니다. 다음에 테스트 할 때 살펴보겠습니다!

dto 에 관한 내용과 entities 에 관한 내용은 다음번에 데이터베이스 연결하고 알아보겠습니다.

그럼 service, controller, module 에 대해서 한번 살펴보죠.

#### 🍔Service

**Service** 파일은 비지니스 로직을 처리하는 파일이라고 했습니다. **UserService** 클래스 안을 살펴 보시면
create, findAll, findOne, update, remove 함수들이 있습니다.
여기서 리턴하는 문자열이 우리가 브라우저에서 본 문자들이죠?

그리고 클래스 위에 **@Injectable()** 이라는 **Decorator** 가 있습니다.

> Decorator 는 기능을 확장할 때 쓰일 수 있는 디자인 패턴입니다.
> [데코레이터 패턴이 뭔가요?](https://www.typescriptlang.org/docs/handbook/decorators.html)

Injectable 데코레이터는 다른 클래스에 **constructor** 를 통해 이 클래스를 Inject 하기 위한 데코레이터로 **DI(Dependency Injection)** 기능을 사용하기 위해 쓰입니다.

Controller 파일을 보면 더 이해가 잘 될겁니다!

#### 🌭Controller

**Controller** 파일은 **라우팅**을 처리하는 파일입니다.
일단 UsersController 클래스 안에 constructor 를 보시면. **userService** 의 **타입만 지정**했습니다.

그럼에도 불구하고 create 함수에서 이 **this.userService.create 를 호출**하고 있는데요.

이게 어떻게 가능한 것이냐면 바로 **Nest 의 훌륭한 DI 시스템** 때문입니다.

> DI 는 간단하게 NestJS 의 틀에 맞게 우리가 어떤 값을 지정해주면 NestJS 가 알아서 컨트롤 해주는 기능입니다.우리 UserService 부분에서 Injectable 데코레이터를 통해 UserService 를 Injectable 한 provider 로 지정했습니다.따라서 UserController 클래스 내의 constructor 에서 단순히 userService 의 타입을 UserService 로 지정해줌으로서NestJS가 알아서 this.userService 의 **생성과 소멸을 관리**하게 됩니다.

와 미쳐따 미쳐따!!! 정말 편하다!!

아직 몇 가지 더 봐야할 것이 있습니다.

바로 **@Controller** 데코레이터 입니다. 데코레이터에서 "users" 라고 지정해주고 있습니다. 이 말은 바로!

**/users 라는 주소로 요청이 들어오면 이 클래스에서 처리하겠다**

라는 뜻입니다. 우리는 UserController 를 app 모듈에 갔다 붙였으니 주소는 localhost:3000/users 가 되겠죠??.

이후 UsersController 내의 함수를 보면

@Post, @Get, @Put, @Delete 데코레이터들이 보입니다.

이름에서도 유추할 수 있듯이 **/users 에 해당하는 메서드로 들어오면 이 함수에서 처리하겠다.** 라는 뜻 입니다.

users 이후 매핑도 지정할 수 있는데요.
@Get(":id") 라는 데코레이터는 **/users/:id 로 들어온 요청을 이 함수에서 처리하겟다** 라는 뜻 입니다.

정말 직관적이죠?? 우후~

> **':'** 로 시작하는 문자열은 파라메터라는 값으로 인식하겠다는 뜻입니다.
> findOne 을 보시면 함수 인자 값에 @Param('id') 이라는 데코레이터를 붙여 :id 위치의 값을 id 라는 값에 할당하는 과정을 볼 수 있습니다.

또한 비슷하게 **@Body** 데코레이터는 request body 의 내용을 변수에 할당하겠다는 뜻 입니다.

정말 쉽다쉽다!!

#### 🥣Module

UsersModule 클래스는 이 users 라는 폴더 안의 **모듈을 관리**하는 클래스입니다.
이 모듈의 **controllers** 는 UsersController 클래스를 통해 관리하겠다!
이 모듈의 **providers** 는 UserService 클래스를 통해 관리하겠다 !!

> 잘 보시면 배열의 값이므로 복수의 값을 할당할 수 있습니다!!

이 UsersModule 을 app 모듈에서 imports 하고 있기 때문에 app 이 UserModule 을 인식할 수 있던 것 입니다!!

다른 값에 대해서는 이후 포스트에서 다루겠습니다.

---

자 여러분 정말 쉽고 직관적으로 되어있지 않나요? 제가 NestJS 를 좋아하게 된 이유 이기도 합니다.!!

다음에는 Postgresql 데이터베이스를 이용해 진짜 user 정보를 저장해보자구요!

피드백은 항상 환영입니다!!
