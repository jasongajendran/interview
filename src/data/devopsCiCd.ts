import { QuestionItem } from '../types';

export const devopsCiCdQuestions: QuestionItem[] = [
  {
    id: 'devops-03',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Build Tools',
    title: 'Maven vs Gradle',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Comparing XML-based Maven to Groovy/Kotlin-based Gradle build tools.',
    coreConcepts: [
      'Maven uses a strict, declarative XML format (pom.xml) with a rigid build lifecycle.',
      'Gradle uses a Groovy or Kotlin DSL, making it highly customizable and often faster due to incremental builds and build caching.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Knows Maven relies on conventions over configuration.',
        'Mentions Gradle\'s performance benefits (daemon, incremental build).'
      ],
      juniorOrMidRedFlags: [
        'Thinks they are entirely different languages rather than build automation tools.'
      ],
      seniorDifferentiators: [
        'Explains Gradle build cache and how it speeds up CI pipelines.'
      ],
      followUpQuestions: [
        'How do you exclude a transitive dependency in Maven?'
      ]
    },
    tags: ['Maven', 'Gradle', 'Build Tools']
  },
  {
    id: 'devops-04',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Version Control',
    title: 'Git vs SVN',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'The shift from centralized SVN to distributed Git.',
    coreConcepts: [
      'SVN is a centralized version control system. You must be connected to the central server to commit.',
      'Git is distributed. Every developer has a full local copy of the repository history, allowing local commits and branching.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Highlights centralized vs distributed architecture.',
        'Mentions Git branches are lightweight and local.'
      ],
      juniorOrMidRedFlags: [
        'Thinks GitHub is Git.'
      ],
      seniorDifferentiators: [
        'Understands the Git index (staging area) and internal object model (blobs, trees, commits).'
      ],
      followUpQuestions: [
        'What is the difference between git merge and git rebase?'
      ]
    },
    tags: ['Git', 'SVN', 'VCS']
  },
  {
    id: 'devops-05',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Containerization & CI',
    title: 'Docker & Jenkins Integration',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'How Docker containers and Jenkins pipelines are used for Continuous Integration.',
    coreConcepts: [
      'Docker packages an application and its dependencies into a portable container image.',
      'Analogy: Shipping containers. Before Docker, cargo (code) was loaded loosely onto ships (servers) causing conflicts (e.g., Python 2 vs 3 dependencies). Docker provides a standardized steel box where everything inside is isolated; it fits uniformly on any ship, truck, or crane worldwide.',
      'Jenkins automates the build, test, and deployment phases. A Jenkinsfile defines the pipeline as code.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the purpose of a Dockerfile (FROM, RUN, COPY, CMD).',
        'Describes a Jenkins declarative pipeline.'
      ],
      juniorOrMidRedFlags: [
        'Confuses a Docker image with a Docker container.'
      ],
      seniorDifferentiators: [
        'Explains multi-stage Docker builds to keep the final image size small.'
      ],
      followUpQuestions: [
        'How do you map a port from a Docker container to the host machine?'
      ]
    },
    tags: ['Docker', 'Jenkins', 'CI/CD']
  },

  {
    id: 'maven-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Maven Architecture',
    title: 'Maven Parent POM, Multi-Module Projects & <dependencyManagement> vs <dependencies>',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Centralized dependency version convergence, Bill of Materials (BOM), parent inheritance, and submodule build orchestration.',
    coreConcepts: [
      '<dependencyManagement>: Declares dependency versions and exclusions in the parent POM without adding the dependency JARs to child modules.',
      '<dependencies>: Actually adds the dependency artifact to the module classpath.',
      'BOM (Bill of Materials): A packaging=pom artifact imported via <scope>import</scope> (e.g. spring-boot-dependencies) that locks compatible library versions across projects.',
      'Multi-Module Build: Root pom with <packaging>pom</packaging> and <modules> list orchestrates reactor build order based on inter-module dependencies.'
    ],
    detailedExplanation: [
      'In enterprise microservices, child modules inherit from a corporate parent POM. Child modules declare dependencies WITHOUT specifying <version>; versions are resolved dynamically from the parent <dependencyManagement>.',
      'This guarantees zero version drift across 50+ microservices for critical libraries like Jackson, Spring, or Log4j.'
    ],
    codeExamples: [
      {
        title: 'Parent POM with DependencyManagement & BOM Import',
        language: 'xml',
        code: `<!-- Corporate Parent pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.enterprise.platform</groupId>
    <artifactId>platform-parent</artifactId>
    <version>2.5.0</version>
    <packaging>pom</packaging>

    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.2.3</spring.boot.version>
        <resilience4j.version>2.1.0</resilience4j.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot BOM Import -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>\${spring.boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- Corporate Resilience4j Version Lock -->
            <dependency>
                <groupId>io.github.resilience4j</groupId>
                <artifactId>resilience4j-spring-boot3</artifactId>
                <version>\${resilience4j.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <modules>
        <module>common-core</module>
        <module>order-service</module>
        <module>payment-service</module>
    </modules>
</project>`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the difference between <dependencyManagement> (centralized version definition) and <dependencies> (classpath inclusion).',
        'Explains how <scope>import</scope> with <type>pom</type> imports third-party BOMs.',
        'Explains Maven Reactor build order calculation for multi-module projects.'
      ],
      juniorOrMidRedFlags: [
        'Hardcodes version tags in every child pom.xml.',
        'Does not know what a BOM is.'
      ],
      seniorDifferentiators: [
        'Explains Maven dependency convergence rules and how to use maven-enforcer-plugin to prevent transitive dependency conflicts.'
      ],
      followUpQuestions: [
        'How does `mvn clean install -pl order-service -am` build only the target module and its upstream dependencies?'
      ]
    },
    tags: ['Maven', 'Parent POM', 'BOM', 'DependencyManagement', 'Multi-Module']
  },
  {
    id: 'maven-02',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Artifact Management & Release',
    title: 'SNAPSHOT vs RELEASE Artifacts & Nexus/Artifactory Repository Types',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Mutability rules, timestamped SNAPSHOT deployment, immutable RELEASE governance, and Hosted vs Proxy vs Virtual repositories.',
    coreConcepts: [
      'SNAPSHOT (e.g. 1.0.0-SNAPSHOT): Mutable development version; Maven appends timestamps (e.g. 1.0.0-20240804.120530-1) and checks remote repos for updates daily/per-build.',
      'RELEASE (e.g. 1.0.0): Strictly immutable production artifact; once deployed to Nexus/Artifactory, redeployment is blocked by repository manager policies.',
      'Repository Types: Hosted (internal private artifacts), Proxy (caches external repos like Maven Central), Virtual/Group (combines multiple repos under one endpoint).'
    ],
    detailedExplanation: [
      'Production builds must NEVER depend on SNAPSHOT versions; doing so creates non-reproducible builds where code changes without version increments.',
      'The maven-release-plugin or modern JGitver/Semantic Release tools automate stripping -SNAPSHOT, tagging Git, deploying release JARs, and bumping the next snapshot version.'
    ],
    codeExamples: [
      {
        title: 'Nexus/Artifactory Distribution Management Configuration',
        language: 'xml',
        code: `<distributionManagement>
    <!-- Production Releases (Immutable) -->
    <repository>
        <id>nexus-releases</id>
        <name>Corporate Release Repository</name>
        <url>https://nexus.company.com/repository/maven-releases/</url>
    </repository>

    <!-- Development Snapshots (Mutable) -->
    <snapshotRepository>
        <id>nexus-snapshots</id>
        <name>Corporate Snapshot Repository</name>
        <url>https://nexus.company.com/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Contrasts mutable SNAPSHOTs vs immutable RELEASE artifacts.',
        'Explains why SNAPSHOTs are forbidden in production deployments (reproducibility guarantee).',
        'Explains Nexus/Artifactory repo types: Hosted, Proxy, Group.'
      ],
      juniorOrMidRedFlags: [
        'Attempts to re-deploy or overwrite a release JAR in Artifactory.',
        'Deploys snapshot artifacts to production environments.'
      ],
      seniorDifferentiators: [
        'Explains Maven metadata.xml updating for snapshot timestamp resolution.'
      ],
      followUpQuestions: [
        'How does `mvn -U` force Maven to check for updated snapshot artifacts from remote repositories?'
      ]
    },
    tags: ['Maven', 'Nexus', 'Artifactory', 'SNAPSHOT', 'Release Management']
  },
  {
    id: 'jenkins-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'CI/CD Pipelines & Jenkins',
    title: 'Jenkins Declarative vs Scripted Pipeline & Complete Jenkinsfile Example',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Structured pipeline syntax, SonarQube quality gate integration, parallel testing stages, Docker packaging, and automated rollback triggers.',
    coreConcepts: [
      'Declarative Pipeline (pipeline { ... }): Strict, structured syntax with built-in validation, directives (agent, stages, steps, post), and clear error reporting.',
      'Scripted Pipeline (node { ... }): Groovy DSL with full programmatic flexibility (loops, try-catch, arbitrary code) but higher complexity.',
      'Quality Gate: Halts the pipeline if SonarQube static analysis detects code smells, security vulnerabilities, or insufficient unit test coverage (<80%).'
    ],
    detailedExplanation: [
      'Enterprise Jenkinsfiles use Declarative syntax for consistency across engineering teams, incorporating post-action hooks (always, success, failure) for Slack/Teams notifications and cleanup.',
      'Parallel stages allow running unit tests, integration tests, and SonarQube scans concurrently across ephemeral Kubernetes agent pods.'
    ],
    codeExamples: [
      {
        title: 'Production Declarative Jenkinsfile with Quality Gate & Docker Push',
        language: 'groovy',
        code: `pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
                containers:
                - name: maven
                  image: maven:3.9.6-eclipse-temurin-17
                  command: ['sleep']
                  args: ['99d']
            '''
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Unit & Mutation Tests') {
                    steps {
                        container('maven') {
                            sh 'mvn clean test pitest:mutationCoverage'
                        }
                    }
                }
                stage('Static Code Analysis') {
                    steps {
                        container('maven') {
                            withSonarQubeEnv('Corporate-SonarQube') {
                                sh 'mvn sonar:sonar'
                            }
                        }
                    }
                }
            }
        }

        stage('Sonar Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Package & Containerize') {
            steps {
                container('maven') {
                    sh 'mvn package -DskipTests'
                    sh 'docker build -t app-service:\${BUILD_NUMBER} .'
                }
            }
        }
    }

    post {
        failure {
            slackSend channel: '#alerts-devops', message: "Pipeline FAILED on build \${BUILD_NUMBER}"
        }
        success {
            slackSend channel: '#alerts-devops', message: "Pipeline PASSED on build \${BUILD_NUMBER}"
        }
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates Declarative (strict pipeline block) from Scripted (node Groovy block).',
        'Demonstrates parallel stage execution for faster pipeline feedback.',
        'Explains waitForQualityGate integration with SonarQube.',
        'Explains ephemeral Kubernetes agents for build isolation.'
      ],
      juniorOrMidRedFlags: [
        'Configures pipelines solely via legacy Jenkins UI freestyle jobs without version-controlled Jenkinsfile.',
        'Ignores Quality Gate failures.'
      ],
      seniorDifferentiators: [
        'Explains shared libraries (vars/ and src/) in Jenkins for reusable pipeline steps across 100+ repos.'
      ],
      followUpQuestions: [
        'How do you implement Blue-Green or Canary deployments in Jenkins using Kubernetes or load balancer routing?'
      ]
    },
    tags: ['Jenkins', 'CI/CD', 'Jenkinsfile', 'SonarQube', 'Pipelines']
  },
  {
    id: 'deploy-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Deployment Strategies',
    title: 'Blue/Green Deployment vs Canary Deployment vs Rolling Updates',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Zero-downtime release architectures, traffic shifting, database backward compatibility, and automated rollback strategies.',
    coreConcepts: [
      'Blue/Green: Two identical production environments. Blue is live; Green receives new version. After verification, load balancer switches 100% traffic to Green. Instant rollback by switching back.',
      'Canary: New version is deployed to a small subset (e.g. 5-10%) of instances. Telemetry & error rates are monitored. If healthy, traffic is incrementally shifted to 100%.',
      'Rolling Update: Gradually replaces old pods/instances one by one. Saves infrastructure costs but runs mixed versions simultaneously.',
      'Expand-and-Contract (Parallel Run) Database Pattern: Database schema changes must remain backward-compatible with both old and new application code.'
    ],
    detailedExplanation: [
      'The biggest hurdle in Blue/Green deployments is database migration. If Green drops a column that Blue is still reading, Blue crashes immediately. Schema changes must follow: 1) Add new nullable column, 2) Deploy Green writing to both, 3) Backfill, 4) Drop old column in next release.',
      'Canary releases are paired with automated metric analysis (e.g. Prometheus + Flagger/Argo Rollouts) to auto-abort if HTTP 5xx rate spikes by >1%.'
    ],
    codeExamples: [
      {
        title: 'Argo Rollouts Canary Strategy Configuration in Kubernetes',
        language: 'yaml',
        code: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: order-service-rollout
spec:
  replicas: 10
  strategy:
    canary:
      steps:
      - setWeight: 10 # Send 10% traffic to new Canary version
      - pause: { duration: 5m } # Monitor error rate for 5 minutes
      - setWeight: 50 # Increase to 50%
      - pause: { duration: 10m }
      - setWeight: 100 # Promote to 100% full rollout`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Compares Blue/Green (full instant switch), Canary (gradual traffic percentage), and Rolling.',
        'Explains the Expand-and-Contract database migration strategy.',
        'Explains automated rollback triggers based on error rate/latency SLIs.'
      ],
      juniorOrMidRedFlags: [
        'Assumes database schema can be changed destructively during a zero-downtime release.',
        'Does not know how traffic shifting works in Canary releases.'
      ],
      seniorDifferentiators: [
        'Explains feature flags (LaunchDarkly / Togglz) vs infrastructure-level traffic shifting.'
      ],
      followUpQuestions: [
        'How do you manage active user WebSocket connections or long-running HTTP requests during a Blue/Green traffic cutover?'
      ]
    },
    tags: ['DevOps', 'Blue/Green', 'Canary', 'Deployment Strategies', 'Zero Downtime']
  },
  {
    id: 'svn-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Version Control Systems',
    title: 'SVN vs Git: Centralized vs Distributed Architecture & Branching Mechanics',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Differences in repository topography, offline operations, branching cost (directory copy vs pointer), merge tracking, and SHA-1 commit DAG.',
    coreConcepts: [
      'SVN (Subversion): Centralized VCS; developers check out a working copy from a single central server. Branching creates a full copy of the directory (svn copy). Revision numbers are sequential integers (r1204).',
      'Git: Distributed VCS; every developer clone contains the complete repository history and DAG (Directed Acyclic Graph). Branching is a lightweight 41-byte pointer to a 40-character SHA-1 hash.',
      'Git allows fully offline commits, diffs, branching, and rebasing; SVN requires continuous network connectivity to the central server for branching, logs, and commits.'
    ],
    detailedExplanation: [
      'In SVN, merging between branches is historically error-prone because merge metadata tracking was basic compared to Git three-way merge base calculation.',
      'SVN is still occasionally used in legacy enterprise environments with massive multi-gigabyte binary assets (games, CAD) where cloning full history in Git would be prohibitive (though Git LFS addresses this).'
    ],
    codeExamples: [
      {
        title: 'SVN vs Git Command Line Comparison Matrix',
        language: 'bash',
        code: `# SVN Branching (Directory copy on server)
svn copy svn://repo/trunk svn://repo/branches/feature-login -m "Create branch"
svn checkout svn://repo/branches/feature-login
svn commit -m "Implement login"

# Git Branching (Instant pointer creation)
git checkout -b feature-login
git commit -am "Implement login" # Local commit (offline!)
git push -u origin feature-login # Push to remote`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates Centralized (SVN) vs Distributed (Git).',
        'Explains why Git branches are lightweight pointer movements vs SVN directory copies.',
        'Explains offline capability in Git vs online requirement in SVN.'
      ],
      juniorOrMidRedFlags: [
        'Does not know what a distributed VCS means.',
        'Thinks git commit sends code directly to the remote server without git push.'
      ],
      seniorDifferentiators: [
        'Explains git rebase vs git merge commit history topologies.'
      ],
      followUpQuestions: [
        'How does git cherry-pick work internally compared to merging?'
      ]
    },
    tags: ['SVN', 'Git', 'Version Control', 'Branching']
  },
  {
    id: 'gocd-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'CI/CD Pipelines & GoCD',
    title: 'GoCD Pipeline Modeling & Value Stream Map',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding GoCD\'s architecture, Pipeline Dependencies, and the Value Stream Map (VSM) for continuous delivery.',
    coreConcepts: [
      'GoCD is specialized for complex Continuous Delivery workflows, emphasizing end-to-end visualization through its Value Stream Map (VSM).',
      'Pipelines in GoCD are first-class citizens that can trigger other pipelines, passing artifacts downstream through Pipeline Dependencies.',
      'A GoCD pipeline consists of Stages (run sequentially), which contain Jobs (run in parallel), which contain Tasks (run sequentially).'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the hierarchy: Pipeline -> Stage -> Job -> Task.',
        'Mentions the Value Stream Map and how it visualizes the path to production.',
        'Understands artifact propagation between dependent pipelines in GoCD.'
      ],
      juniorOrMidRedFlags: [
        'Confuses GoCD with Jenkins (GoCD is heavily opinionated on CD, Jenkins is a general-purpose automation server).'
      ],
      seniorDifferentiators: [
        'Discusses fan-in and fan-out pipeline dependency resolution in GoCD to ensure consistent artifact versions.'
      ],
      followUpQuestions: [
        {
          question: 'How does GoCD handle "Fan-in" dependency resolution?',
          answer: 'If Pipeline C depends on Pipeline A and Pipeline B, GoCD ensures that Pipeline C only triggers when both A and B have successfully built from the exact same upstream source commit, preventing inconsistent versions.'
        }
      ]
    },
    tags: ['GoCD', 'CI/CD', 'Value Stream Map', 'Pipeline']
  },
  {
    id: 'ansible-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Configuration Management',
    title: 'Ansible Playbooks, Idempotency & Agentless Architecture',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Automating infrastructure and application deployment using Ansible Playbooks, Inventories, and Roles.',
    coreConcepts: [
      'Agentless Architecture: Ansible uses standard SSH (or WinRM) to connect to target nodes. It does not require a proprietary daemon installed on the servers, unlike Chef or Puppet.',
      'Idempotency: An Ansible module should only apply a change if the current state differs from the desired state. Running the same playbook multiple times should have the same effect as running it once.',
      'Playbooks (YAML): Define the desired state. Inventories (INI/YAML): Define the target hosts. Roles: Reusable organizational structure for tasks, variables, and templates.'
    ],
    codeExamples: [
      {
        title: 'Idempotent Ansible Task Example',
        language: 'yaml',
        code: `- name: Ensure Nginx is installed and running
  hosts: webservers
  become: yes
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present  # Idempotent: Does nothing if already installed

    - name: Ensure Nginx service is started
      service:
        name: nginx
        state: started`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that Ansible is agentless and push-based (via SSH).',
        'Defines Idempotency and why it is critical in configuration management.',
        'Understands the structure of a Playbook (Tasks, Handlers, Variables).'
      ],
      juniorOrMidRedFlags: [
        'Writes shell command tasks (using the `command` or `shell` module) instead of built-in idempotent modules, breaking idempotency.'
      ],
      seniorDifferentiators: [
        'Discusses Ansible Vault for secret management and dynamic inventories (e.g. AWS EC2 plugin) for ephemeral cloud environments.'
      ],
      followUpQuestions: [
        {
          question: 'Why should you avoid using the `command` or `shell` module if a dedicated module (like `apt` or `copy`) exists?',
          answer: 'The `command`/`shell` modules execute blindly every time, breaking idempotency unless manually constrained with `creates` or `removes` arguments.'
        }
      ]
    },
    tags: ['Ansible', 'Configuration Management', 'Idempotency', 'DevOps']
  },
  {
    id: 'agile-01',
    category: 'devops-cicd',
    categoryName: 'Maven, CI/CD & Version Control',
    topic: 'Agile & SCRUM',
    title: 'Agile/SCRUM Ceremonies & Story Estimation',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'The core tenets of Agile software development, SCRUM ceremonies, and effective story pointing.',
    coreConcepts: [
      'Core Ceremonies: Sprint Planning (what to build), Daily Standup (blockers/status), Sprint Review (demo to stakeholders), Sprint Retrospective (process improvement).',
      'Roles: Product Owner (manages backlog/priority), Scrum Master (removes blockers/facilitates), Development Team (delivers increments).',
      'Story Points: Relative estimation (often Fibonacci sequence 1,2,3,5,8) measuring complexity, effort, and risk—NOT exact hours.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies all standard SCRUM ceremonies and their distinct purposes.',
        'Explains why story points are relative and abstract rather than time-based.',
        'Understands that the Retrospective focuses on team process ("what went well, what can improve") while the Review focuses on the product increment.'
      ],
      juniorOrMidRedFlags: [
        'Treats Daily Standup as a detailed technical problem-solving meeting instead of a quick sync/blocker identification.',
        'Equates 1 story point directly to 1 hour or 1 day of work.'
      ],
      seniorDifferentiators: [
        'Discusses tracking velocity, burn-down charts, and protecting the sprint backlog from scope creep.'
      ],
      followUpQuestions: [
        {
          question: 'What is the difference between the Definition of Done (DoD) and Acceptance Criteria?',
          answer: 'Acceptance Criteria apply to a specific user story (e.g. "User can log in with email"). The Definition of Done applies globally to all stories (e.g. "Code reviewed, unit tests passed, deployed to staging").'
        }
      ]
    },
    tags: ['Agile', 'SCRUM', 'Project Management', 'SDLC']
  }
];
