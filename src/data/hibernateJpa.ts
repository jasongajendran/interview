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
  }
];
