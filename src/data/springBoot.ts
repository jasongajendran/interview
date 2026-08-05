import { QuestionItem } from '../types';

export const springBootQuestions: QuestionItem[] = [
  {
    id: 'spring-01',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Bean Lifecycle & Internals',
    title: 'Spring Bean Lifecycle Phases, Extension Points & Circular Dependency Handling',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Detailed progression from BeanDefinition creation, instantiation, dependency injection, BeanPostProcessor hooks, initialization callbacks, to destruction, and changes in Spring Boot 3.',
    coreConcepts: [
      'Instantiation -> Populate Properties -> Aware Callbacks (BeanNameAware, BeanFactoryAware) -> BeanPostProcessor.postProcessBeforeInitialization -> @PostConstruct / InitializingBean.afterPropertiesSet -> custom init-method -> BeanPostProcessor.postProcessAfterInitialization (AOP proxy creation) -> Ready for Use -> @PreDestroy / DisposableBean -> custom destroy-method.',
      'Circular dependency auto-resolution via three-level cache in DefaultSingletonBeanRegistry was disabled by default in Spring Boot 2.6+ / 3.x (spring.main.allow-circular-references=false) to promote cleaner decoupling.',
      'AOP Proxies (CGLIB / Dynamic Proxies) are wrapped around the bean in BeanPostProcessor.postProcessAfterInitialization.'
    ],
    detailedExplanation: [
      'Spring manages singleton beans through three caches: singletonObjects (level 1: fully initialized), earlySingletonObjects (level 2: early references for circular resolution), and singletonFactories (level 3: ObjectFactory).',
      'In Spring Boot 3.x, constructor injection is the industry standard. Constructor circular dependencies fail immediately with BeanCurrentlyInCreationException.',
      'Custom logic should hook into BeanPostProcessor for cross-cutting modifications or ApplicationListener<ContextRefreshedEvent> for post-startup tasks.'
    ],
    codeExamples: [
      {
        title: 'Spring Bean Lifecycle Demonstration Component',
        language: 'java',
        code: `import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

@Component
public class LifecycleManagedService implements BeanNameAware, InitializingBean, DisposableBean {

    private String beanName;

    public LifecycleManagedService() {
        System.out.println("1. [INSTANTIATION] Constructor invoked");
    }

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("2. [AWARE CALLBACK] BeanNameAware.setBeanName: " + name);
    }

    @PostConstruct
    public void postConstructAnnotation() {
        System.out.println("3. [INITIALIZATION] @PostConstruct method executed");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("4. [INITIALIZATION] InitializingBean.afterPropertiesSet executed");
    }

    public void processBusinessLogic() {
        System.out.println("5. [IN SERVICE] Bean is handling requests");
    }

    @PreDestroy
    public void preDestroyAnnotation() {
        System.out.println("6. [DESTRUCTION] @PreDestroy method executed");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("7. [DESTRUCTION] DisposableBean.destroy executed");
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Recites the core stages in order: Instantiation, DI, Aware interfaces, BPP before-init, @PostConstruct/InitializingBean, BPP after-init (AOP proxying), Destruction.',
        'Explains how Spring AOP proxies are created during postProcessAfterInitialization.',
        'Explains why circular dependencies are disabled by default in Spring Boot 3.x and why constructor injection is preferred.'
      ],
      juniorOrMidRedFlags: [
        'Cannot distinguish @PostConstruct from constructor.',
        'Thinks @Autowired field injection is better than constructor injection.',
        'Unaware of BeanPostProcessor.'
      ],
      seniorDifferentiators: [
        'Explains the 3-level cache in DefaultSingletonBeanRegistry.',
        'Explains how Lazy initialization and @Lazy resolve unavoidable circular references if architectural redesign is deferred.'
      ],
      followUpQuestions: [
        'Why does calling a method annotated with @Transactional from another method within the same bean fail to open a transaction?'
      ]
    },
    tags: ['Spring Boot 3', 'Bean Lifecycle', 'Spring Core', 'AOP', 'Architecture']
  },
  {
    id: 'spring-02',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Security & Authentication',
    title: 'Spring Security 6 (Spring Boot 3.x) & Stateless JWT Architecture',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Configuring SecurityFilterChain bean without deprecated WebSecurityConfigurerAdapter, JWT Authentication Filter, CORS, CSRF disablement for REST, and method-level @PreAuthorize.',
    coreConcepts: [
      'Spring Security 6 completely removed WebSecurityConfigurerAdapter; security is now configured via a @Bean SecurityFilterChain.',
      'Stateless REST APIs must configure SessionCreationPolicy.STATELESS and disable CSRF (as JWT in Authorization Bearer headers is immune to cross-site cookie forgery).',
      'Custom OncePerRequestFilter validates the JWT, extracts claims, creates UsernamePasswordAuthenticationToken, and sets it in SecurityContextHolder.'
    ],
    detailedExplanation: [
      'Incoming HTTP request hits DelegatingFilterProxy -> FilterChainProxy -> Custom JwtAuthenticationFilter.',
      'Token is parsed via SecretKey / RSA PublicKey. If valid, UserDetails or Claims are loaded into SecurityContextHolder.getContext().setAuthentication(auth).',
      'Method security is enabled via @EnableMethodSecurity (replaces @EnableGlobalMethodSecurity) to enforce RBAC via @PreAuthorize("hasRole(\'ADMIN\')") or SpEL.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 SecurityFilterChain and JWT Filter',
        language: 'java',
        code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Safe for stateless JWT bearer tokens
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Writes modern Spring Security 6 lambda DSL using SecurityFilterChain.',
        'Explains why CSRF is disabled for stateless JWT token APIs.',
        'Explains OncePerRequestFilter and SecurityContextHolder mechanics.',
        'Mentions @EnableMethodSecurity replacing @EnableGlobalMethodSecurity.'
      ],
      juniorOrMidRedFlags: [
        'Extends deprecated WebSecurityConfigurerAdapter.',
        'Stores JWTs in HTTP sessions defeating the purpose of stateless architecture.'
      ],
      seniorDifferentiators: [
        'Explains asymmetric RSA key signing (RS256) vs symmetric HMAC (HS256) for multi-service microservice architectures.',
        'Explains token revocation strategies (Redis blocklist, short-lived access token + rotating refresh tokens).'
      ],
      followUpQuestions: [
        'How do you propagate SecurityContext across child threads when using @Async or parallel streams?'
      ]
    },
    tags: ['Spring Security 6', 'JWT', 'Spring Boot 3', 'OAuth2', 'RBAC']
  },
  {
    id: 'spring-03',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Exception Handling',
    title: 'Global Exception Handling with @RestControllerAdvice & RFC 7807 ProblemDetail in Spring Boot 3',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Standardized REST API error payloads using RFC 7807 ProblemDetail, @ExceptionHandler, validation constraint handling, and hiding internal stack traces from clients.',
    coreConcepts: [
      'Spring Boot 3.x natively adopts RFC 7807 Specification (Problem Details for HTTP APIs) through the ProblemDetail class.',
      '@RestControllerAdvice acts as an AOP interceptor around all @RequestMapping methods to catch exceptions globally.',
      'Custom application exceptions (e.g. ResourceNotFoundException, InsufficientFundsException) are mapped to appropriate HTTP status codes (404, 400, 409, 422).'
    ],
    detailedExplanation: [
      'RFC 7807 standardizes error responses with fields: type (URI), title (short summary), status (HTTP code), detail (explanation), instance (URI), and custom properties.',
      'MethodArgumentNotValidException is intercepted to collect validation errors from @Valid / @NotNull / @Size annotations into structured field error lists.'
    ],
    codeExamples: [
      {
        title: 'Spring Boot 3 RFC 7807 Global Exception Handler',
        language: 'java',
        code: `import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class GlobalApiExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, 
            ex.getMessage()
        );
        problem.setTitle("Resource Not Found");
        problem.setType(URI.create("https://api.company.com/errors/not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, 
            "Request validation failed"
        );
        problem.setTitle("Validation Error");

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        problem.setProperty("invalidFields", fieldErrors);
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Mentions @RestControllerAdvice and @ExceptionHandler.',
        'Highlights Spring Boot 3.x adoption of RFC 7807 ProblemDetail standard.',
        'Demonstrates how validation errors (MethodArgumentNotValidException) are transformed into readable field maps.',
        'Emphasizes never leaking internal database stack traces (SQL errors) to external clients.'
      ],
      juniorOrMidRedFlags: [
        'Catches exceptions inside every controller method using try-catch blocks.',
        'Returns HTTP 200 with an error flag inside the body.'
      ],
      seniorDifferentiators: [
        'Explains ResponseEntityExceptionHandler base class extension for overriding default Spring MVC exception handlers.'
      ],
      followUpQuestions: [
        'How do you include a unique correlation/trace ID in the ProblemDetail for distributed observability?'
      ]
    },
    tags: ['Exception Handling', 'REST API', 'RFC 7807', 'Spring Boot 3']
  },
  {
    id: 'spring-04',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Caching & Performance',
    title: 'Spring Cache Abstraction, Redis Integration, and Cache Stampede Mitigation',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Hard',
    summary: '@Cacheable, @CachePut, @CacheEvict semantics, key generation SpEL, TTL policies, and architectural strategies against cache stampede / penetration.',
    coreConcepts: [
      '@Cacheable: Checks cache first. If found, returns cached value without executing method; if missing, executes method and populates cache.',
      '@CachePut: Always executes the method and updates the cache with the method result.',
      '@CacheEvict: Removes one or all entries from the cache (e.g. allEntries = true) upon record deletion/update.',
      'Cache Stampede / Thundering Herd: When a popular key expires, thousands of concurrent requests hit the database simultaneously. Mitigated via sync = true, distributed locks, or probabilistic early expiration.'
    ],
    detailedExplanation: [
      'Spring Cache operates via AOP interceptors around bean methods. Self-invocation (calling a @Cacheable method from within the same class) bypasses the proxy and will NOT hit the cache.',
      'RedisCacheManager allows configuring per-cache TTL (Time-To-Live), key prefixes, and serialization strategies (e.g. GenericJackson2JsonRedisSerializer).'
    ],
    codeExamples: [
      {
        title: 'Spring Caching with Sync Lock and Cache Eviction',
        language: 'java',
        code: `import org.springframework.cache.annotation.*;
import org.springframework.stereotype.Service;

@Service
@CacheConfig(cacheNames = "users")
public class UserAccountService {

    private final UserRepository userRepository;

    public UserAccountService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // sync = true locks the key locally to prevent Cache Stampede
    @Cacheable(key = "#id", sync = true, unless = "#result == null")
    public UserDto getUserById(Long id) {
        System.out.println(">> Cache Miss: Fetching user from Database for ID: " + id);
        return userRepository.findById(id).map(UserDto::fromEntity).orElse(null);
    }

    @CachePut(key = "#dto.id")
    public UserDto updateUser(UserDto dto) {
        System.out.println(">> Updating Database & Refreshing Cache for ID: " + dto.getId());
        return userRepository.save(dto.toEntity());
    }

    @CacheEvict(key = "#id")
    public void deleteUser(Long id) {
        System.out.println(">> Evicting from Cache & Deleting ID: " + id);
        userRepository.deleteById(id);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates @Cacheable, @CachePut, and @CacheEvict clearly.',
        'Explains proxy self-invocation limitation in Spring AOP caching.',
        'Explains Cache Stampede and how sync = true or distributed locks prevent database crashes.',
        'Mentions Redis serializer configuration.'
      ],
      juniorOrMidRedFlags: [
        'Confuses @Cacheable with @CachePut.',
        'Unaware that calling a cached method internally from the same class does not trigger the cache.'
      ],
      seniorDifferentiators: [
        'Explains multi-tier caching (L1 in-memory Caffeine cache + L2 distributed Redis cache) with Redis Pub/Sub invalidation.'
      ],
      followUpQuestions: [
        'How do you protect your database from Cache Penetration (queries for non-existent IDs)?'
      ]
    },
    tags: ['Caching', 'Redis', 'Spring Boot', 'Performance', 'Cache Stampede']
  },
  {
    id: 'spring-05',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Testing & Mocking',
    title: '@WebMvcTest vs @SpringBootTest vs @DataJpaTest (Spring Slice Testing)',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Optimizing test suite execution time by using focused slice tests instead of heavy full-context SpringBootTest.',
    coreConcepts: [
      '@SpringBootTest: Boots the full ApplicationContext with all beans, databases, security, and message listeners. Slowest, best for end-to-end integration tests.',
      '@WebMvcTest: Slices only the web layer (Controllers, @ControllerAdvice, Filters, MockMvc). Service and Repository beans must be mocked with @MockBean.',
      '@DataJpaTest: Slices only JPA repositories, entities, and DataSource (often auto-configures in-memory H2/Testcontainers), disabling regular @Service and @Controller beans.'
    ],
    detailedExplanation: [
      'Booting @SpringBootTest for every unit test degrades CI pipeline speed to dozens of minutes.',
      'Slice testing loads only a targeted subset of beans in memory, executing in milliseconds while validating HTTP status codes, JSON serialization, and JPA query mappings.'
    ],
    codeExamples: [
      {
        title: '@WebMvcTest Slice Testing with MockMvc and @MockBean',
        language: 'java',
        code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class) // Only loads web MVC layer
public class UserControllerSliceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUserPayload() throws Exception {
        given(userService.findById(42L))
            .willReturn(new UserDto(42L, "alex_dev", "alex@company.com"));

        mockMvc.perform(get("/api/v1/users/42").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(42))
            .andExpect(jsonPath("$.username").value("alex_dev"))
            .andExpect(jsonPath("$.email").value("alex@company.com"));
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Contrasts full context test (@SpringBootTest) vs web slice (@WebMvcTest) vs repository slice (@DataJpaTest).',
        'Explains why slice tests dramatically reduce CI build execution time.',
        'Explains how @MockBean / @MockitoBean replaces real beans in the slice context.'
      ],
      juniorOrMidRedFlags: [
        'Uses @SpringBootTest on every single test file.',
        'Does not know MockMvc.'
      ],
      seniorDifferentiators: [
        'Mentions Spring Boot 3.4 @MockitoBean replacing deprecated @MockBean.',
        'Mentions Testcontainers integration via @ServiceConnection in Spring Boot 3.1+.'
      ],
      followUpQuestions: [
        'How does Spring context caching work across different test classes with identical vs distinct @MockBean configurations?'
      ]
    },
    tags: ['Testing', 'WebMvcTest', 'SpringBootTest', 'DataJpaTest', 'Spring Boot 3']
  },
  {
    id: 'spring-06',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Fault Tolerance & Resilience',
    title: 'Resilience4j Circuit Breaker, Retry & RateLimiter in Spring Boot 3',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Circuit breaker state transitions (CLOSED, OPEN, HALF_OPEN), sliding window failure rates, fallback methods, and bulkheads.',
    coreConcepts: [
      'CLOSED: Requests pass through normally. Metrics (failure rate, slow call rate) are tracked in a sliding window (count-based or time-based).',
      'OPEN: If failure rate exceeds threshold (e.g. 50%), circuit trips to OPEN. All subsequent calls immediately fail fast to fallback without hitting downstream.',
      'HALF_OPEN: After a waitDuration (e.g. 10s), circuit transitions to HALF_OPEN, allowing a trial number of calls to determine if downstream recovered.'
    ],
    detailedExplanation: [
      'Resilience4j replaced legacy Netflix Hystrix. It is lightweight, non-blocking, and built around Vavr functional paradigms.',
      'Fallback methods must match the original method signature plus an additional Throwable parameter, and must reside in the same class.'
    ],
    codeExamples: [
      {
        title: 'Resilience4j Circuit Breaker with Fallback in Spring Boot',
        language: 'java',
        code: `import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentGatewayClient {

    @CircuitBreaker(name = "paymentService", fallbackMethod = "processPaymentFallback")
    @Retry(name = "paymentService")
    public PaymentResponse processTransaction(PaymentRequest request) {
        System.out.println(">> Invoking Remote Payment Gateway via HTTP...");
        // Remote REST call that may timeout or throw 503
        return restTemplate.postForObject("https://payments.partner.com/charge", request, PaymentResponse.class);
    }

    // Fallback executed when Circuit is OPEN or call fails
    public PaymentResponse processPaymentFallback(PaymentRequest request, Throwable ex) {
        System.err.println(">> [CIRCUIT OPEN / FAILED] Executing Fallback: " + ex.getMessage());
        return new PaymentResponse(request.getOrderId(), "QUEUED_FOR_OFFLINE_PROCESSING", "Fallback Queue");
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Draws and explains the 3 states: CLOSED, OPEN, HALF_OPEN.',
        'Explains sliding window evaluation (count-based vs time-based) and slow call threshold.',
        'Explains fallback method requirements (identical parameters + Throwable).',
        'Contrasts Circuit Breaker with RateLimiter and Bulkhead.'
      ],
      juniorOrMidRedFlags: [
        'Believes Circuit Breaker simply retries infinite times.',
        'Cannot explain the HALF_OPEN state.'
      ],
      seniorDifferentiators: [
        'Explains why Hystrix was deprecated in favor of Resilience4j (thread pool saturation vs decorator model).'
      ],
      followUpQuestions: [
        'How does Resilience4j integrate with Spring Boot Actuator and Prometheus for metric monitoring?'
      ]
    },
    tags: ['Resilience4j', 'Circuit Breaker', 'Fault Tolerance', 'Microservices']
  },
  {
    id: 'spring-07',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Modern Concurrency & JVM',
    title: 'Virtual Threads (Project Loom) in Spring Boot 3.2+ & High-Throughput I/O',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Enabling spring.threads.virtual.enabled=true, Virtual Threads vs Platform/Carrier Threads, thread pinning pitfalls with synchronized blocks, and throughput scaling.',
    coreConcepts: [
      'Platform Threads are 1:1 mapped to OS kernel threads, consuming ~1MB stack and limited to thousands per machine.',
      'Virtual Threads (Java 21+) are M:N mapped user-space lightweight threads (~few KB stack) managed by the JVM over a pool of Carrier Threads.',
      'Spring Boot 3.2+ supports Virtual Threads with one configuration property: spring.threads.virtual.enabled=true for Tomcat and @Async.'
    ],
    detailedExplanation: [
      'When a Virtual Thread executes a blocking I/O call (DB query, REST call), the JVM unmounts it from the underlying carrier thread, allowing the carrier thread to serve other virtual threads.',
      'Thread Pinning Issue: If a blocking operation occurs inside a synchronized block or native JNI call, the virtual thread cannot unmount and pins the OS carrier thread. Solution: Replace synchronized with java.util.concurrent.locks.ReentrantLock.'
    ],
    codeExamples: [
      {
        title: 'Virtual Thread Configuration in Spring Boot 3.2+ application.yml',
        language: 'yaml',
        code: `spring:
  threads:
    virtual:
      enabled: true

server:
  tomcat:
    threads:
      # Embedded Tomcat will now dispatch each request to a Virtual Thread!
      max: 200`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the difference between OS platform threads and JVM virtual threads.',
        'Explains non-blocking unmounting on I/O operations.',
        'Highlights the Thread Pinning pitfall (synchronized blocks) and ReentrantLock remedy.',
        'Explains why thread pooling (Executors.newFixedThreadPool) is an anti-pattern for virtual threads (create on demand instead).'
      ],
      juniorOrMidRedFlags: [
        'Believes virtual threads make CPU-intensive computations faster (they only help I/O bound throughput).',
        'Attempts to create a bounded thread pool of virtual threads.'
      ],
      seniorDifferentiators: [
        'Explains ThreadLocal memory retention risks with millions of virtual threads.'
      ],
      followUpQuestions: [
        'How does Virtual Thread adoption affect reactive programming models (WebFlux vs MVC with Loom)?'
      ]
    },
    tags: ['Java 21', 'Virtual Threads', 'Project Loom', 'Spring Boot 3.2', 'Concurrency']
  },
  {
    id: 'spring-02',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'REST API Error Handling',
    title: 'Global Exception Handling with @ControllerAdvice and ProblemDetail',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Standardizing REST API error responses across the application using @RestControllerAdvice, @ExceptionHandler, and the RFC 7807 ProblemDetail specification.',
    coreConcepts: [
      '@RestControllerAdvice acts as an interceptor that surrounds the logic in your Controllers, allowing you to centralize error handling.',
      '@ExceptionHandler maps specific exception classes to specific methods inside the advice.',
      'Spring Boot 3 / Spring 6 introduced native support for RFC 7807 (Problem Details for HTTP APIs) via the ProblemDetail class.',
      'Returning standardized error formats helps client developers handle exceptions uniformly without guessing custom JSON structures.'
    ],
    detailedExplanation: [
      'Instead of putting try-catch blocks in every controller method and returning a custom error DTO, @RestControllerAdvice intercepts exceptions thrown by controllers globally.',
      'With Spring 6, returning `ProblemDetail` is preferred over custom error DTOs. It standardizes fields like type, title, status, detail, and instance.',
      'Validation exceptions (MethodArgumentNotValidException) can also be intercepted here to return a list of field-specific errors.'
    ],
    codeExamples: [
      {
        title: 'Global Error Handler using ProblemDetail (Spring 6)',
        language: 'java',
        code: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        problem.setTitle("Bad Request");
        
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
            
        problem.setProperty("invalid_fields", errors);
        return problem;
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Mentions @RestControllerAdvice and @ExceptionHandler for global handling.',
        'Explains why centralized error handling is better than scattered try-catches (DRY principle).',
        'Knows about Spring 6 RFC 7807 support via ProblemDetail (or uses a structured ErrorResponse DTO).',
        'Explains how to handle bean validation (JSR-380) errors via MethodArgumentNotValidException.'
      ],
      juniorOrMidRedFlags: [
        'Writes try-catch in every single controller method.',
        'Returns HTTP 200 OK with an error message in the JSON body.',
        'Returns internal stack traces to the API client.'
      ],
      seniorDifferentiators: [
        'Discusses overriding ResponseEntityExceptionHandler for more granular control over built-in Spring MVC exceptions.',
        'Mentions logging strategies (logging 500s as ERROR, 4xxs as WARN or INFO).'
      ],
      followUpQuestions: [
        'How do you localize error messages for different languages based on the Accept-Language header?',
        'If two @ExceptionHandler methods match an exception (e.g. RuntimeException and CustomException), which one is invoked?'
      ]
    },
    tags: ['Spring Boot', 'REST API', 'Error Handling', 'RFC 7807']
  },
  {
    id: 'spring-03',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Configuration Management',
    title: 'Externalized Configuration: @Value vs @ConfigurationProperties',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Best practices for managing application configuration, comparing field injection via @Value with strongly-typed @ConfigurationProperties.',
    coreConcepts: [
      '@Value is useful for injecting single configuration properties, but lacks type safety and validation.',
      '@ConfigurationProperties binds hierarchical properties (e.g., yaml/properties files) to strongly-typed POJOs/Records.',
      'Spring Boot provides relaxed binding (e.g., my-app.max-size binds to maxSize).',
      '@ConfigurationProperties supports JSR-380 validation (@NotNull, @Min) to fail-fast on startup if configuration is missing or invalid.'
    ],
    detailedExplanation: [
      'While `@Value("${my.app.timeout}")` is easy, it scatters magic strings across the codebase. If the property is missing and no default is provided, context loading fails.',
      'For complex configurations (like AWS credentials, retry policies), `@ConfigurationProperties` groups them into a cohesive class.',
      'In Spring Boot 3, using Java Records with `@ConfigurationProperties` is fully supported, allowing for immutable, thread-safe configuration objects.'
    ],
    codeExamples: [
      {
        title: 'Type-safe Configuration Properties (Spring Boot 3 Records)',
        language: 'java',
        code: `// application.yml
// app:
//   integration:
//     api-url: https://api.example.com
//     timeout-ms: 5000
//     retries: 3

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Validated
@ConfigurationProperties(prefix = "app.integration")
public record IntegrationProperties(
    @NotBlank String apiUrl,
    @Min(1000) int timeoutMs,
    @Min(1) int retries
) {}

// Usage in Service
@Service
public class IntegrationService {
    private final IntegrationProperties props;

    public IntegrationService(IntegrationProperties props) {
        this.props = props;
    }
    
    public void execute() {
        System.out.println("Calling " + props.apiUrl() + " with timeout " + props.timeoutMs());
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates between @Value for simple strings and @ConfigurationProperties for grouped, hierarchical data.',
        'Explains the benefits of type safety and IDE auto-completion (with spring-boot-configuration-processor).',
        'Mentions using JSR-380 validation (@Validated, @NotNull) to fail-fast during application startup.'
      ],
      juniorOrMidRedFlags: [
        'Hardcodes configuration values in code instead of application.yml.',
        'Uses @Value for injecting dozens of related properties instead of grouping them.',
        'Does not know how to provide a default value in @Value (e.g., @Value("${property:default}"))'
      ],
      seniorDifferentiators: [
        'Discusses using Spring Boot Configuration Processor to generate metadata for IDE autocomplete.',
        'Explains how immutable configurations (Records or @ConstructorBinding) prevent accidental state changes at runtime.'
      ],
      followUpQuestions: [
        'What is the order of precedence for Spring Boot configuration sources (e.g. application.yml vs command-line args vs env vars)?',
        'How would you reload @ConfigurationProperties dynamically without restarting the application?'
      ]
    },
    tags: ['Configuration', 'Spring Boot', 'Best Practices']
  }
];
