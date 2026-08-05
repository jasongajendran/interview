import re
with open('src/data/hibernateJpa.ts', 'r') as f:
    content = f.read()

new_content = """  {
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
"""

content = content.replace("export const hibernateJpaQuestions: QuestionItem[] = [", "export const hibernateJpaQuestions: QuestionItem[] = [\n" + new_content)
with open('src/data/hibernateJpa.ts', 'w') as f:
    f.write(content)
