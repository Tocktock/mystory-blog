---
title: 'Node.js Event loop 저수준에서 파헤치기'
pubDate: 2021-02-13T13:12:41.545Z
description: '시작하기 앞서 이 포스트는 Node.js 유튜브 영상 을 참조하고 만든 것을 알려드립니다.!!Node.js 의 Event Loop 가 Scale 측면에서 우수하다 라는 말을 알기 위해서는기존에는 요청을 어떻게 처리 했는지를 이해하면 도움이 많이 됩니다.TCP Conne'
heroImage: '../../../assets/heroes/nodejs-event-loop-low-level.png'
category: 'tech'
series: 'backend-notes'
tags:
  - nodejs
---

시작하기 앞서 이 포스트는 Node.js [유튜브 영상](https://www.youtube.com/watch?v=P9csgxBgaZ8) 을 참조하고 만든 것을 알려드립니다.!!

## 기존의 방법들

**Node.js** 의 Event Loop 가 Scale 측면에서 우수하다 라는 말을 알기 위해서는
기존에는 요청을 어떻게 처리 했는지를 이해하면 도움이 많이 됩니다.

TCP Connection 과정을 기존에 어떻게 처리 했는지 봅시다.

```
    int server = socket();
    bind(server, 80)
    listen(server)

    while(int connection = accept(server)) {
        do_something(connection);
    }
```

위의 의사코드 작동을 보면

- server 의 소켓을 생성하고 포트바인드를 한다.
- 그리고 Listen 상태로서 요청이 오는지 확인하며 대기한다.
- 요청이 오면 요청을 처리한다.

TCP connection 요청을 받고 상태는 accept connection 됩니다. accept connection 은 system call 이고 system call 은 프로그램을 block 할 수 있습니다. 즉 do_something 이 끝날 때까지 다른 무언가를 할 수 없는 상태가 됩니다. 예를 들어 10 초가 걸리는 요청이 있다면 그 요청을 끝내기 전까지는 다른 요청을 처리하지 못하게 될 수 있습니다.

## 멀티 쓰레드

자 이제 Multi Thread 개념을 생각해봅시다.
만약 새로운 Connection 마다 새로운 Thread 를 생성해서 할당하고 그 Thread 에게 요청을 맡기고 요청이 끝나면 다시 Thread 를 회수한다고 생각해봅시다.

Main Thread 에서는 Connection 을 기다리고 Connection 요청이 오면 새로운 Thread 를 생성하고 요청을 할당한 후 다시 Connection 을 기다린다면 요청이 끝나기 전 다른 요청을 받을 수 있습니다.

```
    int server = socket();
    bind(server, 80)
    listen(server)

    while(int connection = accept(server)) {
        pthread_create(echo, connection);
    }
    void echo(int connection) {
        char buf[4096];
        while(int size = read(connection, buffer, sizeof buf)) {
            write(conection, buf, size);
        }
    }
```

Multi Thread 환경에서도 문제가 있습니다. Thread 를 생성하고 할당하는 과정은 우리가 다룰 데이터에 비하면 상대적으로 상당히 무거운 과정입니다.

예를 들어 정말 간단한 작업을 요청을 하더라도 Thread 를 생성해야합니다.
Thread 를 관리하기 위한 메모리 할당, Thread 간 Context switching 과정 등에서 들어갈 작업 등..을 생각해보면 비효율적일 수도 있습니다. 임계 Thread 양보다 많은 요청이 들어온다면 요청을 처리할 수도 없게 됩니다.

## Epoll

Scale 관점의 문제를 해결하기 위해서 Epoll 이라는 것을 알아봅시다.
Epoll 은 I/O 통지 모델로서 커널 수준에서 file descriptor를 관리하게 됩니다.

epoll 이 하는 역할은 epoll descriptor 를 만들고 **커널에 우리가 어떤 이벤트에 관심이 있는지 말해줄게!! 그 이벤트가 발생하면 나에게 알려줘!!** 하는 역할을 하게 됩니다. 다시 말해 커널에게 작업을 맡기겠다는 말입니다. 커널에 정보를 알려주고 다시 요청을 받을 준비를 하게 됩니다. Epoll 을 이용하면 cpu 자원 또한 아끼게 됩니다.

> Epoll 에 대해서는 다음 블로그를 참고해주세요 . [Epoll 알아보기](https://rammuking.tistory.com/entry/Epoll%EC%9D%98-%EA%B8%B0%EC%B4%88-%EA%B0%9C%EB%85%90-%EB%B0%8F-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95)

이를 Event loop 라 하며 각각의 루프를 tick 이라 합니다.
아래와 같은 식이라 생각하면 됩니다. (사실 더 복잡하지만 간략화 했습니다.)

```
struct epoll_event_events[10];

while((int max = epoll_wait(eventfd, events, 10))) {
    for(n = 0; n < max; n++) {
        if(events[n].data.fd.fd == server) {
            //Server socket has connection!!
            int connection = accept(server);
            ev.events = EPOLLIN;
            ev.data.fd = connection;
            epoll_ctl(eventfd,EPOLL_CTL_ADD, connection, &ev);
        } else {
            //Connection socket has data
            char buf[4096];
            int size = read(connection, buffer, sizeof buf);
            write(connection, buffer, size);
        }
    }
}
```

## Event Loop 의 정체

이 반영구적인 loop 가 event loop 의 정체입니다. 커널에 관심사를 알려주고 관심사가 일어날 때까지 blocking 하며 대기상태로 진입한 후 관심사가 일어나면 Node.js 가 그 관심사를 자바스크립트 api 로 변환하게 되는 겁니다.

이 loop 는 더이상 event 를 기다려도 되지 않을 때 까지 반복됩니다.

## Node.js 도 Multi Thread 를 이용한다.

충격적이겠지만 사실 Node.js 에도 Thread pool 이라는 것이 존재합니다. Epoll 을 통해 관리할 수 없는 유형의 작업은 이 Thread pool 의 Thread 에 할당하여 처리하게 됩니다.

### Pollable and None Pollable

- `File System` : fs.\* 의 모든 것은 불가능합니다. 해당 유형의 요청은 Thread 로 넘겨지게 되며 Thread 는 blocking 됩니다.
- `Dns.Lookup calls` : request("hostname")... 의 요청인 경우 Dns 를 찾아야하기 때문에 None Pollable 합니다. 다만 Ip 를 통한 직접적인 요청인 경우는 Pollable 합니다.
- `crypto` : crypto.randomBytes(), crypto.pbkdf2() 등 일부 유형에서 None Pollable 합니다.
- `any c++ addons that use it` : Not Pollable 합니다.

이외에도 여러 유형이 있습니다. 매우 cpu intensive 한 작업에서 None pollable 한 경우가 많았습니다. 만약 None Pollable 한 작업을 많이 요구하는 Node.js 어플리케이션의 경우는 Thread poll size 를 늘리는 것도 생각해야합니다.

또한 Event Loop Time 시간을 잘 고려해서 내 어플리케이션이 어디서 Blocking 이 많이 되는가를 모니터링 해야 한다는군요.

---

Node.js 의 이벤트 루프를 공부하다가 발견한 영상을 토대로 정리했습니다.
미흡한 정보는 이후 포스트를 업데이트 하며 추가/수정 하겠습니다.
피드백은 항상 환영입니다.

이후에는 고수준에서 Event loop 를 살펴보겠습니다.

---

출처

- <https://www.youtube.com/watch?v=P9csgxBgaZ8>
- <https://rammuking.tistory.com/entry/Epoll%EC%9D%98-%EA%B8%B0%EC%B4%88-%EA%B0%9C%EB%85%90-%EB%B0%8F-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95>
