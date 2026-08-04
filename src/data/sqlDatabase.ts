import { QuestionItem } from '../types';

export const sqlDatabaseQuestions: QuestionItem[] = [
  {
    id: 'sql-01',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'Window Functions',
    title: 'ROW_NUMBER() vs RANK() vs DENSE_RANK() with Real Output',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Exact differences in tie-handling, gap-generation, and ranking behavior using PARTITION BY and ORDER BY clauses.',
    coreConcepts: [
      'ROW_NUMBER(): Assigns a unique sequential integer (1, 2, 3, 4) to each row regardless of duplicate values.',
      'RANK(): Assigns identical rank to ties, but leaves gaps in subsequent rankings (1, 2, 2, 4).',
      'DENSE_RANK(): Assigns identical rank to ties without leaving any gaps (1, 2, 2, 3).'
    ],
    detailedExplanation: [
      'Window functions compute values across a set of table rows that are related to the current row without collapsing the rows into a single summary output (unlike GROUP BY).',
      'PARTITION BY resets the rank calculation for each group (e.g. per Department). ORDER BY defines the ranking metric within that partition.'
    ],
    codeExamples: [
      {
        title: 'Ranking Window Functions Query on Employee Salaries',
        language: 'sql',
        code: `-- Setup Table & Data
CREATE TABLE employee_salaries (
    id INT PRIMARY KEY,
    department VARCHAR(50),
    name VARCHAR(50),
    salary INT
);

INSERT INTO employee_salaries VALUES
(1, 'IT', 'Alice',   90000),
(2, 'IT', 'Bob',     85000),
(3, 'IT', 'Charlie', 85000), -- Tie with Bob
(4, 'IT', 'David',   70000),
(5, 'HR', 'Emma',    85000),
(6, 'HR', 'Frank',   85000); -- Tie with Emma

-- Ranking Comparison Query
SELECT 
    department,
    name,
    salary,
    ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) AS row_num,
    RANK()       OVER(PARTITION BY department ORDER BY salary DESC) AS rank_val,
    DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dense_rank_val
FROM employee_salaries;`,
        output: `+------------+---------+--------+---------+----------+----------------+
| department | name    | salary | row_num | rank_val | dense_rank_val |
+------------+---------+--------+---------+----------+----------------+
| HR         | Emma    | 85000  | 1       | 1        | 1              |
| HR         | Frank   | 85000  | 2       | 1        | 1              |
| IT         | Alice   | 90000  | 1       | 1        | 1              |
| IT         | Bob     | 85000  | 2       | 2        | 2              |
| IT         | Charlie | 85000  | 3       | 2        | 2              |
| IT         | David   | 70000  | 4       | 4 (gap!) | 3 (no gap!)    |
+------------+---------+--------+---------+----------+----------------+`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Clearly explains how each handles duplicate/tie values: ROW_NUMBER (arbitrary tie-break, no dupes), RANK (dupes with gaps), DENSE_RANK (dupes without gaps).',
        'Demonstrates PARTITION BY and ORDER BY clauses.',
        'Explains why window functions are superior to self-joins for finding top N per category.'
      ],
      juniorOrMidRedFlags: [
        'Confuses RANK with DENSE_RANK.',
        'Thinks window functions collapse rows like GROUP BY.'
      ],
      seniorDifferentiators: [
        'Provides real-world use case for finding Nth highest salary or deduplicating records via ROW_NUMBER() = 1 in a CTE.'
      ],
      followUpQuestions: [
        'How do you write a query to delete duplicate rows from a table using ROW_NUMBER() and CTE?'
      ]
    },
    tags: ['SQL', 'Window Functions', 'ROW_NUMBER', 'RANK', 'DENSE_RANK']
  },
  {
    id: 'sql-02',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'CTE & Hierarchical Queries',
    title: 'Common Table Expressions (CTE) & Recursive CTE for Hierarchical Data',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Using standard CTEs for query readability and Recursive CTEs to query organization charts, parent-child trees, and graphs without recursive application code.',
    coreConcepts: [
      'A Common Table Expression (CTE) is a temporary named result set defined within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE statement using the WITH keyword.',
      'A Recursive CTE references itself and consists of an Anchor Member, a UNION ALL, and a Recursive Member terminated by a base condition.'
    ],
    detailedExplanation: [
      'Recursive CTEs eliminate the need for procedural stored procedures or multiple round-trip application queries when traversing organizational hierarchies or category trees.',
      'Always include depth guards or cycle detection in recursive CTEs to prevent infinite loops when data contains circular graph references.'
    ],
    codeExamples: [
      {
        title: 'Recursive CTE Querying Employee Management Hierarchy',
        language: 'sql',
        code: `CREATE TABLE org_chart (
    emp_id INT PRIMARY KEY,
    name VARCHAR(50),
    manager_id INT
);

INSERT INTO org_chart VALUES
(1, 'CEO - Sarah', NULL),
(2, 'VP - Marcus', 1),
(3, 'Director - Lin', 2),
(4, 'Lead - Alex', 3),
(5, 'Senior Dev - Raj', 4);

-- Recursive CTE to traverse hierarchy and calculate level
WITH RECURSIVE HierarchyTree AS (
    -- Anchor Member: Root of hierarchy (CEO)
    SELECT emp_id, name, manager_id, 1 AS org_level, CAST(name AS CHAR(200)) AS path
    FROM org_chart
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive Member: Join subordinates with their managers
    SELECT e.emp_id, e.name, e.manager_id, h.org_level + 1, CONCAT(h.path, ' -> ', e.name)
    FROM org_chart e
    INNER JOIN HierarchyTree h ON e.manager_id = h.emp_id
)
SELECT emp_id, name, org_level, path 
FROM HierarchyTree 
ORDER BY org_level;`,
        output: `+--------+------------------+-----------+-------------------------------------------------------------+
| emp_id | name             | org_level | path                                                        |
+--------+------------------+-----------+-------------------------------------------------------------+
| 1      | CEO - Sarah      | 1         | CEO - Sarah                                                 |
| 2      | VP - Marcus      | 2         | CEO - Sarah -> VP - Marcus                                  |
| 3      | Director - Lin   | 3         | CEO - Sarah -> VP - Marcus -> Director - Lin                |
| 4      | Lead - Alex      | 4         | CEO - Sarah -> VP - Marcus -> Director - Lin -> Lead - Alex  |
| 5      | Senior Dev - Raj | 5         | ... -> Lead - Alex -> Senior Dev - Raj                      |
+--------+------------------+-----------+-------------------------------------------------------------+`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains CTE structure (WITH clause) and advantages over complex nested subqueries.',
        'Explains the two parts of Recursive CTE: Anchor query and Recursive query connected via UNION ALL.',
        'Mentions cycle/loop detection when traversing graphs.'
      ],
      juniorOrMidRedFlags: [
        'Cannot explain how recursion terminates in SQL.',
        'Attempts to do multi-level parent-child hierarchy in a single static JOIN.'
      ],
      seniorDifferentiators: [
        'Explains performance differences between CTEs materialized vs inlined by query optimizers in PostgreSQL / Oracle / SQL Server.'
      ],
      followUpQuestions: [
        'How does Postgres MATERIALIZED vs NOT MATERIALIZED hint affect CTE execution?'
      ]
    },
    tags: ['SQL', 'CTE', 'Recursive Query', 'Hierarchical Data']
  },
  {
    id: 'sql-03',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'Indexes & Query Optimization',
    title: 'Composite Indexes, Leftmost Prefix Rule & B-Tree Mechanics',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'How B-Tree balanced search trees work, column ordering in composite indexes (a, b, c), index skip scans, covering indexes, and index selectivity.',
    coreConcepts: [
      'B-Tree indexes maintain sorted keys in leaf nodes connected by doubly linked lists for fast range scans and equality lookups (O(log N)).',
      'Leftmost Prefix Rule: A composite index on (A, B, C) can satisfy queries filtering on (A), (A, B), and (A, B, C). It CANNOT be used for queries filtering solely on (B) or (C).',
      'Covering Index: When an index contains all the columns requested in the SELECT clause, eliminating the need for a secondary table heap lookup (Index Seek only).'
    ],
    detailedExplanation: [
      'In a composite index on (status, created_at), keys are sorted primarily by status, and ties within the same status are sorted by created_at. Searching for created_at without status cannot traverse the B-Tree directly.',
      'Range predicates: Once a range condition (<, >, BETWEEN, LIKE \'abc%\') is used on a column in a composite index, subsequent columns in that index cannot be used for direct index lookups.'
    ],
    codeExamples: [
      {
        title: 'Composite Index Usage Analysis',
        language: 'sql',
        code: `-- Creating a composite index
CREATE INDEX idx_orders_status_date ON orders(status, created_at, customer_id);

-- Scenario 1: OPTIMAL - Uses full index
SELECT customer_id FROM orders 
WHERE status = 'SHIPPED' AND created_at >= '2024-01-01';
-- EXPLAIN: Index Range Scan on idx_orders_status_date (Covering Index - 0 Heap Reads)

-- Scenario 2: PARTIAL - Uses only 'status' part of index
SELECT * FROM orders 
WHERE status = 'SHIPPED' AND customer_id = 999;
-- EXPLAIN: Index Range Scan on (status) + Table Heap Lookup for customer_id

-- Scenario 3: FAILED - Violates Leftmost Prefix Rule
SELECT * FROM orders 
WHERE created_at >= '2024-01-01';
-- EXPLAIN: Full Table Scan (Index cannot be utilized!)`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains Leftmost Prefix Rule with clear examples of which WHERE clauses use the index.',
        'Explains B-Tree leaf node sorting and double-linked list for range queries.',
        'Explains Covering Indexes (Index-Only Scan) eliminating table random I/O heap fetches.',
        'Explains column selectivity (high-cardinality columns first vs low-cardinality equality columns).'
      ],
      juniorOrMidRedFlags: [
        'Believes creating separate single-column indexes on A, B, and C is identical to a composite index (A, B, C).',
        'Does not know that order of columns in an index definition matters.'
      ],
      seniorDifferentiators: [
        'Explains Index Skip Scan in databases like Oracle / MySQL 8.0 and its performance trade-offs.'
      ],
      followUpQuestions: [
        'Why does applying a function like `WHERE UPPER(email) = \'X\'` or `WHERE YEAR(created_at) = 2024` prevent standard B-Tree index utilization?'
      ]
    },
    tags: ['Indexes', 'B-Tree', 'Composite Index', 'Query Tuning', 'Leftmost Prefix']
  },
  {
    id: 'sql-04',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'Transactions & Concurrency',
    title: 'ACID Properties, 4 Isolation Levels & Concurrency Anomalies',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Detailed mechanics of Read Uncommitted, Read Committed, Repeatable Read, and Serializable, and their defense against Dirty Read, Non-Repeatable Read, and Phantom Read.',
    coreConcepts: [
      'Dirty Read: Transaction T1 reads uncommitted modifications made by T2 (which may later be rolled back).',
      'Non-Repeatable Read: T1 reads a row; T2 updates/deletes that row and commits; T1 re-reads the row and sees changed data.',
      'Phantom Read: T1 queries a range of rows; T2 inserts a new row matching that range and commits; T1 re-executes the range query and sees new "phantom" rows.',
      'Isolation Levels: READ UNCOMMITTED (permits all), READ COMMITTED (prevents Dirty Reads), REPEATABLE READ (prevents Dirty + Non-Repeatable Reads via MVCC snapshots), SERIALIZABLE (prevents all including Phantoms via range locks or strict 2-Phase Locking).'
    ],
    detailedExplanation: [
      'Modern databases (PostgreSQL, MySQL InnoDB, Oracle) use Multi-Version Concurrency Control (MVCC) to achieve REPEATABLE READ without heavy table-locking readers. Readers do not block writers, and writers do not block readers.',
      'In MySQL InnoDB, REPEATABLE READ is the default and prevents phantom reads for consistent SELECTs using MVCC snapshots, and for locking reads using Next-Key Locks (Record lock + Gap lock).'
    ],
    codeExamples: [
      {
        title: 'Isolation Level Matrix & Anomalies',
        language: 'sql',
        code: `/*
+------------------+------------+---------------------+--------------+
| Isolation Level  | Dirty Read | Non-Repeatable Read | Phantom Read |
+------------------+------------+---------------------+--------------+
| READ UNCOMMITTED | YES        | YES                 | YES          |
| READ COMMITTED   | NO         | YES                 | YES          |
| REPEATABLE READ  | NO         | NO                  | YES (in SQL) |
| SERIALIZABLE     | NO         | NO                  | NO           |
+------------------+------------+---------------------+--------------+
*/

-- Spring Transactional Isolation Level Declaration
/*
@Transactional(isolation = Isolation.REPEATABLE_READ, timeout = 5)
public void transferMoney(Long fromAcc, Long toAcc, BigDecimal amount) {
    // Executes inside snapshot isolation
}
*/`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Names all 4 ANSI SQL isolation levels in order.',
        'Explains the 3 classical anomalies: Dirty Read, Non-Repeatable Read, Phantom Read.',
        'Explains Multi-Version Concurrency Control (MVCC) and undo logs / snapshot isolation.',
        'Explains trade-off between strict isolation vs throughput and concurrency contention.'
      ],
      juniorOrMidRedFlags: [
        'Cannot define the difference between Non-Repeatable Read and Phantom Read.',
        'Thinks SERIALIZABLE should be used everywhere by default.'
      ],
      seniorDifferentiators: [
        'Explains Gap Locks and Next-Key Locking in MySQL InnoDB to prevent phantom inserts.',
        'Explains Write Skew anomaly in Snapshot Isolation (solved by Serializable Snapshot Isolation - SSI).'
      ],
      followUpQuestions: [
        'What is Write Skew and why does standard Repeatable Read / Snapshot Isolation fail to prevent it?'
      ]
    },
    tags: ['ACID', 'Transactions', 'Isolation Levels', 'MVCC', 'Locking']
  },
  {
    id: 'sql-05',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'Performance & Profiling',
    title: 'Reading Execution Plans (EXPLAIN ANALYZE) & Identifying Performance Bottlenecks',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Deciphering execution plans: Table Scan vs Index Scan vs Index Seek, Join algorithms (Nested Loop, Hash Join, Merge Join), and identifying missing indexes or cardinality estimation errors.',
    coreConcepts: [
      'EXPLAIN shows the query optimizer planned cost; EXPLAIN ANALYZE actually executes the query and shows real runtime elapsed milliseconds, actual row counts, and buffer hits.',
      'Full Table Scan (Seq Scan) on large tables indicates missing indexes or unselective predicates.',
      'Join Mechanics: Nested Loop Join (fast for small outer driving table with indexed inner lookup), Hash Join (fast for large unindexed equijoins), Merge Join (fast for pre-sorted inputs).'
    ],
    detailedExplanation: [
      'High discrepancy between "estimated rows" and "actual rows" indicates stale database table statistics. Solution: Run ANALYZE table_name to refresh histogram distributions.',
      'Spilling to disk (e.g. "Sort Method: external merge Disk" or "HashJoin spilled to tempdb") indicates work_mem / sort_buffer is too small, causing heavy disk I/O.'
    ],
    codeExamples: [
      {
        title: 'Analyzing EXPLAIN ANALYZE Output',
        language: 'sql',
        code: `-- Analyzing a slow order search query
EXPLAIN ANALYZE 
SELECT c.name, o.total_amount 
FROM customers c 
JOIN orders o ON c.id = o.customer_id 
WHERE o.order_date >= '2024-01-01' AND c.country = 'UK';

/*
Sample Plan Output:
-> Hash Join (cost=450.20..1820.50 rows=1200 actual time=12.4..85.2 rows=1150 loops=1)
   Hash Cond: (o.customer_id = c.id)
   -> Index Scan using idx_orders_date on orders o (cost=0.42..1200.10 rows=5000 actual time=0.08..45.1 rows=4800 loops=1)
         Index Cond: (order_date >= '2024-01-01')
   -> Hash (cost=350.00..350.00 rows=3000 actual time=10.2..10.2 rows=2950 loops=1)
         Buckets: 4096  Batches: 1  Memory Usage: 215kB
         -> Seq Scan on customers c (cost=0.00..350.00 rows=3000 actual time=0.04..8.1 rows=2950 loops=1)
               Filter: (country = 'UK')
               Rows Removed by Filter: 47050
Planning Time: 0.45 ms
Execution Time: 86.1 ms
*/

-- Optimization: Add index on customers(country, id) to eliminate 47,050 row Seq Scan!`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates EXPLAIN (estimated estimate) from EXPLAIN ANALYZE (actual real execution metrics).',
        'Explains the three main Join algorithms: Nested Loop, Hash Join, Merge Join.',
        'Identifies red flags: Seq Scan with high "Rows Removed by Filter", Sort spilled to disk, large gap between estimated and actual rows.',
        'Mentions updating table statistics (ANALYZE).'
      ],
      juniorOrMidRedFlags: [
        'Cannot interpret execution plan tree nodes.',
        'Thinks adding indexes to every single column is the right fix.'
      ],
      seniorDifferentiators: [
        'Explains buffer cache hit ratio vs physical disk reads in plan analysis.'
      ],
      followUpQuestions: [
        'When is a Full Table Scan actually preferred by the database optimizer over an Index Scan?'
      ]
    },
    tags: ['EXPLAIN ANALYZE', 'Execution Plan', 'Query Tuning', 'Join Algorithms', 'Database Internals']
  }
];
