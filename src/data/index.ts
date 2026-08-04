import { QuestionItem, CategoryId } from '../types';
import { javaCoreQuestions } from './javaCore';
import { springBootQuestions } from './springBoot';
import { sqlDatabaseQuestions } from './sqlDatabase';
import { legacyWebQuestions } from './legacyWeb';
import { devopsCiCdQuestions } from './devopsCiCd';
import { jbossWildflyQuestions } from './jbossWildfly';
import { testingFrameworkQuestions } from './testingFrameworks';
import { uiFrontendQuestions } from './uiFrontend';
import { microservicesSecurityQuestions } from './microservicesSecurity';
import { productionScenarios } from './productionScenarios';
import { diagnosticTools } from './idesDiagnostics';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  badge: string;
  iconName: string;
}

export const CATEGORIES_META: CategoryMeta[] = [
  {
    id: 'java-core',
    name: 'Java 8+ & Core Internals',
    shortName: 'Java Core',
    description: 'Collections, Concurrency, JVM Memory Model, Streams, Metaspace, Functional interfaces',
    badge: 'Java 8-21',
    iconName: 'Code2'
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot 3.x & Spring 6',
    shortName: 'Spring Boot',
    description: 'Bean Lifecycle, Circular Dependencies, AOP, @Transactional, Auto-configuration',
    badge: 'Spring 6',
    iconName: 'Boxes'
  },
  {
    id: 'microservices-security',
    name: 'Microservices & Security',
    shortName: 'Microservices',
    description: 'SAGA, Transactional Outbox, Kafka, OAuth2 / PKCE, JWT, JWKS, Spring Security 6',
    badge: 'Cloud Arch',
    iconName: 'ShieldCheck'
  },
  {
    id: 'sql-database',
    name: 'SQL, Database & Query Tuning',
    shortName: 'SQL & DB',
    description: 'Window Functions, EXPLAIN ANALYZE, B-Tree Indexes, Deadlocks, ACID, Isolation Levels',
    badge: 'PostgreSQL/Oracle',
    iconName: 'Database'
  },
  {
    id: 'testing-frameworks',
    name: 'Testing Frameworks (JUnit 5 & Mockito)',
    shortName: 'Testing',
    description: '@Mock vs @Spy, doReturn vs thenReturn, ArgumentCaptor, Testcontainers, Architecture tests',
    badge: 'JUnit 5 / Mockito',
    iconName: 'CheckCircle2'
  },
  {
    id: 'devops-cicd',
    name: 'Maven, CI/CD & Version Control',
    shortName: 'DevOps & CI/CD',
    description: 'Multi-module BOM, dependencyManagement, Jenkins pipelines, GoCD, SVN vs Git branching',
    badge: 'CI/CD',
    iconName: 'GitBranch'
  },
  {
    id: 'legacy-web',
    name: 'JSF & FreeMarker (FTL)',
    shortName: 'JSF & FTL',
    description: 'JSF 6-Phase Lifecycle, ManagedBean vs CDI, ViewExpiredException, PrimeFaces, FTL macros',
    badge: 'Enterprise Web',
    iconName: 'Layers'
  },
  {
    id: 'jboss-wildfly',
    name: 'JBoss / WildFly App Server',
    shortName: 'JBoss / WildFly',
    description: 'Standalone vs Domain Mode, JNDI datasources, ClassLoader subsystem, thread pools',
    badge: 'App Server',
    iconName: 'Server'
  },
  {
    id: 'ui-frontend',
    name: 'UI Technologies & Web Security',
    shortName: 'UI & Security',
    description: 'XSS vs CSRF, CSP headers, DOM security, Responsive design, SPA vs SSR, SameSite cookies',
    badge: 'Web Frontends',
    iconName: 'Layout'
  },
  {
    id: 'ides-diagnostics',
    name: 'IDEs & JVM Diagnostics',
    shortName: 'Diagnostics',
    description: 'jcmd, jstack, jmap, GC tuning flags (-Xlog:gc*), Native Memory Tracking, IntelliJ & Eclipse',
    badge: 'JVM Tooling',
    iconName: 'Terminal'
  },
  {
    id: 'production-scenarios',
    name: 'Production Outage Scenarios',
    shortName: 'P1 Incidents',
    description: 'Real-world P1/P2 outage forensics, thread starvation, Metaspace leaks, Deadlocks',
    badge: 'Forensics',
    iconName: 'AlertTriangle'
  }
];

export const allQuestions: QuestionItem[] = [
  ...javaCoreQuestions,
  ...springBootQuestions,
  ...microservicesSecurityQuestions,
  ...sqlDatabaseQuestions,
  ...testingFrameworkQuestions,
  ...devopsCiCdQuestions,
  ...legacyWebQuestions,
  ...jbossWildflyQuestions,
  ...uiFrontendQuestions
];

export {
  javaCoreQuestions,
  springBootQuestions,
  microservicesSecurityQuestions,
  sqlDatabaseQuestions,
  testingFrameworkQuestions,
  devopsCiCdQuestions,
  legacyWebQuestions,
  jbossWildflyQuestions,
  uiFrontendQuestions,
  productionScenarios,
  diagnosticTools
};
