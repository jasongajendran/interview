import { QuestionItem } from '../types';

export const hibernateJpaQuestions: QuestionItem[] = [
  {
    id: 'jpa-03',
    category: 'sql-database',
    categoryName: 'SQL, Database, JPA & Hibernate',
    topic: 'Spring Data JPA',
    title: 'Spring Data JPA Repository Basics',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Using CrudRepository, JpaRepository, and Query Methods in Spring Data.',
    coreConcepts: [
      'Spring Data JPA provides repository interfaces (JpaRepository) that automatically generate implementations at runtime.',
      'Query methods can be derived from the method name (e.g., findByLastNameAndAgeGreaterThan).',
      '@Query annotation allows defining custom JPQL or native SQL queries.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Understands the difference between CrudRepository (basic CRUD) and JpaRepository (adds JPA specific methods like flush() and batch operations).',
        'Knows how to use @Query for complex joins instead of relying solely on method names.'
      ],
      juniorOrMidRedFlags: [
        'Creates huge method names like findByFirstNameAndLastNameAndAgeAndIsActive() instead of writing a custom query or using Specifications.'
      ],
      seniorDifferentiators: [
        'Explains how Spring Data JPA Specifications or QueryDSL can be used for dynamic queries.'
      ],
      followUpQuestions: [
        'What is the difference between getById() / getReferenceById() and findById()?'
      ]
    },
    tags: ['Spring Data', 'JPA', 'Repositories']
  },
  {
    id: 'jpa-04',
    category: 'sql-database',
    categoryName: 'SQL, Database, JPA & Hibernate',
    topic: 'Hibernate',
    title: 'Hibernate Object States & Caching',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'The entity lifecycle states (Transient, Persistent, Detached, Removed) and Hibernate Caching.',
    coreConcepts: [
      'Transient: Newly created object, not associated with a session.',
      'Persistent: Associated with a session, changes are tracked and saved to the DB upon flush.',
      'Detached: Previously persistent, but the session is now closed or cleared. Changes are not tracked.',
      'First-Level Cache: Session-scoped cache, enabled by default.',
      'Second-Level Cache: SessionFactory-scoped cache, shared across sessions, requires third-party provider (e.g. EhCache).'
    ],
    rubric: {
      idealAnswerPoints: [
        'Can list all 4 object states and how to transition between them (e.g., merge() to go from Detached to Persistent).',
        'Explains that L1 cache is mandatory and bound to the transaction/session.'
      ],
      juniorOrMidRedFlags: [
        'Thinks calling save() immediately executes an INSERT statement (it happens at flush time).',
        'Confuses L1 and L2 caches.'
      ],
      seniorDifferentiators: [
        'Explains the query cache and how it interacts with the L2 cache.'
      ],
      followUpQuestions: [
        'What does EntityManager.flush() do compared to EntityManager.commit()?'
      ]
    },
    tags: ['Hibernate', 'Entity Lifecycle', 'Caching']
  },
  {
    id: 'jpa-05',
    category: 'sql-database',
    categoryName: 'SQL, Database, JPA & Hibernate',
    topic: 'Oracle SQL',
    title: 'Oracle SQL specific features (Sequences, Dual, ROWNUM)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Specific concepts related to Oracle Database compared to standard SQL.',
    coreConcepts: [
      'DUAL table: A special one-row, one-column table used for selecting pseudo-columns or evaluating expressions.',
      'Sequences: Database objects that generate unique integers, typically used for primary keys.',
      'ROWNUM: A pseudo-column that assigns a number to each row returned by a query, evaluated before sorting (ORDER BY) in older Oracle versions.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains how to get the next value from a sequence (sequence_name.NEXTVAL).',
        'Knows the trap of using ROWNUM for pagination with ORDER BY, and how Oracle 12c+ introduced FETCH FIRST n ROWS ONLY.'
      ],
      juniorOrMidRedFlags: [
        'Confuses Oracle sequences with MySQL AUTO_INCREMENT.'
      ],
      seniorDifferentiators: [
        'Discusses window functions (Analytic functions) like ROW_NUMBER() OVER() which are heavily used in Oracle.'
      ],
      followUpQuestions: [
        'How do you write a pagination query in Oracle 11g versus Oracle 12c?'
      ]
    },
    tags: ['Oracle', 'SQL', 'Sequences']
  },

  {
    id: 'jpa-01',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'JPA/Hibernate Performance',
    title: 'The N+1 Select Problem and Fetch Strategies',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding the N+1 problem, lazy vs eager loading, and using JOIN FETCH or EntityGraphs to optimize queries.',
    coreConcepts: [
      'The N+1 problem occurs when an application executes 1 query to retrieve N parent entities, and then executes N additional queries to fetch their lazy-loaded child collections.',
      'FetchType.EAGER is an anti-pattern as it always fetches the relations whether needed or not, leading to Cartesian products and memory bloat.',
      'FetchType.LAZY delays loading until the collection is accessed. But iterating over the parents and calling `parent.getChildren()` triggers N queries.',
      'Solutions: Use `JOIN FETCH` in JPQL, use JPA EntityGraphs, or use Hibernate `@BatchSize`.'
    ],
    detailedExplanation: [
      'When you use Spring Data JPA `findAll()` on an entity with `@OneToMany(fetch = FetchType.LAZY)` children, it just runs `SELECT * FROM parent`. If your REST controller then serializes the parent, Jackson calls `getChildren()`, causing a select query for every single parent.',
      '`JOIN FETCH` solves this by forcing a SQL INNER or LEFT JOIN and populating the parent and children in a single trip to the database.',
      'JPA 2.1 introduced EntityGraphs which allow you to specify fetch plans dynamically per repository method without hardcoding `JOIN FETCH` strings.'
    ],
    codeExamples: [
      {
        title: 'Solving N+1 with EntityGraphs and JOIN FETCH',
        language: 'java',
        code: `// The Entity
@Entity
public class Author {
    @Id private Long id;
    private String name;
    
    // Always use LAZY for collections
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List<Book> books;
}

// The Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    
    // BAD: Causes N+1 if you call getBooks() on the returned authors
    List<Author> findAll(); 
    
    // GOOD Solution 1: JPQL JOIN FETCH
    @Query("SELECT a FROM Author a JOIN FETCH a.books")
    List<Author> findAllWithBooks();
    
    // GOOD Solution 2: JPA EntityGraph
    @EntityGraph(attributePaths = {"books"})
    List<Author> findByName(String name);
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains what the N+1 problem is in SQL terms (1 query for parents + N queries for children).',
        'Recommends configuring all associations to FetchType.LAZY.',
        'Explains how JOIN FETCH solves it by bringing back a joined result set.',
        'Explains EntityGraph as a modern JPA alternative to define fetch plans.'
      ],
      juniorOrMidRedFlags: [
        'Suggests changing FetchType.LAZY to EAGER to "fix" the problem.',
        'Does not understand that iterating over collections inside a transaction triggers queries.'
      ],
      seniorDifferentiators: [
        'Explains the MultipleBagFetchException issue when trying to JOIN FETCH two or more `List` collections simultaneously (Cartesian product problem) and how using `Set` or multiple queries mitigates it.',
        'Mentions `@BatchSize(size = 50)` as a fallback optimization to reduce N queries to N/50 queries.'
      ],
      followUpQuestions: [
        'What happens if you JOIN FETCH multiple OneToMany associations in a single query?',
        'How does Jackson JSON serialization interact with lazy-loaded Hibernate proxies?'
      ]
    },
    tags: ['Hibernate', 'JPA', 'N+1', 'Performance', 'EntityGraph']
  },
  {
    id: 'jpa-02',
    category: 'sql-database',
    categoryName: 'SQL, Database & Query Tuning',
    topic: 'Transactions & Persistence Context',
    title: 'Hibernate 1st Level Cache, Dirty Checking & @Transactional',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'How the persistence context manages entity state, automatic dirty checking, and the flush lifecycle.',
    coreConcepts: [
      'The 1st Level Cache is the Persistence Context (EntityManager). It is session-scoped and bound to the current @Transactional boundary.',
      'Entities retrieved within a transaction are in the "Managed" state.',
      'Dirty Checking: Hibernate automatically detects changes made to Managed entities and generates SQL UPDATE statements at flush time. You do NOT need to call repository.save() for existing managed entities.',
      'Flush mode is usually AUTO, meaning Hibernate flushes pending changes before query execution and at transaction commit.'
    ],
    detailedExplanation: [
      'A common junior mistake is calling `userRepository.save(user)` at the end of a method annotated with `@Transactional` after simply modifying `user.setName()`. The `save()` call is redundant and can cause unnecessary overhead (like triggering merge cascades).',
      'If you detach an entity or clear the persistence context, the entity becomes "Detached". To reattach it, you must use `merge()`.',
      'The 2nd Level Cache is optional, application-scoped (cross-session), and requires providers like Ehcache or Redis.'
    ],
    codeExamples: [
      {
        title: 'Dirty Checking Example',
        language: 'java',
        code: `@Service
public class UserService {
    @Autowired private UserRepository userRepository;

    @Transactional
    public void updateStatus(Long id, String newStatus) {
        // 1. Entity becomes Managed, stored in 1st level cache
        User user = userRepository.findById(id).orElseThrow();
        
        // 2. Modifying the managed entity
        user.setStatus(newStatus); 
        
        // 3. DONE. No need to call userRepository.save(user)!
        // At the end of the @Transactional method, Hibernate performs Dirty Checking,
        // sees the 'status' field changed, and executes:
        // UPDATE users SET status = ? WHERE id = ?
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the difference between Managed, Detached, and Transient states.',
        'Understands automatic Dirty Checking at transaction commit.',
        'Explains the relationship between @Transactional and the 1st Level Cache (Persistence Context).'
      ],
      juniorOrMidRedFlags: [
        'Always calls save() after modifying managed entities.',
        'Confuses 1st level cache with 2nd level cache or Spring Cache (@Cacheable).'
      ],
      seniorDifferentiators: [
        'Explains the performance impact of Dirty Checking on large collections of entities and how `@DynamicUpdate` affects the generated SQL.',
        'Explains read-only transactions (`@Transactional(readOnly = true)`) and how they disable dirty checking, providing a performance boost.'
      ],
      followUpQuestions: [
        'What happens if you fetch 10,000 entities in a transaction? How do you prevent out-of-memory errors?',
        'How does `save()` behave differently for a new entity versus a detached entity?'
      ]
    },
    tags: ['Hibernate', 'JPA', 'Transactions', 'Dirty Checking', 'Cache']
  },
  {
    id: 'jpa-locking-01',
    category: 'sql-database',
    categoryName: 'SQL, Database, JPA & Hibernate',
    topic: 'JPA Locking Strategies',
    title: 'Optimistic Locking (@Version) vs Pessimistic Locking in High-Concurrency Scenarios',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Evaluating when to apply Optimistic Locking with @Version versus Pessimistic Locking (PESSIMISTIC_WRITE / SELECT FOR UPDATE) in concurrent transaction processing.',
    coreConcepts: [
      'Optimistic Locking assumes low collision frequency. It uses a `@Version` field (integer or timestamp). During UPDATE, Hibernate appends `WHERE id = ? AND version = ?`. If row count is 0, it throws `OptimisticLockException`.',
      'Pessimistic Locking uses native database row-level locks (`SELECT ... FOR UPDATE` via `LockModeType.PESSIMISTIC_WRITE`). It blocks concurrent transactions from reading or updating the row until the current transaction commits or rolls back.',
      'Optimistic locking does not hold DB locks, maximizing throughput, but requires application-level retry mechanisms. Pessimistic locking guarantees serialization but risks deadlocks and connection pool exhaustion under high contention.'
    ],
    detailedExplanation: [
      'In a banking balance or inventory reservation system with high concurrent updates on the exact same row (e.g., flash sale item inventory), Optimistic Locking will cause 99% of requests to fail with `OptimisticLockException`, wasting CPU on retries.',
      'For high-contention rows, Pessimistic Locking (`PESSIMISTIC_WRITE` with a short timeout `javax.persistence.lock.timeout`) or atomic database increments (`UPDATE inventory SET stock = stock - 1 WHERE id = ? AND stock > 0`) is significantly more efficient.',
      'Always set lock timeouts on pessimistic locks to avoid indefinite thread blocking when a node crashes or experiences network partitions.'
    ],
    codeExamples: [
      {
        title: 'Optimistic vs Pessimistic Repository Usage',
        language: 'java',
        code: `@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private BigDecimal balance;
    
    @Version // Automatically checked and incremented on every UPDATE
    private Long version;
}

public interface AccountRepository extends JpaRepository<Account, Long> {
    
    // Pessimistic Write Lock: Generates "SELECT ... FOR UPDATE"
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000")})
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdWithPessimisticLock(@Param("id") Long id);
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the mechanics of @Version: WHERE version = oldVersion and row-count check.',
        'Explains LockModeType.PESSIMISTIC_WRITE and the resulting SQL SELECT ... FOR UPDATE.',
        'Knows how to handle OptimisticLockException with retries (e.g. @Retryable from Spring Retry).',
        'Highlights the trade-off: Optimistic is better for read-heavy / low contention; Pessimistic is necessary for high contention or external physical side-effects.'
      ],
      juniorOrMidRedFlags: [
        'Thinks @Version prevents reading dirty data.',
        'Does not know that Pessimistic locks hold database connection threads for the duration of the transaction.'
      ],
      seniorDifferentiators: [
        'Explains why pessimistic locking in distributed systems without lock timeouts can cause cascade connection pool exhaustion in HikariCP.',
        'Discusses alternative lock-free designs using atomic SQL updates or event-driven Sagas.'
      ],
      followUpQuestions: [
        'How does Spring Retry integrate with OptimisticLockException handling?',
        'What is the difference between PESSIMISTIC_READ and PESSIMISTIC_WRITE?'
      ]
    },
    tags: ['JPA', 'Hibernate', 'Optimistic Locking', 'Pessimistic Locking', 'Concurrency']
  },
  {
    id: 'jpa-batch-01',
    category: 'sql-database',
    categoryName: 'SQL, Database, JPA & Hibernate',
    topic: 'Hibernate Performance',
    title: 'High-Volume Batch Insertions & GenerationType.IDENTITY Pitfall',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Hard',
    summary: 'Why GenerationType.IDENTITY silently disables Hibernate JDBC batching, and how to configure high-performance batch processing with SEQUENCE and allocationSize.',
    coreConcepts: [
      'Hibernate needs an entity\'s primary key to manage it in the Persistence Context (1st level cache) before flushing.',
      'With `GenerationType.IDENTITY`, the ID is only generated by the database upon immediate execution of an `INSERT` statement. Therefore, Hibernate MUST execute the INSERT immediately, completely disabling JDBC batching (`hibernate.jdbc.batch_size`).',
      'With `GenerationType.SEQUENCE`, Hibernate pre-allocates a block of IDs in memory using `allocationSize` (e.g., 50), allowing it to queue hundreds of inserts and send them in a single JDBC batch network round-trip.'
    ],
    detailedExplanation: [
      'To insert 100,000 records without OutOfMemoryError, developers must: 1) Use SEQUENCE or TABLE id generator with `allocationSize=50` or `100`, 2) Set `spring.jpa.properties.hibernate.jdbc.batch_size=50`, 3) Set `spring.jpa.properties.hibernate.order_inserts=true` and `order_updates=true`, and 4) Periodically call `entityManager.flush()` and `entityManager.clear()` to purge the 1st-level cache.'
    ],
    codeExamples: [
      {
        title: 'Optimized Batch Insertion Loop',
        language: 'java',
        code: `@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "audit_seq")
    @SequenceGenerator(name = "audit_seq", sequenceName = "audit_log_seq", allocationSize = 50)
    private Long id;
    
    private String event;
}

// In Service Layer:
@PersistenceContext
private EntityManager entityManager;

@Transactional
public void batchInsertLogs(List<AuditLogDto> dtos) {
    int batchSize = 50;
    for (int i = 0; i < dtos.size(); i++) {
        AuditLog log = new AuditLog(dtos.get(i).getEvent());
        entityManager.persist(log);
        
        if (i % batchSize == 0 && i > 0) {
            // Flush changes to DB in one JDBC batch & clear 1st level cache to prevent OOM
            entityManager.flush();
            entityManager.clear();
        }
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explicitly identifies that GenerationType.IDENTITY disables JDBC batching in Hibernate.',
        'Explains the purpose of sequence allocationSize for reducing database round-trips.',
        'Explains why calling entityManager.flush() and clear() inside a batch loop is necessary to prevent OutOfMemoryError in the 1st level cache.'
      ],
      juniorOrMidRedFlags: [
        'Configures hibernate.jdbc.batch_size on MySQL with GenerationType.IDENTITY and wonders why batching doesn\'t happen.',
        'Loads 100,000 entities into a single transaction without clearing the EntityManager.'
      ],
      seniorDifferentiators: [
        'Mentions `spring.jpa.properties.hibernate.order_inserts=true` and `order_updates=true` to group statements of the same entity type for maximum batch efficiency.',
        'Compares Hibernate batching with Spring JDBC `JdbcTemplate.batchUpdate()` for extreme throughput.'
      ],
      followUpQuestions: [
        'How does `rewriteBatchedStatements=true` in MySQL JDBC driver work with batch inserts?'
      ]
    },
    tags: ['Hibernate', 'Batching', 'Performance', 'Sequence Generator', 'Memory Optimization']
  },
  {
    id: 'jpa-modifying-01',
    category: 'sql-database',
    categoryName: 'SQL, Database, JPA & Hibernate',
    topic: 'Spring Data JPA',
    title: 'Spring Data @Modifying & Persistence Context Synchronization',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'The risks of executing bulk UPDATE/DELETE JPQL queries with @Modifying and how clearAutomatically / flushAutomatically prevent stale in-memory state.',
    coreConcepts: [
      'Standard JPA entity operations (persist, merge, remove) update the 1st-level cache (Persistence Context).',
      '@Modifying queries (e.g. `UPDATE User u SET u.status = :status WHERE u.active = true`) translate directly into database DML statements, completely bypassing the Persistence Context.',
      'If an entity was already loaded in memory before the @Modifying query executed, its in-memory state is now STALE. Subsequent queries in the same transaction will read the stale cached entity from L1 cache!'
    ],
    codeExamples: [
      {
        title: '@Modifying with clearAutomatically',
        language: 'java',
        code: `public interface UserRepository extends JpaRepository<User, Long> {
    
    // Without clearAutomatically = true, in-memory User entities remain stale!
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE User u SET u.status = 'INACTIVE' WHERE u.lastLoginDate < :cutoff")
    int deactivateInactiveUsers(@Param("cutoff") LocalDateTime cutoff);
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that JPQL bulk updates bypass the EntityManager persistence context.',
        'Explains what clearAutomatically = true does (clears the L1 cache after the query).',
        'Explains what flushAutomatically = true does (flushes pending changes to DB before executing the JPQL).'
      ],
      juniorOrMidRedFlags: [
        'Does not know why a subsequent findById() returns old data after a @Modifying query in the same transaction.'
      ],
      seniorDifferentiators: [
        'Explains how clearing the persistence context will detach all previously loaded entities, and how code must handle subsequent interactions.'
      ],
      followUpQuestions: [
        'What happens if you run an @Modifying query without @Transactional on the service or repository method?'
      ]
    },
    tags: ['Spring Data', '@Modifying', 'Persistence Context', 'JPA', 'Dirty Data']
  }
];
