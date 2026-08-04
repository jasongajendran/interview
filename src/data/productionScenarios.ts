import { ProductionScenario } from '../types';

export const productionScenarios: ProductionScenario[] = [
  {
    id: 'prod-01',
    title: 'P1 Outage: HikariCP Connection Pool Exhaustion & Thread Starvation under Flash Traffic',
    severity: 'P1 - Critical Outage',
    affectedComponent: 'Spring Boot 3 REST API + PostgreSQL + HikariCP',
    symptoms: [
      'HTTP 500 & 504 Gateway Timeout errors spike to 45% during promotional campaign.',
      'Average API latency jumps from 45ms to 30,000ms (timeout threshold).',
      'Tomcat active worker threads reach max capacity (200/200 threads in WAITING state).',
      'HikariCP logs: "HikariPool-1 - Connection is not available, request timed out after 30000ms."'
    ],
    diagnosticSteps: [
      {
        step: 1,
        command: 'jcmd <pid> Thread.print > thread_dump.tdump',
        description: 'Capture thread dump to analyze where Tomcat worker threads are blocked.',
        expectedLogOutput: `"http-nio-8080-exec-114" #142 daemon prio=5 os_prio=0 tid=0x00007f9c WAITING
   java.lang.Thread.State: TIMED_WAITING (parking)
   at jdk.internal.misc.Unsafe.park(Native Method)
   at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:252)
   at com.zaxxer.hikari.util.ConcurrentBag.borrow(ConcurrentBag.java:144)
   at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)`
      },
      {
        step: 2,
        command: 'SELECT pid, query, state, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != \'idle\';',
        description: 'Query database active connections to see if queries are slow or locked.',
        expectedLogOutput: `pid  | query                                                | state  | age
1041 | SELECT * FROM orders WHERE user_id = $1 FOR UPDATE  | active | 00:04:12.441
1042 | SELECT * FROM orders WHERE user_id = $1 FOR UPDATE  | active | 00:04:09.112`
      },
      {
        step: 3,
        command: 'grep -rn "@Transactional" src/main/java/com/app/service/',
        description: 'Audit service methods holding transactions during external HTTP / third-party payment calls.',
        expectedLogOutput: `@Transactional
public OrderResponse checkout(OrderRequest req) {
    Order order = orderRepo.save(new Order(...));
    PaymentResponse payment = paymentGatewayClient.charge(req.getCard()); // BLOCKS 10-15s!
    order.setStatus(payment.isSuccess() ? PAID : FAILED);
    return toResponse(orderRepo.save(order));
}`
      }
    ],
    rootCauseAnalysis: 'Long-running external HTTP API call inside a @Transactional method held the database connection open for 15+ seconds per request. With HikariCP pool size = 10, all 10 connections were quickly exhausted, causing subsequent requests to queue and starve Tomcat worker threads.',
    immediateRemediation: '1. Remove @Transactional from the outer method. 2. Wrap only the minimal database writes in short-lived TransactionTemplate or isolated repository calls. 3. Configure HTTP client connectTimeout (1s) and readTimeout (3s).',
    longTermArchitectureFix: 'Adopt the SAGA or Outbox pattern with asynchronous message queue (Kafka / RabbitMQ) for payment processing. Decouple transactional persistence from external network I/O.',
    interviewerKeyQuestions: [
      'Why is calling an external API inside @Transactional an anti-pattern?',
      'How does HikariCP calculate optimal pool size? (Formula: Pool size = (Core count * 2) + Effective spindle count)',
      'What happens when spring.datasource.hikari.connection-timeout is exceeded?'
    ]
  },
  {
    id: 'prod-02',
    title: 'P2 Degraded: OutOfMemoryError: Metaspace / ClassLoader Leak in JBoss/WildFly Redeployments',
    severity: 'P2 - High Latency / Degraded',
    affectedComponent: 'JBoss EAP 7.4 / WildFly + Legacy Spring/JSF WARs',
    symptoms: [
      'JVM crashes with `java.lang.OutOfMemoryError: Metaspace` after 4-5 hot redeployments without JVM restart.',
      'Full GC pauses reach 12 seconds with 0 Metaspace reclaimed.',
      'JVM flag `-XX:MaxMetaspaceSize=512m` is breached.'
    ],
    diagnosticSteps: [
      {
        step: 1,
        command: 'jcmd <pid> GC.class_stats > class_stats.txt && jcmd <pid> VM.classloader_stats',
        description: 'Inspect classloader hierarchy and count live instances of ModuleClassLoader.',
        expectedLogOutput: `ClassLoader Hierarchy:
+-- org.jboss.modules.ModuleClassLoader (deployment.myapp.war) - Alive: 6 instances!
+-- jdk.internal.loader.ClassLoaders$AppClassLoader`
      },
      {
        step: 2,
        command: 'jmap -dump:format=b,file=metaspace_leak.hprof <pid>',
        description: 'Capture heap dump and inspect GC roots holding onto old ModuleClassLoader in Eclipse Memory Analyzer (MAT).',
        expectedLogOutput: `Problem Suspect 1:
The classloader "org.jboss.modules.ModuleClassLoader @ 0x7f1122" is kept alive by:
- ThreadLocal instance in java.lang.Thread.threadLocals
- Static Logger / JDBC Driver registered in java.sql.DriverManager without deregistration`
      }
    ],
    rootCauseAnalysis: 'Uncleaned ThreadLocal variables on worker threads and JDBC drivers not deregistered in ServletContextListener.contextDestroyed() prevent old application ClassLoaders from being garbage collected on undeploy.',
    immediateRemediation: 'Restart JBoss instance; add ServletContextListener that iterates `DriverManager.getDrivers()` and calls `deregisterDriver()`, plus explicit `ThreadLocal.remove()` in `finally` blocks.',
    longTermArchitectureFix: 'Migrate from multi-app shared application servers to immutable container images (Docker / Podman with Spring Boot Uber-JAR) where upgrades happen via container replacement rather than in-place hot redeployments.',
    interviewerKeyQuestions: [
      'What is Metaspace and how does it differ from PermGen (Java 7 vs Java 8+)?',
      'How do ThreadLocal variables cause classloader leaks in pooled worker threads?',
      'How would you detect uncleaned ThreadLocals programmatically?'
    ]
  },
  {
    id: 'prod-03',
    title: 'P1 Outage: Database Row Lock Deadlock in Concurrent High-Volume Transactions',
    severity: 'P1 - Critical Outage',
    affectedComponent: 'Spring Data JPA + PostgreSQL / MySQL InnoDB',
    symptoms: [
      'PostgreSQL error: `ERROR: deadlock detected - Process 18402 waits for ShareLock on transaction 91840; Process 18405 waits for ExclusiveLock on tuple (4,12) of relation accounts`.',
      'Batch transfers and payment settlements fail abruptly with rollback exceptions.',
      'Transactions stall and spike database CPU utilization to 100%.'
    ],
    diagnosticSteps: [
      {
        step: 1,
        command: 'grep "deadlock detected" /var/log/postgresql/postgresql-*.log -A 20',
        description: 'Examine PostgreSQL deadlock log to identify the competing SQL queries and lock targets.',
        expectedLogOutput: `DETAIL: Process 18402: UPDATE accounts SET balance = balance - 100 WHERE id = 'ACC-A'
Process 18405: UPDATE accounts SET balance = balance - 50 WHERE id = 'ACC-B'
Process 18402 waits for ExclusiveLock on 'ACC-B' (held by 18405)
Process 18405 waits for ExclusiveLock on 'ACC-A' (held by 18402)`
      },
      {
        step: 2,
        command: 'Audit service transferFunds(fromAcc, toAcc) implementation',
        description: 'Check how row locks are acquired when transfer orders occur simultaneously in opposite directions (A->B vs B->A).',
        expectedLogOutput: `// Faulty implementation: Locks fromAcc first, then toAcc
accountRepo.lockAccount(fromId);
accountRepo.lockAccount(toId);`
      }
    ],
    rootCauseAnalysis: 'Unordered resource lock acquisition. When Thread 1 transfers $100 from A to B (locks A, tries to lock B) and Thread 2 transfers $50 from B to A (locks B, tries to lock A), circular lock dependency causes a classic deadlock.',
    immediateRemediation: 'Sort resource identifiers deterministically before acquiring locks (e.g. lock smaller ID first, then larger ID: `String first = idA.compareTo(idB) < 0 ? idA : idB`).',
    longTermArchitectureFix: 'Use optimistic concurrency control (`@Version`) with retry logic, or implement event-driven ledgering (append-only ledger entries) without in-place row updates.',
    interviewerKeyQuestions: [
      'What are the 4 Coffman conditions for a deadlock?',
      'How does optimistic locking (@Version) prevent deadlocks compared to pessimistic locking (SELECT FOR UPDATE)?',
      'How does PostgreSQL detect and resolve deadlocks automatically?'
    ]
  }
];
