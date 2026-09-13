<!-- AUTO-GENERATED FROM NOTION. EDIT THE NOTION PAGE, NOT THIS FILE. -->

# SQL 튜닝

SQL 튜닝이란?

데이터베이스에서 실행되는 SQL 쿼리의 성능을 최적화하여, 최소한의 자원과 시간으로 원하는 결과를 빠르게 얻도록 개선하는 작업이다.

cmd에서 sqlplus를 통해서 진행할 것

**PLAN TABLE** : 실행계획을 확인하는 테이블

오라클 기준 sys.plan_table$ 테이블을 만들고,‘PLAN_TABLE’로 명명한 public synonym도 생성하므로
사용자가 별도로 PLAN TABLE을 만들 필요가 없다 (10g 버전 이후)

<details>
<summary>PLAN TABLE 생성 방법 및 확인 방법</summary>

```sql
@?/rdbms/admin/utlxplan.sql
# ? 는 $ORACLE_HOME 디렉토리를 대체하는 기호이다.
SELECT OWNER, SYNONYM_NAME, TABLE_OWNER, TABLE_NAME
FROM ALL_SYNONYMS
WHERE SYNONYM_NAME = 'PLAN_TABLE';
```

</details>

실행계획 확인은 explain plan 명령어를 수행하면 된다 그러면 SQL 실행계획이 plan_table에 저장된다.

<details>
<summary>더 많은 정보를 확인하는 방법</summary>

```sql
select * from table(dbms_xplan.display(null, null, 'advanced'));
# 3번째 인자에 다양한 옵션을 넣어 확인할 수 있다.
# serial, parallel, outline, alias, projection, all 등
```

</details>

미리보기 기능을 통해 자신이 작성한 SQL이 테이블을 스캔하는지 인덱스를 스캔하는지,
인덱스를 스캔한다면 어떤 인덱스인지를 확인할 수 있고, 
예상과 다른 방식으로 처리된다면 실행경로를 변경할 수 있다.

---

SQL*PLUS에서는** AutoTrace**를 활성화하고 SQL을 실행하면 실행계획을 확인할 수 있다

<details>
<summary>AutoTrace (데이터베이스 진단 도구)</summary>

SQL 문장을 실행할 때 그 결과와 함께 실행 계획과 성능 통계 정보를 자동으로 화면에 출력해준다

SET AUTOTRACE ON : SQL 실행 결과와 실행 계획, 통계 정보를 모두 출력한다.

SET AUTOTRACE TRACEONLY : 실제 SQL을 수행하되, 
화면에 데이터 결과는 보여주지 않고 실행 계획과 통계 정보만 출력한다.

SET AUTOTRACE ON EXPLAIN : 데이터 결과와 예상 실행 계획만 출력한다.

SET AUTOTRACE OFF : 기능을 끈다

</details>

```sql
# 테스트용 테이블 생성
CREATE TABLE T
AS SELECT d.no , e.*
from emp e, (select rownum no from dual connect by level <= 1000) d;

# 인덱스 생성
create index t_x01 on t(deptno,no);
create index t_x02 on t(deptno, job, no);

# T 테이블에 대한 통계정보를 수집
exec dbms_stats.gather_table_stats(user, 't');

# AutoTrace 활성화
set autotrace traceonly exp;

# 테스트 쿼리 실행
select * from t
where deptno = 10
and no = 1;
```

![위 쿼리를 실행했을 때 나오는 결괏값](../../assets/3c74a637425a80f38000d9f9d5d7082c/001-%EC%9C%84-%EC%BF%BC%EB%A6%AC%EB%A5%BC-%EC%8B%A4%ED%96%89%ED%96%88%EC%9D%84-%EB%95%8C-%EB%82%98%EC%98%A4%EB%8A%94-%EA%B2%B0%EA%B4%8F%EA%B0%92.png)

---

```sql
# 두번재 쿼리
Select /*+ index(t t_x02) */ * from t
where deptno = 10
and no = 1;
```

![두번째 쿼리를 실행했을 때 나오는 결괏값](../../assets/3c74a637425a80f38000d9f9d5d7082c/002-%EB%91%90%EB%B2%88%EC%A7%B8-%EC%BF%BC%EB%A6%AC%EB%A5%BC-%EC%8B%A4%ED%96%89%ED%96%88%EC%9D%84-%EB%95%8C-%EB%82%98%EC%98%A4%EB%8A%94-%EA%B2%B0%EA%B4%8F%EA%B0%92.png)

```sql
# 세번째 테스트 쿼리
Select /*+ full(t) */ * from T
where deptno = 10
and no = 1
```

![세번째 쿼리를 실행했을 때 나오는 결괏값](../../assets/3c74a637425a80f38000d9f9d5d7082c/003-%EC%84%B8%EB%B2%88%EC%A7%B8-%EC%BF%BC%EB%A6%AC%EB%A5%BC-%EC%8B%A4%ED%96%89%ED%96%88%EC%9D%84-%EB%95%8C-%EB%82%98%EC%98%A4%EB%8A%94-%EA%B2%B0%EA%B4%8F%EA%B0%92.png)

3개의 결과에서 Cost 즉 비용의 값이 달라졌는데
옵티마이저는 이 비용을 근거로 T_X01 인덱스를 선택했다.

**비용은 쿼리를 수행하는 동안 발생할 것으로 예상하는 I/O 횟수 또는 예상 소요시간을 표현한 값이다.**

**SQL 실행계획에 표시되는 Cost는 어디까지나 예상치다.**

실측치가 아니므로 실제 수행할 때 발생하는 I/O 또는 시간과 많은 차이가 난다.

---

---

## SQL 파싱과 최적화

## SQL 공유 및 재사용

> ⭐ 
> 
> ## 데이터 저장 구조 및 I/O 메커니즘
