---
title: '[백준🔉][14501] 퇴사 문제 해설'
pubDate: 2021-01-13T08:53:19.524Z
description: '정답비율 : 47.669%문제풀러가기✈우리팀에서 가장 열심히, 돈을 위해 직장을 다니던 훌륭한 백준 직원이 퇴사를 하려고 한다.퇴사하기 전까지 가장 많은 돈을 버는 (가장 많은 일을 하는게 아닌) 계획을 짜고 수행하려 한다.백준이가 돈을 많이 벌 수 있게 도와주자.자세'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - 백준
---

---

- 정답비율 : 47.669%
- [문제풀러가기✈](https://www.acmicpc.net/problem/14501)

---

## 👓 문제 요약

우리팀에서 가장 열심히, 돈을 위해 직장을 다니던 훌륭한 백준 직원이 퇴사를 하려고 한다.
퇴사하기 전까지 가장 많은 돈을 버는 (가장 많은 일을 하는게 아닌) 계획을 짜고 수행하려 한다.
백준이가 돈을 **많이** 벌 수 있게 도와주자.

> 자세한 문제 설명과 제한 사항은 백준 홈페이지 참고. [문제풀러가기](https://www.acmicpc.net/problem/14501)

## 🔑 문제 풀이

우리 백준이는 N + 1 일에 퇴사하기 때문에 N 일 까지는 일을 한다.
상담완료에 걸리는 일자가 3일이면 해당하는 날을 포함해 3일 이라는 것을 명심하자.

전형적인 DFS 문제이며 시작하는 일부터 N 일까지 탐색 후, 얼마를 벌었는지 가능한 케이스를 모두 조사하는 것이다.

## 🥽 소스코드 및 소스해석

> 백준 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 코드에는 테스트 코드가 존재합니다.

```cpp
#include<iostream>
#include<vector>
#include<string>
#include<algorithm>

struct Task {
	int period;
	int earn;
};
using namespace std;
void dfs(int idx, int endDay, int money);

vector<Task> myTask;
int myMoney = -1;
int main() {

	int TC;
	cin >> TC;
	myTask.assign(TC, {0, 0});
	for (int i = 0; i < TC; i++)
		cin >> myTask[i].period >> myTask[i].earn;

	for (int i = 0; i < myTask.size(); i++)
		if (myTask[i].period + i <= myTask.size())
			dfs(i + 1, i + myTask[i].period, myTask[i].earn);
	cout << myMoney;
}
//
void dfs(int idx,int endDay,int money) {
	for (int i = idx; i < myTask.size(); i++)
		if(endDay <= i && myTask[i].period + i <= myTask.size())
			dfs(i + 1, i + myTask[i].period, money + myTask[i].earn);
	myMoney = max(myMoney, money);
}
```

## 🔨 문제 후기

DFS의 전형적인 문제로서 기본이 되는 문제였다.
나는 문제를 잘못 읽어서 1시간동안 이상한 짓을 했다.

퇴사를 하기 전까지 열심히 일하는 백준이.
백준이 상사는 훌륭한 부하가 나가기 때문에 매우 심기가 불편할 것 같다.
