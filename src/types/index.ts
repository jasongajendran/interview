export type CategoryId = 
  | 'java-core'
  | 'java-17'
  | 'spring-boot'
  | 'microservices-security'
  | 'sql-database'
  | 'testing-frameworks'
  | 'devops-cicd'
  | 'legacy-web'
  | 'jboss-wildfly'
  | 'ui-frontend'
  | 'ides-diagnostics'
  | 'production-scenarios';

export type SeniorityLevel = 'Senior (10-12 YOE)' | 'Lead / Architect (13-15+ YOE)' | 'Principal / Staff';

export interface CodeExample {
  title: string;
  language: 'java' | 'sql' | 'xml' | 'freemarker' | 'bash' | 'javascript' | 'groovy' | 'yaml';
  code: string;
  output?: string;
  explanation?: string;
}

export interface InterviewerRubric {
  idealAnswerPoints: string[];
  juniorOrMidRedFlags: string[];
  seniorDifferentiators: string[];
  followUpQuestions: string[];
}

export interface QuestionItem {
  id: string;
  category: CategoryId;
  categoryName: string;
  topic: string;
  title: string;
  seniority: SeniorityLevel;
  difficulty: 'Medium' | 'Hard' | 'Architect-Level';
  summary: string;
  coreConcepts: string[];
  detailedExplanation: string[];
  codeExamples: CodeExample[];
  rubric: InterviewerRubric;
  tags: string[];
}

export interface ProductionScenario {
  id: string;
  title: string;
  severity: 'P1 - Critical Outage' | 'P2 - High Latency / Degraded' | 'P3 - Data Inconsistency';
  affectedComponent: string;
  symptoms: string[];
  diagnosticSteps: {
    step: number;
    command: string;
    description: string;
    expectedLogOutput?: string;
  }[];
  rootCauseAnalysis: string;
  immediateRemediation: string;
  longTermArchitectureFix: string;
  interviewerKeyQuestions: string[];
}

export interface CandidateEvaluation {
  questionId: string;
  score: number; // 1 to 5
  notes: string;
  strengths: string;
  concerns: string;
}

export interface InterviewKit {
  id: string;
  title: string;
  candidateName?: string;
  targetRole: string;
  targetYOE: string;
  questionIds: string[];
  createdAt: string;
}
