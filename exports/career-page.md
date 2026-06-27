---
title: "이력 | 지용의 기록실"
description: "Backend와 Platform 영역에서 JiYong이 맡아온 문제, 역량, 프로젝트 기록을 정리한 이력 페이지입니다."
source: "/career"
exportedAt: "2026-06-27"
---

# 운영과 가까운 백엔드를 만들고 있습니다.

**JIYONG PARK**<br>
Backend SW Engineer

최근에는 화물 물류 도메인에서 운송관리, 차주 매칭, 정산, 지도 검색처럼 실제 업무 흐름과 맞닿은 기능을 다뤄왔습니다.

공개 가능한 작업을 중심으로, 제가 맡았던 일과 그 과정의 고민을 정리했습니다.

## 이력 요약

- 현재: 센디 제품팀 · Backend SW Engineer / Lead
- 맡고 있는 분야: 운송관리 도메인, 차주 매칭, 성능 최적화, 업무 자동화
- 주요 스택: Kotlin, Spring, PostgreSQL, Redis, OpenSearch, AWS
- 관심 있는 주제: 운영 자동화, LLM/RAG 기반 업무 도구

센디 · 2021 - 현재 · Backend SW Engineer / Lead

- [GitHub](https://github.com/Tocktock)
- [글과 기록](#글과-기록)

## 대표 작업

회사에서 맡았던 일 중 공개 가능한 범위의 작업을 몇 가지 골랐습니다.

### 01. 제품 도메인

#### 운송관리 흐름을 하나의 기준으로 맞췄습니다.

- 다룬 범위: 운송 요청 · 차주 매칭 · 배차 · 기사 앱 · 운영 도구

운송 요청, 차주 매칭, 배차, 기사 앱, 운영 도구가 같은 운송 정보를 기준으로 움직이도록 Dispatch의 상태와 데이터 흐름을 맞췄습니다.

신규 제품 출범 과정에서도 이 기준을 사용할 수 있도록 관련 API와 조회 흐름을 함께 정리했습니다.

- 운송 요청 → 차주 매칭 → 배차로 이어지는 상태 흐름 정리
- 기사 앱과 운영 도구가 함께 보는 운송 기준 데이터 정리
- 신규 제품에서 사용할 운송관리 API와 조회 흐름 정리

### 02. 데이터와 성능

#### 메인 DB를 PostgreSQL로 옮기고 지도 검색을 개선했습니다.

- 지도 검색 안정화: 1초 이상 요청 0건
- 관찰 구간 최대 응답: 약 239ms

메인 DB 마이그레이션 과정에서 타임존, SQL, 인덱스, 비동기 조회처럼 서비스 동작과 연결된 문제를 다뤘습니다.

PostgreSQL 전환 이후 지도 검색 쿼리와 인덱스를 정리하고, 실제 요청 기준으로 응답 시간을 확인하며 개선했습니다.

- DB 전환 절차와 SQL 호환성 검증
- 지도 검색 쿼리와 응답 안정성 검증

[마이그레이션 상세 기록](/records/mysql-to-postgres/mysql-to-postgres-realworld/)

### 03. 운영과 자동화

#### 배포, 로그, 사내 데이터 활용 기준을 정리했습니다.

- 운영 영역: ECS · CI/CD · APM

서비스를 운영하면서 배포, 로그, 데이터 확인 방식이 여러 곳에 흩어져 있었습니다.

ECS, CI/CD, APM, 로그 수집, Metabase/n8n/CLI 기반 조회 흐름을 정리해 개발자와 운영자가 필요한 정보를 더 쉽게 확인할 수 있도록 했습니다.

- 배포·로그·관측성 운영 기준 정리
- 사내 데이터 조회와 자동화 흐름 정리

## 그 밖에 맡았던 작업

대표 작업에 모두 담기 어려운 제품, 운영, 데이터, 인프라 관련 작업을 정리했습니다.

### LLM 기반 오더폼 자동완성 시스템

- 영역: AI / 자동화
- 기간: 2024

운송 등록에 필요한 입력값을 LLM으로 보완해 오더폼 작성 과정의 반복 입력을 줄이는 흐름을 실험했습니다.

### Metabase 기반 비즈니스 지표 대시보드

- 영역: 데이터·지표 가시화

전사적으로 관리할 매출·주문 등 주요 지표를 self-hosted Metabase로 시각화해 운영 현황과 제품 성과를 확인할 수 있도록 구성했습니다.

### 디비딥 Text to SQL 기능 구현

- 영역: 데이터·지표 가시화

n8n·LangGraph·Metabase를 연결한 디비딥에서 자연어로 필요한 지표를 조회할 수 있도록 Text-to-SQL 기능을 구현했습니다. self-hosted n8n과 LangGraph 기반 워크플로우를 구성해 지표 생성, Metabase 연동, 데이터 수집 흐름을 자동화하고 반복 업무의 처리 효율을 개선했습니다.

### 매칭 프로세스 개선과 드라이버 피드 적용

- 영역: 운송관리 / 매칭
- 기간: 2024~2025

매칭 흐름, 드라이버 피드, DX 드라이버 앱과 Dispatch 도메인이 이어지는 기준을 맞췄습니다.

### 차주용 커뮤니티·어드민 플랫폼

- 영역: 운영 도구
- 기간: 2025~2026

차주 대상 기능과 내부 운영 화면이 함께 움직이도록 API와 관리 도구를 연결했습니다.

### Self-hosted JAR -> Container 기반 ECS 전환 — CI/CD·Datadog·OpenSearch

- 영역: 운영·관측성

JAR 직접 실행 서비스를 ECS 컨테이너 기반으로 전환하고, CI/CD와 Datadog APM, OpenSearch 로그 수집 체계를 구축했습니다.

## 경력

### 센디

- 기간: 2021 - 현재
- 역할: Backend SW Engineer · Lead

제품팀에서 운송관리 도메인과 운영 도구에 필요한 백엔드 개발을 맡고 있습니다.

기능을 만드는 것만큼, 동료와 운영자가 이해하기 쉬운 기준을 남기는 일을 중요하게 생각합니다.

- 주조직: 제품팀
- 겸임 조직: 백엔드파트, 제품본부
- 직무: Backend SW Engineer
- 직위: 리드

주요 내용:

- 운송관리, 차주 매칭, 성능 최적화, 업무 자동화처럼 운영과 가까운 기능을 다뤘습니다.
- 일부 도메인에서는 설계와 운영 기준을 정리하는 역할도 함께 맡았습니다.

## 글과 기록

### Aurora MySQL에서 PostgreSQL로 옮긴 실제 마이그레이션 기록

- 연도: 2023
- 링크: [/records/mysql-to-postgres/mysql-to-postgres-realworld/](/records/mysql-to-postgres/mysql-to-postgres-realworld/)

DB 이전 과정에서 만난 타임존, SQL, 인덱스, 지도 검색 문제를 정리했습니다.

### 회사에서 AI Advisor로 보낸 3개월 회고

- 연도: 2025
- 링크: [/records/meta/ai-advisor-writing-partner/](/records/meta/ai-advisor-writing-partner/)

LLM 기반 업무 도구를 실제 업무에 적용하며 배운 점을 정리했습니다.

## 개인적으로 만드는 도구

### Cornerstone

흩어진 기록과 작업 맥락을 검색하고 이어볼 수 있도록 만드는 개인 프로젝트입니다.

지금은 시나리오 기반 검증, CLI, 감사 로그, ConnectorHub 연계를 중심으로 조금씩 실험하고 있습니다.

[GitHub](https://github.com/Tocktock/Cornerstone)

## 관련 링크

- [GitHub](https://github.com/Tocktock)
- [소개 보기](/about/)
