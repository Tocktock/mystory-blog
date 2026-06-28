---
title: '[📣top interview question] Best Time to Buy and Sell Stock II 문제풀기!'
pubDate: 2021-01-18T06:35:05.996Z
description: '문제풀러가기✈어떤 물건의 가격이 매일 달라..매일 달라지는 가격을 줄테니...나를 부자로 만들어줘!!자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기가격이 언제 꺾이는지 (하강하다 상승, 상승하다 하강) 에 포인트를 주면 될 것 같다.하강하다가 상승한다면 그 지점'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
---

---

- [문제풀러가기✈](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/564/)

---

## 👓 문제 요약

어떤 물건의 가격이 매일 달라..

매일 달라지는 가격을 줄테니...

나를 부자로 만들어줘!!

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/564/)

## 🔑 문제 풀이

가격이 언제 꺾이는지 (하강하다 상승, 상승하다 하강) 에 포인트를 주면 될 것 같다.

하강하다가 상승한다면 그 지점에서 사야하고, 상승하다가 하강하면 팔아야한다.

더 쉽게 풀려면 그냥

    prices[i] < prices[i + 1]

일 때 그 차이를 그냥 더해주면 되지 싶다.

## 🥽 소스코드 및 소스해석

```javascript
var maxProfit = function (prices) {
  let buyDate = -1;
  let profit = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < prices[i + 1]) {
      if (buyDate === -1) {
        buyDate = i;
      }
    } else {
      //감소할때 팔면 이득.
      if (buyDate !== -1) {
        profit += prices[i] - prices[buyDate];
        buyDate = -1;
      }
    }
  }
  return profit;
};
```

## 🔨 문제 후기

에이 너무 쉽네 하고 Hard 문제 도전했다가 탈탈 털렸다...
틈틈히 시간 날 때마다 Hard 문제도 풀어야겠다.
