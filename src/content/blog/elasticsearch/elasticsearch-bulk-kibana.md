---
title: '[🌎elasticsearch] Elasticsearch bulk 기본사용법 (feat. Kibana)'
pubDate: 2021-01-13T08:56:37.743Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈이번에는 쉬어가는 타임으로 bulk 기능을 알아보죠~!하지만 반드시 필수 요소라는것 !!ElasticSearch 의 여러 명령을 실행하기 위해서는 bulk 기능이 정말 편리합니다.bulk 는 '
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 4
tags:
  - elasticsearch
  - kibana
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

이번에는 쉬어가는 타임으로 bulk 기능을 알아보죠~!
하지만 반드시 **필수 요소**라는것 !!

## 🚚🚚 Bulk One Shot!!

ElasticSearch 의 여러 명령을 실행하기 위해서는 bulk 기능이 정말 편리합니다.
bulk 는 기본적인 CRUD 명령 수행이 가능합니다.

바로 예를 보시죠!

```http
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
```

- bulk 기능은 POST 메소드로 "POST url/\_bulk" 로 사용 가능합니다.

  > kibana로 테스트 하시는 경우 url을 따로 지정안해주셔도 됩니다.
  > 커맨드로 하시는 경우는 POST localhost:9200/\_bulk 로 사용가능하십니다!

- 이후에 **Request Body** 를 포함하여 요청을 전송해야합니다.
  - create, index, update, delete 기능은 해당 키워드 안에 curly brace 로 묶습니다.
  - curly brace 안에는 **\_index 로서 원하는 인덱스, \_id로 원하는 id를 지정하여** 기능을 수행할 수 있습니다.
  - delete 를 제외한 create, index, update 다음에는 한 줄의 curly brace 단계가 더 있는데요. 이는 원하는 기능을 수행하기 위해 추가하는 필드입니다.
  - index 와 create 의 경우에는 **"field"** 키워드가 필요합니다.
  - update 의 경우에는 추가 필드에 **"doc"** 키워드를 이용해서 접근하셔야 합니다.

## 속도는 🚀🚀

기본적으로 한 번의 대량의 명령 데이터를 실행할 때는 bulk 기능을 쓰는 것이 속도가 빠릅니다.
최적의 데이터 명령 수를 알기 위해서는 벤치마크를 이용하여 처음에는 100, 200, 400 으로 늘려가며 테스트 해보는 것을 추천드립니다!! 어느정도 늘렸을 때 속도가 이전 단계보다 매우 완화된 상태라면 그 전단계가 최적화된 명령 개수입니다.

너무 많은 명령 데이터를 사용하게 되면 클러스터의 메모리에 과부하를 주게되니 명심하세요!

정말 공부할 수록 훌륭한 검색엔진입니다. 웹 공부를 하시는 분은 ElasticSearch를 무조건 강추!! 하는바입니다 ^^
