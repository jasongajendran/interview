import re
with open('src/data/microservicesSecurity.ts', 'r') as f:
    content = f.read()

new_content = """  {
    id: 'ms-03',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Messaging & Event Streaming',
    title: 'JMS vs RabbitMQ vs Apache Kafka',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Choosing the right messaging broker and understanding their architectural differences.',
    coreConcepts: [
      'JMS (Java Message Service) is an API specification (ActiveMQ is a popular implementation) featuring Queues (P2P) and Topics (Pub/Sub).',
      'RabbitMQ is a message broker implementing AMQP. It excels at complex routing (exchanges) and ensures message delivery, but deletes messages once consumed.',
      'Apache Kafka is a distributed event streaming platform. It uses a partitioned, append-only log. Messages are persisted and can be replayed by multiple consumer groups.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates transient queues (RabbitMQ) from persistent distributed logs (Kafka).',
        'Explains that Kafka consumer groups track offsets, not the broker deleting the message.'
      ],
      juniorOrMidRedFlags: [
        'Thinks Kafka is just a faster RabbitMQ.',
        'Suggests Kafka for complex, priority-based message routing (where RabbitMQ fits better).'
      ],
      seniorDifferentiators: [
        'Explains Kafka partitions and how message keys guarantee ordering within a partition.'
      ],
      followUpQuestions: [
        'How does Kafka handle consumer failures?'
      ]
    },
    tags: ['Kafka', 'RabbitMQ', 'JMS', 'Messaging']
  },
  {
    id: 'ms-04',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Caching & Data Stores',
    title: 'Redis Use Cases in Microservices',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding Redis as an in-memory data structure store used for caching and session management.',
    coreConcepts: [
      'Redis operates primarily in memory, providing sub-millisecond latency for reads and writes.',
      'Common use cases: Distributed caching, rate limiting, session storage (e.g., Spring Session), and pub/sub.',
      'Supports complex data structures (Strings, Hashes, Lists, Sets, Sorted Sets).'
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies Redis as a key component for sharing state (like sessions or cache) across stateless microservice instances.',
        'Mentions Time-To-Live (TTL) for cache expiration.'
      ],
      juniorOrMidRedFlags: [
        'Thinks Redis is a suitable replacement for a primary relational database with complex queries.'
      ],
      seniorDifferentiators: [
        'Explains cache stampede (thundering herd) and how distributed locks in Redis (Redlock) can prevent it.'
      ],
      followUpQuestions: [
        'What happens when Redis runs out of memory (Eviction policies)?'
      ]
    },
    tags: ['Redis', 'Caching', 'Microservices']
  },
"""

content = content.replace("export const microservicesSecurityQuestions: QuestionItem[] = [", "export const microservicesSecurityQuestions: QuestionItem[] = [\n" + new_content)
with open('src/data/microservicesSecurity.ts', 'w') as f:
    f.write(content)
