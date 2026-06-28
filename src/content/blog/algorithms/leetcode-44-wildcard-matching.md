---
title: '[leetcode][44] Wildcard Matching 문제풀기!'
pubDate: 2021-01-30T12:40:30.995Z
description: "문제풀러가기✈간단한 정규식 패턴을 줄게.'?' 이건 하나의 문자를 대체할 수 있는 놈이야.'\\*' 임마 이거는 빈 문자를 포함해서 문자열을 대체할 수 있는 놈이야.자 이제 내가 문자열을 줄테니까 이전에 준 패턴으로 만들 수 있는 놈인지 판단해줘!자세한 문제 설명과 릿코"
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
  - leetcode-hard
---

---

- [문제풀러가기✈](https://leetcode.com/problems/wildcard-matching)

---

## 👓 문제 요약

간단한 정규식 패턴을 줄게.

- **'?'** 이건 하나의 문자를 대체할 수 있는 놈이야.
- **'\*'** 임마 이거는 빈 문자를 포함해서 문자열을 대체할 수 있는 놈이야.

자 이제 내가 문자열을 줄테니까 이전에 준 패턴으로 만들 수 있는 놈인지 판단해줘!

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/wildcard-matching)

## 🔑 문제 풀이

문제에서 문자열의 길이와 패턴의 길이가 최대 2,000 이기 때문에 **O(n^2)** 으로도 가능한 문제입니다!!

저는 DP 기법으로 풀었습니다.

**dp[i][j]** 는 0 ~ i - 1 까지의 패턴으로, 0 ~ j - 1 까지의 문자열을 만족할 수 있는지에 대한 정보를 나타냅니다.

이 문제의 경우 패턴의 인덱스가 0 이거나 문자열의 인덱스가 0 인 경우에 대한 처리가 복잡해질거 같아서

인덱스를 하나씩 더 써서 사용 했습니다.
즉 dp[0][0] 은 패턴 0개, 문자열 0개를 사용했을 때를 나타냅니다.

검사하려는 i - 1 의 패턴이 **'\*'** 인 경우와 **'?'** 또는 **알파벳문자** 인 경우로 나누었습니다.

- **'\*'** 인 경우 : 이 경우는 즉 현재 패턴을 뺀 경우 또는 현재 검사하려는 문자열에서 마지막 문자를 뺀 경우가 만족하면 true 입니다. -> dp[i - 1][j] 또는 dp[i][j - 1] 가 true 이면 dp[i][j] 는 true
- **'?'** 또는 **알파벳문자** 인 경우 : 이 경우는 현재 패턴과 검사하려는 문자열의 마지막 문자를 뺀 경우 만족하면 true 입니다. -> dp[i - 1][j - 1] 가 true 이면 dp[i][j] 는 true

## 🥽 소스코드 및 소스해석

```javascript
var isMatch = function (s, p) {
  //remove consecutive star e.g) **
  if (p.length === 0 && s.length === 0) return true;
  if (p.length === 0) return false;
  let patternTemp = new Array();
  for (let i = 0; i < p.length; i++) {
    while (i + 1 < p.length && p[i] === "*" && p[i + 1] === "*") i++;
    patternTemp.push(p[i]);
  }

  p = patternTemp;
  // dp[i][j] measn from p[0] ~ p[i]
  let dp = new Array(p.length + 1);
  for (let i = 0; i <= p.length; i++) {
    dp[i] = new Array(s.length + 1);
    dp[i].fill(false);
  }
  //dp[pattern][string]

  dp[0][0] = true;
  dp[1][0] = p[0] === "*" ? true : false;

  for (let patternIdx = 1; patternIdx <= p.length; patternIdx++) {
    for (let stringIdx = 1; stringIdx <= s.length; stringIdx++) {
      if (p[patternIdx - 1] === "*") {
        dp[patternIdx][stringIdx] =
          dp[patternIdx][stringIdx - 1] || dp[patternIdx - 1][stringIdx];
      } else if (
        p[patternIdx - 1] === "?" ||
        p[patternIdx - 1] === s[stringIdx - 1]
      ) {
        dp[patternIdx][stringIdx] = dp[patternIdx - 1][stringIdx - 1];
      }
    }
  }

  return dp[p.length][s.length];
```

## 🔨 문제 후기

처음에 패턴이 0 인 경우 문자열이 0 인 경우 다 나누고 있다가 이게 뭔 짓이람 하고 인덱스를 하나 늘려서 그냥 저장했더니 더 간결해졌다.

항상 알고리즘이 동일하다면 더 간결하게 쓰기 위해 노력해야겠다!!
