---
title: '[프로그래머스][2019 kakao] 후보키 문제 해설'
pubDate: 2021-01-13T08:49:15.517Z
description: '정답률 : 16.09%문제풀러가기input 으로 들어오는 릴레이션의 정보를 토대로 후보키 를 생성할 수 있는가에 대한 문제최소성과 유일성을 만족해야한다유일성 : 해당하는 릴레이션에 대해 유일하게 식별 가능해야한다.최소성 : 키를 구성하는 속성 중 하나라도 제외 하는 경'
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - kakao2019
  - 프로그래머스
---

---

- 정답률 : 16.09%
- [문제풀러가기](https://programmers.co.kr/learn/courses/30/lessons/42890)

---

## 문제 요약

- input 으로 들어오는 릴레이션의 정보를 토대로 **후보키** 를 생성할 수 있는가에 대한 문제
- **최소성**과 **유일성**을 만족해야한다
- **유일성** : 해당하는 릴레이션에 대해 유일하게 식별 가능해야한다.
- **최소성** : 키를 구성하는 속성 중 하나라도 제외 하는 경우 유일성이 사라지는 것을 의미한다. 즉 필요하지 않은 속성은 후보키에 포함되지 않아야 한다는 것.
  > 자세한 설명과 제한사항은 프로그래머스에서 확인바랍니다.

## 문제 풀이

가능한 모든 속성들의 조합을 만들고, 최소성과 유일성을 만족하는 조합만 추려내야한다.
DFS, BFS, bit 등을 이용한 방법을 통해 **유일성을 만족하는** 부분집합을 만들고 각 조합들의 최소성과 검사하면 풀어나갈 수 있다.

> 예를 들면 속성(1 ,3)과 속성 (1, 2, 3) 후보키 집합이 존재한다면 후자는 최소성을 만족하지 못한다.

## 소스코드 및 소스해석

> 프로그래머스 사이트가 아닌, visual studio 에서 코드를 작성해서 그대로 가져온 것 입니다. 일부 테스트 코드가 존재합니다.

- DFS 방법으로 먼저 유일성을 만족하는 모든 조합을 추려냅니다.
- 각 속성의 상태를 저장한 **ansVec** 을 검사해 최소성을 만족하는 조합만 카운트 합니다.
  > **추가설명** : ansVec은 flag 용도로 쓰입니다. 0번 인덱스에 몇개의 속성을 가지고 있는지를 저장하고 각 1번 ~ 15번 인덱스에는 조합에서 사용하는 속성에 1의 값을 넣어 다른 조합들과 비교합니다. ansVec은 속성 수를 기준으로 한번 정렬을 했기 때문에 순서대로 비교하면 최소성을 만족하는 조합들만 카운트 할 수 있습니다.

```cpp
#include <string>
#include <vector>
#include <algorithm>

//https://programmers.co.kr/learn/courses/30/lessons/42890

using namespace std;
void DFS(vector<vector<string>>& relation, vector<int> col);
bool check(vector<vector<string>>& relation, vector<int> col);
int solution(vector<vector<string>> relation);
bool comp(vector<int> a, vector<int> b) { return a[0] < b[0]; }
bool colChecked[16];
vector<vector<int>> ansVec;

int main() {
    //각각 2, 1, 2, 1 ,5 가 나와야함
    vector<vector<string>> relation = { {"100","ryan","music","2"},{"200","apeach","math","2"},{"300","tube","computer","3"},{"400","con","computer","4"},{"500","muzi","music","3"},{"600","apeach","music","2"} };
    vector<vector<string>> relation2 = { {"a","b","c"}, {"1","b","c"}, {"a","b","4"}, {"a","5","c"} };
    vector<vector<string>> relation3 = { {"a","1","4"}, {"2","1","5"}, {"a","2","4"} };
    vector<vector<string>> relation4 = { {"a","aa"}, {"aa","a"}, {"a","a"} };
    vector<vector<string>> relation5 = { {"b","2","a","a","b"},
{"b","2","7","1","b"},
{"1","0","a","a","8"},
{"7","5","a","a","9"},
{"3","0","a","f","9"} };
    solution(relation4);
}

int solution(vector<vector<string>> relation) {
    int answer = 0;
    for (int i = 0; i < relation[0].size(); i++) {
        colChecked[i] = true;
        DFS(relation, vector<int>(1,i));
        colChecked[i] = false;
    }
    //check overlapping element
    sort(ansVec.begin(), ansVec.end(), comp);
    for (int i = 0; i < ansVec.size(); i++) {
        for (int j = i + 1; j < ansVec.size(); j++)
        {
            int count = 0;
            for (int k = 1; k < 16; k++) {
                if (ansVec[i][k] == 1 && ansVec[j][k] == 1 ) count++;
            }
            if (count == ansVec[i][0] && count != 0)
                ansVec[j][0] = 0;
        }
    }
    for (int i = 0; i < ansVec.size(); i++) {
        if (ansVec[i][0] != 0)
            answer++;
    }
    return answer;
}
void DFS(vector<vector<string>> &relation, vector<int> col) {
    //col check implement
    if (col.size() > relation[0].size())
        return;
    if (check(relation, col))
        return;

    for (int i = col.back() + 1; i < relation[0].size();i++) {
        if (colChecked[i] == true) continue;
        colChecked[i] = true;
        col.push_back(i);
        //checked out and add new col
        DFS(relation, col);
        colChecked[i] = false;
        col.pop_back();
    }
}
bool check(vector<vector<string>> &relation, vector<int>col) {
    //check if relation with selected col could be primary key
    vector<string> myVec;
    for (int i = 0; i < relation.size(); i++) {
        string strtemp ="";
        for (int j = 0; j < col.size(); j++) {
            strtemp += relation[i][col[j]] + " ";
        }
        auto iter = find(myVec.begin(), myVec.end(), strtemp);
        if (iter == myVec.end())
            myVec.push_back(strtemp);
        else
            return false;
    }
    vector<int> temp(16, 0);
    temp[0] = col.size();
    for (size_t i = 0; i < col.size(); i++)
        temp[col[i] + 1] = 1;
    ansVec.push_back(temp);

    return true;
}
```

## 문제 후기

최소성에 대한 부분을 여러번 고쳤다. 다른 사람들의 풀이를 보면 대부분의 실패 원인은 최소성에 관한 코드에서 발생한다.
카카오는 전반적으로 문제 설명이 깔끔하고 예제를 잘 보여주며, 구현능력을 상당히 중요하게 생각한다는 느낌을 받았다.
