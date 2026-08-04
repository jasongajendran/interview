import { QuestionItem } from '../types';

export const jbossWildflyQuestions: QuestionItem[] = [
  {
    id: 'jboss-01',
    category: 'jboss-wildfly',
    categoryName: 'JBoss / WildFly Application Server',
    topic: 'Server Architecture & Topography',
    title: 'Standalone Mode vs Managed Domain Mode in JBoss EAP / WildFly',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Hard',
    summary: 'Single instance vs multi-server cluster orchestration, Domain Controller, Host Controller, Server Groups, and configuration files (standalone.xml vs domain.xml / host.xml).',
    coreConcepts: [
      'Standalone Mode: Each server instance is completely autonomous and configured independently via its own standalone.xml (or standalone-full.xml). Ideal for microservices, containerized Docker/Kubernetes pods, and local development.',
      'Managed Domain Mode: Centralized management of multi-node server clusters. A Domain Controller (DC) coordinates multiple Host Controllers (HC) and Server Groups via a single domain.xml and host.xml.',
      'Server Group: Logical grouping of server instances running the identical profile and application deployments across multiple physical machines.'
    ],
    detailedExplanation: [
      'In Domain Mode, deploying an application or updating a JNDI datasource on the Domain Controller automatically synchronizes the change across all servers in that Server Group without manual SSH access to each box.',
      'In modern Cloud/Kubernetes environments, Standalone Mode is preferred because container orchestration (Kubernetes ReplicaSets) handles scaling, rolling updates, and cluster management natively.'
    ],
    codeExamples: [
      {
        title: 'JBoss CLI Commands for Domain vs Standalone Management',
        language: 'bash',
        code: `# 1. Connect to JBoss CLI
$JBOSS_HOME/bin/jboss-cli.sh --connect

# 2. Standalone Mode: Deploy WAR & read datasource
[standalone@localhost:9990 /] deploy /opt/builds/app.war
[standalone@localhost:9990 /] /subsystem=datasources/data-source=AppDS:read-resource(include-runtime=true)

# 3. Domain Mode: Deploy to specific Server Group
[domain@dc-master:9990 /] deploy /opt/builds/app.war --server-groups=main-server-group
[domain@dc-master:9990 /] /server-group=main-server-group:restart-servers()`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates Standalone (autonomous single JVM) vs Managed Domain (centralized multi-host control).',
        'Explains Domain Controller, Host Controller, and Server Groups.',
        'Explains why Standalone is favored in Docker/Kubernetes vs Domain Mode on bare-metal VMs.',
        'Mentions jboss-cli.sh usage.'
      ],
      juniorOrMidRedFlags: [
        'Thinks domain mode refers to internet domain names (DNS).',
        'Does not know how JBoss instances are managed.'
      ],
      seniorDifferentiators: [
        'Explains port-offset configuration in host.xml to run multiple server instances on the same physical VM.'
      ],
      followUpQuestions: [
        'How does WildFly JBoss Modules system achieve classloader isolation between separate deployed applications and server libraries?'
      ]
    },
    tags: ['JBoss', 'WildFly', 'Standalone', 'Domain Mode', 'Application Server']
  },
  {
    id: 'jboss-02',
    category: 'jboss-wildfly',
    categoryName: 'JBoss / WildFly Application Server',
    topic: 'Datasources & Connection Pools',
    title: 'JNDI Datasource Configuration & Diagnosing Connection Pool Exhaustion',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Pool sizing (min-pool-size, max-pool-size, blocking-timeout-millis), connection leak detection, cached prepared statements, and JBoss CLI pool monitoring.',
    coreConcepts: [
      'JNDI Datasources in JBoss provide container-managed JDBC connection pooling (IronJacamar subsystem).',
      'min-pool-size / max-pool-size: Bounds the number of physical database connections.',
      'blocking-timeout-millis: Maximum milliseconds a requesting thread will wait for a free connection before throwing IJ000453: Unable to get a connection from pool.',
      'Connection Leak: Occurs when application code acquires a connection but fails to close it in a finally block or try-with-resources.'
    ],
    detailedExplanation: [
      'When connection pool exhaustion occurs, the application stops responding and threads pile up in WAITING state inside javax.resource.ResourceException.',
      'JBoss provides built-in leak tracking: configure <connection-leak-timeout-minutes>1</connection-leak-timeout-minutes> or enable statement tracking to log the exact stack trace where the leaked connection was opened.'
    ],
    codeExamples: [
      {
        title: 'JBoss standalone.xml Production Datasource Definition',
        language: 'xml',
        code: `<subsystem xmlns="urn:jboss:domain:datasources:7.0">
    <datasources>
        <datasource jndi-name="java:/jdbc/EnterpriseAppDS" 
                    pool-name="EnterpriseAppDS_Pool" 
                    enabled="true" 
                    use-java-context="true">
            <connection-url>jdbc:oracle:thin:@db-prod.internal:1521/ORCLPDB</connection-url>
            <driver>oracle</driver>
            <pool>
                <min-pool-size>10</min-pool-size>
                <max-pool-size>50</max-pool-size>
                <prefill>true</prefill>
                <use-strict-min>false</use-strict-min>
                <flush-strategy>FailingConnectionOnly</flush-strategy>
            </pool>
            <security>
                <user-name>app_prod</user-name>
                <password>EncryptedSecretKey</password>
            </security>
            <validation>
                <valid-connection-checker class-name="org.jboss.jca.adapters.jdbc.extensions.oracle.OracleValidConnectionChecker"/>
                <validate-on-match>false</validate-on-match>
                <background-validation>true</background-validation>
                <background-validation-millis>60000</background-validation-millis>
            </validation>
            <timeout>
                <blocking-timeout-millis>10000</blocking-timeout-millis>
                <idle-timeout-minutes>15</idle-timeout-minutes>
            </timeout>
            <statement>
                <track-statements>true</track-statements>
                <prepared-statement-cache-size>100</prepared-statement-cache-size>
            </statement>
        </datasource>
    </datasources>
</subsystem>`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains min/max pool sizing, prefill, and blocking-timeout-millis.',
        'Explains connection validation strategies (background-validation vs validate-on-match).',
        'Explains how to detect unclosed connection leaks using track-statements or connection-leak-timeout.',
        'Knows JBoss CLI commands to check ActiveCount vs AvailableCount in real time.'
      ],
      juniorOrMidRedFlags: [
        'Suggests setting max-pool-size to 1000 without understanding DB server CPU and memory constraints.',
        'Does not know what JNDI is.'
      ],
      seniorDifferentiators: [
        'Explains XA two-phase commit datasources (<xa-datasource>) vs non-XA datasources in distributed enterprise transactions.'
      ],
      followUpQuestions: [
        'What is the performance overhead of validate-on-match="true" compared to background-validation?'
      ]
    },
    tags: ['JBoss', 'JNDI', 'Connection Pooling', 'Datasources', 'IronJacamar']
  },
  {
    id: 'jboss-03',
    category: 'jboss-wildfly',
    categoryName: 'JBoss / WildFly Application Server',
    topic: 'Classloading & Modular Architecture',
    title: 'JBoss Classloading Isolation & jboss-deployment-structure.xml',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Hard',
    summary: 'Overcoming ClassCastException and LinkageError using JBoss Modular Classloading, excluding server-provided modules, and configuring sub-deployment dependencies.',
    coreConcepts: [
      'WildFly / JBoss uses JBoss Modules instead of standard hierarchical Java classloaders. Each library/deployment is a distinct isolated module.',
      'jboss-deployment-structure.xml: Descriptor placed in META-INF or WEB-INF to customize classloading, exclude implicit server dependencies, or export module classes.',
      'Implicit Dependencies: JBoss automatically provides JEE APIs (JAX-RS, JPA, JSF). If a WAR bundles its own incompatible version (e.g. Jersey or Hibernate 6), exclusions must be defined in jboss-deployment-structure.xml.'
    ],
    detailedExplanation: [
      'When an application bundles its own version of a library that conflicts with JBoss internal subsystems (e.g., logging or Jackson), the deployment fails with ClassCastException or NoSuchMethodError.',
      'jboss-deployment-structure.xml allows disabling whole server subsystems for that deployment (e.g. <subsystem name="resteasy" />) or adding explicit dependencies to custom shared modules.'
    ],
    codeExamples: [
      {
        title: 'jboss-deployment-structure.xml Example Exclusions',
        language: 'xml',
        code: `<!-- WEB-INF/jboss-deployment-structure.xml -->
<jboss-deployment-structure xmlns="urn:jboss:deployment-structure:1.3">
    <deployment>
        <!-- Exclude server-provided conflicting subsystems -->
        <exclude-subsystems>
            <subsystem name="resteasy" />
        </exclude-subsystems>

        <exclusions>
            <!-- Exclude bundled JBoss Jackson to use application packaged version -->
            <module name="com.fasterxml.jackson.core.jackson-databind" />
            <module name="com.fasterxml.jackson.core.jackson-core" />
        </exclusions>

        <dependencies>
            <!-- Import custom corporate shared module -->
            <module name="com.corporate.shared.security" export="true" />
        </dependencies>
    </deployment>
</jboss-deployment-structure>`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains JBoss Modules architecture and module isolation.',
        'Explains jboss-deployment-structure.xml for module exclusion and explicit dependency injection.',
        'Explains how to resolve classpath version collisions between server-provided and WAR-bundled libraries.'
      ],
      juniorOrMidRedFlags: [
        'Attempts to fix server library conflicts by modifying global JVM classpath flags.',
        'Unaware of jboss-deployment-structure.xml.'
      ],
      seniorDifferentiators: [
        'Explains how to create a custom module in $JBOSS_HOME/modules with module.xml and JAR dependencies.'
      ],
      followUpQuestions: [
        'What is the difference between EAR deployment classloading and WAR deployment classloading in JBoss?'
      ]
    },
    tags: ['JBoss', 'WildFly', 'Classloading', 'JBoss Modules', 'Troubleshooting']
  }
];
