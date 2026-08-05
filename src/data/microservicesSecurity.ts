import { QuestionItem } from '../types';

export const microservicesSecurityQuestions: QuestionItem[] = [
  {
    id: 'ms-01',
    category: 'microservices-security',
    categoryName: 'Microservices & Enterprise Security',
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
}`,
        output: `// Debezium Kafka Connect or Spring Scheduled Poller then reads 'outbox_events' 
// and publishes reliably to Kafka topic 'order-events' with 0 risk of phantom dual-writes.`
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
    id: 'sec-01',
    category: 'microservices-security',
    categoryName: 'Microservices & Enterprise Security',
    topic: 'OAuth2 / OpenID Connect & JWT Architecture',
    title: 'OAuth2.0 Grant Types (Authorization Code with PKCE vs Client Credentials) & JWT Verification',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Mechanics of Authorization Code Flow with PKCE for single-page/mobile apps, Client Credentials for machine-to-machine, and stateless cryptographic JWT signature validation using JWKS.',
    coreConcepts: [
      'Authorization Code + PKCE (Proof Key for Code Exchange): Prevents authorization code interception attack in public clients (SPAs / mobile) without sharing client secrets.',
      'Client Credentials Grant: Machine-to-machine (M2M) communication where the service itself authenticates via client_id and client_secret.',
      'JSON Web Token (JWT) Structure: Header (alg, typ, kid), Payload (claims: sub, iss, aud, exp, iat, roles), Signature (cryptographic hash).',
      'JWKS (JSON Web Key Set): Endpoint exposed by Identity Provider (Keycloak, Okta, Auth0) publishing public keys for signature verification with automatic key rotation.'
    ],
    detailedExplanation: [
      'Resource Servers (Spring Boot APIs) do NOT need to contact the Identity Provider for every request; they cache the public keys from `/.well-known/jwks.json` to verify the RSA/EC signature statelessly.',
      'Token Revocation Challenge: Because JWTs are stateless, immediate revocation requires maintaining a distributed blacklist (Redis token denylist) or using short-lived access tokens (5-15 mins) paired with refresh token rotation.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 / Spring Boot 3 Resource Server JWT Configuration',
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
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );

        return http.build();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtConverter;
    }
}`,
        output: `// Decodes and validates JWT signature via issuer JWKS endpoint automatically:
// spring.security.oauth2.resourceserver.jwt.issuer-uri=https://auth.company.com/realms/enterprise`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains why PKCE is required for SPAs/mobile apps (protects code against interception without secret).',
        'Explains the 3 parts of a JWT and how signature validation works with asymmetric keys (JWKS).',
        'Addresses the token revocation trade-off (stateless vs Redis denylist / short expiry).',
        'Explains Spring Security 6 Resource Server configuration.'
      ],
      juniorOrMidRedFlags: [
        'Confuses OAuth2 (Authorization framework) with OpenID Connect (Authentication layer with ID Token).',
        'Stores sensitive data like passwords or PII in unencrypted JWT payload.',
        'Validates JWT by calling the Auth Server on every single HTTP request.'
      ],
      seniorDifferentiators: [
        'Mentions JWKS caching, `kid` (Key ID) matching, and key rotation handling.',
        'Discusses BFF (Backend For Frontend) pattern for secure cookie-based token handling in browser apps.'
      ],
      followUpQuestions: [
        'What is the Backend For Frontend (BFF) pattern and how does it protect SPA tokens from XSS?',
        'How do you handle clock skew when validating JWT `exp` (expiration) and `nbf` (not before) claims?'
      ]
    },
    tags: ['Security', 'OAuth2', 'JWT', 'Spring Security', 'OpenID Connect']
  },
  {
    id: 'ms-02',
    category: 'microservices-security',
    categoryName: 'Microservices & Enterprise Security',
    topic: 'Resiliency & Fault Tolerance',
    title: 'Circuit Breaker Pattern (Resilience4j) & Bulkheads',
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
        code: `import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;

@Service
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
        // Log the error concisely
        System.err.println("Inventory service failed. Serving cached/default data. Reason: " + throwable.getMessage());
        
        // Return default/cached response for graceful degradation
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
        'Discusses the combination of Bulkheads (thread pool isolation) with Circuit Breakers.',
        'Discusses ignoring certain client exceptions (like 404 Not Found) so they don\'t count towards the failure rate threshold.'
      ],
      followUpQuestions: [
        'If a downstream service returns a 400 Bad Request, should that count as a failure that trips the Circuit Breaker?',
        'How does the Half-Open state work?'
      ]
    },
    tags: ['Resilience', 'Circuit Breaker', 'Microservices', 'Resilience4j', 'Fault Tolerance']
  }
];
