---
title: '[leetcode][30] Substring with Concatenation of All Words 문제풀기!'
pubDate: 2021-01-19T14:41:20.091Z
description: '문제풀러가기✈문자열과 단어집을 줄테니 단어집의 모오오오든 단어를 포함하는 문자열의 부분 집합을 찾아줘!!자세한 문제 설명과 릿코드 홈페이지 참고. 문제풀러가기단순히 Brute force 기법을 쓴다면 시간제한에 걸리게 된다.자료구조 Map을 통해 특정 문자를 logN '
category: 'tech'
series: 'algorithms'
tags:
  - algorithm
  - leetcode
  - leetcode-hard
---

---

- [문제풀러가기✈](https://leetcode.com/problems/substring-with-concatenation-of-all-words/)

---

## 👓 문제 요약

문자열과 단어집을 줄테니 단어집의 모오오오든 단어를 포함하는 문자열의 부분 집합을 찾아줘!!


> 자세한 문제 설명과 릿코드 홈페이지 참고. [문제풀러가기](https://leetcode.com/problems/substring-with-concatenation-of-all-words/)

## 🔑 문제 풀이

단순히 Brute force 기법을 쓴다면 시간제한에 걸리게 된다.
자료구조 Map을 통해 특정 문자를 logN 시간만에 접근하는 방법을 통해 풀자!

#### 그래서 제가 어떻게 풀었냐면 !!


단어집의 모든 단어를 map 자료구조에 할당하고 

단어집의 모든 단어를 합친 길이 만큼 문자열에서 떼와서 검사를 했다.

당연히 통과할 줄 알았는데, 단순히 map 자료형으로는 시간적 제한을 통과하지 못했다.

그래서 찾아본 결과 !! 

뚜둔

#### Map과 HashMap의 차이를 아시나요?

-   **Map** 자료형은 레드블랙트리 기반으로 되어 있습니다.
    모든 데이터는 정렬되어 저장이 됩니다.
    레드블랙트리는 Binary Search Tree 에 Self-Balancing 기능이 추가된 자료구조 입니다.
    Search 에 Time complexity 가 O(logN) 을 보장하긴 하지만 키 삽입, 제거 할 때마다 트리를 보정하는 비용이 들어가기 때문에 성능이 저하될 수 있습니다. 물론 O(logN) 을 크게 벗어나진 않습니다.

-   HashMap 은 hash table 을 통해 자료에 접근하게 따라서 데이터를 정렬하지 않습니다. 
    충분한 크기의 hash table 이 주어진다면, 데이터의 삽입, 제거, 검색시에 성능저하가 거의 일어나지 않습니다.


저는 기본적인 Map 자료구조를 이용했을 때 문제의 시간제한을 통과하지 못했습니다.
다른거는 전부 그대로 두고 hash table 을 사용하니 바로 통과하더군요!!

만약 데이터의 양이 매우 많아진다면 Hash Table 을 사용하는 것도 좋은 선택인 것 같습니다.


## 🥽 소스코드 및 소스해석

```cpp
#include<vector>
#include<string>
#include<algorithm>
#include<unordered_map>
using namespace std;
vector<int> findSubstring(string s, vector<string>& words);
bool testSubstringMatch(string& s, int start, int end, int wordLength, int wordsSize);
unordered_map<string, int> mapWord;

int main() {
	findSubstring(in2[0], inp);
}

vector<int> findSubstring(string s, vector<string>& words) {
	vector<int> ans;
	if (s.size() < words[0].size() * words.size()) 
		return ans;
	for (int i = 0; i < words.size(); i++){
		mapWord[words[i]]++;
	}
	for (int i = 0; i <= s.size() - words[0].size(); i++) {
		if (testSubstringMatch(s, i, i + words[0].size() * words.size(), words[0].size(), words.size())) {
			ans.push_back(i);
		}
	}
	return ans;
}

bool testSubstringMatch(string& s, int start, int end, int wordLength, int wordsSize) {

	unordered_map<string, int> mapTemp;
	int count = 0;
	for (int i = start; i < end; i += wordLength) {
		string compareStr = s.substr(i, wordLength);
		mapTemp[compareStr]++;
		if (mapTemp[compareStr] <= mapWord[compareStr])
			count++;
		else
			return false;
	}
	if (count == wordsSize)
		return true;
	return false;
}


```

## 🔨 문제 후기

자료구조에 대해 더 신경써야할 시간이 온 것 같다. !!!!
Hard 문제는 확실히 일반 문제랑 조금 다르다.!! 
