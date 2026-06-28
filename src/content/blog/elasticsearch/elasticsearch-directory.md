---
title: '[🌎elasticsearch] Elasticsearch 폴더에는 뭐가 있을까??'
pubDate: 2021-01-14T07:36:45.702Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈쉬어가는 느낌으로 ElasticSearch 의 directory 구조를 한번 살펴보도록 하겠습니다.ElasticSearch의 폴더로 한번 가보죠!저는 elk라는 폴더에 elasticsearch'
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 6
tags:
  - elasticsearch
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

## 🧡 ElasitcSearch 폴더 구조

쉬어가는 느낌으로 ElasticSearch 의 directory 구조를 한번 살펴보도록 하겠습니다.

ElasticSearch의 폴더로 한번 가보죠!

![](/blog/elasticsearch-directory/532a2785-c54b-4f6a-b81c-1ad9cb92b0b0-전체화면.png)

> 저는 elk라는 폴더에 elasticsearch 와 관련된 폴더들을 모아두었습니다.

## 📒Bin 폴더

bin 폴더 안에는 elasticsearch-cli, elasticsearch-sql-cli, elasicsearch-plugin 등등

elasticsearch 기능의 핵심적인 스크립트 들이 있습니다.

> 건들지마세용 .....

x-pack 부분은 elasticsearch 의 플러그인(보안, 알림, 모니터링, 보고, 그래프 등)들을 버전에 맞게 묶은 패키지라고 생각하시면 됩니다.!! elasticsearch를 알리게 만든 기능들의 집합체라고 생각합시다.!!

## 📒Config 폴더

#### elasticsearch.yml

이 파일에서 elasticsearch 의 전반적인 환경을 설정할 수 있습니다. 메모장이나 에디터로 켜시면

```yaml
# ---------------------------------- Cluster -----------------------------------
#
# Use a descriptive name for your cluster:
#
#cluster.name: my-application
#
```

cluster.name 옆에 #을 지우시고 cluster.name : <원하는 이름> 을 쓰시면 클러스터 이름을 설정할 수 있습니다.

> 클러스터와 노드에 대한 내용은 이후 포스트에서 자세하게 다루겠습니다.

그 밑에 node, paths, memory, network, Discovery 가 있습니다.

- paths 에서는 데이터, 로그가 저장되는 위치를 지정할 수 있습니다.
- memory 에서는 다른 자바프로그램이 엘라스틱 서치의 힙 영역의 메모리를 사용하지 못하도록 lock 을 걸 수 있습니다.
  > 해당 memory 제한은 jvm.option 파일에서 힙사이즈를 조정함으로서 디테일하게 설정가능합니다.
- network 에서는 어떤 ip의 어떤 port 번호로 elasticsearch에 접근 할 지 설정가능합니다.
- discovery 에서는 elasticsearch 에 얼마나 많은 인스턴스들이 연결 되는지 설정가능합니다.

#### jvm.options

이 파일에서는 elasticsearch 에 허용해줄 메모리 크기를 설정해줄 수 있습니다. 기본은 1기가바이트 입니다. 메모리 외의 내용에 대해서는 전문가가 아니면 건들지 맙시다 ...

#### log4j2.properties

여기는 elasticsearch 의 로그 관련 파일로, log4j2는 java 의 가장 강력한 logging 프레임워크중 하나입니다.

## 📒modules 폴더

여기는 완전히 elasticsearch 의 기능에 도움을 주는 built-in module 들이 모여있는 곳입니다.
많은 x-pack 폴더들이 보이시죠~ ?

## 📒plugins 폴더

이 폴더는 우리가 elasticsearch 에 custom 플러그인을 추가할 때 사용하는 폴더입니다.

피드백은 항상 환영입니다.!!
맛있는 커피 드시고 공부하세요!!
