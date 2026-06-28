---
title: 'Node.js Event loop 파헤치기'
pubDate: 2021-02-15T10:05:45.189Z
description: '🙄 그래서 Event loop 가 뭘까?  이전 포스트에서 Event loop 는 epoll_wait loop 로서 커널에 관심사를 알려주고 커널에서 알림이 blocking 상태를 해제하고 적절한 javascript API 로 변환하는 과정이라고 했습니다. 쉽게 말하'
heroImage: '../../../assets/heroes/nodejs-event-loop.png'
category: 'tech'
series: 'backend-notes'
tags:
  - nodejs
---

## 🙄 그래서 Event loop 가 뭘까?

이전 포스트에서 **Event loop** 는 **epoll_wait loop** 로서 **커널**에 관심사를 알려주고 커널에서 알림이 blocking 상태를 해제하고 적절한 javascript API 로 변환하는 과정이라고 했습니다. 쉽게 말하자면 Node.js 가 None Blocking I/O 작업을 수행하도록 해주는 과정입니다.

Event loop 더 고수준에서 다이어그램으로 보자면 아래와 같습니다.

       ┌───────────────────────────┐
    ┌─>│           timers          │
    │  └─────────────┬─────────────┘
    │  ┌─────────────┴─────────────┐
    │  │     pending callbacks     │
    │  └─────────────┬─────────────┘
    │  ┌─────────────┴─────────────┐
    │  │       idle, prepare       │
    │  └─────────────┬─────────────┘      ┌───────────────┐
    │  ┌─────────────┴─────────────┐      │   incoming:   │
    │  │           poll            │<─────┤  connections, │
    │  └─────────────┬─────────────┘      │   data, etc.  │
    │  ┌─────────────┴─────────────┐      └───────────────┘
    │  │           check           │
    │  └─────────────┬─────────────┘
    │  ┌─────────────┴─────────────┐
    └──┤      close callbacks      │
       └───────────────────────────┘

이벤트루프는 저수준 c 코드에서 일어나는 일이며 사실 더 복잡한 과정을 가지고 있습니다만 Node.js 공식 문서에서는 위 과정이 Event loop 의 가장 중요한 단계 를 의미한다고 합니다.

모든 단계는 특징을 가지고 있습니다.

- 각 단계는 실행할 콜백의 FIFO 큐를 가집니다.
- 각 단계는 각각 자신만의 특징을 가지고 있으며 해당 단계에 진입시 그 단계에서 행하는 동작을 수행하고 콜백을 실행합니다.
- 각 단계에서는 큐를 모두 소진하거나 콜백의 최대 개수를 수행할 때까지 콜백을 실행합니다. 큐를 모두 소진하거나 콜백 제한에 이르면 이벤트 루프는 다음 단계로 이동합니다.

## 👓각 단계 파헤치기.

### 각 단계의 개요

- timers: 이 단계는 setTimeout()과 setInterval()로 스케줄링한 콜백을 실행합니다.
- pending callbacks: 다음 루프 반복으로 연기된 I/O 콜백들을 실행합니다.
- idle, prepare: 내부용으로만 사용합니다.
- poll: 새로운 I/O 이벤트를 가져옵니다. I/O와 연관된 콜백(클로즈 콜백, 타이머로 스케줄링된 콜백, setImmediate()를 제외한 거의 모든 콜백)을 실행합니다. 적절한 시기에 node는 여기서 블록 합니다.
- check: setImmediate() 콜백은 여기서 호출됩니다.
- close callbacks: 일부 close 콜백들, 예를 들어 socket.on('close', ...).

### Timers

타이머는 제공된 콜백이 일정 시간 후 실행되어야 하는 시간을 지정합니다. 이 시간은 운영체제 스케쥴링이나 다른 콜백 실행 때문에 지연될 수 있으므로 정확한 시간이 아닙니다.

예를 들어 100ms 이후 실행되도록 시간을 지정하고 95ms 가 걸리는 파읽 읽기를 비동기로 수행한다고 가정합니다.

```javascript
const fs = require("fs");

function someAsyncOperation(callback) {
  // 이 작업이 완료되는데 95ms가 걸린다고 가정합니다.
  fs.readFile("/path/to/file", callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// 완료하는데 95ms가 걸리는 someAsyncOperation를 실행합니다.
someAsyncOperation(() => {
  const startCallback = Date.now();

  // 10ms가 걸릴 어떤 작업을 합니다.
  while (Date.now() - startCallback < 10) {
    // 아무것도 하지 않습니다.
  }
});
```

`someAsyncOperation` 에서 95ms 이 걸리는 `fs.readFile` 을 수행하고 10ms 를 소요하는 콜백을 다시 수행합니다.

> 해당 과정은 poll 과정에서 일어나고, poll 임계점에 다다르지 않았다고 가정합니다.

콜백이 완료되면 105ms 를 소요하게 되고 poll 큐에 아무것도 없기 때문에 poll 단계는 종료됩니다.

이제 이벤트루프는 check -> close callback 단계를 거쳐 다시 timers 단계로 돌아가며 100ms 로 지정한 콜백은 105ms 이후 실행되었기에 timers 의 시간은 **정확한** 시간이 아니라 콜백을 실항할 때 까지 걸리는 최소시간 이라는 것을 알 수 있습니다.

---

### Pending 콜백

이름에서 알 수 있다시피 콜백의 완전히 완료하지 못하고 연기된 콜백을 실행하는 단계 입니다.

### poll

다음 두 가지 기능을 합니다.

- I/O 를 얼마나 오래 block 하고 polling 해야하는지 계산합니다.
- poll 큐에 있는 이벤트를 처리합니다.

poll 단계에서는

- poll 큐가 **비어있지 않다면** 콜백의 큐를 모두 소진하거나 임계점에 도달할 때 까지 동기로 콜백을 수행합니다.
- poll 큐가 **비어있다면** 다음 단계로 넘어가거나 콜백이 poll 큐에 추가되길 기다린 후 즉시 실행합니다.

> poll 큐가 다음 단계로 간다는 말은 하나 이상의 timers 가 준비되어있거나 setImmediate() 가 스케쥴링 되어 있다는 뜻 입니다.

### check

poll 단계가 수행된 후에 콜백을 수행하기 위한 단계입니다.
setImmediate() 를 통해 이 단계를 수행할 수 있습니다.

setImmediate() 는 setTimeout() 와 다른 단계에서 수행이 되며 동일한 I/O 주기 내에서 둘을 같이 호출 한다면 setImmidate() 가 항상 먼저 실행됩니다.

### close

소켓 또는 핸들이 닫힌 경우와 같이 close 이벤트를 처리하기 위한 단계입니다.

---

## 😁그림으로

[ Bert Belder 의 강연](https://www.youtube.com/watch?v=PNa9OMajw9w&t=596s) 에서는 다음과 같은 그림을 통해 설명하고 있습니다.

![](/blog/nodejs-event-loop/event-loop.png)

---

Node.js 는 이벤트루프를 libUV 라이브러리를 통해 수행하고 있습니다.
libUV 에 대해 더 알고 싶다면 [libUV Doc](http://docs.libuv.org/en/v1.x/) 를 참고해주세요.

피드백은 환영입니다.

---

출처

- <https://www.youtube.com/watch?v=P9csgxBgaZ8>
- <https://www.youtube.com/watch?v=PNa9OMajw9w&t=596s>
- <https://nodejs.org/ko/docs/guides/event-loop-timers-and-nexttick/>
