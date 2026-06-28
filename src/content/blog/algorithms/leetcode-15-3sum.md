---
title: '[leetcode][15] 3sum 문제풀기!'
pubDate: 2021-01-14T01:53:23.718Z
description: '문제풀러가기✈숫자를 엄청 줄게!!숫자 3개를 뽑아서 그 숫자들의 합이 0 이 되는 부분집합좀 찾아줘!자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기숫자 세개를 뽑아서... 0 을 만드는지 확인하면 된다!.다만 3개 전부 완전탐색을 돌려버리게 된다면 타임아웃이 뜨'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
---

---

- [문제풀러가기✈](https://leetcode.com/problems/3sum)

---

## 👓 문제 요약

숫자를 엄청 줄게!!
숫자 3개를 뽑아서 그 숫자들의 합이 0 이 되는 부분집합좀 찾아줘!

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/3sum)

## 🔑 문제 풀이

숫자 세개를 뽑아서... 0 을 만드는지 확인하면 된다!.
다만 3개 전부 완전탐색을 돌려버리게 된다면 타임아웃이 뜨지 않을까?
주어진 조건에서 숫자의 개수는 최대 3천개라 했으니 아마 타임아웃이 뜰거 같다.

#### 그래서 제가 어떻게 풀었냐면 !!

일단 숫자 세개의 합이 0이 되어야하니, 숫자들을 정렬하고 최저의 수를 선택하고 이 숫자와
다른 숫자 2개를 선택했을 때 0이 되는 경우를 구했습니다. !!!!! **빠밤!!**

저희는 최저의 수를 선택했기 때문에 해당 숫자보다 오른쪽에 있는 수는 무조건 선택된 숫자보다 크다는 겁니다.!!

그리고 숫자 두개를 정할껀데,

- 하나는 최저 숫자보다 한 단계 크거나 같은수
- 다른 하나는 가장 큰 수

를 선택해서
선택지의 폭을 줄여나가는 겁니다.

만약 세 개를 더했는데 0보다 크다? 그러면 가장 큰 수를 가르키는 포인트를 한 단계 낮은 숫자로 옮깁니다.
만약 세 개를 더했는데 0보다 작다? 그러면 선택된 최저의 수를 가지고는 0을 만들 수 없습니다.

> 선택된 숫자를 제외하고 가장 작은 수와 가장 큰 수를 더했기 때문

만약 세개를 더했는데 0이랑 같다? 정답에 추가합니다.

자자자자 **요약**해줄게요 !

- 최저의 수 선택 - selected 라 하겠습니다.
- 최저의 수와 같은 또는 한 단계 큰 수를 가르키는 포인트 - 그 숫자를 left라 하겠습니다.
- 최대의 수를 가르키는 포인트 - 그 숫자를 right라 하겠습니다.
- selected + left + right === 0 -> 답에 추가!
- selected + left + right < 0 -> selected 의 숫자로는 더이상 0을 만들 수가 없음!
- selected + left + right > 0 -> right 의 숫자를 한 단계 낮춰줌 !!

이 것을 반복하시면 됩니다. 반복은 컴퓨터가 하기 때문에 마음껏 돌려주세요!

다만 중복을 피하기 위해 포인트를 옮길 때는 같은 수는 전부 지나쳐주세요!!

## 🥽 소스코드 및 소스해석

```javascript
var threeSum = function (nums) {
  let answer = [];
  let selected = 0;
  let left = selected + 1;
  let right = nums.length - 1;
  if (nums.length < 3) return answer;
  nums.sort((a, b) => a - b);
  while (nums[selected] <= 0 && left !== right) {
    if (nums[selected] + nums[left] + nums[right] === 0) {
      answer.push([nums[selected], nums[left], nums[right]]);
      while (nums[right] === nums[right - 1]) right--;
      while (left + 1 < nums.length && nums[left] === nums[left + 1]) left++;
      right--;
      left++;
    } else if (nums[selected] + nums[left] + nums[right] < 0) {
      while (left + 1 < nums.length && nums[left] === nums[left + 1]) left++;
      left++;
    } else {
      while (nums[right] === nums[right - 1]) right--;
      right--;
    }
    if (right <= left) {
      [selected, left, right] = setValue(selected, left, right, nums);
    }
  }
  return answer;
};
const setValue = (selected, left, right, nums) => {
  if (nums[selected] === nums[selected + 1]) {
    while (nums[selected] === nums[selected + 1]) {
      selected++;
    }
  }
  selected++;
  left = selected + 1;
  right = nums.length - 1;
  return [selected, left, right];
};
```

## 🔨 문제 후기

자잘한 조건 때문에 오래걸린 문제!!

나는 정말 숫자에 약한 것 같다 ㅜㅜ 다들 화이팅!!

코드를 깔끔하게 정리하는 법좀 배워야할 듯 싶다.

릿코드 상당히 괜찮은 사이트 같습니다!
