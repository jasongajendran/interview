import { QuestionItem } from '../types';

export const microservicesSecurityQuestions: QuestionItem[] = [
  {
    id: 'ms-03',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Messaging & Event Streaming',
    title: 'RabbitMQ in Depth: Architecture, AMQP Protocol, Exchange Types & Kafka Comparison',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Comprehensive deep dive into RabbitMQ internals, AMQP protocol, Exchange types (Direct, Topic, Fanout, Headers), Manual Acknowledgments, Prefetch QoS, Quorum Queues, and Kafka comparison.',
    coreConcepts: [
      'AMQP Protocol (Advanced Message Queuing Protocol): Binary application layer protocol providing framing, channels, and transactions over a single TCP connection.',
      'Core Topology: Producer -> Exchange -> Bindings (Routing Key rules) -> Queue -> Consumer. Publishers NEVER publish directly to queues.',
      'Exchange Types: Direct (exact routing key match), Topic (wildcards `*` for single word, `#` for 0 or more words), Fanout (broadcasts to all bound queues, ignores routing key), Headers (routes based on message header key-value attributes).',
      'Push vs Pull Model: RabbitMQ pushes messages to consumers over open AMQP channels with Prefetch QoS limits; Kafka relies on consumer pull loops (`poll()`).',
      'Message Lifecycle & Deletion: In RabbitMQ, messages are removed from the queue once acknowledged (ACK\'d) by consumers. In Kafka, messages are immutable append-only logs persisted for a retention duration.',
      'Quorum Queues (RabbitMQ 3.8+): Raft consensus-based replicated queues designed for high availability and data safety, replacing legacy classic mirrored queues.'
    ],
    detailedExplanation: [
      'In RabbitMQ, channels are lightweight virtual connections inside a single physical TCP socket. Multiplexing channels avoids the expensive overhead of creating hundreds of TCP connections.',
      'Manual Acknowledgment (`AcknowledgeMode.MANUAL`): By default, Spring AMQP can auto-ack or ack on method return. In critical financial systems, manual ACKs via `channel.basicAck(deliveryTag, false)` or `channel.basicNack(deliveryTag, false, requeue)` ensure messages are not lost if the JVM crashes mid-processing.',
      'Prefetch Count (QoS): Without a prefetch limit, RabbitMQ pushes all available messages in the queue into consumer memory at once, potentially causing OutOfMemoryError (OOM) or starving other consumer instances. Setting `prefetchCount = 20` ensures RabbitMQ sends at most 20 unacknowledged messages per consumer channel.',
      'RabbitMQ vs Kafka Architectural Fit: Choose RabbitMQ for complex routing, per-message acknowledgments, task worker distribution, priority queues, and strict point-to-point delivery. Choose Kafka for high-throughput event streaming (millions of msgs/sec), event sourcing, stream processing (Kafka Streams/Flink), and replaying historical event logs.'
    ],
    codeExamples: [
      {
        title: 'Spring Boot RabbitMQ Configuration with Topic Exchange & Prefetch QoS',
        language: 'java',
        code: `@Configuration
public class RabbitMqConfig {

    public static final String ORDERS_EXCHANGE = "orders.topic.exchange";
    public static final String INVENTORY_QUEUE = "orders.inventory.queue";
    public static final String NOTIFICATION_QUEUE = "orders.notification.queue";

    @Bean
    public TopicExchange ordersExchange() {
        // durable = true, autoDelete = false
        return new TopicExchange(ORDERS_EXCHANGE, true, false);
    }

    @Bean
    public Queue inventoryQueue() {
        // Quorum Queue for Raft-based high availability and fault tolerance
        return QueueBuilder.durable(INVENTORY_QUEUE)
            .quorum()
            .build();
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(NOTIFICATION_QUEUE)
            .quorum()
            .build();
    }

    @Bean
    public Binding inventoryBinding(Queue inventoryQueue, TopicExchange ordersExchange) {
        // Matches "order.created", "order.updated", "order.cancelled"
        return BindingBuilder.bind(inventoryQueue).to(ordersExchange).with("order.*");
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange ordersExchange) {
        // Matches "order.created.eu", "order.shipped.us.priority", etc.
        return BindingBuilder.bind(notificationQueue).to(ordersExchange).with("order.#");
    }

    @Bean
    public MessageConverter jacksonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter jacksonMessageConverter) {
        
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jacksonMessageConverter);
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL); // Manual ACK mode
        factory.setPrefetchCount(25); // QoS: max 25 unacknowledged messages per consumer
        factory.setConcurrentConsumers(3); // 3 worker threads
        factory.setMaxConcurrentConsumers(10);
        return factory;
    }
}`
      },
      {
        title: 'Manual Acknowledgment & Error NACK Handling in Consumer',
        language: 'java',
        code: `@Service
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    @RabbitListener(queues = RabbitMqConfig.INVENTORY_QUEUE)
    public void processOrderEvent(
            OrderEvent event,
            Channel channel,
            @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {

        log.info("Processing order event: {} with delivery tag: {}", event.getOrderId(), deliveryTag);

        try {
            // Business logic: Update stock and reserve items
            executeInventoryReservation(event);

            // Positively acknowledge message receipt and successful processing
            // multiple = false (only ack this specific delivery tag)
            channel.basicAck(deliveryTag, false);
            log.info("Successfully ACK'd order: {}", event.getOrderId());

        } catch (NonTransientBusinessException ex) {
            // Business validation failed (e.g. invalid item ID) - discard without requeueing (or route to DLQ)
            log.error("Non-recoverable error for order {}. Discarding message.", event.getOrderId(), ex);
            channel.basicNack(deliveryTag, false, false); // requeue = false -> routed to DLX if configured

        } catch (TransientNetworkException ex) {
            // Transient database or network failure - requeue message at the back of the queue
            log.warn("Transient error for order {}. Requeueing message.", event.getOrderId(), ex);
            channel.basicNack(deliveryTag, false, true); // requeue = true
        }
    }

    private void executeInventoryReservation(OrderEvent event) {
        // Business logic execution...
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the RabbitMQ AMQP routing chain: Producer -> Exchange -> Binding -> Queue -> Consumer.',
        'Differentiates all 4 exchange types: Direct, Topic (`*` and `#`), Fanout, and Headers.',
        'Explains the difference between Push model with Prefetch count (RabbitMQ) vs Pull model with polling (Kafka).',
        'Contrasts message lifecycle: RabbitMQ deletes messages upon ACK; Kafka retains immutable logs with consumer offset management.',
        'Explains manual acknowledgment (`basicAck` vs `basicNack` with `requeue` flag).'
      ],
      juniorOrMidRedFlags: [
        'Thinks RabbitMQ publishers push messages directly into queues without an exchange.',
        'Does not know what Prefetch Count (QoS) is, leading to consumer OOM crashes.',
        'Confuses RabbitMQ (smart broker, dumb consumer) with Kafka (dumb broker, smart consumer).'
      ],
      seniorDifferentiators: [
        'Explains Quorum Queues (Raft consensus) vs classic mirrored queues for avoiding split-brain data loss.',
        'Discusses TCP connection vs AMQP channel multiplexing to prevent socket exhaustion.',
        'Explains Publisher Confirms (`ConfirmCallback`) and Publisher Returns (`ReturnsCallback`) for end-to-end reliability.'
      ],
      followUpQuestions: [
        'What happens when `basicNack` is called with `requeue = true` on a poison message that always throws an exception?',
        'How does RabbitMQ handle flow control when broker memory or disk alarms are triggered?'
      ]
    },
    tags: ['RabbitMQ', 'AMQP', 'Kafka', 'Messaging', 'Spring Boot', 'Quorum Queues']
  },

  {
    id: 'ms-05',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Messaging & Event Streaming',
    title: 'RabbitMQ Advanced Resiliency: Dead Letter Exchange (DLX), Message Retries with TTL & Publisher Confirms',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Building enterprise message resiliency in RabbitMQ: Dead Letter Exchanges (DLX), Dead Letter Queues (DLQ), Exponential Backoff retry queues with message TTL, and Publisher Confirms & Returns.',
    coreConcepts: [
      'Dead Letter Exchange (DLX): An ordinary exchange configured on a queue via `x-dead-letter-exchange` to receive messages that are dead-lettered.',
      'Dead-Letter Triggers: 1) Message rejected with `basic.reject` / `basic.nack` with `requeue = false`, 2) Message TTL (`x-message-ttl`) expired, 3) Queue length limit (`x-max-length`) exceeded.',
      'Retry Pattern via Delay Queues & TTL: Messages that fail processing are routed to a retry queue with a per-message TTL and no consumers. When the TTL expires, the retry queue dead-letters the message back to the primary exchange.',
      'Publisher Confirms (`ConfirmCallback`): Asynchronous broker acknowledgments confirming that a published message has been safely persisted to disk or quorum replicas.',
      'Publisher Returns (`ReturnsCallback`): Broker notifies the publisher when a message published with `mandatory = true` cannot be routed to any queue (e.g. invalid routing key or missing binding).'
    ],
    detailedExplanation: [
      'Poison Message Storm: If an unhandled exception occurs and the consumer naively rejects the message with `requeue = true`, RabbitMQ will endlessly re-deliver the bad message, saturating CPU and halting the queue.',
      'Dead Letter Architecture: When an unrecoverable error occurs, the consumer calls `channel.basicNack(deliveryTag, false, false)`. RabbitMQ intercepts the message and forwards it to the DLX with metadata headers (`x-death`, `x-first-death-reason`, `x-first-death-queue`).',
      'Publisher Confirms eliminate the "black hole" risk where network drops occur right after `rabbitTemplate.convertAndSend()`. With `CorrelationData`, the publisher tracks future ACKs/NACKs asynchronously.'
    ],
    codeExamples: [
      {
        title: 'Spring Boot DLX, DLQ & Retry Queue Configuration with Arguments',
        language: 'java',
        code: `@Configuration
public class RabbitResiliencyConfig {

    public static final String MAIN_EXCHANGE = "payment.main.exchange";
    public static final String MAIN_QUEUE = "payment.process.queue";
    
    public static final String DLX_EXCHANGE = "payment.dlx.exchange";
    public static final String DLQ_QUEUE = "payment.deadletter.queue";
    
    public static final String RETRY_QUEUE = "payment.retry.5s.queue";

    // 1. Primary Processing Queue with Dead-Letter parameters
    @Bean
    public Queue mainQueue() {
        return QueueBuilder.durable(MAIN_QUEUE)
            .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
            .withArgument("x-dead-letter-routing-key", "payment.deadletter")
            .build();
    }

    // 2. Dead Letter Exchange (DLX) & Dead Letter Queue (DLQ)
    @Bean
    public DirectExchange dlxExchange() {
        return new DirectExchange(DLX_EXCHANGE, true, false);
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DLQ_QUEUE).build();
    }

    @Bean
    public Binding dlqBinding(Queue deadLetterQueue, DirectExchange dlxExchange) {
        return BindingBuilder.bind(deadLetterQueue).to(dlxExchange).with("payment.deadletter");
    }

    // 3. Delayed Retry Queue: Messages wait here for 5000ms (TTL), then expire back to MAIN_EXCHANGE
    @Bean
    public Queue retryQueue() {
        return QueueBuilder.durable(RETRY_QUEUE)
            .withArgument("x-message-ttl", 5000) // 5 seconds delay
            .withArgument("x-dead-letter-exchange", MAIN_EXCHANGE)
            .withArgument("x-dead-letter-routing-key", "payment.process")
            .build();
    }

    @Bean
    public Binding retryBinding(Queue retryQueue, DirectExchange dlxExchange) {
        return BindingBuilder.bind(retryQueue).to(dlxExchange).with("payment.retry");
    }
}`
      },
      {
        title: 'Reliable Publisher with Confirms & Returns Callbacks',
        language: 'java',
        code: `@Service
public class ReliablePaymentPublisher {

    private static final Logger log = LoggerFactory.getLogger(ReliablePaymentPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public ReliablePaymentPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        initCallbacks();
    }

    private void initCallbacks() {
        // Publisher Confirm: Broker acknowledges message received and stored
        this.rabbitTemplate.setConfirmCallback((CorrelationData correlationData, boolean ack, String cause) -> {
            String id = correlationData != null ? correlationData.getId() : "unknown";
            if (ack) {
                log.info("Publisher Confirm: Broker safely received message ID: {}", id);
            } else {
                log.error("Publisher NACK: Broker failed to persist message ID: {}. Cause: {}", id, cause);
                // Trigger alerting or store in emergency outbound DB fallback
            }
        });

        // Publisher Return: Message was published with mandatory=true but had no matching queue binding
        this.rabbitTemplate.setReturnsCallback(returned -> {
            log.error("Publisher Return: Unroutable message {} returned from exchange {} with routing key {}. Reply: {}",
                    returned.getMessage().getMessageProperties().getMessageId(),
                    returned.getExchange(),
                    returned.getRoutingKey(),
                    returned.getReplyText());
        });
    }

    public void publishPayment(PaymentEvent payment) {
        CorrelationData correlationData = new CorrelationData(payment.getTransactionId());
        
        rabbitTemplate.convertAndSend(
            RabbitResiliencyConfig.MAIN_EXCHANGE,
            "payment.process",
            payment,
            message -> {
                message.getMessageProperties().setMessageId(payment.getTransactionId());
                message.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT); // Persistent message
                return message;
            },
            correlationData
        );
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the 3 conditions that trigger dead-lettering in RabbitMQ (NACK with requeue=false, TTL expiry, queue overflow).',
        'Designs a non-blocking retry mechanism using intermediate delay queues with TTL routing back to the main exchange.',
        'Explains how Publisher Confirms prevent message loss during broker-side failures before persistence.',
        'Explains Publisher Returns (`mandatory = true`) when routing keys have no bound queues.'
      ],
      juniorOrMidRedFlags: [
        'Requeues failing messages synchronously in a while loop, causing CPU thrashing and queue head-of-line blocking.',
        'Believes `rabbitTemplate.convertAndSend()` guarantees delivery without configuring Publisher Confirms.'
      ],
      seniorDifferentiators: [
        'Explains how to parse the `x-death` header array in Spring AMQP to determine retry counts and implement exponential backoff tiers (e.g. 5s -> 30s -> 5m -> DLQ).',
        'Discusses Quorum Queue poison message handling using `x-delivery-count` threshold.'
      ],
      followUpQuestions: [
        'How does RabbitMQ Quorum Queue `x-delivery-count` simplify dead-lettering compared to manual retry queues?',
        'How do you replay 10,000 messages from a Dead Letter Queue back to production after fixing a downstream bug?'
      ]
    },
    tags: ['RabbitMQ', 'DLX', 'Dead Letter Queue', 'Resilience', 'Publisher Confirms', 'Spring Boot']
  },

  {
    id: 'ms-04',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Caching & Data Stores',
    title: 'Redis Use Cases in Microservices: Distributed Caching, Session Management & Rate Limiting',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding Redis data structures, distributed session replication (Spring Session), Cache-Aside pattern, Distributed Locks (Redisson), and Token Bucket Rate Limiting.',
    coreConcepts: [
      'In-Memory Data Structures: Strings, Hashes, Lists, Sets, Sorted Sets (ZSET), HyperLogLog, Bitmaps, and Streams.',
      'Distributed Caching Patterns: Cache-Aside (Lazy loading), Write-Through, Write-Behind (Async), and Refresh-Ahead.',
      'Distributed Locking (Redlock / Redisson): Distributed mutex using atomic `SET key uuid NX PX 30000` with heartbeat lock renewal (Watchdog).',
      'Rate Limiting: Implemented via Redis Lua scripts using Sliding Window Counters (ZSET) or Token Bucket algorithms to prevent race conditions.'
    ],
    detailedExplanation: [
      'In stateless microservices architectures, Redis provides sub-millisecond distributed state. Storing user sessions in Redis allows any service replica behind a round-robin load balancer to authenticate requests without sticky sessions.',
      'Cache Stampede (Thundering Herd): When a hot cache key expires, thousands of concurrent requests miss the cache simultaneously and slam the backend database. Mitigations include Distributed Locks, probabilistic early expiration (XFetch), or background cache warmers.'
    ],
    codeExamples: [
      {
        title: 'Spring Cache Configuration with Custom TTL and Jackson Serialization',
        language: 'java',
        code: `@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(15))
            .disableCachingNullValues()
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));

        // Custom TTL per cache region
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("users", defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put("products", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigs)
            .build();
    }
}

@Service
public class ProductService {

    @Cacheable(value = "products", key = "#productId", unless = "#result == null")
    public Product getProductById(String productId) {
        // Cache miss: Execute expensive database query
        return database.findById(productId);
    }

    @CacheEvict(value = "products", key = "#product.id")
    public void updateProduct(Product product) {
        database.save(product);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the Cache-Aside pattern, TTL configuration, and eviction policies.',
        'Explains how Redis enables truly stateless microservices through distributed session sharing.',
        'Identifies Cache Stampede and explains distributed locks or probabilistic expiration.'
      ],
      juniorOrMidRedFlags: [
        'Treats Redis as a permanent database without configuring eviction policies (e.g. `allkeys-lru`) or TTLs.',
        'Does not serialize complex Java objects properly, causing ClassCastExceptions during version deployments.'
      ],
      seniorDifferentiators: [
        'Explains Redis Lua scripting for atomic multi-step operations (e.g. sliding window rate limiters).',
        'Discusses Redisson Watchdog mechanism for automatic lock renewal in distributed systems.'
      ],
      followUpQuestions: [
        'What is the difference between Redis RDB snapshots and AOF (Append-Only File) persistence?',
        'How does Redis Cluster perform data sharding across 16,384 hash slots?'
      ]
    },
    tags: ['Redis', 'Caching', 'Microservices', 'Spring Boot', 'Distributed Lock']
  },

  {
    id: 'sec-01',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'OAuth2 / OpenID Connect & JWT Architecture',
    title: 'OAuth 2.0 Grant Types (Authorization Code + PKCE vs Client Credentials) & JWT Cryptographic Verification',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Mechanics of OAuth 2.0 Grant Types, PKCE (Proof Key for Code Exchange) for SPAs/Mobile, Client Credentials for M2M, Refresh Token Rotation, JWT Anatomy, and stateless JWKS signature verification.',
    coreConcepts: [
      'Authentication (AuthN) vs Authorization (AuthZ): AuthN verifies WHO you are (Identity / OIDC). AuthZ determines WHAT you can access (Permissions / Scopes / OAuth 2.0).',
      'Authorization Code Grant with PKCE (RFC 7636): Mandatory for Public Clients (SPAs, React/Angular, iOS/Android apps) that cannot safely protect a client secret. Uses dynamic `code_verifier` and SHA-256 `code_challenge` to prevent authorization code interception.',
      'Client Credentials Grant: Direct machine-to-machine (M2M) backend service authentication using client credentials without end-user involvement.',
      'Refresh Token Rotation (RTR): Every time a refresh token is exchanged, the authorization server invalidates the previous refresh token and issues a new one. If an invalidated token is reused, all active tokens for that user family are immediately revoked to protect against token theft.',
      'JSON Web Token (JWT) Anatomy: Header (Algorithm `alg`, Key ID `kid`, Type `typ`), Payload (Standard claims `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti` + Custom claims `roles`, `tenant_id`), Signature (Cryptographic hash using RS256/ES256 public-private keys).',
      'JWKS (JSON Web Key Set): The Identity Provider publishes public certificates at `/.well-known/jwks.json`. Resource Servers cache these keys to verify JWT signatures statelessly with zero network calls per HTTP request.'
    ],
    detailedExplanation: [
      'PKCE Flow Step-by-Step: 1) Client creates random `code_verifier` (43-128 chars) and hashes it to create `code_challenge = BASE64URL(SHA256(code_verifier))`. 2) Client redirects user to IdP authorization endpoint with `code_challenge`. 3) User authenticates; IdP redirects back with `auth_code`. 4) Client sends `auth_code` + original plain `code_verifier` to IdP `/token` endpoint. 5) IdP hashes the `code_verifier` and verifies it matches `code_challenge`. If matched, IdP issues tokens.',
      'Stateless Verification in Spring Boot: Spring Security 6 Resource Server decodes the JWT header to get the `kid`, downloads the matching public key from the IdP JWKS endpoint (caching it in memory), checks the cryptographic signature, validates timestamps (`exp > now` with clock skew allowance), and asserts `iss` (issuer URI) and `aud` (audience).'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 Resource Server JWT Configuration & Role Converter',
        language: 'java',
        code: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Stateless REST API using Bearer tokens
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/orders/**").hasAuthority("SCOPE_orders.read")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        // Extract scopes (e.g. "SCOPE_read")
        grantedAuthoritiesConverter.setAuthorityPrefix("SCOPE_");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Combine both OAuth2 scopes and custom enterprise roles
            Collection<GrantedAuthority> authorities = grantedAuthoritiesConverter.convert(jwt);
            
            // Custom role extraction from JWT claims (e.g., Okta "groups" or Keycloak "roles")
            List<String> roles = jwt.getClaimAsStringList("roles");
            if (roles != null) {
                roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                    .forEach(authorities::add);
            }
            return authorities;
        });
        return jwtConverter;
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains why PKCE is required for public clients (SPAs / mobile) without client secrets.',
        'Explains the 3 components of a JWT and how RS256 asymmetric signature verification works with JWKS.',
        'Explains Refresh Token Rotation and token revocation mechanics.',
        'Demonstrates Spring Security 6 Resource Server configuration with custom Claim-to-Authority conversion.'
      ],
      juniorOrMidRedFlags: [
        'Suggests using Client Secret in a React or Angular frontend application.',
        'Validates JWT by making a synchronous HTTP call to the Authorization Server on every single incoming API request.',
        'Stores sensitive passwords or PII in unencrypted JWT payload claims.'
      ],
      seniorDifferentiators: [
        'Explains JWKS caching, `kid` (Key ID) rotation, and clock skew tolerance (`exp` / `nbf`).',
        'Discusses the BFF (Backend-For-Frontend) pattern to avoid exposing JWTs to browser JavaScript memory.'
      ],
      followUpQuestions: [
        'How does a resource server handle JWKS public key rotation when the IdP rolls over to a new signing key?',
        'What is the difference between an Access Token (OAuth2) and an ID Token (OIDC)?'
      ]
    },
    tags: ['Security', 'OAuth2', 'JWT', 'PKCE', 'Spring Security', 'OpenID Connect']
  },

  {
    id: 'sec-02',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'OAuth2 / OpenID Connect & JWT Architecture',
    title: 'Enterprise Identity Providers (Okta / Keycloak / Auth0), OpenID Connect (OIDC) & Spring Security 6 Integration',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Centralized Identity Providers (IdP), OIDC SSO login vs Resource Server APIs, OpenID Discovery endpoint, and inter-service token propagation with Spring WebClient.',
    coreConcepts: [
      'Identity Provider (IdP) Role: Centralized authority (Okta, Keycloak, Ping, Auth0) managing user identities, MFA, federation (SAML/OIDC), and token issuance.',
      'OIDC Discovery Protocol: Standard metadata document at `https://idp.company.com/.well-known/openid-configuration` providing endpoints (`authorization_endpoint`, `token_endpoint`, `jwks_uri`, `userinfo_endpoint`).',
      'OIDC ID Token vs OAuth2 Access Token: ID Token is for the client application to display user profile (`name`, `email`, `sub`); Access Token is a Bearer credential intended exclusively for Resource Server APIs.',
      'Inter-Service Token Propagation: When Service A calls Service B on behalf of a user, it forwards the incoming Bearer token (Token Relay) or exchanges it for a downstream token using OAuth 2.0 Token Exchange (RFC 8693) / Client Credentials.'
    ],
    detailedExplanation: [
      'In modern enterprise architectures, Spring Boot applications rarely store user passwords. Instead, they delegate authentication entirely to an IdP like Okta or Keycloak.',
      'Spring Boot 3 / Spring Security 6 simplifies this with `spring.security.oauth2.resourceserver.jwt.issuer-uri=https://company.okta.com/oauth2/default`. Spring automatically queries the `.well-known/openid-configuration` endpoint, locates the JWKS URI, and configures the `JwtDecoder` bean with automatic key rotation.',
      'Downstream Microservice Communication: When microservices communicate internally, they use `OAuth2AuthorizedClientManager` with the Client Credentials flow to automatically manage token acquisition, caching, and refresh.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 Configuration for Okta IdP & Custom Claim Mapping',
        language: 'java',
        code: `@Configuration
@EnableWebSecurity
public class OktaSecurityConfig {

    @Bean
    public SecurityFilterChain resourceServerFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ENTERPRISE_ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(oktaJwtAuthenticationConverter()))
            );

        return http.build();
    }

    /**
     * Converts Okta "groups" claim array into Spring Security GrantedAuthorities
     */
    private Converter<Jwt, ? extends AbstractAuthenticationToken> oktaJwtAuthenticationConverter() {
        return jwt -> {
            // Extract Okta user groups (e.g. ["Enterprise_Admin", "Billing_User"])
            List<String> oktaGroups = jwt.getClaimAsStringList("groups");
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            if (oktaGroups != null) {
                authorities = oktaGroups.stream()
                    .map(group -> new SimpleGrantedAuthority("ROLE_" + group.toUpperCase().replace(" ", "_")))
                    .collect(Collectors.toList());
            }

            // sub claim is the unique Okta User ID
            String principalClaimValue = jwt.getClaimAsString("sub");
            return new JwtAuthenticationToken(jwt, authorities, principalClaimValue);
        };
    }
}`
      },
      {
        title: 'Inter-Service Token Propagation with Spring WebClient & OAuth2 Client Manager',
        language: 'java',
        code: `@Configuration
public class WebClientOauthConfig {

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientRepository authorizedClientRepository) {

        OAuth2AuthorizedClientProvider authorizedClientProvider =
                OAuth2AuthorizedClientProviderBuilder.builder()
                        .clientCredentials()
                        .build();

        DefaultOAuth2AuthorizedClientManager authorizedClientManager =
                new DefaultOAuth2AuthorizedClientManager(clientRegistrationRepository, authorizedClientRepository);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }

    @Bean
    public WebClient billingWebClient(OAuth2AuthorizedClientManager authorizedClientManager) {
        ServletOAuth2AuthorizedClientExchangeFilterFunction oauth2Filter =
                new ServletOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
        // Automatically injects client_credentials Bearer token for client registration "okta-m2m"
        oauth2Filter.setDefaultClientRegistrationId("okta-m2m");

        return WebClient.builder()
                .baseUrl("https://billing-service.internal/api")
                .apply(oauth2Filter.oauth2Configuration())
                .build();
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the centralized role of an IdP (Okta / Keycloak) in enterprise SSO and security.',
        'Explains OpenID Connect Discovery (`/.well-known/openid-configuration`) and JWKS endpoint interactions.',
        'Differentiates ID Tokens (user identity for UI) from Access Tokens (authorization bearer tokens for APIs).',
        'Demonstrates how to propagate or acquire tokens for inter-service microservice calls using Spring WebClient.'
      ],
      juniorOrMidRedFlags: [
        'Thinks Spring Boot should validate user credentials directly against Okta database.',
        'Sends ID Token in the `Authorization: Bearer` header to Resource Servers instead of Access Token.'
      ],
      seniorDifferentiators: [
        'Explains Multi-Tenant IdP configuration (dynamically resolving JWKS based on JWT `iss` issuer claim).',
        'Discusses RFC 8693 OAuth 2.0 Token Exchange for secure delegation between chained microservices.'
      ],
      followUpQuestions: [
        'How do you configure a Multi-Tenant Spring Boot Resource Server that validates tokens from both Okta and Keycloak?',
        'How do you prevent token forwarding vulnerabilities (confused deputy problem) in a deep microservice call chain?'
      ]
    },
    tags: ['Okta', 'Keycloak', 'IdP', 'OIDC', 'OAuth2', 'Spring Security', 'WebClient']
  },

  {
    id: 'sec-03',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'OAuth2 / OpenID Connect & JWT Architecture',
    title: 'Stateless JWTs vs Stateful Sessions, Token Revocation Strategies & The BFF Pattern',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Evaluating stateless JWTs vs stateful sessions, handling instant token revocation in distributed architectures, Redis denylists, and the Backend-For-Frontend (BFF) pattern for securing SPAs.',
    coreConcepts: [
      'Stateless JWT Scalability: No shared database lookups required on resource servers; fast cryptographic validation.',
      'The Token Revocation Problem: Because JWTs are self-contained and stateless, an issued JWT remains valid until its `exp` time, even if the user logs out, changes passwords, or is terminated.',
      'Token Revocation Solutions: 1) Short-Lived Access Tokens (5-10 min) + Refresh Token Rotation, 2) Redis Token Denylist/Blacklist (stores revoked `jti` IDs with TTL matching token expiration), 3) User Token Epoch / Versioning, 4) OIDC Backchannel Logout.',
      'BFF (Backend-For-Frontend) Pattern: Single-Page Apps (React/Angular) never hold raw JWTs in browser memory/localStorage (preventing XSS theft). The browser communicates with a server-side BFF via encrypted, `HttpOnly`, `SameSite=Strict`, `Secure` cookies. The BFF securely attaches the Bearer JWT when proxying requests to downstream microservices.'
    ],
    detailedExplanation: [
      'Storing JWTs in `localStorage` or `sessionStorage` makes them vulnerable to any Cross-Site Scripting (XSS) vulnerability on the page. An attacker can run `localStorage.getItem("token")` and exfiltrate the token.',
      'The BFF Architecture decouples frontend web clients from raw OAuth token management. The BFF handles the Authorization Code + PKCE exchange server-side, encrypts tokens inside an HttpOnly session cookie, and acts as a security reverse proxy for API requests.',
      'Redis Denylist Trade-off: While checking a Redis blacklist for every request introduces a remote network lookup (partially defeating "pure statelessness"), checking a fast in-memory Redis cluster with pipeline lookups takes <0.5ms and enables instant global logout.'
    ],
    codeExamples: [
      {
        title: 'Spring Security Redis Token Denylist Filter',
        language: 'java',
        code: `@Component
@RequiredArgsConstructor
public class JwtRevocationFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            String jti = jwt.getId(); // JWT ID claim

            if (jti != null) {
                // Check if JWT ID exists in Redis denylist
                Boolean isRevoked = redisTemplate.hasKey("revoked_tokens:" + jti);
                if (Boolean.TRUE.equals(isRevoked)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Token has been revoked\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}`
      },
      {
        title: 'Spring Cloud Gateway BFF Token Relay Configuration',
        language: 'yaml',
        code: `# application.yml for Spring Cloud Gateway as BFF
spring:
  cloud:
    gateway:
      routes:
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            # Replaces browser session cookie with upstream Bearer JWT token
            - TokenRelay=
            - RemoveRequestHeader=Cookie
  security:
    oauth2:
      client:
        registration:
          okta:
            client-id: \${OKTA_CLIENT_ID}
            client-secret: \${OKTA_CLIENT_SECRET}
            scope: openid,profile,email,orders.read
        provider:
          okta:
            issuer-uri: https://company.okta.com/oauth2/default`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the architectural trade-offs between stateless JWTs and stateful session storage.',
        'Explains 3 distinct strategies for revoking stateless JWTs (Short TTL + RTR, Redis Denylist with `jti`, Token Versioning).',
        'Explains the Backend-For-Frontend (BFF) pattern and why storing tokens in browser localStorage is an XSS vulnerability risk.',
        'Explains how Spring Cloud Gateway acts as a BFF with `TokenRelay`.'
      ],
      juniorOrMidRedFlags: [
        'Believes JWTs are completely unrevocable until expiration without any workarounds.',
        'Recommends storing sensitive JWT tokens in browser localStorage for banking or enterprise applications.'
      ],
      seniorDifferentiators: [
        'Explains OIDC Backchannel Logout (RFC draft / OIDC standard) where IdP pushes logout tokens to application backends.',
        'Discusses User Token Version / Epoch counters in user profile tables for bulk session invalidation on password resets.'
      ],
      followUpQuestions: [
        'How does the BFF pattern handle server-sent events (SSE) or WebSockets when session cookies are used?',
        'If a Redis denylist cluster fails, should the security filter fail-open (allow traffic) or fail-closed (block traffic)?'
      ]
    },
    tags: ['Security', 'JWT', 'Token Revocation', 'BFF', 'Redis', 'Spring Cloud Gateway']
  },

  {
    id: 'ms-01',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Distributed Transactions & SAGA Pattern',
    title: 'SAGA Pattern (Choreography vs Orchestration) & Outbox Pattern for Reliable Messaging',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Handling eventual consistency across distributed databases without 2-phase commit (2PC), compensating transactions, and atomic event publishing via Transactional Outbox.',
    coreConcepts: [
      '2-Phase Commit (2PC / XA) is an anti-pattern in cloud microservices due to coordinator single-point-of-failure, high network latency, and prolonged lock holding.',
      'SAGA Choreography: Services listen to domain events and publish next events autonomously. Simple, loose coupling, but hard to trace and risk of cyclic event storms.',
      'SAGA Orchestration: A centralized orchestrator (state machine / Temporal / Camunda) coordinates steps and explicitly dispatches compensating transactions on failure.',
      'Transactional Outbox Pattern: Saves the domain entity AND the outbound event payload in the SAME local database transaction (in an `outbox_events` table). A Debezium CDC (Change Data Capture) or Polling Publisher reads the table and publishes to Kafka with at-least-once guarantee.'
    ],
    detailedExplanation: [
      'Dual-write problem: If a service writes to PostgreSQL and then makes a network call to Kafka, a network timeout or crash creates inconsistent state.',
      'The Transactional Outbox pattern guarantees atomicity by utilizing the local ACID transaction of the database.',
      'Compensating transactions must be idempotent because retry mechanisms in event systems may deliver messages more than once.'
    ],
    codeExamples: [
      {
        title: 'Transactional Outbox Entity & Repository Pattern',
        language: 'java',
        code: `@Entity
@Table(name = "outbox_events")
public class OutboxEvent {
    @Id
    private UUID id = UUID.randomUUID();
    
    @Column(nullable = false)
    private String aggregateType; // e.g. "Order"
    
    @Column(nullable = false)
    private String aggregateId;
    
    @Column(nullable = false)
    private String eventType; // e.g. "OrderCreatedEvent"
    
    @Lob
    @Column(nullable = false)
    private String payloadJson;
    
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    
    private boolean processed = false;
}

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Order createOrder(CreateOrderRequest req) throws Exception {
        Order order = orderRepository.save(new Order(req));
        
        OutboxEvent event = new OutboxEvent();
        event.setAggregateType("Order");
        event.setAggregateId(order.getId().toString());
        event.setEventType("OrderCreated");
        event.setPayloadJson(objectMapper.writeValueAsString(new OrderCreatedEvent(order)));
        
        outboxRepository.save(event); // ATOMIC within the SAME local DB transaction!
        return order;
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains why 2PC/XA does not scale in microservices (blocking locks, coordinator bottleneck).',
        'Differentiates Choreography vs Orchestration with trade-offs.',
        'Explains the Dual-Write problem and solves it with Transactional Outbox + CDC (Debezium) or Idempotent Consumer.',
        'Emphasizes that compensating transactions MUST be idempotent.'
      ],
      juniorOrMidRedFlags: [
        'Suggests distributed 2PC / XA transactions across REST APIs.',
        'Believes publishing to Kafka immediately after db.save() in a try-catch is safe from inconsistencies.',
        'Cannot explain how to handle network timeouts during compensation.'
      ],
      seniorDifferentiators: [
        'Explains Debezium CDC reading WAL (Write-Ahead Log) vs scheduled DB polling.',
        'Discusses deduplication strategies on consumer side using message UUIDs in Redis/DB.'
      ],
      followUpQuestions: [
        'How does a consumer achieve exactly-once processing semantics when Kafka only guarantees at-least-once?',
        'If the compensating transaction itself fails, what is the recovery protocol?'
      ]
    },
    tags: ['Microservices', 'SAGA', 'Transactional Outbox', 'Kafka', 'Distributed Systems']
  },

  {
    id: 'ms-02',
    category: 'microservices-security',
    categoryName: 'Microservices & Security',
    topic: 'Resiliency & Fault Tolerance',
    title: 'Circuit Breaker Pattern (Resilience4j), Retries & Bulkheads',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Protecting microservices from cascading failures using Circuit Breakers, Retry mechanisms, and Bulkheads with Resilience4j.',
    coreConcepts: [
      'Circuit Breaker Pattern: Prevents a service from making calls to a downstream service that is likely to fail, giving the failing service time to recover.',
      'States: CLOSED (normal, calls go through), OPEN (calls blocked, fail fast), HALF_OPEN (probing to see if downstream is healthy).',
      'Fallback Method: A default response provided when the circuit is open or a call fails, ensuring graceful degradation.',
      'Bulkhead Pattern: Isolates resources (thread pools/semaphores) for different downstream calls so that one slow downstream service doesn\'t exhaust the entire service\'s threads.'
    ],
    detailedExplanation: [
      'In a microservice architecture, a slow dependency is often worse than a dead one. If Service A calls a slow Service B, Service A\'s threads will block, eventually causing Service A to crash and cascading the failure upstream.',
      'The Circuit Breaker tracks failure rates and slow call rates. Once a threshold is breached, it trips OPEN, immediately rejecting new calls and returning fallbacks.',
      'Resilience4j has largely replaced Netflix Hystrix as the modern standard for Spring Boot 2/3 applications.'
    ],
    codeExamples: [
      {
        title: 'Spring Boot 3 + Resilience4j Circuit Breaker',
        language: 'java',
        code: `@Service
public class InventoryClient {

    private final RestTemplate restTemplate;

    public InventoryClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Wrap call with Circuit Breaker and Retry
    @CircuitBreaker(name = "inventoryService", fallbackMethod = "fallbackInventory")
    @Retry(name = "inventoryService")
    public InventoryResponse getInventory(String productId) {
        return restTemplate.getForObject("http://inventory-service/api/inventory/" + productId, 
                                          InventoryResponse.class);
    }

    // Fallback must have same signature plus the Exception parameter
    public InventoryResponse fallbackInventory(String productId, Throwable throwable) {
        log.error("Inventory service failed. Serving cached/default data. Reason: {}", throwable.getMessage());
        return new InventoryResponse(productId, 0, false);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the three states of a Circuit Breaker (Closed, Open, Half-Open).',
        'Identifies the problem it solves (cascading failures, thread pool exhaustion due to slow downstream services).',
        'Understands how to implement a graceful fallback method.',
        'Mentions modern tools like Resilience4j over deprecated Netflix Hystrix.'
      ],
      juniorOrMidRedFlags: [
        'Thinks Circuit Breaker restarts the application.',
        'Implements retry without exponential backoff or without a limit, risking a DDoS on the downstream service.',
        'Does not know how a Circuit Breaker transitions from Open back to Closed (via Half-Open probes).'
      ],
      seniorDifferentiators: [
        'Explains the difference between a time-based sliding window and count-based sliding window for calculating failure rates.',
        'Discusses the combination of Bulkheads (thread pool isolation) with Circuit Breakers.'
      ],
      followUpQuestions: [
        'If a downstream service returns a 400 Bad Request, should that count as a failure that trips the Circuit Breaker?',
        'How does the Half-Open state work?'
      ]
    },
    tags: ['Resilience', 'Circuit Breaker', 'Microservices', 'Resilience4j', 'Fault Tolerance']
  }
];
