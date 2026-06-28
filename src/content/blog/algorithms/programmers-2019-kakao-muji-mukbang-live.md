---
title: '[프로그래머스][2019 kakao] 무지의 먹방 라이브 문제 해설'
pubDate: 2021-01-13T08:46:37.222Z
description: '정답률: 정확성 42.08% / 효율성 5.52%문제풀러가기특별한 먹방을 하려는 무지. 회전테이블에 각각의 음식을 놓아두고 자신 앞의 음식을 1초 동안 섭취 한 다음 회전판에 의해 다음 음식을 1초동안 섭취하는 특이한...회전하는데 걸리는 시간은 없다고 본다.빈 그릇이'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2019
  - 프로그래머스
---

---

- 정답률: 정확성 42.08% / 효율성 5.52%
- [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42891)

---

## 문제 요약

특별한 먹방을 하려는 무지. 회전테이블에 각각의 음식을 놓아두고 자신 앞의 음식을 1초 동안 섭취 한 다음 회전판에 의해 다음 음식을 1초동안 섭취하는 특이한...

- 회전하는데 걸리는 시간은 없다고 본다.
- 빈 그릇이 아닐 때 까지 회전한다.
- k초 후에 어떤 음식이 앞에 놓여있는지 도출해내는 문제
- 무지는 엄청난 대식가이기 때문에 최대 20만개의 그릇에 한 그릇당 최대 1억 초 동안 먹을 수 있는 괴물이다. (효율성을 체크 해야한다는 뜻)
- 또한 무지는 매우 지루한 나날을 보내고 있기 때문에 최대 2 x 10^13 초에 해당 하는 시간동안 음식을 섭취할 수 있는 초능력을 가지고 있다.(효율성을 체크 하라는 뜻)
  > 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고.
  > [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42891)

## 문제 풀이

**정확성**만 생각한다면 1초 지날 때마다 검사하는 시뮬레이션을 통해 답을 도출해 내면 된다.
**효율성**을 생각한다면 남아있는 음식의 접시와 회전수를 조사하여 O(nlgn) 시간에 도출해야한다.

## 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

- 정렬을 통해 남은 음식의 시간이 가장 작은 수에 해당하는 회전을 진행한다고 가정합니다.
- 남은 접시의 수와 남은 지나간 k 초의 상관관계를 계산하며 k 가 0이하가 되기 바로 전 회전까지 계산합니다. (0번째 인덱스에 해당하는 접시로 다시 돌아오기 까지의 회전)
- 이제 정렬된 숫자와 상관없이 1초마다 계산해서 답을 도출 해내시면 됩니다.
- 회전 할 때 공식 : k = k - (음식이 남아 있는 접시 수) \* ("체크하지 않은 접시 중 가장 낮은 남은 시간을 가진 접시의 남은 시간" - "이때 까지 회전한 수를 뺀 값")

```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int solution(vector<int> food_times, long long k);

int main() {
    vector<int> input = { 3, 1, 2 };
    vector<int> input2 = { 4,2,3,6,7,1,5,8 };
    int k = 5; // answer 1
    int k2 = 16; // answer 3
    int answer = solution(input, k);
}

int solution(vector<int> food_times, long long k) {
    int answer = 0;
    vector<int> sortedTime = food_times;
    sort(sortedTime.begin(), sortedTime.end());
    sortedTime.push_back(0);

    long long foodNum = food_times.size();
    long long rotateNum = 0;

    for (int i = 0; i < sortedTime.size(); i++) {
        int ateFoodNum = 1;
        while (sortedTime[i] == sortedTime[i + 1]) {
            i++;
            ateFoodNum++;
        }
        if (k - (foodNum * (sortedTime[i] - rotateNum)) <= 0) {
            break;
        }
        k = k - (foodNum * (sortedTime[i] - rotateNum));
        foodNum -= ateFoodNum;
        rotateNum = sortedTime[i];
    }
    if (foodNum <= 0) return -1;
    while (k - foodNum > 0) {
        k = k - foodNum;
        rotateNum++;
    }

    for (size_t i = 0; i < food_times.size(); i++)
    {
        if (food_times[i] > rotateNum)
            k--;
        else
            continue;
        if (k == 0) {
            for (size_t j = 1; j <= food_times.size(); j++)
            {
                if ((i + j) % food_times.size() == 0) rotateNum++;
                if (food_times[(i + j) % food_times.size()] > rotateNum)
                    return (i + j) % food_times.size() + 1;
            }
        }
    }
    return -1;
}
```

## 문제 후기

문제 자체는 어렵지 않으나 구현 할 때 숫자 하나 차이로 풀리지 않을 수도 있기 때문에 주의를 요한다.

무지는 정말 대식가이다 지구에 있는 모든 음식을 다 먹을 수 있겠다.
