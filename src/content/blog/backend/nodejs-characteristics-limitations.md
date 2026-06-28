---
title: 'Node.js 의 특징과 한계'
pubDate: 2021-02-02T06:02:08.453Z
description: '초기 웹 페이지는 지금처럼 동적이지 않고 정적이었습니다.그런데 동적으로 좀 움직이면 좋겠는데.. 하고 나온 것이 Javascript 입니다.Javascript Javascript 는 브라우저의 자바스크립트 엔진을 통해 DOM Context 를 제어하며 동적인 웹페이지를'
category: 'tech'
series: 'backend-notes'
tags:
  - nodejs
---

## 🤗 Node.JS 등장하다!!

초기 웹 페이지는 지금처럼 동적이지 않고 정적이었습니다.
그런데 동적으로 좀 움직이면 좋겠는데.. 하고 나온 것이 Javascript 입니다.
Javascript Javascript 는 브라우저의 자바스크립트 엔진을 통해 DOM Context 를 제어하며 동적인 웹페이지를 만들 수 있었습니다.

시간이 흘러 2008 년 구글이 크롬을 발표하면서 V8 자바스크립트 엔진을 만들게 됩니다.
이전과는 다르게 상당한 수준의 퍼포먼스를 보이며 자바스크립트를 다른 분야에 적용하자는 의견이 생기기 시작했습니다. 이후 CommonJS 표준이 발표되고 곧바로 CommonJS 와 V8 엔진을 기반으로 Node.js 가 탄생합니다.

## 😊 Node.js 가 빛나기 시작했어!!

Node.js 는 다음과 같은 특징을 가지고 있습니다.

- None Blocking
- Event Driven
- Data Intensive
- I/O Intensive

사실 위의 특징 모두 Node.js 의 비동기 이벤트 기반 아키텍처 때문입니다.

## 😃 쓰레드 기반 vs 비동기 이벤트 기반

Node.js 가 개발된 배경과 목적에는 다수의 연결을 효율적으로 관리하고 비용을 최소화 할 수 있는 방법을 제시하는 것이 있었습니다. 이를 설명하기 위해 기존의 Multi Thread 환경에 대해서 알아봅시다.

Multi Thread 기반의 서버는 클라이언트가 웹 서버에 요청을 하게 되면 서버에서는

- 일정한 메모리 공간을 사용해 새로운 Thread 를 생성하거나 또는
- Thread pool 에서 적당한 Thread 를 해당 요청에 할당하게 됩니다.

이 할당된 Thread 는 해당 요청이 완료될 때 까지 이 요청에 할당됩니다. 하지만 실제로 코드가 수행되는 속도와 I/O 장치의 수행 속도가 다르기 때문에 Blocking I/O 에 대한 문제가 생기게 됩니다.

Blocking I/O 자체가 발생시키는 문제는

- I/O 요청을 하고 응답이 올 때까지 아무것도 하지 않고 시간을 낭비하는 것과
- 스케쥴링 처리와 문맥 전환시 CPU 연산이 필요하기 때문에

쓰레드가 많아질 수록 이로 인한 성능 저하가 일어난다는 것 입니다.

Node.js 는 Single Thread 기반으로 작동합니다.

뭐 ?? **Single Thread 면 요청 기다리는 동안 아무것도 못하잖아!!**

오.. 오해입니다!!

Node.js 는 **Single Thread 기반 비동기 처리 방식** 으로 구동됩니다.

Node.js 는

- I/O 작업 처리에 대한 응답을 기다리지 않고 바로 다음 작업을 실행합니다.
- 대신 I/O 작업이 종료되면 이벤트를 발생시키고,
- 이 이벤트는 해당 프로세스의 이벤트 큐에 등록되게 됩니다.
- 노드가 이 이벤트 큐를 주기적으로 계속 감지하여 해당 이벤트 이후 수행해야 할 작업을 하게 됩니다.

**이벤트 루프** 는 작업을 요청하면서 그 작업이 완료되었을 때 어떤 작업을 진행할지에 대한 콜백함수를 지정하여 동작이 완료되었을 때 해당 콜백함수를 실행하는 동작 방식을 말합니다. 만약 HTTP 요청이 서버에 오면 이벤트 루프는 이를 감지하고 적당한 Worker Thread 를 생성하여 해당 요청을 할당한 후 다른 요청을 기다리게 됩니다.

다시 말해 이벤트 루프는 어떤 요청이 발생하면 그 작업에 대해 **쓰레드 실행만을 일으킬 뿐**입니다. 이후 작업을 할당받았던 해당 쓰레드가 모든 작업을 마치면 미리 전달받은 콜백 함수를 실행하도록 이벤트 루프로 응답하게 되며 이벤트 루프는 이것을 실행하여 클라이언트에게 결과를 응답해줍니다.

## 🙀 Node.js 의 한계

Node.js : **Culculte Intensive** 한 분야는 자신 없어!!

다음과 같은 상황을 봅시다.

```javascript
let count = 0;
for (let i = 0; i < 100000000; i++) count++;
```

감이 오십니까??

다시 말하자면 Node.js 는 Single Thread 기반입니다. 위 상황과 같이 긴 시간이 필요한 연산이 있으면 거기서 Block 이 됩니다.

반면 Multi Thread 기반의 어떤 Thread 가 위와 같은 요청을 받고 연산을 한다해도 여러 Thread 가 있으니 다른 요청을 받을 수 있습니다.

> Thread 는 시분할 또는 특정 조건에 해당하는 기간동안 수행되고 Context Switching 을 통해 작업을 미루게 됩니다.

따라서 단순히 연산에 집중적인 분야에 대해서는 Node.js 가 아닌 다른 언어 다른 코드로 작성하는 방법으로 우회하시는게 좋습니다.

---

## 😭 마치며

사실 Node.js 환경을 사용하면서, 단순히 백엔드랑 프론트엔드 둘 다 사용가능하니까 !! 라는 지식만 가지고

왜 Node.js 가 무엇을 목적으로 탄생했는지 어떤점에 강점을 가지는지에 대해서는 몰랐던것 같습니다.
생각보다 Performance 도 훌륭하다는 것에 놀랐고 Single Thread 의 비동기 이벤트 기반 수행과정에 다시 놀랐습니다.
최소한 왜 쓰는지 이 환경의 장점이 무엇인지는 아는 것이 중요한 것 같습니다.

> Node.js 직군 면접을 보면서 특히 더 많이 느꼇습니다.

추가로, Node.js 도 어떤 부분에서는 Multi Thread 요소를 쓰기도 합니다.
이 부분에 대해서는 다른 내용과 함께 더 좋은 정보를 가지고 다시 찾아뵙겠습니다.!!

출처

- <https://zbulletjournal.tistory.com/85>
- <https://m.blog.naver.com/hhw1990/221394005779>
- <https://www.youtube.com/watch?v=UCd6LorxpkY&list=PLqq-6Pq4lTTa-d0iZg41U2RDqECol9C5B&index=6>
- <https://sjh836.tistory.com/149>
- <https://edu.goorm.io/learn/lecture/557/%ED%95%9C-%EB%88%88%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-node-js>
