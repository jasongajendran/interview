import { QuestionItem } from '../types';

export const awsCloudQuestions: QuestionItem[] = [
  {
    id: 'aws-01',
    category: 'aws-cloud' as any,
    categoryName: 'AWS Cloud & Serverless',
    topic: 'Compute & Containers',
    title: 'EC2 vs Fargate vs Lambda',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding when to use standard VMs (EC2), serverless containers (Fargate), and serverless functions (Lambda).',
    coreConcepts: [
      'EC2 provides full control over the underlying virtual machine, useful for legacy or highly customized environments.',
      'AWS Fargate is a serverless compute engine for containers that works with ECS and EKS, removing the need to provision underlying servers.',
      'AWS Lambda is an event-driven, serverless computing platform that executes code in response to triggers and manages compute resources automatically.'
    ],
    detailedExplanation: [
      'For a Spring Boot app that takes 10 seconds to boot, Lambda might suffer from "cold starts". Fargate or EC2 is often better for long-running microservices.',
      'Lambda is ideal for event-driven tasks, like processing an image immediately after it is uploaded to S3.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Compares the operational overhead of managing EC2 vs Fargate.',
        'Explains cold starts in Lambda.',
        'Matches the compute choice to application behavior (event-driven vs long-running).'
      ],
      juniorOrMidRedFlags: [
        'Thinks Lambda is best for a traditional persistent Spring Boot REST API.',
        'Confuses Fargate with a container registry (ECR).'
      ],
      seniorDifferentiators: [
        'Discusses AWS Lambda SnapStart for Java to reduce cold start times.'
      ],
      followUpQuestions: [
        'How do you handle background processing (threads) in a Lambda function?'
      ]
    },
    tags: ['AWS', 'EC2', 'Fargate', 'Lambda']
  },
  {
    id: 'aws-02',
    category: 'aws-cloud' as any,
    categoryName: 'AWS Cloud & Serverless',
    topic: 'Storage & Databases',
    title: 'S3, RDS, and DynamoDB Use Cases',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Choosing between Object Storage (S3), Relational DBs (RDS), and NoSQL (DynamoDB).',
    coreConcepts: [
      'S3 is an object storage service designed for storing static assets, documents, and backups at scale.',
      'RDS provides managed relational databases (MySQL, PostgreSQL, Oracle) with built-in patching and read replicas.',
      'DynamoDB is a fully managed NoSQL document and key-value database providing single-digit millisecond performance.'
    ],
    detailedExplanation: [
      'Do not store binary files (like images or PDFs) directly in RDS or DynamoDB. Store them in S3 and save the S3 URL in the database.',
      'RDS is perfect for transactional data requiring complex joins. DynamoDB is great for high-throughput, unstructured or semi-structured data where access patterns are well-defined.'
    ],
    codeExamples: [
      {
        title: 'Spring Cloud AWS - S3 Upload Example',
        language: 'java',
        code: `@Service
public class S3Service {

    private final S3Template s3Template;

    public S3Service(S3Template s3Template) {
        this.s3Template = s3Template;
    }

    public void uploadProfilePicture(String userId, MultipartFile file) throws IOException {
        String bucketName = "user-profile-pictures-bucket";
        String key = userId + "/" + file.getOriginalFilename();
        
        // Upload the file to S3
        s3Template.store(bucketName, key, file.getInputStream(), file.getSize());
        
        System.out.println("File uploaded to S3: " + key);
    }
    
    public URL generatePresignedUrl(String key) {
        // Generates a URL that allows a user to download a private file temporarily
        return s3Template.createSignedGetURL("user-profile-pictures-bucket", key, Duration.ofMinutes(15));
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Correctly pairs unstructured files with S3.',
        'Contrasts ACID transactions in RDS with eventual consistency in DynamoDB (though DynamoDB supports transactions now).',
        'Explains how to use S3 Pre-signed URLs for secure access.'
      ],
      juniorOrMidRedFlags: [
        'Suggests storing large video files as BLOBs in RDS.',
        'Thinks DynamoDB can easily execute complex SQL JOIN queries.'
      ],
      seniorDifferentiators: [
        'Mentions DynamoDB partition keys and avoiding hot partitions.'
      ],
      followUpQuestions: [
        'When would you use DynamoDB Streams?'
      ]
    },
    tags: ['AWS', 'S3', 'RDS', 'DynamoDB']
  },
  {
    id: 'aws-03',
    category: 'aws-cloud' as any,
    categoryName: 'AWS Cloud & Serverless',
    topic: 'Networking & Security',
    title: 'Load Balancers, Route 53 & Secrets Manager',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'The difference between ALB and NLB, DNS routing, and secure credential management.',
    coreConcepts: [
      'Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) and can route based on URLs or headers. Network Load Balancer (NLB) operates at Layer 4 (TCP/UDP) for ultra-high performance.',
      'Route 53 is AWS\'s highly available DNS web service, supporting health checks and various routing policies (latency, weighted, failover).',
      'AWS Secrets Manager securely stores, rotates, and retrieves database credentials and API keys, replacing hardcoded properties.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates Layer 7 (ALB) vs Layer 4 (NLB) load balancing.',
        'Explains why Secrets Manager is superior to storing passwords in environment variables or application.properties.',
        'Understands Route 53 is for DNS management.'
      ],
      juniorOrMidRedFlags: [
        'Confuses Route 53 with an API Gateway or Load Balancer.',
        'Hardcodes DB passwords in AWS Lambda environment variables instead of using Secrets Manager.'
      ],
      seniorDifferentiators: [
        'Explains how to configure automatic secret rotation for RDS using Secrets Manager and Lambda.'
      ],
      followUpQuestions: [
        'How does an ALB terminate SSL/TLS connections?'
      ]
    },
    tags: ['AWS', 'ALB', 'Route 53', 'Secrets Manager']
  }
];
