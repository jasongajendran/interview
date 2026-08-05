import re

with open('src/data/microservicesSecurity.ts', 'r') as f:
    content = f.read()

# Replace ms-03
ms03_new = """  {
    id: 'ms-03',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Messaging & Event Streaming',
    title: 'RabbitMQ in Depth & JMS vs Kafka',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Deep dive into RabbitMQ (AMQP), its exchange types, and how it compares to JMS and Apache Kafka.',
    coreConcepts: [
      'JMS (Java Message Service): API specification (ActiveMQ is a popular implementation) featuring Queues (P2P) and Topics (Pub/Sub).',
      'RabbitMQ: A message broker implementing AMQP. It excels at complex routing (exchanges) and ensures message delivery, but deletes messages once consumed (or acknowledged).',
      'RabbitMQ Components: Producer -> Exchange -> Binding -> Queue -> Consumer.',
      'Exchange Types: Direct (exact match), Topic (pattern match using * and #), Fanout (broadcast to all bound queues), Headers.',
      'Apache Kafka: Distributed event streaming platform. Uses a partitioned, append-only log. Messages are persisted and can be replayed.'
    ],
    detailedExplanation: [
      'In RabbitMQ, publishers never send messages directly to a queue. Instead, they send them to an Exchange. The Exchange routes the message to one or more Queues based on Bindings and Routing Keys.',
      'Topic Exchanges are extremely powerful for microservices. For example, a routing key `order.created.eu` can be routed to a queue bound to `order.*.eu` and another bound to `order.created.#`.',
      'Acknowledgment (ACK) mechanisms are crucial. If a consumer crashes before sending an ACK, RabbitMQ will re-queue the message to ensure it is not lost (At-Least-Once delivery).'
    ],
    codeExamples: [
      {
        title: 'Spring Boot RabbitMQ Configuration (Topic Exchange)',
        language: 'java',
        code: `@Configuration
public class RabbitConfig {

    public static final String EXCHANGE_NAME = "ecommerce.exchange";
    public static final String INVENTORY_QUEUE = "inventory.queue";
    public static final String SHIPPING_QUEUE = "shipping.queue";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue inventoryQueue() {
        // durable = true (survives broker restart)
        return new Queue(INVENTORY_QUEUE, true);
    }

    @Bean
    public Queue shippingQueue() {
        return new Queue(SHIPPING_QUEUE, true);
    }

    @Bean
    public Binding inventoryBinding(Queue inventoryQueue, TopicExchange exchange) {
        // Matches order.created, order.updated, etc.
        return BindingBuilder.bind(inventoryQueue).to(exchange).with("order.*");
    }

    @Bean
    public Binding shippingBinding(Queue shippingQueue, TopicExchange exchange) {
        // Matches order.created.eu, order.shipped.us, etc.
        return BindingBuilder.bind(shippingQueue).to(exchange).with("order.#");
    }
    
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}`
      },
      {
        title: 'RabbitMQ Publisher & Consumer',
        language: 'java',
        code: `@Service
public class OrderPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OrderPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCreated(OrderEvent event) {
        // Routing key: "order.created"
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, "order.created", event);
        System.out.println("Published order event: " + event.getOrderId());
    }
}

@Service
public class InventoryConsumer {

    // Spring AMQP automatically creates a listener container
    @RabbitListener(queues = RabbitConfig.INVENTORY_QUEUE)
    public void handleOrderEvent(OrderEvent event) {
        System.out.println("Inventory service received order: " + event.getOrderId());
        // Acknowledgment is handled automatically by Spring (if no exception is thrown)
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Clearly defines the roles of Exchange, Queue, Binding, and Routing Key in RabbitMQ.',
        'Can give an example of when to use a Topic exchange vs a Direct exchange.',
        'Explains that RabbitMQ deletes messages after ACK, whereas Kafka persists them based on a retention policy.'
      ],
      juniorOrMidRedFlags: [
        'Thinks RabbitMQ publishers send directly to queues.',
        'Confuses RabbitMQ (smart broker, dumb consumer) with Kafka (dumb broker, smart consumer).'
      ],
      seniorDifferentiators: [
        'Explains Dead Letter Exchanges (DLX) in RabbitMQ for handling failed/poison messages.',
        'Discusses Prefetch Count (QoS) to prevent consumer overwhelming.',
        'Discusses Publisher Confirms to guarantee message reached the broker.'
      ],
      followUpQuestions: [
        'How do you handle a "poison message" that consistently throws an exception and prevents other messages from being processed?',
        'What is the difference between RabbitMQ\\'s push model and Kafka\\'s pull model?'
      ]
    },
    tags: ['RabbitMQ', 'AMQP', 'Kafka', 'Messaging', 'Spring Boot']
  },"""

# Replace ms-04
ms04_new = """  {
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
    detailedExplanation: [
      'In a microservices architecture, services are typically stateless. Redis provides a fast, shared, distributed state. For example, storing user sessions in Redis allows any instance of the Auth service to validate a session.',
      'The Cache-Aside pattern is the most common caching strategy: the application first checks Redis. If there is a cache miss, it queries the database, writes the result to Redis with a TTL (Time-To-Live), and returns the data.'
    ],
    codeExamples: [
      {
        title: 'Spring Cache Abstraction with Redis',
        language: 'java',
        code: `@Configuration
@EnableCaching
public class RedisCacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10)) // Global TTL
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
            
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build();
    }
}

@Service
public class ProductService {
    
    // Automatically checks Redis cache 'products' before executing method
    @Cacheable(value = "products", key = "#productId")
    public Product getProductById(String productId) {
        System.out.println("Cache miss! Fetching from DB for ID: " + productId);
        return database.findById(productId);
    }
    
    // Evicts the cache entry when product is updated
    @CacheEvict(value = "products", key = "#product.id")
    public void updateProduct(Product product) {
        database.save(product);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies Redis as a key component for sharing state (like sessions or cache) across stateless microservice instances.',
        'Mentions Time-To-Live (TTL) for cache expiration and memory management.'
      ],
      juniorOrMidRedFlags: [
        'Thinks Redis is a suitable replacement for a primary relational database with complex queries.',
        'Forgets to configure TTLs, leading to memory exhaustion (OOM).'
      ],
      seniorDifferentiators: [
        'Explains cache stampede (thundering herd) and how distributed locks in Redis (using SETNX or Redisson) can prevent it.',
        'Understands Redis eviction policies (e.g., allkeys-lru).'
      ],
      followUpQuestions: [
        'What happens when Redis runs out of memory?',
        'How would you implement a Rate Limiter using Redis?'
      ]
    },
    tags: ['Redis', 'Caching', 'Microservices', 'Spring Boot']
  },"""

# Use regex to replace the specific items in the array
pattern_ms03 = r"\s*\{\s*id:\s*'ms-03',.*?(?=\s*\{\s*id:\s*'ms-04'|\s*\];)"
pattern_ms04 = r"\s*\{\s*id:\s*'ms-04',.*?(?=\s*\{\s*id:\s*'ms-01'|\s*\];)"

import re
content = re.sub(pattern_ms03, "\n" + ms03_new, content, flags=re.DOTALL)
content = re.sub(pattern_ms04, "\n" + ms04_new, content, flags=re.DOTALL)

with open('src/data/microservicesSecurity.ts', 'w') as f:
    f.write(content)
