---
title: '[leetcode][43] Multiply Strings 문제풀기!'
pubDate: 2021-01-25T01:12:12.839Z
description: '문제풀러가기✈숫자 두개를 문자열로 줄테니 곱해줘!근데 숫자가 엄청 커 ㅎㅎ;;;자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기BigInteger 를 쓰면 매우 쉽지만, 그러라고 문제 푸는거 아니잖아 ? ? ?나는 우리가 학창시절 때 배웠던 곱셈 방식을 이용했다.'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
---

---

- [문제풀러가기✈](https://leetcode.com/problems/multiply-strings/)

---

## 👓 문제 요약

숫자 두개를 문자열로 줄테니 곱해줘!

근데 숫자가 엄청 커 ㅎㅎ;;;

> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/multiply-strings/)

## 🔑 문제 풀이

BigInteger 를 쓰면 매우 쉽지만, **그러라고 문제 푸는거 아니잖아 ? ? ?**

나는 우리가 학창시절 때 배웠던 곱셈 방식을 이용했다.

        1 2 3
        4 5 6
    ㅡㅡㅡㅡㅡ
        7 3 8
      6 1 5 0
    4 9 2 0 0
    ㅡㅡㅡㅡㅡ
    5 6 0 8 8

이런 식으로 중간 단계를 두어 123 \* 6, 123 \* 5, 123 \* 4 를 한 후 한 자리씩 더해주었다.

## 🥽 소스코드 및 소스해석

```javascript
var multiply = function (num1, num2) {
  let answer = "";
  if (num1 === "0" || num2 === "0") return "0";

  for (let i = num2.length - 1; i >= 0; i--) {
    answer = strPlus(answer, subMultiply(num1, num2[i], num2.length - i - 1));
  }
  return answer;
};

const subMultiply = (str1, target, pos) => {
  let result = [];
  let carryOut = 0;
  for (let i = str1.length - 1; i >= 0; i--) {
    let value = +str1[i] * target + carryOut;
    carryOut = parseInt(value / 10);
    result.push(value % 10);
  }
  if (carryOut !== 0) {
    result.push(carryOut);
  }
  let gather = "";
  for (let i = result.length - 1; i >= 0; i--) {
    gather += result[i];
  }
  for (let i = 0; i < pos; i++) {
    gather += "0";
  }
  return gather;
};
const strPlus = (str1, str2) => {
  // str2가 커야한다
  if (str1.length > str2.length) {
    let temp = str1;
    str1 = str2;
    str2 = temp;
  }
  if (str1.length === 0) return str2;
  let result = [];
  let carryOut = 0;
  let diff = str2.length - str1.length;
  for (let i = str2.length - 1; i >= 0; i--) {
    let str1Int = i - diff >= 0 ? +str1[i - diff] : 0;
    let value = str1Int + +str2[i] + carryOut;
    carryOut = parseInt(value / 10);
    result.push(value % 10);
  }
  if (carryOut !== 0) {
    result.push(carryOut);
  }
  let gather = "";
  for (let i = result.length - 1; i >= 0; i--) {
    gather += result[i];
  }
  return gather;
};
```

## 🔨 문제 후기

내가 쓴 코드는 상당히 지저분해진 코드이다.

저번에도 말했지만 **간결할 수록 버그도 적어진다!!**

분면 줄일 수 있는, 간결해질 수 있는 방법이 있을 것이다. 함수화를 한다던가? 한번 찾아보고
코드를 줄이면 문서를 다시 수정하겠습니다!
