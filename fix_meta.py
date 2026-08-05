import re

with open('src/data/index.ts', 'r') as f:
    content = f.read()

new_content = """  {
    id: 'aws-cloud',
    name: 'AWS Cloud & Serverless',
    shortName: 'AWS Cloud',
    description: 'EC2, S3, RDS, DynamoDB, Fargate, Lambda, ALB/NLB, Route 53',
    badge: 'Cloud',
    iconName: 'Cloud'
  }
];"""

content = content.replace("  }\n];", "  },\n" + new_content)

with open('src/data/index.ts', 'w') as f:
    f.write(content)
