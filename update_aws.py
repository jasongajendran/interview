import re

with open('src/data/awsCloud.ts', 'r') as f:
    content = f.read()

# Update aws-02
new_aws02 = """  {
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
  },"""

content = re.sub(r"\s*\{\s*id:\s*'aws-02',.*?(?=\s*\{\s*id:\s*'aws-03'|\s*\];)", "\n" + new_aws02, content, flags=re.DOTALL)

with open('src/data/awsCloud.ts', 'w') as f:
    f.write(content)
