---
title: '[leetcode][16] 3sum closet 문제풀기!'
pubDate: 2021-01-15T03:52:09.983Z
description: '문제풀러가기✈이번에도 숫자를 엄청 줄게!!숫자 3개를 뽑아서 그 숫자들의 합이 내가 원하는 숫자랑 가장 가까워지는 값을 찾아줘!!자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기이번에도 숫자 세개를 뽑아서... 더해서 ... 원하는 숫자와 얼마나 가까운지 체크하면'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
---

---

- [문제풀러가기✈](https://leetcode.com/problems/3sum-closest)

---

## 👓 문제 요약

이번에도 숫자를 엄청 줄게!!
숫자 3개를 뽑아서 그 숫자들의 합이 내가 원하는 숫자랑 가장 가까워지는 값을 찾아줘!!

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/3sum-closest)

## 🔑 문제 풀이v

이번에도 숫자 세개를 뽑아서... 더해서 ... 원하는 숫자와 얼마나 가까운지 체크하면 된다!
다만 이번에도 3개 전부 완전탐색을 돌려버리게 된다면 타임아웃이 뜨지 않을까?

저번과 마찬가지로 투포인터 접근법으로 풀었다.
이전 문제를 풀었다면 별로 어렵지 않을 것이다!

#### 그래서 제가 어떻게 풀었냐면 !!

저번과 마찬가지로 정렬 후 selected, left, right 숫자를 선정합니다.

- select : 가장 작은 숫자
- left : selected + 1
- right : 가장 큰 숫자

이후 알고리즘은

- 합을 계산한 후 원하는 숫자와의 거리를 구한후,
- 이전에 구한 원하는 숫자와의 거리의 최솟값과 비교한후
- 더 작다면 이번에 계산한 값과, 거리를 저장!

가장 중요한 left 와 right 의 인덱스를 어떻게 변화시킬거냐.. 는 다음과 같습니다.

- 원하는 숫자가 방금 구한 합보다 작다면 right 인덱스를 1 줄여주고
  > 왜냐면 방금 구한 합보다 작아져야 원하는 숫자에 더 가까워지기 때문 !!
- 반대의 경우 left 인덱스를 1 늘립니다.

계싼은 컴퓨터에게 맡겨욥!!

## 🥽 소스코드 및 소스해석

```javascript
var threeSumClosest = function (nums, target) {
  let answer = 100000;
  let minDist = 1000000;
  nums.sort((a, b) => a - b);
  let selected = 0;
  while (selected < nums.length - 2) {
    let left = selected + 1;
    let right = nums.length - 1;
    while (left < right) {
      let sum = nums[selected] + nums[right] + nums[left];
      if (minDist >= Math.abs(sum - target)) {
        minDist = Math.abs(sum - target);
        answer = sum;
      }
      if (target - sum < 0) {
        right--;
      } else {
        left++;
      }
    }
    selected++;
  }
  return answer;
};
```

## 🔨 문제 후기

이전 문제를 풀었기 때문에 쉽게 풀 수 있었다.
이 알고리즘으로는 시간복잡도 O(n^2) 에 풀 수 있다.
혹시 O(nlgn) 방법으로도 가능할까 싶어서 생각하고 찾아봤는데.. 답은 나오지 않았다.
뭔가 있을거 같은데 ...
