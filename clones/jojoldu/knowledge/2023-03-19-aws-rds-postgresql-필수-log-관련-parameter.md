---
topic: "(AWS RDS) PostgreSQL 필수 Log 관련 Parameter"
source_type: other
source_url: "https://jojoldu.tistory.com/708"
authorship: self
published_at: 2023-03-19
---
# (AWS RDS) PostgreSQL 필수 Log 관련 Parameter

**작성자:** 향로 (기억보단 기록을)
**게시일:** 2023. 3. 19.

DB를 활용한 365/24시간 서비스에서 가장 중요한 설정 중 하나가 **DB 로그를 어떻게 남기고 관리할 것인가** 이다.

MySQL을 주로 사용하다가 PostgreSQL 을 사용하게 되면서 PostgreSQL에서 지원하는 다양한 로그 파라미터들을 알게 되었다.

아래는 사내에서 적용하고 있는 PostgreSQL 의 필수 로그 파라미터 값들이다.

## 파라미터

각 설정들은 [공식 문서](https://www.postgresql.org/docs/14/runtime-config-logging.html) 를 확인해보면 더 자세하게 확인할 수 있다.

> 각 설정을 남길 경우 발생되는 로그 메세지 샘플도 첨부했다.
> 해당 로그 메세지를 파싱하여 Slack 알람 등을 보내는 Lambda 함수를 만드는데 활용하면 좋다.

### log_temp_files
권장: `1024`

- 설정된 값(KB) 이상의 임시 파일을 사용하는 SQL 쿼리를 기록
- 대부분의 경우 전체 테이블 스캔에 해당
  - ex) 대용량 테이블의 해시 조인을 사용한 경우 등

### Log_min_messages
권장: `error`

- 로그에 기록되는 메시지 종류를 필터링하여 원하는 유형의 메시지만 로그에 남길 수 있도록 한다.
- `error` 로 설정하면 warning 또는 notice 메세지는 기록되지 않는반면, error / log / fatal / panic 로그는 남긴다.

### log_lock_waits
권장: `1`

- 교착 상태 감지를 위해 설정
  - ex) 하나의 트랜잭션이 다른 트랜잭션을 block 할 경우에 대한 로깅 기준
- 설정된 기간(기본값 1초)보다 긴 기간 동안 잠긴 상태로 유지되는 세션을 로깅할 수 있다.
- 해당 로그 발생시 blocking 혹은 blocked session 을 중지 해야한다

### log_statement
권장: `ddl` (기본값은 `none`)

- 어떤 로그들을 남길 것인지 설정할 수 있는 값
- 아래 4개의 옵션을 선택할 수 있다
  - `ddl`: 모든 DDL(ex: CREATE, ALTER 및 DROP)을 로깅
  - `mod`: 모든 DDL 및 DML(ex: INSERT, UPDATE 및 DELETE)을 로깅
  - `all`: 실행 시간에 상관없이 모든 쿼리를 로깅
  - `none`: 기본값이자, 아무것도 로깅하지 않는 옵션

해당 옵션을 `ddl`로 설정하면 다음과 같이 `insert`, `update`, `delete` 를 남긴다.

```
2023-03-10 04:08:47 UTC:10.0.0.123(52834):inflab@testdb:[20175]:LOG: statement: ALTER TABLE testdb DROP COLUMN created_at;
```

### log_min_duration_statement
권장: `100` 혹은 `1`

- 지정된 시간 (ms) 이상의 시간이 소요된 쿼리들을 로깅
- 예를 들어, `log_min_duration_statement` 값을 500으로 설정하면 쿼리 유형에 상관없이 완료 시간이 0.5초보다 긴 모든 쿼리를 로깅
- slow query에 대해 정의하는 기준이 된다.

우리팀의 경우 `1` (1ms) 로 설정해서 사용한다. 1ms 면 거의 대부분의 쿼리들을 남기는 상황인데, 엄청나게 많은 양의 로그가 쌓일 우려도 있다. **이걸 1으로 설정하면 너무 많은 쿼리들이 로깅될 수 있어 로깅 자체가 DB의 부하**를 줄 수도 있기 때문에 본인 서비스에 맞게 설정이 필요하다.

해당 값을 설정하면 다음과 같은 로그를 확인할 수 있다.

```
2023-03-10 07:09:17 UTC:10.0.0.123(52834):inflab@testdb:[20175]:LOG: duration: 1087.507 ms statement: SELECT count(*) FROM orders where created_at > '2023-03-01 00:00:00';
```

### log_autovacuum_min_duration
권장: `1000`

- 지정된 시간(ms) 이상 실행되는 autovacuum 및 autoanalyze 을 로깅한다.
- 0으로 설정 하면 **모든 autovacuum 및 autoanalyze을 로깅** 한다.

auto-vacuum 은 PostgreSQL에서 중요한 작업이지만 CPU, 메모리, IO 리소스 사용량 측면에서 비용이 발생한다. 설정하면 다음과 같은 로그를 확인할 수 있다.

```
2023-03-10 07:09:17 UTC::@:[29679]:LOG: automatic vacuum of table "inflab.public.orders": index scans: 0
pages: 0 removed, 10811 remain, 0 skipped due to pins, 0 skipped frozen
tuples: 1000001 removed, 1000000 remain, 0 are dead but not yet removable, oldest xmin: 113942594
buffer usage: 21671 hits, 0 misses, 1 dirtied
avg read rate: 0.000 MB/s, avg write rate: 0.003 MB/s
system usage: CPU: user: 0.12 s, system: 0.00 s, elapsed: 2.30 s
2023-03-10 07:09:17 UTC::@:[29679]:LOG: automatic analyze of table "inflab.public.orders" system usage: CPU: user: 0.06 s, system: 0.00 s, elapsed: 1.17 s
```

### rds.force_autovacuum_logging_level
권장: `log` (기본값: `disabled`)

- 만약 설정한다면 `log_autovacuum_min_duration` 이 설정한 값에 따라 실행되는 autovacuum 및 autoanalyze 을 로깅한다.
- 즉, 해당 옵션이 `log` 일 경우 `log_autovacuum_min_duration` 이상 수행되는 auto vacuum 일때는 `log` 레벨 이상의 로그들을 남긴다.

### auto_explain.log_min_duration
권장: `1000`

- Query 실행 시간이 지정된 시간(ms) 이상이면 실행 계획을 로깅한다.

설정하면 다음과 같은 로그를 확인할 수 있다.

```
2023-03-10 07:09:17 UTC:10.0.0.123(53094):inflab@testdb:[18387]:LOG: duration: 2376.049 ms plan:
Query Text: select * from courses c join vocuhers on v.courses_id = c.id where v.user_id=12312 and v.deleted_at is null;
Nested Loop  (cost=1.40..74738.03 rows=16154 width=8) (actual time=1.940..3420.203 rows=9596 loops=1)
...
```

### shared_preload_libraries
권장: `auto_explain, pg_stat_statements`

- `auto_explain` 이면 자동으로 로깅 된다.
- `pg_stat_statements` 가 누락되면 RDS Performance Insight가 제대로 활용되지 않으니 항상 함께 한다.

### log_error_verbosity
권장: `verbose`

서버 로그에서 오류 메시지의 상세 수준을 조절하는 옵션이다. `verbose`로 설정하면 SQL 명령어와 서버 내부의 오류 진단 정보를 포함한다.

`default` 설정 시:
```
ERROR:  duplicate key value violates unique constraint "index_users_on_lower_email_text_unique_key"
```

`verbose` 설정 시 상세 정보(DETAIL)가 포함된다.

### rds.force_admin_logging_level
권장: `log`

- 마스터 사용자의 활동들에 대한 로깅 레벨
- 마스터 관리자가 실행한 모든 쿼리를 로그로 남겨준다.

## 주의할 점

- `log_statement`를 `all` 혹은 `mod`로 설정하면 **DML 쿼리들의 duration이 출력되지 않는다**. 이는 중복 로깅을 방지하기 위함이다. 따라서 실행 시간이 포함된 로그가 필요하다면 설정 간의 조율이 필요하다.

## 마무리

데이터베이스의 로그 관련 파라미터들을 잘 남겨야 모니터링, 장애 알림, 장애 로그 등을 좀 더 정교하게 구성하여 시스템 장애를 해결할 수 있다. 어떤 장애 대응도 가장 먼저 **로그 관리** 부터 시작이다.
