---
title: '[프로그래머스✈][2020 kakao] 자물쇠와 열쇠 문제 풀이'
pubDate: 2021-01-13T08:49:55.831Z
description: '정답률: 7.4%문제풀러가기✈고고학자로 위장한 도굴꾼 튜브는 고대 유적지에서 자물쇠를 발견했습니다.가지고 있는 열쇠가 이 자물쇠에 맞는지 사방으로 끼워보고 돌려서도 끼워보고 해서 자물쇠를 열어 발굴할 수 있는지 확인하려고 합니다. 문제를 푸시오.자세한 문제 설명과 제한'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2020
  - 프로그래머스
---

---

- 정답률: 7.4%
- [문제풀러가기✈](https://programmers.co.kr/learn/courses/30/lessons/60059)

---

## 👓 문제 요약

고고학자로 위장한 도굴꾼 **튜브**는 고대 유적지에서 자물쇠를 발견했습니다.
가지고 있는 열쇠가 이 자물쇠에 맞는지 사방으로 끼워보고 돌려서도 끼워보고 해서 자물쇠를 열어 발굴할 수 있는지 확인하려고 합니다. 문제를 푸시오.

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42892)

## 🔑 문제 풀이

20x20의 크기의 board에 열쇠가 맞는지 모든 케이스를 맞춰보는 겁니다. 여러분 이건 어려운게 아니라 **귀찮은** 문제 입니다.

이 녀석을 혼쭐 내줍시다.

## 🥽 소스코드 및 소스해석

> 해당소스는 프로그래머스에서 풀고 바로 가져온 코드 입니다.

키를 만들고 사방으로 끼우고 돌려서도 끼우고 다 해봅니다.
**노동은 컴퓨터가 하잖아요?**

```cpp
#include <string>
#include <vector>

using namespace std;
void makeMyKey(vector<vector<int>>& key);
void makeMyTempKey(vector<vector<int>>& tempKey, int dir, int x, int y, int keysize, int locksize);
bool check(vector<vector<int>>& tempKey, vector<vector<int>>& lock);
int mykey[4][32][32];
bool solution(vector<vector<int>> key, vector<vector<int>> lock) {
	makeMyKey(key);
	vector<vector<int>> tempKey(lock.size(), vector<int>(lock.size(), 0));
	for (int i = 0; i <= key.size() + lock.size(); i++) {
		for (int j = 0; j <= key.size() + lock.size(); j++) {
			for (int k = 0; k < 4; k++) {
				makeMyTempKey(tempKey, k, j, i, key.size(), lock.size());
				if (check(tempKey,lock)) {
					return true;
				}
			}
		}
	}
	return false;
}
void makeMyKey(vector<vector<int>>& key)
{
	int length = key.size();
	for (int i = 0, _i = 0; i < length; i++, _i++)
		for (int j = 0, _j = 0; j < length; j++, _j++)
			mykey[0][i][j] = key[i][j];
	for (int i = 0, _i = 0; i < length; i++, _i++)
		for (int j = 0, _j = length - 1; j < length; j++, _j--)
			mykey[1][i][j] = key[_j][_i];
	for (int i = 0, _i = 0; i < length; i++, _i++)
		for (int j = 0, _j = length - 1; j < length; j++, _j--)
			mykey[2][i][j] = mykey[1][_j][_i];
	for (int i = 0, _i = 0; i < length; i++, _i++)
		for (int j = 0, _j = length - 1; j < length; j++, _j--)
			mykey[3][i][j] = mykey[2][_j][_i];
}
void makeMyTempKey(vector<vector<int>>& tempKey, int dir, int x, int y, int keysize, int locksize) {
	int keyX = keysize - x;
	int keyY = keysize - y;

	for (int i = 0,_i = keyY; i < locksize; i++, _i++) {
		for (int j = 0, _j = keyX; j < locksize; j++, _j++)
		{
			if (_j >= keysize || _j < 0 || _i >= keysize || _i < 0) {
				tempKey[i][j] = 0;
			}
			else {
				tempKey[i][j] = mykey[dir][_i][_j];
			}
		}

	}
}
bool check(vector<vector<int>>& tempKey, vector<vector<int>>& lock) {
	int length = lock.size();
	for (int i = 0; i < length; i++)
	{
		for (int j = 0; j < length; j++)
		{
			if (lock[i][j] + tempKey[i][j] == 0 || lock[i][j] + tempKey[i][j] == 2)
				return false;
		}
	}
	return true;
}
```

## 🔨 문제 후기

Depth가 깊은거 같다구요? 네 맞습니다. 여러분이 짜실 때는 가능한 많이 줄여서 써주세요.

카카오는 구현능력을 많이 물어보는 것 같다.
하지만 많이 풀어본다면 너도 할 수 있다구!.
우리 사랑스러운 튜브 그림을 보는데 너무 귀엽다.
