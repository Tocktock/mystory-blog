---
title: 'mysql vs postgres 짧은 비교'
pubDate: 2022-07-25
description: '일반적으로 postgres 는 mysql 에 비해 대용량 서비스에서 더 나은 성능을 제공한다.'
---

## Postgres 를 쓰는 이유

2022 년 stackoverflow 기준 postgres 의 사용률은 mysql 을 거의 따라잡았다.
실제 점유율은 그러지 않을 수 있지만 postgres 의 점유율이 점점 증가한다는 사실은 부정할 수 없다.
무슨 이유 때문에 postgres 의 인기가 열풍을 띄는지 필자는 궁금해졌다.

### 대용량 데이터 기반 또는 분석서비스에 적합

서비스가 지속될 수록 데이터는 쌓이게 되고 sql 최적화 만으로는 한계에 부딪힐 시간이 온다.
파티셔닝, 캐싱 등 여러 방법을 사용할 수도 있지만 대용량 데이터에 더 효율적인 데이터베이스를 사용하는 것도 하나의 방법이 될 수 있다.

데이터가 처음부터 대용량이 될 것이라고 판단하고 데이터베이스를 설계한 것이 아니라면 서비스가 커지기 시작하면 일부 기능은 데이터베이스에 상당한 오버헤드를 유발하는 쿼리를 사용할 수 있다.
특정 테이블이 100 만 개 이상의 row 를 보유하고 있다면 슬슬 부담되기 시작하고 이 테이블과 join 을 하기 시작하는 read query 들은 상당히 무거워 질 것이다.

일반적으로 postgres 는 mysql 에 비해 효율적인 조인과 병렬 쿼리, 다중버전동시제어(MVCC) 를 지원한다. 따라서 대용량 read query 에서 postgres 는 mysql 보다 더 나은 성능을 제공한다.
mysql 또한 hash join, 병렬 쿼리, MVCC 를 지원하지만 postgres 보다는 성능이 좋다고 할 수 없다. 따라서 대용량 데이터 기반의 서비스라면 postgres 가 적합한 선택일 것이다.

하지만 필자가 강조하고자 하는 바가 있다. postgres 는 위와 같은 문제를 해결하는 **근본적인 대안이 될 수 없으며** 필요에 따라 개발자가 적절한 방법을 사용하여 성능을 향상시켜야 할 것이다.
다만 위 같은 경우 postgres 는 mysql 과 비교했을 때 더 나은 성능을 제공한다. 쓰지 않을 이유가 있을까?

### 그외 장점

오픈소스, 다양한 data type 지원, 보안관련 이슈 등 여러가지 장점이 다른 블로그, 문서에서 소개되었지만 솔직히 와닿지 않아 필자는 소개하지 않을 것이다.
필자가 위 같은 사항에서 mysql 보다 더 좋은 상황을 경험한다면 포스트를 업데이트 하겠다.

## postgres 의 단점

위에서 postgres 는 mysql 에 비해 효율적인 조인방법, 병렬쿼리를 사용한다고 소개했지만 postgres 가 항상 mysql 보다 더 나은 성능을 제공하지는 않는다.

### 단순한 crud, 적은 데이터 셋에서 불리 할 수 있다.

postgres 는 대용량 데이터를 read 하는 데에는 최적화되어 있지만 적은 데이터셋을 조인한다면 오히려 mysql 에 비해 더 낮은 성능을 제공할 수 있다.
수십 밀리초 밖에 차이가 나지 않을 수 있지만 read 강도가 매우 높은 애플리케이션이라면 문제가 될 수도 있다. (사실 해결할 방법도 있지만..)
실제로 필자가 실행한 성능 테스트에서 복잡한 조인과 많은 양의 데이터를 조인했을 때에는 postgres 가 mysql 에 비해 약 1.5 ~ 2배 더 좋은 성능을 제공했다. 데이터 셋이 더 많아진다면 더 크게 증가할 수도 있다.
하지만 적은 데이터셋을 가지고 수행하는 쿼리에서는 오히려 postgres 가 mysql 에 비해 2배 가량 더 낮은 성능을 제공했다.

또한 postgres 는 데이터의 레코드를 update 하는데 insert 를 하는 수준의 연산이 일어나는 반면 mysql 은 직접적으로 레코드를 수정하는 것으로 알려져있어 update 연산에 불리할 수 있다.

### postgres 의 blocking DDL

최근에 들어서 postgres 는 많은 blocking 커맨드들을 개선했지만 오래된 버전의 postgres 나 특정 DDL 은 테이블 전체를 잠금 할 수 있기 때문에
먼저 해당 DDL 이 테이블을 잠금하는지 알아야한다.

### mysql 은 이미 지배적으로 사용되었다.

spring boot 를 사용하다보니 필자가 많이 느낀 것이다. mysql jdbc 의 편리한 기능들에 익숙해져 대부분의 문서, 블로그들이 mysql 기준으로 작성되어 있다.
mysql 에서 postgres 로 데이터베이스 마이그레이션을 성공적으로 수행한 후에도 mysql 에서 작동하던 코드는 postgres 에서 정상적으로 작동하지 않을 수 있다.

## 마무리

새로 시작하는 프로젝트라면 mysql 을 선택하든 postgres 를 선택하든 상관 없을 것이라 생각한다.
mysql 진영에서도 부족한 기능을 지속적으로 개선해나가고 있고 postgres 진영도 마찬가지이기 때문에 갈 수록 격차는 줄어들 수 있다.

다만 특수한 상황이 아니라면 데이터베이스를 마이그레이션 하기 쉽도록 표준 sql 을 사용하고 데이터베이스에 의존적이지 않은 코드를 작성하는 것이 더 중요하다고 필자는 생각한다.

다음에는 pgloader 를 이용해서 mysql 기반 데이터베이스를 마이그레이션 하는 작업을 포스팅할 것이다.

## 출처

- https://smoh.tistory.com/370
- https://www.imaginarycloud.com/blog/postgresql-vs-mysql/#6
- https://techblog.woowahan.com/6550/
- https://dev.mysql.com/doc/refman/8.0/en/innodb-multi-versioning.html
- https://www.citusdata.com/blog/2018/02/22/seven-tips-for-dealing-with-postgres-locks/
- https://www.postgresql.org/docs/current/sql-altertable.html
