---
title: '[백준🔉][16234] 인구이동 문제 해설'
pubDate: 2021-01-13T08:51:23.488Z
description: '정답비율 : 36.044%문제풀러가기✈1 x 1 모양의 사각형이 n x n 만큼 펼쳐진 땅이 있다고 가정한다.각 사각형은 나라를 지칭하며 그 안에는 백성들의 숫자가 있다.매우 자유로운 이 대륙의 특정한 나라는 다른 나라의 인구수와 비슷하다면 연합을 하여 연합국 간 인구'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - 백준
---

---

- 정답비율 : 36.044%
- [문제풀러가기✈](https://www.acmicpc.net/problem/16234)

---

## 👓 문제 요약

1 x 1 모양의 사각형이 n x n 만큼 펼쳐진 땅이 있다고 가정한다.
각 사각형은 나라를 지칭하며 그 안에는 백성들의 숫자가 있다.

매우 자유로운 이 대륙의 특정한 나라는 다른 나라의 인구수와 비슷하다면 연합을 하여 연합국 간 인구는 같은 숫자로 유지하기로 법을 제정했다.

위 법을 완전히 수행하기 위해 필요한 일 수를 구하여라.

**라고 생각 하면 됨**

> 자세한 문제 설명과 제한 사항은 백준 홈페이지 참고. [문제풀러가기](https://www.acmicpc.net/problem/16234)

## 🔑 문제 풀이

**중요!!!** 필요한 일 수이다. 이동한 횟 수가 아니다. 다시 말해 동일한 날에 연합이 여러개 발생한다 해도 하루에 일어났기 때문에 답을 추가할 때는 **1**을 추가해야한다

각 칸별로 BFS를 수행하면 풀 수 있는 문제.

## 🥽 소스코드 및 소스해석

> 백준 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 코드에는 테스트 코드가 존재합니다.

```cpp
#include<iostream>
#include<fstream>
#include<vector>
#include<string>
#include<algorithm>

using namespace std;
struct Point {
	int x;
	int y;
};

vector<vector<Point>> group;
vector<vector<int>> myBoard;
vector<vector<bool>> checked;

void dfs(int pre, int x, int y, int low, int high, vector<vector<int>>& myBoard, vector<vector<bool>> &checked);
void flatting(vector<vector<int>>& myBoard);
int main() {

	int boardSize;
	cin >> boardSize;
	int low, high;
	cin >> low >> high;
	myBoard.assign(boardSize, vector<int>(boardSize,0));

	for (int i = 0; i < boardSize; i++)
		for (int j = 0; j < boardSize; j++)
			cin >> myBoard[i][j];

	int answer = 0;
	while (true) {
		group.clear();
		checked.clear();
		group.push_back(vector<Point>(0));
		checked.assign(boardSize, vector<bool>(boardSize, false));
		for (int i = 0; i < boardSize; i++)
		{
			for (int j = 0; j < boardSize; j++)
			{
				if (checked[i][j] == true) continue;
				dfs(myBoard[i][j], j + 1, i, low, high, myBoard, checked);
				dfs(myBoard[i][j], j - 1, i, low, high, myBoard, checked);
				dfs(myBoard[i][j], j, i + 1, low, high, myBoard, checked);
				dfs(myBoard[i][j], j, i - 1, low, high, myBoard, checked);
				if (group[group.size() - 1].size() != 0)
					group.push_back(vector<Point>(0));
			}
		}
		flatting(myBoard);
		if (group[0].size() == 0) break;
		answer++;
	}
	cout << answer;
}
void dfs(int pre, int x, int y, int low, int high, vector<vector<int>>& myBoard, vector<vector<bool>> &checked) {
	if (y < 0 || y >= myBoard.size() || x < 0 || x >= myBoard.size()) return;
	if (checked[y][x] == true) return;

	int diff = abs(myBoard[y][x] - pre);
	if (diff >= low && diff <= high) {
		checked[y][x] = true;
		group[group.size() - 1].push_back({ x,y });
		dfs(myBoard[y][x], x + 1, y, low, high, myBoard, checked);
		dfs(myBoard[y][x], x - 1, y, low, high, myBoard, checked);
		dfs(myBoard[y][x], x, y + 1, low, high, myBoard, checked);
		dfs(myBoard[y][x], x, y - 1, low, high, myBoard, checked);
	}
}
void flatting(vector<vector<int>>& myBoard) {
	for (int i = 0; i < group.size(); i++)
	{
		if (group[i].size() == 0) continue;
		int flat = 0;
		for (int j = 0; j < group[i].size(); j++)
			flat += myBoard[group[i][j].y][group[i][j].x];
		flat /= group[i].size();
		for (int j = 0; j < group[i].size(); j++)
			myBoard[group[i][j].y][group[i][j].x] = flat;
	}
}
```

## 🔨 문제 후기

불필요한 동작도 많은 것 같지만 풀었다는 것에 만족하고 다른 사람의 코드를 보았다. 역시 세상에는 천재는 많고 나는 바보다.
