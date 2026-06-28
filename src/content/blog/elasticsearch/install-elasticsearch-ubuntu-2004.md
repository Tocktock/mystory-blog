---
title: '[🌎elasticsearch] Elasticsearch 설치하기 (Ubuntu 20.04)'
pubDate: 2021-01-13T02:03:22.590Z
description: 'Elasticsearch 가이드북 ✈Elasticsearch 홈페이지 가기 ✈다음과 같은 사항이 필요합니다.Ubuntu 20.04 버전이 깔려 있는 OS듀얼코어 이상의 cpu 와 4gb 이상의 램 원활한 실행을 위해 필요하며 필수는 아닙니다.ElasticSearch는 '
heroImage: '../../../assets/heroes/elasticsearch-overview.png'
category: 'tech'
series: 'elasticsearch'
seriesOrder: 2
tags:
  - elasticsearch
---

---

- [Elasticsearch 가이드북 ✈](https://esbook.kimjmin.net/)

- [Elasticsearch 홈페이지 가기 ✈](https://www.elastic.co/kr/what-is/elasticsearch)

---

## 👓 잠깐만 이거 했니??!!

다음과 같은 사항이 필요합니다.

- Ubuntu 20.04 버전이 깔려 있는 OS
- 듀얼코어 이상의 cpu 와 4gb 이상의 램
  > 원활한 실행을 위해 필요하며 필수는 아닙니다.

> ElasticSearch는 자바로 만들어졌기 때문에 JDK 가 설치되어야 하지만 ElasticSearch를 설치하면서 JDK 가 같이 깔리게 됩니다. 자바 문제가 발생한다면 지원하는 JDK를 다시 깔고 JAVA_HOME 변수를 다시 설정해주세요. [Elasticsearch JDK 버전 확인하기 ✈](https://www.elastic.co/kr/support/matrix#matrix_jvm)

---

## 🥽 따라와

> 설치과정은 ElasticSearch 7.x 버전을 기준으로 합니다. 버전이 다르면 수행이 다를 수 있습니다.

### Step 1 - 설 치 하 자

- Ubuntu 에서는 ElasticSearch 컴포넌트가 기본적으로 이용이 불가능합니다. 하지만 apt 명령으로 설치 후 Elastic 의 패키지를 설치한다면 이용 가능합니다.
- ElasticSearch는 너를 사랑해서 Elastic 인증키로 서명이 되어 있습니다.(보안을 위해서라는 뜻) 키를 통해 인증받은 패키지들은 모두 사용가능합니다.
- 설치를 위해 다음을 실행하여 Elastic Public GPG 키를 추가해주세요

> $ curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

- sources.list.d 폴더에 Elastic 소스리스트를 추가해주세요! APT 가 새로운 소스를 찾아야하거든요!! (다음 입력하라는 뜻)

> $ echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list

- package lists 들을 업데이트 해야겠죠?

> $ sudo apt update

- 드디어 설치!

> $ sudo apt install elasticsearch

두둔

### Step 2 - 설 정 하 자

- 로컬 머신에서 돌리기 위해서 약간의 수정이 필요하답니다!
  ElasticSearch 는 elasticsearch.yml 에서 설정 관리되고 있습니다. (열어라는 뜻)

> $ sudo nano /etc/elasticsearch/elasticsearch.yml

- 내려 내려 내려 내려 (다음 과 같은 영역을 찾아라는 뜻) 그리고 바꿔 (: 이후에 내용을 원하는 값을 설정합니다.)

>\# ---------------------------------- Network -----------------------------------
>\#
>\# Set the bind address to a specific IP (IPv4 or IPv6):
>\#
>network.host: localhost
>. . .

> **주의** yml 파일은 포맷이 매우 중요합니다 ' : ' 다음에 반드시 뛰어쓰기를 해야합니다.

---

### Step 3 - 실 행 하 자

- systemctl 명령으로 실행해봅시다.
- 초기 수행에 시간이 걸리니 잠시 기다려주세.

> $ sudo systemctl start elasticsearch

- 한번 확인해볼까요?

> $ service elasticsearch status

- 위의 명령을 입력후, active running 단어가 보이면 정상 실행중이라는 겁니다. 램 많이 잡아먹네요.
- 이제 컴퓨터가 켜질 때마다 자동으로 실항하게 해줍니다.

> $ sudo systemctl enable elasticsearch

### Step 4 - 확 인 하 자

- 별도로 포트 설정을 안했다면 <http://localhost:9200> 으로 접속하면 json 형식으로 값이 뜨면 성공!!

## 😁

고생하셨습니다!!

기본적인 사용법에 대해서는 다음 포스트에서 ~
