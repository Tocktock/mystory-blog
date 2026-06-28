---
title: '[🌎elasticsearch] Elasticsearch CRUD 기본사용법 (feat. Kibana)'
pubDate: 2021-01-13T02:17:55.587Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈ElasticSearch 의 search 와 Bulk 기능은 이후 포스트에서 다루겠습니다.CreateReadUpdateDeleteElasticSearch 에서는 REST APIs 안의 Docu'
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 3
tags:
  - elasticsearch
  - kibana
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

### ElasticSearch 의 기본 기능 CRUD 기능을 한번 살펴보겠습니다!.

> ElasticSearch 의 search 와 Bulk 기능은 이후 포스트에서 다루겠습니다.

## 👓 CRUD 는 ??

- Create
- Read
- Update
- Delete

ElasticSearch 에서는 REST APIs 안의 Document APIs 에서 해당 내용을 다루고 있습니다.

## 🔎 들어가기 전에!!

- Index

        ElasticSearch 의 Index 는 흔히 아는 배열의 인덱스와는 다르게 데이터베이스의 테이블과 유사한 개념을 가지고 있습니다.
        같은 NoSQL MongoDB 의 Collector 와 비슷하다고 생각하시면 편합니다.

- HTTP 프로토콜

        ElasticSearch 는 http 프로토콜로 접근제어가 가능합니다.

- RESTFul

        PUT, POST, GET, DELETE 메소드를 통해 자원을 제어할 수 있습니다.

## 😎 Kibana Dev Tool

기본적으로 리눅스의 Curl 기능 또는 vscode 의 rest client 등의 기능과 같이 URL을 이용해 자원에 접근제어를 할 수도 있지만 우리가 저번시간에 설치한 Kibana 의 Dev Tool 기능을 통해 Elastic 환경을 실습해보도록 하겠습니다.

정상적으로 Kibana 가 설치되고 실행이 되고 있다면 <http://localhost:5601> 에 접속하면 Kibana 어플리케이션 메인화면이 기다리고 있어요!!

![](/blog/elasticsearch-crud-kibana/91773fb6-7a7d-4fe0-bc56-17d1a9d977b8-kibana_main.png)

좌측 상단의 메뉴 버튼을 누른후 아래쪽의 Dev Tools 로 들어가줍니다.

<br>

![](/blog/elasticsearch-crud-kibana/4db7b8d4-4e41-4736-b137-dfd1e528ed48-stack_management.png)

<br><br>

![](/blog/elasticsearch-crud-kibana/1b97356d-df81-4c9e-9c9c-bdd8c069a084-devTools_main.png)

Dev Tools 콘솔에서 좌측에서 Curl 과 비슷한 기능을 수행하고 우측에서 그 결과를 볼 수 있습니다.

## 🔨 Create

일단 데이터베이스에서도 자원을 저장하고 사용하기 위해서 테이블을 만들듯이 ElasticSearch 에서도 이에 해당하는 Index 를 생성해줘야 합니다.

Index 생성에는 **PUT** 메소드를 사용하여 요청을 해야합니다.

> 일반적으로 생성에는 POST 갱신에는 PUT 메소드를 사용하지만 ElasticSearch 에서는 둘을 모호하게 사용합니다.

mydoc 이라는 Index 를 생성해봅시다.

        PUT mydoc

위의 텍스트를 Dev Tools 콘솔 좌측에 입력후 해당 줄에 생기는 ▶ 이렇게 생긴 삼각형 버튼을 누르면 해당하는 요청이 전송됩니다.

> Dev Tools 에서는 `http://<호스트>:<포트>/` 가 생략되어 있습니다.
> 즉 위의 요청은 원래대로라면 PUT http://localhost:5601/mydoc 입니다. Dev tools 에서는 이 사항이 동일시 적용됩니다.

바로 아래 이어서 첫 데이터를 생성해봅시다.

        POST mydoc/_doc
        {
        "title" : "first Title",
        "contents" : "first contents"
        }

우측에 바로

![](/blog/elasticsearch-crud-kibana/94ae8113-ade6-4e26-a39d-7eb01a3b8de5-fourth_result.png)

위와 같은 형식의 결과 데이터가 보인다면 성공입니다. 우측상단에 201 status 코드와 해당 요청을 수행하는데 걸린 시간 또한 표시가 됩니다.

저는 second, third 가 들어가는 데이터를 두개 더 만들었습니다.

> `POST <인덱스>/_doc/<아이디>` 처럼 아이디를 명시하지 않으면 임의로 아이디를 생성하게 됩니다.
> 해당하는 아이디가 존재할 경우 **생성**이 아니라 **갱신**을하게 되므로 조심해야 합니다.
> 또한 PUT 메소드를 통해 `PUT <인덱스>/_create/<아이디>` 처럼 생성만 가능하게도 할 수 있씁니다.

이제 확인을 해봅시다. 😎😎

좌측 상단의 메뉴 - 하단의 Stack Management 를 클릭합니다.

![](/blog/elasticsearch-crud-kibana/4db7b8d4-4e41-4736-b137-dfd1e528ed48-stack_management.png)

좌측 중간즈음 Kibana 카테고리 아래 Index Patterns 를 클릭합니다.
우리가 보려는 Index 를 명시하기 위해 Create Index pattern 을 클릭합니다.

![](/blog/elasticsearch-crud-kibana/79d7d790-12a3-45a1-a5df-195a459a6087-index_pattern_mydoc.png)

Index pattern name 칸에 mydoc 을 입력하고 Next Step 을 클릭합니다.

![](/blog/elasticsearch-crud-kibana/47918dd5-350a-4349-bd53-7c906a6924de-index_pattern_step2.png)

우리가 만든 데이터에는 시간 데이터가 없기 때문에 아무것도 선택하지 않아도 생성됩니다.
시간 데이터가 한 개 이상이라면 시간별로 데이터를 추적할 수 있습니다.
Create Index Pattern 을 클릭합시다.

이제 좌측 메뉴를 클릭 메뉴 상단의 Kibana - Discover 탭을 선택합니다.

여기서 우리가 위에서 입력했던 Index 의 데이터들이 나타나게 됩니다.

![](/blog/elasticsearch-crud-kibana/b8af6dd6-0e1b-4ef4-b21e-e6d855236790-three_hits.png)

데이터를 생성하는 것은 이제 끝났습니다.

## 🔨 Read

Read 는 매우 단순합니다!

        GET mydoc/_doc/cdRVaXYBNC5Keng2JJce

위와 같이 `GET <인덱스>/_doc/<아이디>` 형식으로 요청을 하게 되면 해당하는 데이터가
결과값으로 나오게 됩니다.!!

![](/blog/elasticsearch-crud-kibana/befc0aa8-6cd4-4332-b62b-92bd6ccba362-get_firstdoc.png)

우하우하!우하!
자료가 없으면 not found가 뜨게 됩니다!! 여기까지 하느라 고생많으셨습니다.
이제 얼마 안남았으니 영차영차! 😁😁😁😁

> full-text-search 기능인 키워드를 통해 자료를 찾는 search 기능은 다음포스트에서 다루겠습니다.!!

## 🔨 Update

이번에는 Update 기능을 수행해보겠습니다.

Update 는 PUT 메소드를 사용하여 수행할 수 있습니다.
second Title 자료의 id를 복사하여 다음과 같은 형태의 요청을 만들어줍니다.
해당하는 Id 가 존재할 경우 데이터 전체를 업데이트하게 됩니다.

        PUT mydoc/_doc/ctRWaXYBNC5Keng2Dpfm
        {
        "title" : "updated second title",
        "contents" : "updated second contents"
        }

성공하면 아래과 같이 result 에 updated 라는 결과값이 표시됩니다.

![](/blog/elasticsearch-crud-kibana/8284f550-f689-4543-805e-d42a05821d4c-updateDoc_result.png)

Kibana 의 Discover 탭을 보게 되면

![](/blog/elasticsearch-crud-kibana/2d23baf8-3775-4837-a7ae-fd0e2e55aa0f-updated_second_discover.png)

우하! 행복하군요 Update 가 성공된 것을 확인할 수 있습니다.!!

## 🔨 Delete

마지막입니다.!! 이것만 알면 CRUD 기능은 끝 입니다.

        DELETE mydoc/_doc/ctRWaXYBNC5Keng2Dpfm

바로 실행!!

![](/blog/elasticsearch-crud-kibana/b1f1d141-938a-4377-9212-1f77da1ae6b2-remove_fourthDoc_result.png)

> 삭제 결과 연산을 캡처 하는 것을 깜빡해서 데이터를 하나 더 만들고 다시 삭제해서 이전과 아이디가 다릅니다. ㅜㅜ

위와 같이 result 의 값으로 deleted가 뜨면 성공!!!!

여러분 만남이 있으면 끝도 있는법.

마지막으로 Index 님을 삭제 해드립시다. 잘가 ... 😭😭😭😭

        DELETE mydoc

삭제... 요청...

![](/blog/elasticsearch-crud-kibana/b6ed1fff-d256-464d-a4aa-1222b70c55df-deleteDoc.png)

![](/blog/elasticsearch-crud-kibana/dd86f2b1-d279-4b15-8795-08efa4adb9c6-deleteDoc_result.png)

성공...

이후 Discover 탭에 어떠한 자료도 추적하지 못하게되었습니다.. 흐극

와우 커피 한잔 하면서 같이 따라해보셨나요. 생각보다 간단합니다.
다음에는 **Search** 님과 함께 통해 다시 찾아오겠습니다.!!

[더 많은 자료 보러 공식홈페이지 가기!!](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html)
