---
title: '[프로그래머스✈][2017 카카오코드] 4단 고음 해설'
pubDate: 2021-01-13T08:53:52.458Z
description: '🛑🛑 아이유 팬은 주의 🛑🛑🛑🛑 아이유 팬은 주의 🛑🛑🛑🛑 아이유 팬은 주의 🛑🛑🛑🛑 해당문제를 풀지 말고 돌아가길 권고 🛑🛑문제풀러가기✈우리 지은이는 3단 고음을 넘어 4단 고음을넘어2147483647 단 고음을 연습중이다.우리 지은이는 '
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - 프로그래머스
---

---

🛑🛑 **아이유 팬은 주의** 🛑🛑
🛑🛑 **아이유 팬은 주의** 🛑🛑
🛑🛑 **아이유 팬은 주의** 🛑🛑
🛑🛑 **해당문제를 풀지 말고 돌아가길 권고** 🛑🛑

- [문제풀러가기✈](https://programmers.co.kr/learn/courses/30/lessons/1831)

---

## 👓 문제 요약

우리 지은이는 3단 고음을 넘어 4단 고음을넘어
2147483647 단 고음을 연습중이다.

우리 지은이는 현재 음계의 3배 (음계에 배수라는게 존재하는지 모르겠다.) 높은 음계를 낼 수 있고 **반드시** 3단 점프를 한 후에는 음계를 한 단계씩 두 번을 더 높게 내야한다. 하지만 굳이 연속으로 1단 점프를 할 필요는 없다.

예시 )

**(가능)**

1. 3단 점프
2. 1단 점프
3. 1단 점프
4. 끝

**(불가능)**

1. 3단 점프
2. 1단 점프
3. 끝

**(가능)**

1. 3단 점프
2. 1단 점프
3. 3단 점프
4. 1단 점프
5. 1단 점프
6. 1단 점프
7. 끝

자세한 문제를 프로그래머스 홈페이지를 참고하는걸 강력히 권고

🛑🛑 **아이유 팬은 주의** 🛑🛑
🛑🛑 **아이유 팬은 주의** 🛑🛑
🛑🛑 **아이유 팬은 주의** 🛑🛑
🛑🛑 **해당문제를 풀지 말고 돌아가길 권고** 🛑🛑

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42892)

## 🔑 문제 풀이

전형적인 DFS 문제이다.
범위가 INT_MAX에 해당하는 값이 있으므로 들어오는 인풋을 기준으로 역추적을 하여 1까지 찾아가는 것을 추천한다.

DFS 문제이지만 범위가 매우 크므로 적당한 가지치기가 필요하다.
3단 점프의 최대 가능 범위를 구하고, 3단 점프와 1단 점프간의
상관관계 (3단 점프 후에는 반드시 1단 점프 2번이 와야함.)

## 🥽 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

```cpp
#include<vector>
#include<algorithm>
using namespace std;

void dfs(int plusCt, int multiCt,int i, int num);
int g_ans;
long long maxNum[100];
long long minNum[100];
int solution(int n);
int main() {
    solution(15);
}

int solution(int n) {
    g_ans = 0;
    int i = 1;
    maxNum[0] = 5;
    while (maxNum[i - 1] < 2147483647) {
        maxNum[i] = maxNum[i - 1] * 3 + 2;
        i++;
    }
    i = 1;
    minNum[0] = 3;
    while (minNum[i - 1] < 2147483647) {
        minNum[i] = minNum[i - 1] * 3;
        i++;
    }
    i = 0;
    while (true) {
        if (n < maxNum[i])
            break;
        i++;
    }
    dfs(0, 0, i + 1, n);
    return g_ans;
}

void dfs(int plusCt, int multiCt, int i, int num){
    if (plusCt > i * 2 || multiCt > i || num == 0) return;
    if (multiCt * 2 > plusCt) return;
    if (num == 1 && multiCt * 2 == plusCt) {
        g_ans++;
        return;
    }
    if(num % 3 == 0)
        dfs(plusCt, multiCt + 1, i, num / 3);
    dfs(plusCt + 1, multiCt, i, num - 1);
}
```

## 🔨 문제 후기

프로그래머스도 성장하고 있구나를 많이 느꼈따.

당시 코드 템플릿이나 채점 등 지금과 비교하면 많이 부족한 것을 느낄 수 있다.

그리고 아이유는 아이유다.
