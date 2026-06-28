---
title: '2. NestJS 블로그 만들기 - 리팩토링과 e2e 테스트!!'
pubDate: 2021-02-09T03:29:56.808Z
description: '이번에는 이전 포스트에서 다뤘던 내용에 대해서 Refactoring 을 하고 테스트도 해보겠습니다.계속 리팩토링 하다보니 위와 같은 구조가 만들어졌습니다.파일 이름이 바뀐 것도 있고, 내부 구현사항이 바뀐 것도 있습니다.리팩토링 하면서 설계의 중요성을 다시 느낍니다.C'
heroImage: '../../../assets/heroes/nestjs-logo.png'
category: 'tech'
series: 'nestjs-blog'
seriesOrder: 4
tags:
  - nestjs
---

이번에는 이전 포스트에서 다뤘던 내용에 대해서 Refactoring 을 하고 테스트도 해보겠습니다.

## 🔨 Refactoring !!

    └─modules
        └─user
            │  user.controller.ts
            │  user.module.ts
            │  user.repository.ts
            │  user.service.ts
            │  user.spec.ts
            │
            ├─dto
            │      create-user.dto.ts
            │      index.ts
            │      update-user.dto.ts
            │
            ├─entities
            │      user.entity.ts
            │
            ├─exceptions
                email-already-exist-exception.ts
                user-not-found.exception.ts
                username-already-exist-exception.ts

계속 리팩토링 하다보니 위와 같은 구조가 만들어졌습니다.
파일 이름이 바뀐 것도 있고, 내부 구현사항이 바뀐 것도 있습니다.
리팩토링 하면서 설계의 중요성을 다시 느낍니다.

### user.exceptions

Custom Exception 을 만들기 위해 user 폴더 안에 exceptions 폴더를 만듭시다!

이메일과 유저네임이 중복 되었을 때 그리고 유저를 찾지 못했을 때 발생 시킬 exception 을 각각 만들어 줍시다.

- `username-already-exist-exception.ts`

```typescript
import { BadRequestException } from "@nestjs/common";

export class UsernameAlreadyExistException extends BadRequestException {
  constructor(error?: string) {
    super("username already exist", error);
  }
}
```

- `email-already-exist-exception.ts`

```typescript
import { BadRequestException } from "@nestjs/common";

export class EmailAlreadyExistException extends BadRequestException {
  constructor(error?: string) {
    super("email already exist", error);
  }
}
```

- `user-not-found.exception.ts`

```typescript
import { BadRequestException } from "@nestjs/common";

export class UserNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super("user not found", error);
  }
}
```

각각의 클래스는 BadRequestException 을 상속받고 있습니다.
해당 Exception 을 발생시키면 Status Code 는 400(BadRequest) 이 발생됩니다.

매우 간단하게 Custom Exception 을 만들었습니다!!

### user.service

create 메소드 안에서 이전에 만들었던 QueryBuilder 부분을 삭제하고 바로 위에서 만들었던 Custom Exceptions 들을 사용하여 간단하게 만들어줍니다.

- `UserService.create`

```typescript
const thisUser = await this.userRepository.findOne({ username: username });
if (thisUser) {
  const error = "UserName is already exist";
  throw new UsernameAlreadyExistException(error);
}
const thisEmail = await this.userRepository.findOne({ email: email });
if (thisEmail) {
  const error = "Email is already exist";
  throw new EmailAlreadyExistException(error);
}
```

그리고 유저를 저장하여 반환할 때 단순 number 값이 아니라 Object 를 반환해줍시다.

```typescript
const userId = await this.userRepository.save(newUser).then((v) => v.id);
return { userId: userId };
```

테스트를 위해 remove 메소드 안의 내용을 다음과 같이 만들어 줍시다.

> 이후 Auth 관련 기능을 만들면서 remove 기능은 사라질겁니다...

- `UserService.remove`

```typescript
async remove(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email });
}
```

### user.controller

remove 와 관련된 controller 부분을 다음으로 변경해주세요!

- `UsersController.remove`

```typescript
  @Delete('')
  remove(@Body('email') email: string) {
    return this.usersService.remove(email);
  }
```

`@Body` annotation 은 response body 안에서 해당하는 필드를 가져와 변수에 입력해주는 기능을 합니다!!

## 🧡🧡새해 첫 테스트 두근두근

먼저 유닛테스트가 아닌, e2e 테스트를 진행하기 위한 코드임을 알려드립니다.
테스트 관련 기술이 많이 부족해서 계속 공부중입니다. ㅜㅜ 더 알아가면서 포스트를 업데이트 하도록 하겠습니다!!

테스트는 해당 url 로 요청 수행시 적절한 응답이 오는 확인합니다.

e2e 테스트 방법에 정석이 있겠지만 진행 도중 많은 오류가 발생하여.. 일단 야매로 진행하겠습니다.

**서버실행 -> url로 요청**

요청을 수행하기 위해서 supertest 라이브러리를 먼저 설치합시댜!!

```sh
$ npm install --save-dev supertest
```

> supertest 관한 내용은 다음링크에서 더 확인 가능합니다!!
> [npm supertest](https://www.npmjs.com/package/supertest)

그리고 테스트 하기 위한 nest 라이브러리도 설치합시다 !!

```sh
$ npm i --save-dev @nestjs/testing
```

이제 user.spec.ts 라는 파일을 user 폴더 안에 생성하여 다음과 같은 코드를 작성합시다!

```typescript
import * as request from "supertest";
const app = "http://localhost:3000";
describe("User create 테스트", () => {
  beforeEach(async () => {
    await request(app).delete("/users").send({ email: "test1@example.com" });
    await request(app).delete("/users").send({ email: "test2@example.com" });
  });

  it("email 중복 확인", async () => {
    await request(app)
      .post("/users")
      .send({
        email: "test1@example.com",
        username: "testuser",
        password: "12345",
      })
      .expect(201);

    const res = await request(app)
      .post("/users")
      .send({
        email: "test1@example.com",
        username: "abcd",
        password: "12345",
      })
      .expect(400);
    expect(res.body.error).toBe("Email is already exist");
  });

  it("username 중복 확인", async () => {
    await request(app)
      .post("/users")
      .send({
        email: "test2@example.com",
        username: "testuser",
        password: "12345",
      })
      .expect(201);

    const res = await request(app)
      .post("/users")
      .send({
        email: "test1@example.com",
        username: "testuser",
        password: "12345",
      })
      .expect(400);
    expect(res.body.error).toBe("UserName is already exist");
  });
});
```

- `describe` 메소드로 테스트 할 놈들을 그룹화 해줍니다.
- `beforeEach` 메소드를 통해 각 테스트를 수행하기 전 테스트 유저를 삭제해줍니다.
- `it` 메소드를 통해 각각 테스트를 수행합니다. `it` 은 `test` 메소드와 같은 기능을 하며 별칭입니다.

자 이제 테스트를 시작해봅시다!!

먼저 서버실행!!

```sh
$ npm run start
```

그리고 테스트도 실행 !!

```sh
$ npm run test
```

    > nestjs-practice@0.0.1 test C:\Users\jiyoung\nestjs-practice
    > jest

    PASS  src/modules/user/user.spec.ts
    User create 테스트
        √ email 중복 확인 (173 ms)
        √ username 중복 확인 (24 ms)

    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        1.392 s, estimated 5 s
    Ran all test suites.

다음과 같이 통과하면 성공입니다!!

> package.json 에서 jest 관련 설정을 spec 또는 test 가 붙은 ts 파일로 설정했기 때문에 해당하는 파일은 모두 테스트하게 됩니다!!

---

테스트 관련해서는 아직 공부하고 있습니다 !!
e2e 테스트를 먼저 해보기 위해 시도는 많이 했으나 그만큼 오류가 많이 나더군요 ㅜㅜ
위와 같은 야매 방법을 통해 테스트를 했으나, 이후에 해결방법을 알아와서 포스트를 업데이트 하겠습니다!!

또한 이후에는 Unit Test 관련 기능도 알아보겠습니다!

다음에는 post 모듈을 만들어봅시다!!
감사합니다.

피드백은 항상 환영입니다.
