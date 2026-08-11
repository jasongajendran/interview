import { QuestionItem, CategoryId } from '../types';
import { javaCoreQuestions } from './javaCore';
import { java17Questions } from './java17';
import { springBootQuestions } from './springBoot';
import { hibernateJpaQuestions } from './hibernateJpa';
import { sqlDatabaseQuestions } from './sqlDatabase';
import { legacyWebQuestions } from './legacyWeb';
import { devopsCiCdQuestions } from './devopsCiCd';
import { jbossWildflyQuestions } from './jbossWildfly';
import { testingFrameworkQuestions } from './testingFrameworks';
import { uiFrontendQuestions } from './uiFrontend';
import { microservicesSecurityQuestions } from './microservicesSecurity';
import { productionScenarios } from './productionScenarios';
import { diagnosticTools } from './idesDiagnostics';
import { awsCloudQuestions } from './awsCloud';
import { designPatternsQuestions } from './designPatterns';

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
    id: 'java-17',
    name: 'Java 8 to 17 Features',
    shortName: 'Java 17+',
    description: 'Records, Pattern Matching, Sealed Classes, Text Blocks, Switch Expressions',
    badge: 'Java 14-17',
    iconName: 'Layers'
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
    name: 'SQL, Database, JPA & Hibernate',
    shortName: 'SQL & JPA',
    description: 'N+1 Problem, Dirty Checking, Window Functions, B-Tree Indexes, ACID',
    badge: 'PostgreSQL/JPA',
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
    name: 'Struts, JSF & Jakarta EE',
    shortName: 'Jakarta EE & Legacy Web',
    description: 'JSF 6-Phase Lifecycle, Apache Struts, Jakarta Servlets, Jakarta Messaging (JMS), FreeMarker (FTL)',
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
    description: 'Angular, jQuery, JSON, Accessibility (WCAG AA/AAA), XSS, CSRF, DoS, Responsive design',
    badge: 'Web Frontends',
    iconName: 'Layout'
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud & Serverless',
    shortName: 'AWS Cloud',
    description: 'EC2, S3, RDS, DynamoDB, Fargate, Lambda, ALB/NLB, Route 53',
    badge: 'Cloud',
    iconName: 'Cloud'
  },
  {
    id: 'design-patterns',
    name: 'Software Design Patterns',
    shortName: 'Design Patterns',
    description: 'Singleton, Strategy, Observer, Factory, Decorator, Builder',
    badge: 'Architecture',
    iconName: 'Puzzle'
  }
];

export const allQuestions: QuestionItem[] = [
  ...javaCoreQuestions,
  ...java17Questions,
  ...springBootQuestions,
  ...hibernateJpaQuestions,
  ...microservicesSecurityQuestions,
  ...sqlDatabaseQuestions,
  ...testingFrameworkQuestions,
  ...devopsCiCdQuestions,
  ...legacyWebQuestions,
  ...jbossWildflyQuestions,
  ...uiFrontendQuestions,
  ...awsCloudQuestions,
  ...designPatternsQuestions
];

export {
  javaCoreQuestions,
  java17Questions,
  springBootQuestions,
  hibernateJpaQuestions,
  microservicesSecurityQuestions,
  sqlDatabaseQuestions,
  testingFrameworkQuestions,
  devopsCiCdQuestions,
  legacyWebQuestions,
  jbossWildflyQuestions,
  uiFrontendQuestions,
  awsCloudQuestions,
  designPatternsQuestions,
  productionScenarios,
  diagnosticTools
};
