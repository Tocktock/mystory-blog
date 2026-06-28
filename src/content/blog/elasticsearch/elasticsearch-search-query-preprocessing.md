---
title: '[🌎elasticsearch] search query 집중탐구 - 1 전처리 과정'
pubDate: 2021-01-26T15:10:50.566Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈Elasticsearch 는 "text" 로 매핑된 필드의 경우 그 안에 데이터를 Inverted Index 라는 구조로 저장합니다.직역하자면 역 색인, 반대 색인 이런 뜻인데 대충 감이 오시'
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 8
tags:
  - elasticsearch
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

## 🧡 ElasitcSearch Full-Text-Search 의 원리

### 🙂Inverted Index

Elasticsearch 는 "text" 로 매핑된 필드의 경우 그 안에 데이터를 Inverted Index 라는 구조로 저장합니다.

직역하자면 역 색인, 반대 색인 이런 뜻인데 대충 감이 오시나요??

예들 들어보겠습니다.
아래와 같은 데이터가 있다고 합시다.

| Id  | Description             |
| --- | ----------------------- |
| 1   | "Cat is Cute"           |
| 2   | "Dog is Cute Too"       |
| 3   | "Cat is lazy"           |
| 4   | "Dog is super athletic" |

일반적인 DBMS 에서는 **"athletic"** 을 검색하고 싶다하면 1번 ,2번, 3번, 4번 순서로 검색해서
**"athleti"** 이 있구나 Id 4를 보여줘야지. 라고 할 겁니다.

Inverted Index 는 조금 다릅니다.
토큰마다 값을 가지는데, 이 값은 "이 문서에 이 토큰 값이 포함되어 있어."를 저장합니다.
위의 테이블을 아래와 같은 식으로 저장합니다.

| Token      | Id   |
| ---------- | ---- |
| "cat"      | 1, 3 |
| "dog"      | 2, 4 |
| "cute"     | 1, 2 |
| "lazy"     | 3    |
| "athletic" | 4    |
| "super"    | 4    |

이 같은 경우 "athletic" 토큰이 포함된 4번 문서만 보면 됩니다. 다만 토큰을 빨리 찾기 위해 저장하는 자료구조는 좀 복잡해질겁니다.
괜찮습니다. **Elasticsearch 가 대신해줄거거든요!!**

🛑🛑 단 이렇게 저장되는 건 오직 필드가 **text** 타입일 때만 적용됩니다.
다른말로 하자면 text 필드가 아니면 전문검색 기능을 쓸 수 없습니다!!

### 🙂Analizer

위의 예시에서 눈치채신 분도 계시겠지만, 처음 테이블의 내용을 Inverted Index 방법으로 저장할 때 전부 소문자로 바뀌어서 저장이 되었습니다.
그리고 저장되지 않은 단어들도 있군요. 이 과정을 **Text Analysis** 라고 합니다.
이 과정을 거치지 않고 진행하게 되면 검색에 필요 없는단어 가령 "is", "too" 까지 저장해야합니다.

우리가 "dOG" 라고 검색해도 "Dog" 가 포함된 문서를 보고 싶다면 토큰화하는 과정에 전처리 과정을 수행해야합니다.

#### 1. Character Filter

**Character Filter** 는 전처리과정에서 가장 먼저 수행되는 과정입니다.
**Character Filter** 에는 **HTML Strip, Mapping, Pattern Replace** 세 가지가 존재합니다.

- **HTML Strip** : 문장에 HTML 태그들을 없애주는 Filter 입니다. 예를들면,
  `<p>I&apos;m so <b>happy</b>!</p>` 라는 문장을 `I'm so happy!` 로 바꿔줍니다.
- **Mapping** : 특정 문자열을 내가 원하는 값으로 대체할 수 있습니다.
- **Pattern Replace** : 특정 정규식 패턴을 내가 원하는 값으로 대체할 수 있습니다.

#### 2. Tokenizer Filter

**Tokenizer Filter** 는 문자열을 받아 단어들을 토큰화하는 과정입니다.
Tokenizer Filter 는 많은 종류가 있는데 대표적인 3가지를 먼저 알아보겠습니다.

- **Standard** : 토큰화 할 때 **공백과 hyphen(-)을** 기준으로 토큰화를 수행하며, 일부 특수문자를 제거합니다.
- **Letter** : 토큰화 할 때 **문자열 이외**를 기준으로 토큰화를 수행합니다.
  예들 들어 `Brown-Foxes dog's` 같은 문자열은 [Brown, Foxes, dog, s] 로 토큰화를 수행합니다.
- **Whitespace** : **공백** 을 기준으로 토큰화를 수행합니다. 공백, 줄바꿈, 탭 모든 공백을 포함합니다.

> Email, URL, Path 와 특수 목적용 Tokenizer 들이 많으니 자세한 정보는 [Tokenizer Document](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html) 를 참조해주시와요.!!

#### 3. Token Filter

**Token Filter** 는 각 Tokenizer Filter 에 의해 만들어진 Token 들에 대한 후처리 작업을 수행합니다.
가장 대표적인 Lowercase Token Filterr 로 Stop Token Filterr 가 있습니다.

- **Lowercase** : 말 그대로 토큰들을 소문자로 바꾸는 Token filter 입니다.
- **Stop** : Search 기능에 필요 없는 단어들 예를 들면 is, be, to, a, as 등을 없애는 필터입니다.

> 더 많은 Token filter 를 보고 싶으면 [Token Filters](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/analysis-tokenfilters.html) 를 참조해주세요!! 오른쪽 메뉴바에 다양한 Token filters 가 있습니다.

#### 4. Stemming

또한 각 토큰들은 그 원형을 유지할 필요가 있습니다. 예를 들면 `working` 에서 `ing` 는 필요 없는 부분이며 우리는 work 만 검색하면 됩니다.
이러한 과정을 Stemming 이라고 합니다.

### ETC

우리가 문서에 영어만 쓰는 것은 아닙니다. 대부분 그 나라에서는 그 나라 언어를 많이 쓸 것입니다.
ElasticSearch 에 내장된 언어분석기가 없다면, Full-Text-Search 에 난항을 겪을지도 모릅니다.
다행이도 한글의 경우는 Nori 한글 형태소 분석기를 이용하여 이 과정을 수행합니다.

> 자세한 내용은 Elasticsearch Document 를 참고해주세요!! [Nori Analysis Plugin 구경하기](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/analysis-nori.html)

---

위 과정을 통해 저장된 토큰들을 통해 Search API 기능들을 수행합니다.

다음에는 query 를 통해 실제 예제로 찾아뵙겠습니다.

피드백은 항상 환영입니다.
