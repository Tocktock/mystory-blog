---
title: '[프로그래머스][2020 kakao] 기둥과 보 설치 문제 해설'
pubDate: 2021-01-13T08:50:24.298Z
description: '정답률 : 1.9%문제풀러가기죠르디 는 기둥과 보를 이용하여 벽면 구조물을 자동으로 세우려고 한다. 2차원 벽면 n x n 의 격자칸이 주어지고, 기둥과 보를 설치하고 제거하는 명령어가 주어 질 때 해당 명령어가 실행 가능하다면 실행하라.자세한 문제 설명과 제한 사항은'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2020
  - 프로그래머스
---

- 정답률 : 1.9%
- [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/60061)

---

## 문제 요약

**죠르디** 는 기둥과 보를 이용하여 벽면 구조물을 자동으로 세우려고 한다. 2차원 벽면 n x n 의 격자칸이 주어지고, 기둥과 보를 설치하고 제거하는 명령어가 주어 질 때 해당 명령어가 실행 가능하다면 실행하라.

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/60061)

## 문제 풀이

- 보는 오른쪽으로, 기둥은 위로 설치, 제거한다.
- 보는 양쪽 끝 아래에 기둥이 존재하거나 양쪽으로 보가 존재해야 한다.
- 기둥은 아래에 기둥이 있거나 아래에 보가 있어야 한다.
- 어떤 기둥 또는 보를 제거했을 때 **모든 기둥과 보**가 유지될 수 있어야만 제거를 진행한다.

## 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

```cpp
#include <string>
#include <vector>

using namespace std;
//https://programmers.co.kr/learn/courses/30/lessons/60061

vector<vector<int>> solution(int n, vector<vector<int>> build_frame);
void myadd(int x, int y, bool iscol);
void myremove(int x, int y, bool iscol);
bool check(int x, int y, bool iscol);
bool checkEvery();

int board[128][128][4]; //4방향 top 부터 시계방향.
int g_n;

int main() {
	vector<vector<int>> answer;
	vector<vector<int>> input = { {1,0,0,1} ,{1,1,1,1},{2,1,0,1},{2,2,1,1},{5,0,0,1},{5,1,0,1},{4,2,1,1},{3,2,1,1} };
	vector<vector<int>> input2 = { {0, 0, 0, 1} ,{2, 0, 0, 1},{4, 0, 0, 1},{0, 1, 1, 1},{1, 1, 1, 1},{2, 1, 1, 1},{3, 1, 1, 1},{2, 0, 0, 0},{1, 1, 1, 0},{2, 2, 0, 1} };
	answer = solution(5, input2);
}

vector<vector<int>> solution(int n, vector<vector<int>> build_frame) {
	vector<vector<int>> answer;
	g_n = n;
	for (int i = 0; i < build_frame.size(); i++) {
		if (build_frame[i][3] == 1) {
			myadd(build_frame[i][0], build_frame[i][1], !build_frame[i][2]);
		}
		else {
			myremove(build_frame[i][0], build_frame[i][1], !build_frame[i][2]);
		}
	}
	for (int i = 0; i <= n; i++) {
		//i = x, j = y, x 오름차순, x가 같으면 y좌표 기준
		for (int j = 0; j <= n; j++) {
			if (board[j][i][0] == 1) {
				answer.push_back(vector<int>({ i, j, 0 }));
			}
			if (board[j][i][1] == 1) {
				answer.push_back(vector<int>({ i, j, 1 }));
			}
		}
	}
	return answer;
}
void myadd(int x, int y, bool iscol) {
	if (iscol && check(x, y, true)) {
		board[y][x][0] = 1;
		board[y + 1][x][2] = 1;
	}
	else if (!iscol && check(x,y, false)) {
		board[y][x][1] = 1;
		board[y][x + 1][3] = 1;
	}

}
void myremove(int x, int y, bool iscol) {

	//!(board[y][x + 1][0] && check(x + 1, y, iscol)) ||
	if (iscol) {
		board[y][x][0] = 0;
		board[y + 1][x][2] = 0;
		if (!checkEvery()) {
			board[y][x][0] = 1;
			board[y + 1][x][2] = 1;
		}
	}
	else {
		board[y][x][1] = 0;
		board[y][x + 1][3] = 0;
		if (!checkEvery()) {
			board[y][x][1] = 1;
			board[y][x + 1][3] = 1;
		}
	}
}
bool check(int x, int y, bool iscol) {
	if (iscol && (y == 0 || (board[y][x][1] == 1 || board[y][x][3] == 1 || board[y][x][2] == 1))) return true;
	else if (!iscol && (board[y][x][2] == 1 || board[y][x + 1][2] == 1
		|| (board[y][x + 1][1] == 1 && board[y][x][3] == 1))){ return true;}
	return false;
}

bool checkEvery() {
	for (int i = 0; i <= g_n; i++) {
		//i = x, j = y, x 오름차순, x가 같으면 y좌표 기준
		for (int j = 0; j <= g_n; j++) {
			if (board[j][i][0] ? !check(i, j, true) : false) { return false;}
			if (board[j][i][1] ? !check(i, j, false) : false) { return false; }
		}
	}
	return true;
}
```

## 문제 후기

인풋값이 크지 않으므로 전수조사를 수행하길 권한다.
사실 나도 제거 할 때 모든 조건을 어째 고려해야하나 싶다가 전수조사 하니까 답이 떠버렸다.

헿
