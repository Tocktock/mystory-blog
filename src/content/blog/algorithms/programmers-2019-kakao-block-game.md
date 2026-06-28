---
title: '[프로그래머스][2019 kakao] 블록게임 해설'
pubDate: 2021-01-13T08:44:20.239Z
description: '정답률 : 5.85%문제풀러가기피지컬을 극복하려는 프로도의 피빠진 노력게임의 규칙은 간단하다.위에서 검은색 블록을 떨어뜨린다.검은블록을 포함하여 특정 블록이 직사각형의 형태가 되면 그 블록을 지울 수 있다.특정 블록은 무조건 한 개체여야하며 다른 개체와 섞여서는 안된다'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2019
  - 프로그래머스
---

- 정답률 : 5.85%
- [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42894)

---

## 문제 요약

피지컬을 극복하려는 프로도의 피빠진 노력

게임의 규칙은 간단하다.

- 위에서 검은색 블록을 떨어뜨린다.
- 검은블록을 포함하여 특정 블록이 직사각형의 형태가 되면 그 블록을 지울 수 있다.
- 특정 블록은 무조건 한 개체여야하며 다른 개체와 섞여서는 안된다.

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42894)

## 문제 풀이

테스트 케이스가 많지는 않기 때문에 검은블록을 0, 0 에서부터 n, n까지 다 떨어뜨려 본다.

## 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

- 풀이방법은 12가지의 블록 유형중 삭제될 수 있는지 판단하는 것과 일단 떨어뜨려 보는 것이 있다. (그 외에도 있을 듯) 나는 후자를 택했다.
- 블록을 감싼 직사각형의 Left Top 좌표와 Right Bottom 좌표를 획득하여 해당 하는 좌표 내에서 검은블록이 떨어지면 삭제될 수 있는지 판단한다.
- 위에서부터 차곡차곡 검사한다.

```cpp
#include <string>
#include <vector>
using namespace std;

struct Point {
    int x, y;
};
struct BlockInfo {
    Point lt, rb;
    vector<Point> pt; // x,y 반복체?
};

vector<int> getLTRB(BlockInfo block);
bool check(BlockInfo block, vector<vector<int>>& board);
int solution(vector<vector<int>> board);
void myRemove(BlockInfo block, vector<vector<int>>& board);

vector<BlockInfo> myblock(250);

int main() {
    vector<vector<int>> board = { {0,0,0,0,0,0,0,0,0,0} ,{0,0,0,0,0,0,0,0,0,0},{0,0,0,0,0,0,0,0,0,0},{0,0,0,0,0,0,0,0,0,0},{0,0,0,0,0,0,4,0,0,0},{0,0,0,0,0,4,4,0,0,0},{0,0,0,0,3,0,4,0,0,0},{0,0,0,2,3,0,0,0,5,5},{1,2,2,2,3,3,0,0,0,5},{1,1,1,0,0,0,0,0,0,5} };
    int answer = solution(board);
}

int solution(vector<vector<int>> board) {
    int answer = 0;
    for (int i = 0; i < board.size(); i++) {
        for (int j = 0; j < board.size(); j++) {
            if (board[i][j] == 0) continue;
            myblock[board[i][j]].pt.push_back(Point{ j, i });
            if (myblock[board[i][j]].pt.size() == 4) {
                vector<int> LTRB = getLTRB(myblock[board[i][j]]);
                myblock[board[i][j]].lt = { LTRB[0], LTRB[1] };
                myblock[board[i][j]].rb = { LTRB[2], LTRB[3] };
            }
        }
    }
    for (int i = 0; i < board.size(); i++) {
        for (int j = 0; j < board.size(); j++) {
            if (board[i][j] != 0) {
                bool isPossible = check(myblock[board[i][j]], board);
                if (isPossible == true) {
                    answer++;
                    myRemove(myblock[board[i][j]], board);
                }
            }
        }
    }
    return answer;
}

vector<int> getLTRB(BlockInfo block) {
    vector<int> LTRB = { 2147483647, 2147483647, -1,-1 };
    for (int i = 0; i < block.pt.size(); i++)
    {
        if (block.pt[i].x < LTRB[0]) LTRB[0] = block.pt[i].x;
        if (block.pt[i].x > LTRB[2]) LTRB[2] = block.pt[i].x;
        if (block.pt[i].y < LTRB[1]) LTRB[1] = block.pt[i].y;
        if (block.pt[i].y > LTRB[3]) LTRB[3] = block.pt[i].y;
    }
    return LTRB;
}
bool check(BlockInfo block, vector<vector<int>> &board) {
    for (int i = block.lt.y; i <= block.rb.y; i++)
    {
        for (int j = block.lt.x; j <= block.rb.x; j++)
        {
            if (board[i][j] == 0) {
                for (int k = 0; k <= i; k++)
                {
                    if (board[k][j] != 0)
                        return false;
                }
            }
            else if (board[i][j] != board[block.pt[0].y][block.pt[0].x]) {
                return false;
            }
        }
    }
    return true;
}
void myRemove(BlockInfo block, vector<vector<int>>& board) {
    for (int i = block.lt.y; i <= block.rb.y; i++)
        for (int j = block.lt.x; j <= block.rb.x; j++)
            board[i][j] = 0;
}
```

## 문제 후기

직사각형이라고 하길래

0 0 0 2  
0 1 2 2
1 1 1 2

이런식으로 나오면 두개 다 삭제해야하는 줄 알고 처음에 코드를 짯다가 낭패 맞았다. 문제가 애매하면 답이나 질문들을 먼저 참고하자.
