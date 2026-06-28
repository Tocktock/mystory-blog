---
title: '[프로그래머스][2019 kakao] 길 찾기 게임 문제 해설'
pubDate: 2021-01-13T08:45:18.079Z
description: '정답률 : 7.40%문제풀러가기"전무"로 승진한 라이언이 왕따인 이유를 알려주는 문제."전무" 라이언이 x, y 좌표값을 주면 우리 친구들이 x, y 를 전부 순회를 마친 팀이 이기는 "라이언만" 재미있는 게임이다.x, y 좌표는 사실상 트리의 구성요소라고 생각하면 된'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2019
  - 프로그래머스
---

---

- 정답률 : 7.40%
- [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42892)

---

## 문제 요약

"전무"로 승진한 라이언이 왕따인 이유를 알려주는 문제.
"전무" 라이언이 x, y 좌표값을 주면 우리 친구들이 x, y 를 전부 순회를 마친 팀이 이기는 "라이언만" 재미있는 게임이다.

- x, y 좌표는 사실상 트리의 구성요소라고 생각하면 된다.
- 이진트리의 모양을 가졌으며 x 값이 node 의 data, y가 node 의 레벨 이라 생각한다.

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42892)

## 문제 풀이

x, y 좌표를 가지고 트리를 만들어 순회시키면 끝나는 문제.
모든 요소들은 이진트리를 만족하기 위한 조건을 가지고 있으므로 맘 놓고 트리를 만들면 된다.

## 소스코드 및 소스해석

리스트로 짜도 되지만 귀찮기 때문에 vector를 이용하여 트리의 정보를 저장한다.
x, y, left, right, 들어올 때 index 를 저장하는 Node 구조체를 생성하고, 트리를 **잘** 만들어 주면 된다. 트리를 만들기 힘들다고 느껴지면 노트장 펴고 펜으로 먼저 순서를 적어가며 하는 것을 추천함.

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

struct Node {
    int x, y;
    int left, right;
    int myindex;
};

vector<vector<int>> solution(vector<vector<int>> nodeinfo);
void myInsert(int nodeIndex, vector<int> insertNode);
void preorder(vector<int> &vec, Node node);
void postorder(vector<int>& vec, Node node);
bool comp(vector<int> a, vector<int> b) {
    if (a[1] == b[1]) return a[0] < b[0];
    return a[1] > b[1];
}
vector<Node> tree; // x,y,left,right 를 저장하는 노드를 가진 트리
vector<vector<int>> levelInfo;
int treeIndex;
int main() {
    vector<vector<int>> nodeinfo = { {5, 3}, {11, 5}, {13, 3}, {3, 5}, {6, 1}, {1, 3}, {8, 6}, {7, 2}, {2, 2} };
    solution(nodeinfo);
}
vector<vector<int>> solution(vector<vector<int>> nodeinfo) {
    vector<vector<int>> answer;
    for (size_t i = 0; i < nodeinfo.size(); i++)
        nodeinfo[i].push_back(i + 1);
    sort(nodeinfo.begin(), nodeinfo.end(), comp);
    tree.push_back(Node{nodeinfo[0][0], nodeinfo[0][1], -1, -1, nodeinfo[0][2]});

    for (size_t i = 1; i < nodeinfo.size(); i++)
        myInsert(0, nodeinfo[i]);


    //순회
    vector<int> preVec,postVec;
    preorder(preVec, tree[0]);
    postorder(postVec, tree[0]);
    answer.push_back(preVec);
    answer.push_back(postVec);

    return answer;
}
void myInsert(int nodeIndex, vector<int> insertNode){

    //x 값을 기준으로 왼쪽 오른쪽 체크한다
    if (tree[nodeIndex].x > insertNode[0]) {
        if (tree[nodeIndex].left == -1) {
            tree.push_back(Node{insertNode[0], insertNode[1], -1, -1, insertNode[2] });
            tree[nodeIndex].left = tree.size() - 1;
        }
        else {
            myInsert(tree[nodeIndex].left, insertNode);
        }
    }
    else {
        if (tree[nodeIndex].right == -1) {
            tree.push_back(Node{insertNode[0], insertNode[1], -1, -1,insertNode[2] });
            tree[nodeIndex].right = tree.size() - 1;
        }
        else {
            myInsert(tree[nodeIndex].right, insertNode);
        }
    }
}
void preorder(vector<int> &vec, Node node) {
    vec.push_back(node.myindex);
    if(node.left != -1)
        preorder(vec,tree[node.left]);
    if (node.right != -1)
        preorder(vec, tree[node.right]);
}
void postorder(vector<int>& vec, Node node) {
    if (node.left != -1)
        postorder(vec, tree[node.left]);
    if (node.right != -1)
        postorder(vec, tree[node.right]);
    vec.push_back(node.myindex);
}
```

## 문제 후기

문제의 난이도에 비해 정답률이 낮은 것이 좀 의아하다.

내 친구가 라이언 같은 놈이라면 절교한다.
