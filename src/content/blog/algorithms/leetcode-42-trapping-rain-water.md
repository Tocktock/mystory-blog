---
title: '[leetcode][42] Trapping Rain Water 문제풀기!'
pubDate: 2021-01-25T01:10:42.382Z
description: '문제풀러가기✈내가 말이야.. 특이한 목욕탕을 만들고 싶거든.. 근데 물이 얼마나 필요할지 잘 모르겠어.. 니가 좀 구해줄래?자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기대표적으로 이런 문제는 대부분 2 pointer 문제더라!!일단 물 높이를 생각해보자. 인풋'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
  - leetcode-hard
---

---

- [문제풀러가기✈](https://leetcode.com/problems/trapping-rain-water/)

---

## 👓 문제 요약

내가 말이야.. 특이한 목욕탕을 만들고 싶거든.. 근데 물이 얼마나 필요할지 잘 모르겠어.. 니가 좀 구해줄래?

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/trapping-rain-water/)

## 🔑 문제 풀이

대표적으로 이런 문제는 대부분 2 pointer 문제더라!!

일단 물 높이를 생각해보자. 인풋이 [2 ,0 ,0 ,3] 이렇게 주어지면, 왼쪽 기둥은 높이가 2, 오른쪽 기둥은 3 이다.
따라서 물을 다 채우면 왼쪽이 오른쪽 보다 낮기 때문에 높이 2까지만 채워진다.

이 원리를 이용해 왼쪽에서 오른쪽 방향으로 하나씩 참고하는 포인터와 반대로 오른쪽에서 왼쪽 방향으로 참고하는 포인터를 생성한다.

만약 왼쪽에서 하나씩 보다가 현재 기둥이 오른쪽에서 참조하는 기둥의 높이보다 낮거나 같으면 한 칸 물을 채워주고, 반대로 오른쪽 기둥이 더 낮으면 오른쪽에서 물을 채워주는 형식으로 진행한다. 채워주는 양은 현재 물의 높이 - 현재 기둥의 높이라고 생각하면 되겠다. 물을 낮은 곳 부터 차근차근 채워나간다고 생각하자.

왼쪽에서 먼저가던 오른쪽으로 가던 어느쪽으로 기준을 잡던 상관이 없지만 저는 왼쪽으로 기준 삼았습니다!.

#### 그래서 제가 어떻게 풀었냐면 !!

물을 채울 때 높이가 가장 중요하다.
물의 높이는 왼쪽 기둥과 오른쪽 기둥의 높이를 비교하여 낮은 값과, 이때까지 물의 높이 중 더 큰 값을 선택한다.
알아보기 쉽게 다음과 같이 표기하겠다.

```javascript
Math.max(fixH, Math.min(height[left], height[right]));
// fixH가 물의 높이다.
```

그런 다음 왼쪽 오른쪽 어디를 채울지 선택해 채우면 된다!!.

## 🥽 소스코드 및 소스해석

```javascript
var trap = function (height) {
  let answer = 0;
  let left = 0;
  let right = height.length - 1;
  let fixH = 0;
  while (left < right) {
    fixH = Math.max(fixH, Math.min(height[left], height[right]));
    if (height[left] <= fixH) {
      answer += fixH - height[left];
      left++;
    } else {
      answer += fixH - height[right];
      right--;
    }
  }
  return answer;
};
```

## 🔨 문제 후기

재미있다.

처음에 나는 상당히 긴 코드를 작성했다. 내가 워낙 설계하지 않고 풀다보니 깔끔하게 풀지를 못해서 중간에 값을 변경하고 변경하고 하다가 문제를 통과했다.

다른 사람들이 푼 아주 깔끔한 소스를 보고 약간의 자괴감과 한가지 깨닳음을 얻었따.

**코드가 간결해 질수록 버그도 적어진다!!**

앞으로 간결하게 코드를 작성하도록 해야할 듯 하다.
