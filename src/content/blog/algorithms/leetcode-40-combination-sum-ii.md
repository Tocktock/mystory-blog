---
title: '[leetcode][40] Combination Sum II 문제풀기!'
pubDate: 2021-01-22T11:57:36.829Z
description: '문제풀러가기✈숫자들을 줄게. 그 숫자들을 조합해서 내가 원하는 숫자가 나오는 조합을 찾아줘!단, 그 찾은 조합끼리 중복이 있으면 안돼!! 그리고 특정 숫자를 내가 준 개수보다 더 많이 쓰면 안돼!!!!자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기모든 경우를 다'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
---

---

- [문제풀러가기✈](https://leetcode.com/problems/combination-sum-ii/)

---

## 👓 문제 요약

숫자들을 줄게. 그 숫자들을 조합해서 내가 원하는 숫자가 나오는 조합을 찾아줘!

단, 그 찾은 조합끼리 중복이 있으면 안돼!! 그리고 특정 숫자를 내가 준 개수보다 더 많이 쓰면 안돼!!!!

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/combination-sum-ii/)

## 🔑 문제 풀이

모든 경우를 다 체크해서 만들어진다? 그 결과가 중복되지 않는다? 그럼 push 한다.

라는 방법이 있지만, 이 방법으로는 이미 풀어봤기 때문에 다른 방법을 찾아봤다!

#### 그래서 제가 어떻게 풀었냐면 !!

정답에 중복이 되는 이유는 같은 숫자들끼리 아무런 구별 없이 길을 만들어 지나왔기 때문!!

같은 숫자를 쓰는 길은 한 번만 지나가게 하면 된다.!!!! 뚜둔

예를 들어

[1, 2, 2 ,2 ,5] , 5 라는 값이 주어졌다 하면,

1, 2, 5 를 지나가는 길은 오직 한 번만 체크하면 된다.
두 번째 2도 체크하고, 세 번째 2도 체크 할 필요가 없다.

## 🥽 소스코드 및 소스해석

```javascript
var combinationSum2 = function (candidates, target) {
  candidates.sort((a, b) => a - b); // 오름차순
  let answer = [];
  /**
   * @param {number[]} candidates
   * @param {number[]} path
   * @param {number} start
   * @param {number} target
   */
  const dfs = (_candidates, path, start, _target) => {
    // 다음 값도 체크해야한다!
    if (_target === 0) {
      answer.push(path);
      return;
    }
    if (_target < 0 || start > _candidates.length - 1) return;

    let next = start;
    while (_candidates[start] === _candidates[next]) next++;

    dfs(_candidates, path, next, _target);

    path.push(_candidates[start]);
    dfs(_candidates, [...path], start + 1, _target - _candidates[start]);
    path.pop();
  };
  dfs(candidates, [], 0, target);

  return answer;
};
```

## 🔨 문제 후기

재미있다.

다른 사람의 풀이 보는 것도 재미있다.
세상에는 천재는 넘치고 내 시간은 부족하다.
