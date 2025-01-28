---
title: 'pgloader 를 사용하여 mysql 디비 postgres 로 마이그레이션하기'
publishDate: 2022-07-31
description: 'pgloader 를 사용하면 mysql 디비를 postgres 로 손쉽게 옮길 수 있다.'
---

## Pgloader 란

pgloader 란 이름 그대로 data 를 postgres 로 복사해주는 도구이다.
pgloader 는 mysql 뿐만 아니라 mssql, sqlite 등 다른 데이터베이스를 비롯하여
csv, tsv 등 일정한 format 을 가진 input data 를 postgres 로 copy 할 수 있게 해준다.

## 사전 준비

- source 가 될 mysql 머신과 데이터
- target 이 될 postgres 머신
- pgloader 를 실행할 machine (ubuntu, mac 등)

## pgloader 설치하기

### ubuntu 18.04 이상에서 설치하기

필자는 ubuntu 18.04 버전의 도커 컨테이너를 준비했다. 컨테이너 안에서 아래 명령어를 실행하면 설치할 수 있다.

```shell
$ sudo apt update

# pgloader 를 컴파일, 빌드하기 위한 툴을 설치한다.
$ sudo apt install sbcl unzip libsqlite3-dev gawk curl make freetds-dev libzip-dev

# pgloader 다운로드 및 압축해제
$ curl -fsSLO https://github.com/dimitri/pgloader/releases/download/v3.6.6/pgloader-bundle-3.6.6.tgz
$ tar -xvf pgloader-bundle-3.6.6.tgz
$ cd pgloader-bundle-3.6.6

# pgloader 빌드 및 실행파일로 옮기기
$ make pgloader
$ sudo mv ./build/bin/pgloader /usr/local/bin/

# pgloader 버전 확인하기
$ pgloader --version
```

### mac 에서 설치하기

brew 가 설치 되어 있다면 아래 명령어로 정상적으로 설치 할 수 있다.
다만 컴파일 과정에서 특정 버전의 빌드 툴들이 필요할 경우 조정하기가 쉽지 않다.

```shell
$ brew install pgloader
```

## pgloader 실행하기

pgloader 를 실행하기 위해서는 간단하게 아래처럼 실행할 수 있으나 필자는 메타데이터 파일을 직접 작성하는 것을 추천한다.

```shell
$ pgloader --with "prefetch rows = 1000" mysql://user@localhost/sakila postgresql:///pagila
```

### 메타데이터 작성하기

pgloader 를 실행할 머신에 command.load 라는 이름의 파일을 생성한다. 파일 이름은 자유롭게 설정해도 된다.

```text
LOAD DATABASE
     FROM      mysql://mysqlUserName:mysqlPassword@mysqlhostdomain.com/sakila
     INTO postgresql://postgresUserName:postgresPassword@postgresDomain/sakila

 WITH include drop, create tables, create indexes, reset sequences,
      workers = 8, concurrency = 1,
      multiple readers per thread, rows per range = 50000;
 CAST type bigint when (= precision 20) to bigserial drop typemod,
      type date drop not null drop default using zero-dates-to-null,
      -- type tinyint to boolean using tinyint-to-boolean,
      type year to integer
```

load database, from, into 등 key 에 해당하는 값은 소문자로 작성해도 무방하다.

각 key 와 value 에 대한 설명

- LOAD DATABASE

  - FROM : source 가 되는 mysql 의 정보이다. mysql 접속을 위한 username 과 패스워드, 그리고 데이터베이스 연결 호스트를 설정한다.
  - INTO : target 이 되는 postgres 의 정보이다. 마찬가지로 postgres 를 접속하기 위한 username 과 패스워드, 연결 호스트를 설정한다.

- WITH : pgloader 를 실행할 때 사용할 옵션을 지정한다. 각 옵션들에 대한 설명은 [여기](https://pgloader.readthedocs.io/en/latest/ref/mysql.html#mysql-database-migration-options-with) 를 참조바란다.
- CAST : mysql 과 pgloader 는 호환이 안되는 필드들이 있다. CAST 옵션을 통해 mysql 의 특정 타입을 만나면 postgres 의 타입으로 변경할 수 있다. 자세한 정보는 [여기](https://pgloader.readthedocs.io/en/latest/ref/mysql.html#mysql-database-casting-rules) 를 참조 바란다.

이 외에도 사용할 수 있는 옵션들이 많으니 [참고](https://pgloader.readthedocs.io/en/latest/ref/mysql.html#) 하면 좋을듯 하다

### pgloader 수행

아래 명령어로 pgloader 를 실행하자

```shell
$ pgloader command.load
```

정상적으로 실행이 되었다면 각 테이블당 복사된 row 수와 발생한 에러수 등을 확인하는 통계를 볼 수 있다.

## 트러블슈팅

필자가 겪은 문제점과 해결법을 안내하려한다 동일한 문제점을 가진 분에게 도움이 되면한다.
추가적인 문제가 발견되면 포스트를 업데이트 하겠다.

### Heap exhausted during allocation ... 에러

많은 양의 데이터를 옮길 때 eap exhausted during allocation 오류가 발생한 경우는 많은 양의 데이터를 옮길 때 주로 발생하는 것으로 판단된다.
이 경우 pgloader 실행시 with 옵션에 prefetch rows = 1000 으로 설정하고 실행하면 정상적으로 진행되는 것으로 판단된다.

### prefetch rows 옵션 사용시 sbcl 컴파일 에러 발생.

prefetch rows 옵션을 사용하면 sbcl 컴파일 에러가 발생할 수 있다.
필자는 아래와 같은 에러를 마주했다.

```shell
FATAL error: deleting unreachable code ...
```

이 경우 sbcl 버전 관련 문제인 것으로 판단된다 sbcl 을 낮은 버전으로 낮춘 후 pgloader 를 다시 빌드하면 될 것 같다.
필자는 sbcl 2.1.9 버전으로 낮추고 실행하니 정상적으로 작동했고, 기능상 문제 없는 것으로 판단했다.

### postgis 의 geometry 타입이 없다는 에러가 발생할 시.

mysql 의 geometry 타입의 컬럼을 아무 조건 없이 postgres 로 마이그레이션 하게 되면 postgres 의 point 타입으로 매핑되게 된다.
mysql 의 geometry 타입을 postgres 의 geometry 타입으로 매핑하려면 cast 옵션으로 매핑을 해야한다.
이 경우 postgres 의 target db 에 postgis extension 이 생성되지 않아 발생하는 오류이다.
postgis 가 설치되어 있다는 가정하에 postgres db 에 접속후 아래 명령어를 실행하면 된다.

```shell
$ \c targetDB
$ create extension postgis;
```

## 후기

## 출처

- https://pgloader.readthedocs.io/en/latest/
- https://github.com/dimitri/pgloader
- https://www.digitalocean.com/community/tutorials/how-to-migrate-mysql-database-to-postgres-using-pgloader
