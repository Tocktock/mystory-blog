---
title: '[🌎elasticsearch] Elasticsearch 타입에 대해서 알아보자!'
pubDate: 2021-01-19T16:54:28.724Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈ElasticSearch 의 다양한 기능들을 둘러보기 전 꼭 알아야 할 타입들에 대해서 알아보겠습니다.!!진짜 진짜 진짜 중요하니 꼭 커피 스윽 마시고 읽어주세요!!Mapping 어떻게 Ela'
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 7
tags:
  - elasticsearch
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

ElasticSearch 의 다양한 기능들을 둘러보기 전 꼭 알아야 할 타입들에 대해서 알아보겠습니다.!!
진짜 진짜 진짜 중요하니 꼭 커피 스윽 마시고 읽어주세요!!

## 🍔 Mapping

Mapping 어떻게 ElasticSearch 의 문서들이 저장되고 색인 되었는지에 대한 정의입니다.
이 Mapping 의 정의를 통해 불필요한 프로세스 들과 공간 낭비를 줄이고 필요한 기능을 사용할 수 있습니다.
예를 들면,

- 어떤 필드들이 Full-Text-Search 의 대상이 되어야 하는가?
- 어떤 필드들이 숫자, 날짜, 위치 정보를 포함하는가?

또한 이후 포스트에서 Dynamic Mapping 을 다룰 때에도 Mapping 과 타입에 대한 기본 개념이 필요합니다.

## 🍟 Field Data Type

먼저 이번 포스트에서는 Metadata Fields 가 아닌 Properties 에 대한 Field Type 다룹니다.

> Metadata Fields 는 "\_index", "\_id", "\_source" 와 같이 metadata 와 관련된 녀석들입니다!

먼저 중요한 녀석들을 뽑자면,

- Text
- Keyword
- Numbers
- Date
- Object

그 외에

- Nested

등이 있습니다.

> 더 자세한 내용은 [👆엘라스틱 홈페이지 참고하기!!](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html#structured-data-types)

## 🍕Keyword & Text

요 두 녀석은 정말 중요합니다.

- **keyword** 는 exact search, sorting, aggregations 등을 위한 녀석입니다. 예를 들면 Id, Email, Tag 등을 검색할 때 유용합니다.
- **text** 는 Full-Text-Search 기능을 위한 녀석입니다. 우리가 검색하려는 단어와 최대한 관련된 검색을 위해 사용하는 놈 입니다!

기본적으로 우리가 어떤 필드 타입을 지정해주지 않고 문자열 데이터를 넣게 되면 (지정 안해도 가능합니다.)
ElasticSearch 는 이 필드가 어떤 용도로 사용될 지 알 방법이 없기 때문에 keyword 와 text 타입을 같이 지정해주어 색인과정을 진행하게 됩니다.

keyword 와 text 의 두 기능이 모두 필요하다면 keyword 와 text 타입을 같이 지정해주는 것이 정말 유용합니다.

하지만 예를 들어봅시다.
문서의 작성자를 검색을 하고 싶습니다. 작성자를 Email 이라고 합시다.
우리가 검색할 단어와 Email 이 비슷한지는 상관관계를 따질 필요가 없습니다.
오직 keyword 타입의 필드만 있으면 되겠죠.

그럼 Email 필드에 text 타입은 불필요한 타입이고, 이는 disk 공간을 낭비하게 됩니다.
만약 문서가 수백만 수천만개가 넘어간다면 이는 무시할 수 없는 공간일 것 입니다.

이는 반대도 마찬가지 입니다.

필드에 필요한 Type 만 지정하는 것은 결국 disk 비용을 줄이는 결과를 가져오겠죠??
비용은 매우 중요하니까 꼭 필요한 만큼만 씁시다!!

## 🥞 Numbers

숫자 또한 중요하지만 알아야 할 개념은 많지 않습니다.
만약 JSON 형식의 데이터가 날라와 저장하는데 정수 형식이다 그러면 Long 타입으로,
실수 형식이다 그러면 Double 타입으로 자동으로 매핑됩니다.

자 여기서 질문. 왜 Long 이고, Double 일까?

ElasticSearch 는 지정되지 않은 타입에 대해서 정보가 없습니다.

다시말해 정수가 저장되면 이 정수의 범위가 어떻게 될지에 대해서 알 수 없습니다.
그렇기 때문에 Interger 가 아니라 더 큰 수를 담을 수 있는 Long 타입에 매핑하는 것 입니다.
Double 또한 마찬가지 입니다.

하지만 무조건 Long, Double 타입을 사용하는건 좋지 않습니다.
이전에 이미 말했지만 비용은 매우 중요합니다. Integer 의 범위면 충분한데 Long 을 사용하는 것은 disk 공간을 낭비하는 행동이겠죠?

만약 정확하게 특정 필드가 다룰 숫자의 범위를 안다면 그에 맞게 사용하시는 것이 좋습니다.

## 🍗 Date

JSON 형식의 데이터에는 이 필드는 date 타입이다!! 라고 알려주는 지표가 없습니다.
우리가 JSON 형식으로 데이터를 주고 받을텐데.. ElasticSearch 는 이걸 어떻게 알까요?

ElasticSearch 는 매우 유용한 기능을 가지고 있습니다.

이 필드가 Date 타입인지 아닌지 **유추**하는 것이죠

문자열 필드이며, Date 정보를 포함하고 있다면 예들들어 다음과 같은 형식이라면

    { "date": "2015-01-01" }
    { "date": "2015-01-01T12:10:30Z" }

ElasticSearch 는 아!! 이 필드는 Date 타입이구나! 라고 추론하게 됩니다.

물론 이 형식은 아래와 같이 형식을 정할 수 있습니다.

    "mappings": {
        "properties": {
            "date": {
                "type":   "date",
                "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
            }
        }
    }

아직 mapping 하는 법을 배우진 않았지만 format 형식을 보면서 아 이런 식으로 지정 가능하구나 라고 아시면 될 것 같습니다.

또한 미리 지정한다면 Interger, Long 타입을 Date 필드로 표현이 가능도 합니다.

- Integer 타입은 1970년 1월 1일 부터 초를 단위로 계산한 값입니다.
- Long 타입은 1970년 1월 1일부터 밀리초를 단위로 계산한 값입니다.

## ☕ Object

JSON 의 데이터 형식은 Object 라고 보시면 됩니다.
계층적으로 내부 Object 를 다시 포함하게 되죠.

ElasticSearch 에서는 사실 Object 라는 타입이 애매모호합니다.

예를 들어

    {
        "region": "US",
        "manager": {
            "age":     30,
            "name": {
            "first": "John",
            "last":  "Smith"
            }
        }
    }

이런 데이터가 있다면 ElasticSearch 는 내부적으로

    {
        "region":             "US",
        "manager.age":        30,
        "manager.name.first": "John",
        "manager.name.last":  "Smith"
    }

점을 통해 저장합니다. 따라서 내부적으로 본다면, "Object 라는 타입은 없다." 라고도 할 수 있겠네요.

## 🥧 Nested

Nested 타입은 배열과 관련이 있습니다.
더 자세하게 말하면 Object 의 배열을 색인 하기 위한 특수 타입이라고 보시면 되겠네요.

이전에 말했던 것 처럼ElasticSearch 내부적으로는 Object 라는 타입이 없다. 라고 말씀드렸는데요.

    {
        "group" : "fans",
            "user" : [
                {
                "first" : "John",
                "last" :  "Smith"
                },
                {
                "first" : "Alice",
                "last" :  "White"
                }
            ]
    }

이와 같은 타입은 어떻게 저장되어야 할까요? user.first 는 여러개 있으니 배열로 저장해야 할 것입니다.
다음과 같이요.

    {
        "group" :        "fans",
        "user.first" : [ "alice", "john" ],
        "user.last" :  [ "smith", "white" ]
    }

이렇게 저장되면 alice white 라는 이름과 john smith 이름의 연관성은 사라지게 됩니다.

순수히 user.first 에 "alice", "john" 이 저장되었고
마찬기자로 user.last 에 "smith", "white" 이 저장되었기 때문이죠.

다시말해 smith 라고 검색한다면 alice 가 튀어나올 수도 있는 상황이라는 겁니다.

이를 해결하기 위해 Nested 라는 타입을 지정할 수 있습니다.
Nested 를 사용하게 되면 ElasticSearch 는 배열을 내부적으로 숨겨진 문서에 해당 내용을 따로 저장하게 됩니다.

만약 user 가 11명이라면, 11개의 숨겨진 user 문서와 1개의 본 문서가 저장되겠네요.

문서가 늘어난다는 것은 검색 비용이 늘어난다는 말입니다.
유의해서 써라... 이 말이죠.

## 😂 끝 입니다!!

끝이라 적고 한가지만 더 말씀드리자면..
이 Mapping 을 통해 데이터 타입을 정하고 인덱스를 만들었습니다.
그리고 엄청난 양의 데이터를 만들고 나니 데이터의 타입을 변경해야할 상황이 오게 되면...

인덱스를 삭제하고 다시 만드는 Reindex 과정이 필요합니다... 그러니 반드시.. 심사숙고해서.. 만드세요..

---

짞짞짞 고생 많으셨습니다.!! 잠시 눈 운동하고 쉬고 계세요!!

다음에는 또 어려운 내용으로 찾아뵐게요.. 흑흐구 ㅜㅜ 공부할 수록 알아야할 내용이 많습니다.
