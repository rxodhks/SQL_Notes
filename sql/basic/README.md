<!-- AUTO-GENERATED FROM NOTION. EDIT THE NOTION PAGE, NOT THIS FILE. -->

# SQL 기본

## 데이터 모델의 이해

<details>
<summary>목차</summary>



</details>

---

1. 모델링의 정의
  사람이 살아가면서 접할 수 있는 다양한 현상을 표기법에 따라 표기하는 것 자체

  → 약속(그림, 기호, 수식 등) 에 따라 다양하고 복잡한 여러 현상을 알기 쉽게 표현한 집합체

1. 모델링의 종류
  <details>
  <summary>정보시스템 모델링</summary>

  정보시스템을 구축하는 과정에서 업무 내용과 시스템의 구조를 적절한 표기법으로 표현하는 것

  정보 모델링, 데이터 모델링, 프로세스 모델링 등이 포함.

  <details>
  <summary>정보시스템 모델링의 3가지 관점</summary>

  **데이터 관점** : 업무가 어떤 데이터와 관련이 있는지, 관계는 어떠한지를 모델링하는 방법

  **프로세스 관점** : 업무가 실제로 처리하는 일이 무엇인지, 무엇을 해야 하는지 모델링하는 방법

  **데이터와 프로세스의 상관 관점** : 업무 처리 방식에 따라 데이터가 서로 어떤 영향을 주고 받는지를 모델링 하는 방법

  </details>

  </details>

  <details>
  <summary>수리 모델링</summary>

  = 수학적 모델링 / 미분, 상태, 시스템 방정식, 시스템 함수 등이 해당

  </details>

  <details>
  <summary>통계 모델링</summary>

  확률 현상을 차트, 표, 수식, 함수 등으로 표현, 데이터 분석에서 유용하게 사용.

  </details>

  <details>
  <summary>회로 모델링</summary>

  회로 소자를 이용해 증폭, 필터링, 스위칭 등 연산을 수행하는 회로를 특정한 규칙에 따라 표현

  </details>

1. 모델링의 특징
  1. 추상화 : 현실 세계를 일정한 형식에 맞춰 추상적으로 표현

  1. 단순화 : 복잡한 현실 세계를 특정한 약속에 따라 기호, 문자, 그림 등으로 쉽게 이해할 수 있게 단순화 하는 개념

  1. 명확화 : 애매함을 제거 / 이해하기 쉽도록 명확하게 현상을 기술 하는 것

## 데이터 모델링

## 관계형 데이터베이스

## 정규화 ⭐

---

### 계층형 데이터 모델

데이터를 트리 구조로 구성해 데이터 간의 관계를 계층적으로 나타내는 모델

특징 → 각 노드가 단 하나의 부모 노드만 가질 수 있다 (데이터 간의 관계가 단순하고 명확하게 정의된다.)

---

### 상호배타적 관계 ⭐

---

### 트랜잭션 ⭐

---

### NULL 속성의 이해 (+ NVL 함수)

### 본질식별자와 인조식별자

---

---

# SQL 기본

### SELECT 문

### SQL 내장 함수

SQL 문에서 특정 조건을 만족하는 행만 선택하기 위해 사용된다.
이는 데이터베이스에서 원하는 데이터를 필터링하는 데 필수적이다.

수백만 수천만 행을 가진 테이블을 WHERE 절 없이 전체 조회하면 데이터베이스의 하드웨어 자원을 
과도하게 사용하게[ 되며, 다른 사용자들에게까지 영향을 줄 수 있다.

WHERE 절은 기본적으로 FROM 다음에 위치하는 문법을 따른다

```sql
SELECT *
FROM 테이블명
WHERE 조건절;
```

<details>
<summary>비교 연산자 (=, <> , > , <, >= , <= )</summary>

[부등호 기호 연산]

=, <> , > , <, >= , <=

</details>

<details>
<summary>부정 비교 연산자 (!=, ^=, <>, NOT = , NOT >)</summary>

!= — 같지 않다 ( = 의 부정)

^= — 같지 않다 ( = 의 부정)

<> — 같지 않다 ( = 의 부정) → 표준 SQL

NOT [칼럼명] = — 칼럼명과 같지 않다

NOT [칼럼명] > —칼럼명보다 크지 않다

</details>

<details>
<summary>SQL 연산자 (BETWEEN AND, IN(list), LIKE, IS NULL)</summary>

BETWEEN a AND b — a 와 b 사이의 값

IN (list) — list에 있는 값들 중 어느 하나라도 일치

LIKE ‘비교문자열’ — ‘비교문자열’과 일치하면 참(TRUE) → (% , _ 사용)

IS NULL — NULL 값

</details>

<details>
<summary>부정 SQL 연산자 (NOT BETWEEN, NOT IN, IS NOT NULL)</summary>

NOT BETWEEN a AND b — a 와 b 값 사이의 값을 가지지 않음

NOT IN (list) — list에 있는 값들 중 어느 하라도 일치하지 않음

IS NOT NULL — NULL 값을 가지지 않음

</details>

<details>
<summary>논리 연산자 (AND, OR, NOT)</summary>

AND — 두 개 이상의 조건이 모두 참(TRUE)일 때만 전체 조건을 참으로 반환

즉 모든 조건을 동시에 만족해야 함

OR — 두 개 이상의 조건 중 하나라도 참(TRUE)일 경우 전체 조건을 참으로 반환

즉 하나의 조건만 만족해도 됨

NOT — 조건의 참/거짓을 반전, 조건이 참(TRUE)이면 거짓(FALSE)을 반환하고,
조건이 거짓(FALSE)이면 참(TRUE)을 반환

</details>

WHERE 절에서 여러 연산자가 사용될 때 우선순위는 다음과 같다

괄호 → 산술 연산자 → 문자열 연결 연산자( \|\| , + ) → 비교 연산자 & SQL 연산자

→ NOT 연산자 → AND → OR

비교 연산자와 SQL 연산자의 순위는 같으며 왼쪽에서 오른쪽으로 순서대로 적용된다.

<details>
<summary>예시</summary>

```sql
SELECT ENAME, JOB, SAL, DEPTO
FROM EMP
WHERE SAL BETWEEN 1500 AND 3000
AND DEPTNO = 20;
```

OR DEPTNO = 20 과 AND DEPTNO = 20 차이

```sql
SELECT ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE SAL BETWEEN 1500 AND 300
OR DEPTNO = 20;
```

---

괄호는 순서에 상관없이 우선순위가 가장 높다

```sql
SELECT ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE SAL > 1000 AND (SAL < 2000 AND DEPTNO = 20);
```

</details>

= (같다) : 숫자와 동일한 값을 가진 행을 선택

<> , != (같지 않다) : 특정 숫자와 다른 값을 가진 행을 선택

```sql
SELECT ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE SAL <> 3000 -- 혹은 
	SAL != 3000
```

>= (크거나 같다) : 특정 숫자보다 크거나 같은 값을 가진 행을 선택

<= (작거나 같다) : 특정 숫자보다 작거나 같은 값을 가진 행을 선택

---

복합 조건과 괄호 사용 : 조건의 우선순위를 명확히 하기 위해 괄호를 사용

```sql
SELECT ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE (SAL > 2000 AND DEPTNO = 20)
	OR
	(SAL BETWEEN 1500 AND 3000)
```

= (같다) : 특정 문자열과 동일한 값을 가진 행을 선택

!= 또는 <> (같지 않다) : 특정 문자열과 다른 값을 가진 행을 선택

> (크다) : 특정 문자열보다 사전 순으로 큰 값 (사전순으로 뒤에 나오는 값)을 가진 행을 선택

< (작다) : 특정 문자열보다 사전순으로 작은값(사전순으로 앞에 나오는 값)을 가진행을 선택

```sql
SELECT ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE ENAME > 'M';
```

M으로 시작으로 ENAME 값이 있다면 그 값도 출력된다.
ENAME > ‘M’ 은 정확히 M만 제외됨

따라서 ENAME ≥ ‘M’ 과 결과가 같다

>= , <= (크거나, 작거나 같다) : 특정 문자열보다 사전 순으로 크거나 혹은 작거나 같은 값을 가진 행을 선택

```sql
SELECT ENAME , JOB, SAL
FROM EMP
WHERE SAL BETWEEN 1500 AND 3000;
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE DEPTNO IN (10,20,30);
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE ENAME LIKE 'S%';
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE ENAME LIKE '%R%';
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE ENAME LIKE 'J_NES';
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE ENAME LIKE '_A%';
```

LIKE는 대소문자를 구분하므로 작성 시 대소문자를 잘 확인하여야 한다.

대소문자를 구분하지 않고 검색하기 위해 대문자로 검색하고, 칼럼 앞에
UPPER를 붙여준다

UPPER 함수가 ENAME을 대문자로 변경하기 때문에 결과적으로 소문자도 함께 조회된다.

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE UPPER(ENAME) LIKE 'A%';
```

---

NULL은 다른 값과 비교할 수 없으며, 일반적인 비교 연산자로는 비교되지 않으므로,
열의 값이 NULL인지 확인하는 데 사용된다.

```sql
SELECT ENAME, JOB, SAL, COMM
FROM EMP
WHERE COMM IS NULL;
```

- 테이블에 % , _ , 또는 * 과 같은 와일드카드 문자가 그대로 저장돼 있는 경우.

- 와일드카드로 사용되는 문자인지 아니면 실제 저장된 문자 데이터인지 구분해야 한다.

- 이때 사용하는 것이 이스케이프 문자이다.

- 이스케이프 문자란 와일드카드 문자를 와일드카드 문자가 아닌 일반 문자로 인식하도록 지정하는 특별한 문자를 말한다.

- 이스케이스 문자는 일반적으로 역슬래시(\\) 를 사용하며
문자 앞뒤로 역슬래시를 붙여 그 안에 들어간 문자를 와일드카드가 아닌 문자로 인식시킨다

- 그리고 마지막에 ESCAPE ‘\\’ 를 적어 이스케이프 문자를 인식시킨다.
\\ 를 앞뒤로 붙여서 감싸주는 모양이다 (\\%\\)

```sql
SELECT EMPNO, ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE ENAME LIKE 'A\%\_LLEN' ESCPAE '\';
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE SAL >= 2000
AND JOB = 'MANAGER';
```

<details>
<summary>WHERE 1=1 쿼리를 사용하는 이유</summary>

WHERE 조건에 논리 연산자가 여러 개있을 경우 
나중에 수정하기 쉽게 하기 위해서이다.

WHERE 1=1 다음 행에 AND나 OR 연산자로 여러 번 반복하는 조건을 수정하기 쉬워진다.

실무에서 WHERE 조건 수정은 꽤나 빈번하기 때문에 자주 사용한다.

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE 1=1
	AND SAL >= 2000
	AND JOB = 'MANAGER'
	AND ENAME = 'JONES';
```

</details>

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE SAL > 2000 OR DEPTNO = 20;
```

```sql
SELECT ENAME, JOB, SAL
FROM EMP
WHERE NOT SAL > 1000
OR JOB = 'MANAGER';
```

---

<details>
<summary>논리 연산자 우선순위</summary>

논리 연산자 우선순위 NOT > AND > OR

```sql
SELECT ENAME, JOB, SAL, DEPTNO
FROM EMP
WHERE (NOT(SAL > 2000 AND DEPTNO = 10))
	OR JOB = 'CLERK';
```

</details>

<details>
<summary>SQL 쿼리의 실행 과정</summary>

1단계 재료 준비 — FROM : 테이블에서 데이터 가져오기

2단계 재료 선별 — WHERE : 조건에 맞는 행 선택

3단계 재료 분류 — GROUP BY : 같은 종류끼리 그룹화

4단계 분류된 재료 선별 — HAVING : 그룹 중 조건에 맞는 것 선택

5단계 요리 완성 — SELECT : 최종 결과 선택

6단계 정렬하기 — ORDER BY : 오름차순, 내림차순

---

다중행 함수 (EX. AVG, SUM)는 여러 재료를 한꺼번에 처리해야 한다. (= 그룹화 필요)

WHERE는 개별 재료를 선별하는 단계 

아직 재료가 분류되지 않았기 때문에 여러 재료를 한꺼번에 처리하는 다중행 함수를 사용할 수 없다

HAVING은 재료를 분류한 후에 실행된다.

이때는 이미 재료가 그룹별로 정리되어 있어서 다중행 함수를 사용할 수 있다

EX. 

WHERE : “빨간 사과만 선택해”

HAVING : “사과들의 평균 무게가 200G 이상인 종류만 선택해”

HAVING 절에는 그룹별 ‘평균’이라는 개념을 사용할 수 있지만,
WHERE 절에서는 아직 사과를 선택하는 단계이기 때문에 평균을 계산할 수 없다.

그룹별 ‘평균’ 이라는 것은 그룹핑을 먼저 한 다음에야 그룹벼로 평균이라는 개념이
나오는 것이므로 항상 GROUP BY 다음에 HAVING이 온다고 생각하면 된다.

</details>

<details>
<summary>다중행 함수와 집계 함수</summary>

모든 집계 함수는 다중행 함수이지만 모든 다중행 함수는 집계 함수가 아니다

다중행 함수 : 여러 행을 입력으로 받아서 처리하는 함수를 통칭하는 넓은 개념

ORACLE 함수 구분

단일행 함수 : 행 하나마다 결과를 하나씩 반환 (EX. UPPER, SUBSTR, ROUND)

다중행 함수 : 여러 행을 대상으로 동작 (그룹함수/집계함수가 여기 포함됨)

---

집계 함수 : SQL에서 여러 행의 데이터를 하나의 결괏값으로 집계하는데 사용되는 함수

주로 데이터의 요약, 계산, 통계 목적으로 사용된다.

SUM , AVG , COUNT , MAX , MIN 함수 등이 대표적이다.

집계 함수의 특징 (데이터진흥원) : 

여러 행들의 그룹이 모여 그룹당 단 하나의 결과를 돌려주는 함수이다.

GROUP BY 절은 행들을 소그룹한다.

SELECT , HAVING , ORDER BY 절에서 사용할 수 있다.

다중행 함수에서 주의할 점은 WHERE 절에서는 사용할 수 없고,
HAVING 절에서 사용 가능하다.

다중행 함수의 전체 조건이 바로 그룹화가 이루어져야 가능한 함수이기 때문이다.

반별 평균, 칼럼의 최댓값 등 먼저 그룹화한 다음에 다중행 함수가 실행되므로
SQL 문법 순서상 그룹화 되기 전에 실행되는 WHERE 절에서 사용할 수 없다.

</details>

<details>
<summary>다중행 함수 종류</summary>

<details>
<summary>집계 함수</summary>

COUNT() : 행의 개수를 계산

SUM() : 합계를 계산

AVG() : 평균을 계산

MAX() : 최댓값은 찾음

MIN() : 최솟값을 찾음

</details>

<details>
<summary>통계 함수 (집계함수로 분류하기도 함)</summary>

STDDEV() : 표준편차를 계산

VARIANCE() : 분산을 계산

</details>

<details>
<summary>그룹 함수 (데이터 분석 함수로 분류하기도 함)</summary>

LISTAGG() : 여러 행의 값을 하나의 문자열로 연결 (오라클)

STRING_AGG() : LISTAGG와 유사 (SQL Server)

GROUP_CONCAT() : LISTAGG와 유사 (MYSQL)

</details>

<details>
<summary>순위 함수</summary>

RANK() : 순위를 계산 (동점 시 간격 발생)

DENSE_RANK() : 순위를 계산 (동점시 간격 없음)

ROW_NUMBER() : 각 행에 고유한 숫자를 할당

</details>

<details>
<summary>윈도우 함수</summary>

위의 다중행 함수들을 OVER 절과 함께 사용하여 윈도우 함수로 활용 가능

</details>

</details>

GROUP BY 절은 SQL에서 데이터를 그룹화하는 데 사용되는 중요한 기능이다.

GROUP BY는 지정된 칼럼(열)의 값이 같은 행들을 하나의 그룹으로 묶는다

집계 함수를 사용하여 그룹의 특성을 파악하기 위함이다.

보고서, 통계, 데이터 요약 등의 실무에서 자주 사용된다.

---

GROUP BY 절은 SELECT 문에서 집계 함수를 사용할 때 
지정된 열의 기준으로 행을 그룹으로 묶는다

그룹화된 칼럼(열)은 반드시 SELECT 절에도 포함되어야 한다.
이는 최종적으로 조회해서 보여주려면 
그룹화된 칼럼도 SELECT 절에 존재해야 하기 때문이다.

```sql
-- DEPTNO, JOB, 그룹별 SAL의 합계를 선택
SELECT DEPTNO, JOB, SUM(SAL)
-- EMP 테이블에서
FROM EMP
-- DEPTNO와 JOB 칼럼의 데이터를 그룹화
-- 칼럼의 데이터 고윳값을 기준으로 그룹화
GROUP BY DEPTNO, JOB
-- DEPTNO 순으로 정렬
ORDER BY DEPTNO;
```

GROUP BY에서는 ALIAS를 사용할 수 없다.
GROUP BY는 SELECT 절보다 먼저 실행되므로, 
GROUP BY에서 정의된 ALIAS를 인식할 수 없다.

따라서 GROUPY BY 절에서 정의된 ALIAS 를 사용하면 오류가 발생한다

<details>
<summary>ORDER BY에서는 ALIAS를 사용할 수 있는 이유</summary>

SQL 실행 순서와 깊은 관련이 있기 때문이다.

ORDER BY절은 가장 마지막 단계에서 실행되므로 
ORDER BY 절에서는 ALIAS를 사용 할 수 있다.

하지만 최신 몇몇 DB 에서는 GROUP BY절에서 ALIAS를 허용하기도 한다.
일부 주요 데이터베이스 시스템에서는 
GROUP BY절에서 ALIAS 사용을 허용하지는 않는다.

</details>

HAVING절은 GROUP BY와 함께 자주 사용되며 그룹화된 결과에 조건을 적용할 때 사용

다시 말해, GROUP BY 절로 그룹화된 특정 칼럼의 고유한 데이터값 전부를 그룹화하는 것이 아니라, 필터를 통해 그룹 내에서 필터링된 값만을 그룹화하고 싶을 때 사용한다.

HAVING 절에는 주로 집계함수(SUM, COUNT, AVG 등)가 사용된다.

GROUPY BY 절 없이 HAVING 을 사용할 수 있지만 , 이는 드믄 경우이다.
대부분은 GROUP BY와 함께 사용된다.

---

GROUP BY와 HAVING 사용 예시

```sql
SELECT DEPTNO, AVG(SAL) -- DEPTNO, AVG(SAL) 행 선택
FROM EMP -- EMP 테이블에서
GROUP BY DEPTNO -- DEPTNO 칼럼의 데이터를 그룹화
HAVING AVG(SAL) > 2000; -- AVG(SAL)이 2000 초과인 그룹 선택
-- DEPTNO별로 그룹화하고 평균 SAL이 2000 초과인 그룹 조회
```

GROUP BY 와 HAVING 절의 순서가 바뀐 경우

- 오라클에서는 문법 에러가 없고 결과물도 동일

- SQL Server에서는 오류 발생

```sql
SELECT DEPTNO, AVG(SAL) -- DEPTNO, AVG(SAL) 행 선택
FROM EMP -- EMP 테이블에서
-- DEPTNO별로 그룹화하고 평균 SAL이 2000 초과인 그룹 조회
HAVING AVG(SAL) > 2000; -- AVG(SAL)이 2000 초과인 그룹 선택
GROUP BY DEPTNO -- DEPTNO 칼럼의 데이터를 그룹화
```

---

<details>
<summary>데이터를 필터링할 때 WHERE 절 혹은 HAVING 절의 차이</summary>

- 데이터를 그룹핑하여 집계 함수를 적용할 때 특정한 그룹을 필터링 할 수 있는 
방법은 크게 두 가지다.

- 하나는 WHERE 절에서 먼저 데이터를 필터링하고 이를 가지고 집계하는 방법
다른 하나는 HAVING 절에서 데이터를 필터링하는 방법

---

WHERE 절에서 필터링 하는 방법

```sql
SELECT DEPTNO , AVG(SAL)
FROM EMP
WHERE SAL > 1500 -- SAL 값이 1500 초과인 행
GROUP BY DEPTNO; -- DEPTNO별로 그룹화
```

HAVING 절에서 필터링 하는 방법

```sql
SELECT DEPTNO, AVG(SAL)
FROM EMP
GROUP BY DEPTNO -- DEPTNO 별로 그룹화
HAVING AVG(SAL) > 1500 -- AVG(SAL)이 1500 초과인 그룹 선택
-- DEPTNO별로 그룹화하고 평균 SAL이 1500 초과인 그룹 조회
```

WHERE 절은 그룹화 전에 개별 행을 필터링한다.
즉, 적용 대상은 개별 행이며, 이때 WHERE 절에는 집계 함수를 사용할 수 없다.

HAVING 절은 그룹화 후 그룹에 대해 필터링한다.
즉, 적용 대상은 그룹화된 결과이며, HAVING절에는 집계 함수를 사용할 수 있다.

WHERE 절은 데이터를 그룹화하기 전에 개별 행에 조건을 적용하여 필터링하고,
HAVING 절은 데이터를 그룹화한 후 그룹에 조건을 적용하여 필터링한다.

WHERE과 HAVING 절을 사용하여 더 정교한 데이터 필터링과 집계가 가능하다.

</details>

ASC : 오름차순 정렬 (NULL이 맨 뒤)

DESC : 내림차순 정렬 (NULL이 맨 앞)

---

단일 열을 기준으로 오름차순 정렬

```sql
SELECT ENAME, JOB AS JOB_NAME, SAL
FROM EMP
ORDER BY SAL ASC; -- SAL를 오름차순 정렬
```

단일 열은 기준으로 내림차순 정렬

```sql
SELECT ENAME, JOB AS JOB_NAME, SAL
FROM EMP
ORDER BY SAL DESC; -- SAL를 내림차순 정렬
```

여러 열을 기준으로 정렬

```sql
SELECT ENAME, JOB AS JOB_NAME, SAL
FROM EMP
ORDER BY DEPTNO ASC, SAL DESC;
-- DEPTNO는 오름차순으로 정렬하고, SAL은 내림차순 정렬
```

부서별로 가장 최근에 고용된 직원 찾기

```sql
SELECT ENAME, JOB, HIREDATE, DEPTNO
FROM EMP
ORDER BY DEPTNO ASC, HIREDATE DESC;
```

- **ASC/DESC는 컬럼마다 개별 적용** — 안 붙이면 그 컬럼은 오름차순

- **왼쪽 컬럼이 우선**, 같을 때만 다음 컬럼 → 순서 바뀌면 결과가 달라짐

- 뒤 컬럼은 **동점을 깨는 기준**으로 활용

- **NULL 위치** 확인 (Oracle은 ASC면 뒤, DESC면 앞 / `NULLS FIRST·LAST`로 조정)

DB에서의 ‘관계’ : 서로 연결되어 있다

식별 관계 : 부모 테이블의 식별자를 자식 테이블의 식별자로 포함

그렇지 않다면 ‘비식별 관계’라고 한다.

SQL에서 관계 개념을 JOIN 이라고 부른다.

JOIN은 데이터를 서로 연결해서 볼 수 있는 방법
데이터를 연결해주는 연결고리(식별자)를 통해 두 가지 다른 정보를 한데 모아 볼 수 있다.

JOIN은 두 개 이상의 테이블에서 관련된 데이터를 결합하여 새로운 결과 집합을 생성하는 과정

관계형 데이터베이스에서는 테이블 간의 관계를 정의하고,
이러한 관계를 통해 데이터를 연결한다.

조인의 기본 목적은 테이블 간의 관계를 활용하여 필요한 정보를 효율적으로 검색하는 것이다.

```sql
SELECT -- 조인한 이후 최종적으로 출력할 칼럼 선택
	별칭1.칼럼명
	별칭2.칼럼명
FROM
	테이블1 AS 별칭1 -- 테이블 1의 ALIAS는 별칭1
	JOIN 테이블2 AS 별칭2 -- 테이블1과 테이블2를 조인, 테이블 2의 ALIAS는 별칭2
		ON 별칭1.칼럼명 = 별칭2.칼럼명; -- 테이블1의 칼럼과 테이블2의 칼럼이 서로 일치하는 조건
```

JOIN은 일반적으로 주식별자(PK)나 보조식별자(FK) 값의 연관에 의해 조인이 이루어진다.
하지만 식별자 관계없이 논리적인 값들의 연관만으로도 JOIN이 이루어질 수 없다.

<details>
<summary>일반적인 식별자 관계 JOIN </summary>

EMP_NEW 테이블에 직원 정보가 있으며, DEPTNO 칼럼이 FK로 설정
DEPT_NEW 테이블에서는 DEPTNO 칼럼이 PK로 설정

직원 정보를 저장하는 EMP_NEW 테이블에서는 직원의 부서 정보를 표시하기 위해 부서 정보 테이블인 DEPT_NEW 테이블의 DEPTNO 칼럼을 FK로 참조한다.

EMP_NEW 테이블에서는 부서의 번호만 담고 있을 뿐, 세부적으로 어떤 부서인지에 관한 정보는 담고 있지 않다. 따라서 특정 지원이 속한 부서 이름을 알고 싶다면, 해당 테이블들을 DEPTNO 칼럼으로 조인해야 한다.

이렇게 식별자 관계로 조인하는 경우가 ‘일반적인 식별자 관계 JOIN’이다.

```sql
-- JOIN한 이후 최종적으로 출력할 칼럼을 선택
-- EMP_NEW 테이블의 ENAME, DEPT_NEW 테이블의 DNAME
SELECT e.ENAME, d.DNAME 
FROM EMP_NEW e -- EMP_NEW 테이블과 DEP_NEW 테이블을 조인
	JOIN DEPT_NEW d  -- EMP_NEW 테이블의 별칭은 e, DEPT_NEW 테이블의 별칭은 d
		ON e.DEPTNO = d.DEPTNO;
		-- EMP_NEW 테이블의 DEPTNO 칼럼과 DEPT_NEW 테이블의 DEPTNO 칼럼이 서로 일치하는 조건
```

</details>

<details>
<summary>비식별자 관계 JOIN</summary>

식별자 관계가 아닌 경우에도 조인이 가능하다.

EMP_NEW 테이블과 DEPT_NEW 테이블에 모두 존재하는 칼럼이지만,
식별자 관계가 아닌 LOCATION 칼럼으로 조인하는 경우를 예시로 든다.

이 경우 EMP_NEW 직원 정보 테이블에 있는 LOCATRION 칼럼과 
DEPT_NEW 부서 정보 테이블의 LOCATION 칼럼을 조인할 때 ON 조건절로 정의해야 한다.

```sql
SELECT e.ENAME , d.DNAME -- 조인한 이후 최종적으로 출력할 칼럼 선택
-- EMP_NEW 테이블과 DEPT_NEW 테이블을 조인
FROM EMP_NEW e 
	JOIN DEPT_NEW d 
	-- EMP_NEW 테이블의 LOCATION과 DEPT_NEW 테이블의 LOCATION 칼럼이 서로 일치할 때
		ON e.LOCATION = d.LOCATION;
```

</details>

데이터 간의 논리적 연관성이 있다면 그것을 기준으로 JOIN을 수행할 수 있다.

그러나 비식별자 관계를 통한 방식의 JOIN은 데이터의 정합성과 의미를 신중히 고려해야 한다.

조인 시 조건이 되는 칼럼이 서로 식별자 관계가 아니기 때문에 데이터의 정합성을 보장할 수 없으며
경우에 따라 조인 후 테이블의 행 수가 두 테이블을 합친 것보다 훨씬 더 많이 늘어날 수도 있다.
(낮은 카디널리티)

<details>
<summary>카디널리티(Cardinality)</summary>

카디널리티는 특정 데이터 집합에서 유니크한(중복되지 않는) 값의 개수를 의미한다.

카디널리티는 데이터의 ‘유일성’을 나타내며, 높은 카디널리티 칼럼을 사용하면
데이터베이스 작업이 일반적으로 더 효율적이고 예측 가능해진다.

JOIN 시에도 가능하면 높은 카디널리티 칼럼을 사용하는 것이 좋다.

카디널리티의 예시

- 성별 칼럼 : 보통 ‘남성’, ‘여성’ 두 가지 값만 있으므로 낮은 카디널리티

- 주민등록번호 칼럼 : 모든 사람이 다른 값을 가지므로 높은 카디널리티

카디널리티의 중요성

- 인덱스 설계 : 높은 카디널리티를 가진 칼럼이 인덱스로 더 적합하다.

- 쿼리 성능 : 높은 카디널리티 칼럼으로의 검색이 일반적으로 더 빠르다.

- JOIN의 효율성 : 높은 카디널리티 칼럼으로 JOIN 시 더 효율적이다.

카디널리티와 JOIN

- 높은 카디널리티로 JOIN : 결과 행 수가 예측 가능하고 제어하기 쉽다.

- 낮은 카디널리티로 JOIN : 결과 행 수가 급격히 증가할 수 있어 주의가 필요하다.

</details>

또한 고유하지 않은 정보로 연결할 경우, 실제로는 관계없는 데이터가 연결될 수도 있다.
즉, 조인 후 데이터가 정확하지 않을 수 있다.

---

```sql
SELECT S.ID, S.NAME, D.DNAME
FROM STUDENT S 
	INNER JOIN DEPARTMENT D
		ON S.DEPTNO = D.DEPTNO
```

---

```sql
SELECT S.ID, S.NAME, D.DNAME
FROM STUDENT S
-- 왼쪽 테이블의 모든 행과 오른쪽 테이블의 공통된 값을 가진 행 반환
	LEFT OUTER JOIN DEPARTMENT D
	-- LEFT 테이블인 STUDENT 테이블의 모든 행과
	-- RIGHT 테이블인 DEPARMENT 테이블의 DEPTNO가 일치하는 행을 결합
		ON S.DEPTNO = D.DEPTNO
		-- 일치하지 않는 DEPARTMENT 행은 NULL 표시
```

오라클에서는 WHERE 조건에 서 (+) 기호를 기준이 되는 반대쪽 칼럼에 붙이면
LEFT OUTER JOIN과 같은 결과가 나온다.
반드시 기준이 되는 테이블의 반대쪽 테이블에 붙여야 한다.

오라클에서 LEFT OUTER JOIN 및 (+) 두 분법 모두 사용 가능하지만,
다른 DMBS로 마이그레이션 할 가능성이 있다면 ANSI 표준 문법을 사용하는 것이 좋다.

```sql
SELECT S.ID, S.NAME, D.DNAME
FROM STUDENT S, DEPARTMENT D
WHERE S.DEPTNO = D.DEPTNO(+);
```

---

```sql
SELECT S.ID, S.NAME, D.DNAME
FROM STUDENT S
	RIGHT OUTER JOIN DEPARTMENT D
		ON S.DEPTNO = D.DEPTNO
```

RIGHT OUTER JOIN도 똑같이 (+) 문법이 적용 가능하다
기준이 되는 테이블의 반대쪽 테이블에 붙여야 한다.

```sql
SELECT S.ID, S.NAME, D.DNAME
FROM STUDENT S, DEPARTMENT D
WHERE S.DEPTNO(+) = D.DEPTNO;
```

---

```sql
SELECT S.ID, S.NAME, D.DNAME
FROM STUDENT S
	FULL OUTER JOIN DEPARTMENT D
	-- 공통된 값이 없는 경우에도 각 테이블에서 행을 반환하고 NULL 표시
		ON S.DEPTNO = D.DEPTNO;
```

---

UNION은 JOIN의 종류는 아니지만, 두 테이블을 결합할 때 자주 사용한다.
UNION은 두 쿼리의 결과 집합을 합치되, 중복된 행이 있다면 중복 행을 제거하고
유일한 하나의 행만 출력한다.

FULL OUTER JOIN과 유사하지만, 중복 행을 제거해서 출력한다는 점에서 다르다.

만약 FULL OUTER JOIN 과 같이 중복된 행을 모두 표시하고 싶을 때는 
UNION ALL을 사용해야한다.

```sql
-- 쿼리 1
SELECT ID, NAME, DEPTNO
FROM STUDENT
UNION -- 두 쿼리의 결과 집합을 합치되, 중복은 제거
-- 쿼리 2
-- DEPARTMENT 테이블의 칼럼에서 ALIAS를 사용하여 동일한 칼럼명으로 변경
-- (칼럼명이 동일해야 UNION이 가능)
SELECT DEPTNO AS ID, DNAME AS NAME, NULL AS DEPTNO
FROM DEPARTMENT;
```

UNION 사용 시 주의사항

UNION을 사용하려면 각 쿼리의 칼럼 개수와 데이터 유형이 동일해야 하며,
각 컬럼의 이름이 동일할 필요는 없지만 의미상으로는 일치해야 한다.

즉, 각 컬럼이 동일한 의미를 가져야 합쳐진 결과가 올바르게 해석될 수 있다.

FULL OUTER JOIN과 UNION, UNION ALL의 차이

| 항목 | FULL OUTER JOIN  | UNION  | UNION ALL |
| --- | --- | --- | --- |
| 데이터 결합 방식 | 두 테이블의 모든 행을 결합 | 두 쿼리의 결과 집합을 합침 | 두 쿼리의 결과 집합을 합침 |
| 중복 처리 | 중복된 행도 포함 | 중복된 행을 제거 | 중복된 행도 모두 포함 |
| NULL 처리 | 어느 한쪽에만 존재하는 행은 NULL로 채움 | 중복된 행은 한 번만 포함 | 각 쿼리의 결과에 포함된 NULL 값이 그대로 유지되어 결과 집합에 포함 |
| 사용 목적 | 두 테이블 간의 모든 데이터를 결합 | 여러 쿼리의 결과를 하나로 결합 | 여러 쿼리의 결과를 중복된 행을 포함하여 하나로 결합 |

EQUI JOIN은 두 테이블을 특정 열의 값이 동일한 행을 기준으로 결합하는 조인 방식이다.
이 조인은 ON 절에서 두 열의 값이 같은지 확인하는 조건을 사용한다.

가장 일반적인 형태의 조인 중 하나이며, INNER JOIN과 동일한 방식으로 작동한다.

```sql
SELECT S.ID, S.NAME, S.SCORE, D.DEPT_ID, D.GRADE
FROM NEW_STUDENT S
	JOIN NEW_DEPARTMENT D
	-- NEW_STUDENT 테이블의 SCORE 값이
	-- NEW_DEPARTMENT 테이블의 MIN_SCORE 값과 동일한 행들을 결합
		ON S.SCORE = D.MIN_SCORE;
```

---

Non EQUI JOIN은 두 테이블을 결합할 때 = 연산자가 아닌 다른 비교 연산자를 사용하는 
조인 방식이다.

이 방식은 두 테이블 간의 관계가 단순히 동일한 값이 아니며,
범위나 다른 조건에 따라 결합되어야 할 때 사용된다.

Non EQUI JOIN은 두 테이블 간의 값을 비교할 때 = 연산자 이외의 다른 비교 연산자
(> , < , >=, <=, != 등)를 사용하여 결합한다.
일반적으로 특정 범위나 조건을 만족하는 행동을 결합할 때 사용된다.

```sql
SELECT S.ID, S.NAME, S.SCORE, D.DEPT_ID, D.GRADE
FROM NEW_STUDENT S
	JOIN NEW_DEPARTMENT D
		ON S.SCORE 
		BETWEEN D.MIN_SCORE AND D.MAX_SCORE;
```

3개 이상의 테이블을 조인하는 방법은 두 개의 테이블을 조인하는 방식과 동일하게,
각 테이블 간의 관계를 정의하여 연결한다.

각 조인의 결과를 다음 조인에 사용하는 방식으로 여러 테이블을 연속적으로 조인한다.

따라서 3개 이상이든 10개 이상이든 개념은 같다.
실행 순서대로 먼저 2개의 테이블을 조인하고, 그 결과를 다시 다른 테이블과 조인하며,
이를 반복하면 된다.

STUDENT  (학생 테이블)                   
────────────  
ID  NAME  DEPTNO        
1     철수        10            
2    영희        20

DEPARTMENT  (학과 테이블)     
────────────────        
DEPTNO  DNAME   PROFNO   
10               컴공           P1       
20              전자           P2

PROFESSOR   (교수 테이블)
──────────────── 
PROFNO  PNAME
 P1               김교수
 P2              이교수

STUDENT - DEPARTMENT - PROFESSOR

STUDENT는 DEPTNO로 DEPARTMENT와 연결
DEPARTMENT는 PROFNO로 PROFESSOR와 연결

DEPARTMNET는 다리 역할
학생과 교수는 직접 연결고리가 없고, 학과를 거쳐야 이어진다.

```sql
SELECT S.NAME, D.DNAME, P.PNAME
FROM STUDENT S -- 시작 테이블
	JOIN DEPARTMENT D ON S.DEPTNO = D.DEPTNO -- 연결1 (학생 <-> 학과)
	JOIN PROFESSOR P ON D.PROFNO = P.PROFNO; -- 연결2 (학과 <-> 교수)
```

1단계 - STUDENT와 DEPARTMENT를 연결

철수(10) + 컴공(10, P1)
영희(20) + 전자(20, P2)

2단계 - 1단계 결과에 PROFESSOR를 조인

철수 + 컴공(P1) + 김교수(P1)
영희 + 전자(P2) + 이교수(P2)

결과 

NAME   DNAME   PNAME
────   ─────   ──────
   철수        컴공         김교수
   영희        전자         이교수

---

3개 이상의 테이블을 조인할 시 ON이 올바른 두 테이블을 연결하고 있는지 확인해야 된다.

두 테이블 간의 공통 열을 자동으로 사용하여 조인을 수행하는 SQL 조인 방식이다.

조인 조건을 명**시적으로 지정할 필요가 없으며**,
**두 테이블에 동일한 이름을 가진 모든 열이 조인 조건으로 사용**된다.

기본적으로 JOIN은 종류를 막론하고 ON 다음에 조건을 명시해야 하지만,
NATURAL JOIN은 조인 조건이 필요 없다는 점이 일반적인 JOIN과 가장 큰 차이점이다.

```sql
SELECT *
FROM 테이블A
	NATURAL JOIN 테이블B; 
	-- 두 테이블 간의 공통 열을 자동으로 사용하여 조인을 수행
	-- 조인 조건을 지정할 필요 없음
```

테이블만 지정하면 별다른 조건이 없어도, 테이블A와 테이블B의 공통된 칼럼명을 찾아서
자동으로 조인 조건으로 사용한다.

따라서 NATURAL JOIN은 공통된 칼럼명이 하나일 때 사용하는 것이 좋다.

---

공통된 칼럼며이 여러개인 경우 오류가 발생하거나, 결괏값이 없거나, 예상치 못한 방식으로
조인되어 결과 데이터가 이상하게 나오는 등의 문제가 발생할 수 있다.

NATURAL JOIN을 사용하면 공통된 칼럼이 한 번 나오고,
INNER JOIN을 사용하면 공통된 칼럼이 중복으로 두 번 나온다.

USING 조건절은 SQL에서 조인을 수행할 때 두 테이블 간의 공통 칼럼을 명시적으로 지정하는
방법이다.

USING 조건절은 두 테이블에 동일한 이름을 가진 열을 지정하여 조인 조건으로 사용한다.
이는 NATURAL JOIN과 비슷하지만, 명시적으로 조인할 열을 지정할 수 있다는 점이 다르다.

```sql
SELECT *
FROM 
	테이블A
	JOIN 테이블B
		USING (공통 칼럼);
		-- 두 테이블간의 공통 칼럼을 명시적으로 지정
```

두 테이블 간의 공통 칼럼을 지정하여 조인을 수행한다.
이때 결과는 NATURAL JOIN처럼 공통 칼럼이 한 번 출력된다.

```sql
SELECT *
FROM EMP A
	JOIN DEPT B
		USING (DEPTNO);
```

---

ON 조건절과 USING 조건절의 차이

ON 조건절은 JOIN 구문의 일부로 사용되며,
조인할 열이나 복잡한 조건을 명시할 수 있다.

ON 조건절은 다양한 유형의 조인(INNER, LEFT/RIGHT, FULL OUTER JOIN)에서 사용된다.

**ON 조건절에서는 조건절에 사용되는 칼럼명이 동일하지 않아도 된다.
하지만 USING 조건절은 반드시 동일한 칼럼명을 사용하는 칼럼만 조건으로 사용할 수 있다.**

**ON 조건절에서는 조인된 테이블의 칼럼이 그대로 결과에 포함되지만,
USING 조건절은 조인된 공통 칼럼이 결과 집합에 한 번만 나타난다.**
