---
title: '1. NestJS 블로그 만들기 -이거는 알고 시작하자.'
pubDate: 2021-01-15T10:50:58.812Z
description: 'NestJS를 시작하기전 이거만큼은 알고 시작하자!!🚨🚨🚨 본 포스트와 이후 nestjs 시리즈에서는 Javascript, Typescript 를 배우기 위한 내용은 다루지 않습니다. 🚨🚨🚨Javascript 는 FrontEnd 를 공부중이시거나 NodeJS'
heroImage: '../../../assets/heroes/nestjs-logo.png'
category: 'tech'
series: 'nestjs-blog'
seriesOrder: 1
tags:
  - nestjs
---

NestJS를 시작하기전 이거만큼은 알고 시작하자!!

🚨🚨🚨 본 포스트와 이후 nestjs 시리즈에서는 Javascript, Typescript 를 배우기 위한 내용은 다루지 않습니다. 🚨🚨🚨

---

## 📣Prerequisites

### 1. Javascript & Typescript

Javascript 는 FrontEnd 를 공부중이시거나 NodeJS 를 다루어 보신분이라면 알고 계실거라고 생각합니다!
다만 Typescript 까지 해야하느냐?? 라고 물으신다면

- **예**

NestJS 의 주요 핵심중 하나는 **의존성주입**(Defendency Injection) 입니다.

의존성주입이 무엇인지 먼저 알아보죠.

### 2. 의존성주입 (Dependency Injection)

의존성 주입은 제어의역전(Inversion of Control) 의 기술중 하나입니다.

🙄🙄🙄

의존성 주입이란 말을 처음 들은 여러분의 표정이 상상이 갑니다.

간단하게 먼저 말하자면

- 제어의역전 : **"내가 대신 제어해줄게"**
- 의존성주입 : **"니가 정의한 코드(클래스, 변수 등등)를"**

예를 들어보겠습니다.

NestJS 에서는 생성자를 통해 의존성을 주입할 수 있습니다.

```typescript
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

위의 코드에서

```typescript
  constructor(private catsService: CatsService) {}
```

여기에 해당하는 코드를 보시면 생성자에서 catService 의 타입만 지정했습니다. 그럼에도 불구하고

```typescript
  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
```

여기서 catService 의 create 메소드를 호출하고 있습니다.

이는 NestJS 가 "오 catsService 는 CatsService 타입이네? 내가 직접 찾아서 할당해줘야겠다!!"
라는 행동을 하게 됩니다. 이후 이 클래스의 생성, 소멸 주기를 몰라도 그냥 미친듯이 사용 가능합니다.
NestJS 가 해당 객체를 관리해줄거거든요. 이미 내 손을 떠난 문제에요!!

**"무슨 말인지 모르겠어.. 그냥 의존성주입이고 나발이고 내가 다 만들어서 개발할래!!"**
라고 생각하신다면... 프레임워크를 사용 안하고 모든 것을 직접 개발하셔도 됩니다.
다만 프레임워크의 장점을 버리는 것이 더 큰 고통을 안겨줄지도 몰라요 😭😭😭

자 위에서 보신것과 같이 NestJS가 의존성주입을 사용하기 위해서 우리는 **타입**을 지정해주었습니다.
Nodejs 환경에서 Javascript 는 타입을 명시할 수 없습니다. 따라서 Typescript 를 사용하게됩니다.

이제 Typescript 를 꼭 해야합니까?? 의 답변을 이해 하시겠죠??

### 3. HTTP

HTTP에 대해서 완전 자세하게 전문가까지의 지식이 필요한 것은 아닙니다. (저도 전문가는 아닙니다.)
HTTP 메소드가 무엇인지. URL이 무엇인지. HTTP 포트가 무엇인지 !!
간략하게나마 아신다면 RESTful API 를 작성하시는데 큰 도움이 되겠습니다.

### 4. Database

데이터 제공을 할거잖아요?? 간단한 SQL 문법 정도는 집고 넘어갑시다. !!
NoSQL 이 떠오른다고는 하지만 SQL 의 모든 것을 대체할거라고 생각하시면 안됩니다. !!
MYSQL !! Postgresql !!!! 원하는 데이터베이스를 선택해서 해봅시다!!

---

위의 내용을 **간략하게** 라도 아신다면 이후 NestJS 를 배우시는데 큰 도움이 될 거에요!!

Javascript 를 모르신다면

노마드코더님, 드림코딩 엘리님, 또 영어를 잘하시면 Academind 님의 영상 등,
유튜브, Udemy 에 수많은 강의들이 있으니 꼭 들어보시길 바랍니다.

다음에는 CRUD 기능 실습을 통해 NestJS 가 이런거구나 라는 것을 알아보겠습니다.!!

피드백은 항상 환영입니다.
