---
title: '[🌎elasticsearch] Elasticsearch search 기본사용법 (feat. Kibana)'
pubDate: 2021-01-13T08:57:23.946Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈이번에는 ElasticSearch 를 쓰는 이유중 하나인 전문검색 (Full Text Search) 의 간단한 기능을 알아보고자 합니다.이 부분에 대해서는 내용이 워낙 방대하다보니 제 글은 맛'
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 5
tags:
  - elasticsearch
  - kibana
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

## 🧡 ElasticSearch 의 진정한 기능 Full Text Search!!

이번에는 ElasticSearch 를 쓰는 이유중 하나인 전문검색 (Full Text Search) 의 간단한 기능을 알아보고자 합니다.
이 부분에 대해서는 내용이 워낙 방대하다보니 제 글은 맛보기 용으로 생각해주시고 [Elasticsearch 가이드북](https://esbook.kimjmin.net/) 을 더 참고해주시면 감사하겠습니다.!

## 👓전문검색?

전문검색은 간단한 예시로 네이버의 검색, 구글의 검색 기능을 생각하시면 편합니다.
데이터베이스의 특징인 특정 단어의 포함 여부, 조건문의 기능과 유사하지만 특정 단어와의 상관관계에 대한 색인기능이 추가되어 있다고 생각하시면 됩니다.

글로만 읽어도 엄청 복잡합니다. 바로 예시 들어가겠습니다.
일단 ElasticSearch 와 Kibana 를 켜 주시고 Kibana DevTools 로 들어가주세요! 이전에 했으니 여러분 다 할 수 있습니다!

## 😂 일단 해보자!

먼저 이전에 배운 bulk 키워드를 통해 검색할 데이터를 먼저 생성합시다!!
copy copy~

```http
POST _bulk
{ "index" : { "_index*" : "test", "_id" : "1" } }
{ "field1" : "i love my cute cat" }
{ "index" : { "_index" : "test", "_id" : "2" } }
{ "field1" : "my dog is so big" }
{ "index" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "i am big" }
{ "index" : { "_index" : "test", "_id" : "4" } }
{ "field1" : "my girl friend is cute" }
```

제일 먼저 간단한 검색인 URI 검색부터!

```http
GET test/_search?q=dog
```

자 그럼 다음과 같은 결과가 나올겁니다!

```json
{
    "took" : 0,
    "timed_out" : false,
    "_shards" : {
        "total" : 1,
        "successful" : 1,
        "skipped" : 0,
        "failed" : 0
    },
    "hits" : {
        "total" : {
        "value" : 1,
        "relation" : "eq"
        },
        "max_score" : 1.1516262,
        "hits" : [
            {
                "_index" : "test",
                "_type" : "_doc",
                "_id" : "2",
                "_score" : 1.1516262,
                "_source" : {
                "field1" : "my dog is so big"
                }
            }
        ]
    }
}
```

**"hits"** 필드를 주목합시다. 만약 해당 검색에서 아무런 결과가 없다면 이 필드안에는 아무 값이 없습니다.
**"hits"** 필드 안에 내용을 잘 보시면 **\_score** 항목이 있습니다. 위에서 검색한 키워드인 "dog" 와 얼마나 상관관계가 있는지에 대한 점수 입니다. 정말 유용한 지표죠?

URI 검색은

```http
GET <index>/_search=?q=<value>
```

와 같은 형태의 검색을 말합니다. Request Body 에 옵션을 붙여서 더 자세한 검색이 가능합니다.
다음 명령어는 test 인덱스의 field1 의 필드에서만 "dog" 를 검색하는 기능입니다.

```http
GET test/_search
{
    "query": {
        "match": {
        "field1": "dog"
        }
    }
}
```

만약 특정 인덱스의 모든 document 를 검색하고 싶다면 다음과 같이 해주세요!.

```http
GET my_index/_search
{
    "query":{
        "match_all":{ }
    }
}
```

---

자자자 기본적인 기능을 배웠습니다.

다음에는 좀더 심화내용을 배워봅시다! 다음 내용을 보기 전에 커피 스윽~ 스트레칭 쭈욱 하고 오세용~🧡🧡
