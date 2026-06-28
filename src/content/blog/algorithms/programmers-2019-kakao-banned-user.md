---
title: '[프로그래머스✈][2019 kakao 겨울 인턴십] 불량 사용자 문제 해설'
pubDate: 2021-01-13T08:52:18.041Z
description: '문제풀러가기✈우리가 사용자를 밴 할껀데 사실 나도 누가 밴 해야하는지 원본을 잃어버렸어... 혹시 가능한 경우의 수... 니가 좀 구해줄래? 일단 한번 보고 다 밴하던가 할게....문자열에 별표가 들어있다. 이 문자열의 별표는 알파벳과 숫자로 대체 가능하다. 조건에 맞'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2019
  - 프로그래머스
---

---

- [문제풀러가기✈](https://programmers.co.kr/learn/courses/30/lessons/64064)

---

## 👓 문제 요약

우리가 사용자를 밴 할껀데 사실 나도 누가 밴 해야하는지 원본을 잃어버렸어... 혹시 가능한 경우의 수... 니가 좀 구해줄래? 일단 한번 보고 다 밴하던가 할게....

문자열에 별표가 들어있다. 이 문자열의 별표는 알파벳과 숫자로 대체 가능하다. 조건에 맞는 유저들을 찾아라.

> 자세한 문제 설명과 제한 사항은 프로그래머스 홈페이지 참고. [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/64063)

## 🔑 문제 풀이

별표는 무조건 단 하나의 문자와 대응 가능하기 때문에 문제는 어렵지 않다.

2차원 배열을 만든 후 banned_id에 대응하는 user_id를 체크하고 각 경우의 수를 구한다면 나름 쉽게 풀 수 있다.

## 🥽 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

bool isMatch[10][10]; // ban, user 순
bool isUsed[10];
int bansize = 0;
vector<vector<int>> ansVec;
bool check(string userid, string banid);
void travel(int banidx, int userNum, vector<int> ans);
int solution(vector<string> user_id, vector<string> banned_id);

int main() {

    string s = "frodo";
    string test = s.substr(4);
    vector<string> user_id = { "frodo", "fradi", "crodo", "abc123", "frodoc" };
    vector<string> banned_id = { "fr*d*", "abc1**" };
    solution(user_id, banned_id);
}

int solution(vector<string> user_id, vector<string> banned_id) {
    int answer = 1;
    bansize = banned_id.size();
    for (size_t i = 0; i < banned_id.size(); i++)
        for (size_t j = 0; j < user_id.size(); j++)
            if (check(user_id[j], banned_id[i]))
                isMatch[i][j] = true;
    int startLine = -1;

    vector<int> ans;
    travel(0, user_id.size(), ans);

    return ansVec.size();
}
void travel(int banidx, int userNum ,vector<int> ans) {
    if (banidx == bansize) {
        sort(ans.begin(), ans.end());
        for (int i = 0; i < ansVec.size(); i++) {
            bool flag = true;
            for (int j = 0; j < ansVec[i].size(); j++){
                if (ans[j] != ansVec[i][j]) flag = false;
            }
            if (flag == true) return;
        }
        ansVec.push_back(ans);
        return;
    }
    bool isExist = false;
    for (size_t i = 0; i < userNum; i++)
        if (isMatch[banidx][i] == true) isExist = true;

    if (isExist == false) {
        travel(banidx + 1, userNum, ans);
        return;
    }

    for (size_t i = 0; i < userNum; i++){
        if (isUsed[i] == true) continue;
        if (isMatch[banidx][i] == true) {
            ans.push_back(i);
            isUsed[i] = true;
            travel(banidx + 1 , userNum, ans);
            ans.pop_back();
            isUsed[i] = false;
        }
    }
}
bool check(string user, string ban) {
    if (user.size() != ban.size()) return false;
    for (size_t i = 0; i < ban.size();i++)
    {
        if (user[i] != ban[i] && ban[i] != '*') return false;
    }
    return true;
}
```

## 🔨 문제 후기

BANNED 당한 유저를 \* 로 처리 해주는 센스...
항상 생각 하지만 문제는 현실의 요구를 반영하지 않는 것 같다.
