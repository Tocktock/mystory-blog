---
title: '[프로그래머스✈][2020 kakao] 동굴 탐험'
pubDate: 2021-01-13T08:52:56.036Z
description: '문제풀러가기✈우리 프로도는 특정한 규칙을 세워서 동굴의 각 방들을 탐험 하려고 한다. 해당 규칙을 만족하게 계획을 세우고 모든 방을 탐험할 수 있는지 탐색하라!자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. 문제풀러가기루트부터 각각의 방들을 탐색하며, 선행'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2020
  - 프로그래머스
---

---

- [문제풀러가기✈](https://programmers.co.kr/learn/courses/30/lessons/67260)

---

## 👓 문제 요약

우리 프로도는 특정한 규칙을 세워서 동굴의 각 방들을 탐험 하려고 한다. 해당 규칙을 만족하게 계획을 세우고 모든 방을 탐험할 수 있는지 탐색하라!

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/67260)

## 🔑 문제 풀이

루트부터 각각의 방들을 탐색하며, 선행이 필요한 방은 이후에 다시 조사한다!

선행이 되는 방을 방문한다면, 선행이 필요한 방은 방문 가능하다고 판단한다.

## 🥽 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

```cpp
#include <string>
#include <vector>
#include <deque>
#include <string.h>
using namespace std;

int pre[200000];
int post[200000];
int hang[200000];
vector<vector<int>> myTree;
bool visit[200000];

bool solution(int n, vector<vector<int>> path, vector<vector<int>> order);

int main() {
    vector<vector<int>> path = { {0,1} ,{0,3},{0,7},{8,1},{3,6},{1,2},{4,7},{7,5} };
    vector<vector<int>> order = { {8, 5}, {6, 7}, {4, 1} };
    vector<vector<int>> path2 = { {8,1},{0,1},{1,2},{0,7},{4,7},{0,3},{7,5},{3,6}  };
    vector<vector<int>> order2 = { {4, 1}, {5, 2} };
    vector<vector<int>> path3 = { {0, 1}, {0, 3}, {0, 7}, {8, 1}, {3, 6}, {1, 2}, {4, 7}, {7, 5} };
    vector<vector<int>> order3 = { {4, 1}, {8, 7}, {6, 5} };
    bool answer = solution(9, path, order);
}

bool solution(int n, vector<vector<int>> path, vector<vector<int>> order) {
    myTree.assign(200000, vector<int>(0));
    memset(post, -1,sizeof(post));
    memset(pre, -1, sizeof(pre));
    memset(hang, -1, sizeof(hang));
    for (int i = 0; i < path.size(); i++){
        myTree[path[i][0]].push_back(path[i][1]);
        myTree[path[i][1]].push_back(path[i][0]);
    }
    for (int i = 0; i < order.size(); i++){
        if (order[i][1] == 0) return false;
        pre[order[i][0]] = order[i][1];
        post[order[i][1]] = order[i][0];
    }

    deque<int> myStack;
    myStack.push_back(0);
    visit[0] = true;
    while (!myStack.empty()) {
        int node = myStack.back();
        myStack.pop_back();
        for (int i = 0; i < myTree[node].size(); i++)
        {
            int target = myTree[node][i];
            if (visit[target] == true) continue;
            if (pre[target] != -1) {
                if (hang[pre[target]] != -1) {
                    myStack.push_back(pre[target]);
                }
                myStack.push_back(target);
            }
            else if (post[target] != -1) {
                if (visit[post[target]]) {
                    myStack.push_back(target);
                }
                else
                    hang[target] = post[target];
            }
            else {
                myStack.push_back(target);
            }
            visit[target] = true;
        }
    }
    for (size_t i = 0; i < n; i++) {
        if (visit[i] != true) return false;
    }
    return true;
}
```

## 🔨 문제 후기

매우 힘든 문제였다. 처음 풀었다가 효율성 마지막 번호만 통과하지 못하는 최악의 상황을 통과하지 못했다.

단순하게 스택-큐 같이 넣어 버린다면 효율성 마지막 케이스에서 시간초과가 뜰 것이다.

또한 이 미친 제출자는 0번 방을 들리기 전에 필요한 선행조건을 테스트 케이스로 만들어놨으니 주의.

걍풀지마세요. 답보고 푸세요.😁😁😁🤣🤣🤣
