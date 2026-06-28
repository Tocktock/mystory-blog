---
title: 'Node.js process.Tick() 이란'
pubDate: 2021-02-15T10:06:18.352Z
description: 'nextTickQueue는 process.nextTick() API의 콜백들을 가지고 있으며, microTaskQueue는 Resolve된 프로미스의 콜백을 가지고 있습니다.이 두 개의 큐는 이벤트루프에 포함되어있지 않으며 이벤트루프에 앞서 실행하기 위한 것을 목적으로'
heroImage: '../../../assets/heroes/nodejs-process-nexttick.png'
category: 'tech'
series: 'backend-notes'
tags:
  - nodejs
---

## ☕ nextTickQueue 와 microTaskQueue

nextTickQueue는 process.nextTick() API의 콜백들을 가지고 있으며, microTaskQueue는 Resolve된 프로미스의 콜백을 가지고 있습니다.

이 두 개의 큐는 이벤트루프에 포함되어있지 않으며 이벤트루프에 앞서 실행하기 위한 것을 목적으로한다.

따라서 libUV 라이브러리에 포함되어 있지 않고 Node.js 에 포함되어있다.

## 👓 process.nextTick()

> `tick` 은 반영구적인 event loop 에서 하나의 loop 를 의미합니다.

process.nextTick() 은 비동기 API 이지만 위 다이어그램의 어떠한 이벤트루프에도 속해있지 않습니다.

process.nextTick() 의 목적은 **사용자의 동기코드 이후, 이벤트루프가 진행되기 이전** 의 시간을 목적으로 합니다.

다음과 같은 상황을 보면

```javascript
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log("bar", bar); // 1
});

bar = 1;
```

사용자의 동기코드인 `bar = 1;` 이 수행된 이후에 `someAsycnApiCall` 에 전달된 callback 이 수행됩니다. 만약 `process.nextTick(callback)` 을 `callback()` 으로 바꾸게 된다면 bar = 1; 이 실행되기 이전에 `callback` 이 수행될 수 있습니다.

> process.nextTick() 은 이벤트루프 이전에 수행되기 때문에 반복적으로 호출하게 되면 poll 단계가 수행되지 않을 수 있으며 이는 I/O 단계를 Starving 상태로 만들 수 있습니다.

## 😃 process.nextTick() 그리고 setImmediate()

사실 두 함수의 이름은 바뀌어야 합니다.
process.nextTick()이 setImmediate()보다 더 즉시 실행되지만 이미 수많은 코드들이 작성되어 있기 때문에 두 이름을 바꾼다면 npm 패키지에 잠재적으로 많은 문제가 발생할 수 있기 때문에 이름을 바꾸지 않는다고 합니다.

## 🙄 그런데 왜 쓰는가?

process.nextTick() 을 쓰는 이유는 단순합니다.

사용자가 **이벤트루프를 진행하기 전에 수행할 작업**이 필요하기 때문입니다.

다음 예를 봅시다.

```javascript
const server = net.createServer();
server.on("connection", (conn) => {});

server.listen(8080);
server.on("listening", () => {});
```

`server.listen(8080)` 은 이벤트루프 시작 부분에서 수행될 것 입니다.
`server.on` 으로 등록한 `listening` 콜백은 `setImmedate()` 로 수행이 됩니다. 따라서 `server.listen(8080)` 보다 먼저 적용될 수 있습니다.

---

피드백은 항상 환영입니다

---

출처

- <https://nodejs.org/ko/docs/guides/event-loop-timers-and-nexttick/>
- <https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/>
