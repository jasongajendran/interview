import re

with open('src/data/devopsCiCd.ts', 'r') as f:
    content = f.read()

new_content = """  {
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
        'Mentions Gradle\\'s performance benefits (daemon, incremental build).'
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
"""

content = content.replace("export const devopsCiCdQuestions: QuestionItem[] = [", "export const devopsCiCdQuestions: QuestionItem[] = [\n" + new_content)
with open('src/data/devopsCiCd.ts', 'w') as f:
    f.write(content)
