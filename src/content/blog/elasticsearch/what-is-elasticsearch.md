---
title: '[🌎elasticsearch] Elasticsearch이란?'
pubDate: 2021-01-10T19:21:38.130Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈네이버 및 구글에서 원하는 문서를 검색하면 잘 나옵니다.어떻게 이런게 가능할까요 ???전문검색(Full-Text-Search 이하 FTS)은 검색 단어를 입력하면 해당하는 문서와 "관련 깊은"'
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 1
tags:
  - elasticsearch
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

## 👓 전문검색(Full-Text-Search)

네이버 및 구글에서 원하는 문서를 검색하면 잘 나옵니다.
어떻게 이런게 가능할까요 ???

전문검색(Full-Text-Search 이하 FTS)은 검색 단어를 입력하면 해당하는 문서와 **"관련 깊은"** 자료를 보여주게 됩니다.

단순한 문자열 일치 연산으로는 네이버나 구글의 검색과 같은 결과를 보여주기는 어렵습니다.
따라서 FTS 에서는 모든 문서의 단어와 문장을 검색하여 점수를 매기게됩니다.
이 과정에서는 머신러닝과 같은 자연어 처리 과정이 포함되게 됩니다.

당연히 모든 문서의 단어와 문장을 검색하고 점수를 매긴 후 점수 순서대로 보여주기 때문에
기존의 문자열 일치 연산보다 복잡한 연산을 하게 됩니다.

다시 말하자면 전문검색은 우리가 원하는 문서와 **관련깊은** 문서들을 보여주는 기술이라 생각하시면 됩니다.

---

## 🥽 ElasticSearch

FTS 기능은 분석 엔진으로 제공될 수도 있고 DBMS에 기능이 탑재될 수도 있습니다.

Lucene, Solr, ElasticSearch 등 다양한 분석 엔진이 있고
Mongodb, Postgresql, AzureSQLDatabase 등 다양한 DBMS에서도 지원하고 있으니 더 검색해보는 걸 추천드립니다.

그 중에 ElasticSearch 를 소개하려고 합니다.

ElasticSearch 는 FTS 를 지원하는 오픈소스 검색 및 분석 엔진입니다.
Apache Lucene을 기반으로 구축되었으며 다음과 같은 사항들을 강조합니다.

- **빠르다.** Lucene을 기반으로 구축되었기 때문에 빠르며, 실시간에 가까운 속도를 보여줍니다.
- **분산적이다.** 샤드라고 하는 저장형태로 여러 컨테이너에 걸쳐 분산, 복제되어 저장되기 때문에 분산적이라고 할 수 있습니다.
- **간소화된 데이터** Beats와 Logstash, Kibana 를 통해 데이터를 실시간으로 시각화하며 로그, 인프라 메트릭 데이터에 신속히 접속가능합니다.

ElasticSearch 는 또한 다음 언어를 위해서 클라이언트가 공식적으로 지원합니다.

- 자바
- 자바스크립트
- Go
- .NET(C#)
- PHP
- Pearl
- Python
- Ruby

---

## 😁

프로젝트를 진행하면서 Full Text Search 기능이 필요하여 찾다가 ElasticSearch 를 찾게 되었고
ElasticSearch 에 흥미를 가지게 되었네요.

저보다 정리를 잘한 가이드북이 있으니 꼭 보시길 추천드립니다.

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

다음 시간에는 ElasticSearch 를 Ubuntu에 설치하는 방법으로 찾아뵙겠습니다.
