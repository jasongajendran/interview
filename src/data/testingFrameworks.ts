import { QuestionItem } from '../types';

export const testingFrameworkQuestions: QuestionItem[] = [
  {
    id: 'test-03',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'JUnit',
    title: 'JUnit 4 vs JUnit 5',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Key differences between the legacy JUnit 4 and modern JUnit 5 architectures.',
    coreConcepts: [
      'JUnit 4 is a monolithic library. JUnit 5 is composed of three sub-projects: Platform, Jupiter (new API), and Vintage (runs JUnit 4 tests).',
      'Annotations changed: @Before becomes @BeforeEach, @BeforeClass becomes @BeforeAll, @Ignore becomes @Disabled.',
      'JUnit 5 leverages Java 8 features like lambdas for assertions (e.g., assertThrows, assertAll).'
    ],
    rubric: {
      idealAnswerPoints: [
        'Knows that JUnit 5 requires Java 8+.',
        'Can list annotation changes.',
        'Explains assertThrows vs JUnit 4 @Test(expected=Exception.class).'
      ],
      juniorOrMidRedFlags: [
        'Thinks they are fully incompatible and you must rewrite all tests (Vintage handles this).'
      ],
      seniorDifferentiators: [
        'Explains the JUnit 5 Extension Model (@ExtendWith) which replaces JUnit 4 Rules and Runners.'
      ],
      followUpQuestions: [
        'How do you group assertions in JUnit 5 so that all run even if one fails?'
      ]
    },
    tags: ['JUnit 4', 'JUnit 5', 'Testing']
  },
  {
    id: 'test-04',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'Mockito',
    title: 'Mockito Basics: @Mock vs @InjectMocks',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Understanding how to initialize and inject mocks into a class under test.',
    coreConcepts: [
      '@Mock creates a fake instance (mock) of a class or interface.',
      '@InjectMocks creates an instance of the class under test and injects the @Mock created instances into it.',
      'Mockito.when().thenReturn() is used to define the behavior of the mocked methods.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Clearly distinguishes the object being tested (@InjectMocks) from its dependencies (@Mock).',
        'Knows how to verify interactions using Mockito.verify().'
      ],
      juniorOrMidRedFlags: [
        'Tries to use @Mock on the class that is actually being tested.'
      ],
      seniorDifferentiators: [
        'Explains constructor injection vs field injection when Mockito processes @InjectMocks.'
      ],
      followUpQuestions: [
        'How do you mock a void method in Mockito?'
      ]
    },
    tags: ['Mockito', 'Unit Testing']
  },

  {
    id: 'test-01',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'Mockito Core Internals',
    title: '@Mock vs @Spy vs @InjectMocks & doReturn().when() vs when().thenReturn()',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Differences between dummy stubs and partial mocks, avoiding unintended real method invocations on Spies, and dependency injection mechanics.',
    coreConcepts: [
      '@Mock: Creates a complete proxy mock where every method returns default values (null, 0, false) unless explicitly stubbed.',
      '@Spy: Creates a partial mock wrapping a REAL object. Real methods are executed by default unless explicitly stubbed.',
      '@InjectMocks: Creates an instance of the class under test and injects matching @Mock and @Spy fields via constructor, setter, or reflection.',
      'when(spy.method()).thenReturn(val) CALLS the real method once during stub registration! Use doReturn(val).when(spy).method() to prevent real method invocation.'
    ],
    detailedExplanation: [
      'Calling when(spy.expensiveDbCall()).thenReturn(fakeResult) actually invokes expensiveDbCall() during test setup, which may throw NullPointerException or crash if external resources are uninitialized.',
      'doReturn().when() is mandatory when stubbing methods on spies, void methods (doThrow().when()), or when overriding previous stubbings.'
    ],
    codeExamples: [
      {
        title: 'Mock vs Spy and doReturn vs when.thenReturn Demo',
        language: 'java',
        code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MockitoDeepDiveTest {

    static class PaymentService {
        public String chargeCustomer(String id, double amount) {
            // Real network/DB logic
            System.out.println(">> [REAL METHOD] Charging customer " + id + " $" + amount);
            return "SUCCESS_TXN_999";
        }

        public boolean validateAccount(String id) {
            return id != null && id.startsWith("ACC_");
        }
    }

    @Spy
    private PaymentService spyService;

    @Test
    void testSpyMethodBehavior() {
        // 1. Calling real method on Spy by default
        boolean isValid = spyService.validateAccount("ACC_100");
        assertTrue(isValid); // Real method executed!

        // 2. PITFALL: when().thenReturn() calls real method during stubbing!
        // when(spyService.chargeCustomer("ACC_100", 50.0)).thenReturn("MOCKED_TXN");
        // -> Prints: [REAL METHOD] Charging customer ACC_100 $50.0

        // 3. CORRECT WAY: doReturn().when() does NOT invoke real method!
        doReturn("MOCKED_TXN").when(spyService).chargeCustomer("ACC_100", 50.0);

        String txnId = spyService.chargeCustomer("ACC_100", 50.0);
        assertEquals("MOCKED_TXN", txnId);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates @Mock (full dummy proxy) from @Spy (partial mock wrapping real instance).',
        'Explains why when(spy.method()).thenReturn() triggers the real method during stubbing.',
        'Explains how doReturn().when() safely overrides behavior without executing real method.',
        'Explains @InjectMocks injection order: Constructor -> Setter -> Field reflection.'
      ],
      juniorOrMidRedFlags: [
        'Uses @Mock and @InjectMocks interchangeably.',
        'Does not know why when().thenReturn() threw an exception on a spy.'
      ],
      seniorDifferentiators: [
        'Explains ArgumentCaptor for asserting deep object graph mutations inside mocked method invocations.'
      ],
      followUpQuestions: [
        'How do you mock static methods (e.g. LocalDate.now() or UUID.randomUUID()) using Mockito 3.4+ mockStatic()?'
      ]
    },
    tags: ['JUnit 5', 'Mockito', 'Mock vs Spy', 'Unit Testing', 'doReturn']
  },
  {
    id: 'test-02',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'JUnit 5 Architecture',
    title: 'JUnit 5 Architecture (Platform, Jupiter, Vintage) & Parameterized Tests',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Three-subsystem architecture, @ParameterizedTest, @ValueSource, @CsvSource, @MethodSource, extensions, and lifecycle callbacks.',
    coreConcepts: [
      'JUnit Platform: Foundation for launching testing frameworks on the JVM (IDE & build tool integration runner).',
      'JUnit Jupiter: Modern programming model and extension architecture for writing tests (org.junit.jupiter.api).',
      'JUnit Vintage: Provides backward compatibility for running legacy JUnit 3 and JUnit 4 tests on the modern Platform.',
      '@ParameterizedTest: Allows executing the identical test logic across multiple input datasets.'
    ],
    detailedExplanation: [
      'JUnit 5 replaced JUnit 4 @RunWith(MockitoJUnitRunner.class) and @Rule with a unified, composable Extension API (@ExtendWith(MockitoExtension.class)).',
      '@ParameterizedTest with @CsvSource or @MethodSource enables comprehensive data-driven testing for boundary edge cases (nulls, empty strings, negative balances) in a single test method.'
    ],
    codeExamples: [
      {
        title: 'JUnit 5 Parameterized Test with @CsvSource',
        language: 'java',
        code: `import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class LoanCalculatorTest {

    public double calculateMonthlyInterest(double principal, double annualRate) {
        return (principal * (annualRate / 100.0)) / 12.0;
    }

    @ParameterizedTest(name = "Principal={0}, Rate={1}% => Expected Monthly Interest={2}")
    @CsvSource({
        "100000.0, 6.0, 500.0",
        "200000.0, 3.0, 500.0",
        "50000.0,  12.0, 500.0",
        "0.0,      5.0, 0.0"
    })
    void testMonthlyInterestCalculations(double principal, double rate, double expected) {
        double actual = calculateMonthlyInterest(principal, rate);
        assertEquals(expected, actual, 0.001);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Names the 3 subsystems of JUnit 5: Platform, Jupiter, Vintage.',
        'Demonstrates @ParameterizedTest with @ValueSource / @CsvSource / @MethodSource.',
        'Explains @ExtendWith replacing JUnit 4 @RunWith and @Rule.',
        'Mentions @DisplayName, @Nested, and assertAll() grouped assertions.'
      ],
      juniorOrMidRedFlags: [
        'Mixes JUnit 4 annotations (org.junit.Test) with JUnit 5 (org.junit.jupiter.api.Test).',
        'Does not know how to run parameterized tests.'
      ],
      seniorDifferentiators: [
        'Explains how to write a custom ExecutionCondition extension to disable tests based on environment variables or OS.'
      ],
      followUpQuestions: [
        'What is the benefit of assertAll() over multiple individual assertEquals() statements?'
      ]
    },
    tags: ['JUnit 5', 'Jupiter', 'Parameterized Tests', 'Testing Architecture']
  },
  {
    id: 'test-mockstatic-01',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'Mockito Advanced',
    title: 'Mockito Static Mocking (mockStatic) & @InjectMocks Pitfalls',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Mocking static methods (e.g., UUID.randomUUID(), Instant.now(), System.currentTimeMillis()) using MockedStatic in try-with-resources, and why @InjectMocks fails with constructor vs field injection.',
    coreConcepts: [
      'Mockito 3.4+ introduced `mockStatic()` to mock static methods without requiring PowerMock (which heavily modified bytecodes and broke on newer Java versions).',
      '`MockedStatic<T>` must be scoped in a `try-with-resources` block or explicitly deregistered in an `@AfterEach` teardown method, otherwise the static mock leaks across subsequent test threads and causes cascading test failures.',
      '@InjectMocks attempts constructor injection first, then property/setter, then field reflection. If constructor injection succeeds, field reflection is skipped, leaving remaining `@Mock` fields null!'
    ],
    codeExamples: [
      {
        title: 'Mocking Static UUID and Clock in JUnit 5',
        language: 'java',
        code: `@Test
void testOrderCreationGeneratesDeterministicId() {
    UUID fixedUuid = UUID.fromString("00000000-0000-0000-0000-000000000001");
    Instant fixedInstant = Instant.parse("2026-01-01T12:00:00Z");

    // Scoped static mocking with try-with-resources ensures cleanup!
    try (MockedStatic<UUID> mockedUuid = mockStatic(UUID.class);
         MockedStatic<Instant> mockedInstant = mockStatic(Instant.class, Mockito.CALLS_REAL_METHODS)) {
        
        mockedUuid.when(UUID::randomUUID).thenReturn(fixedUuid);
        mockedInstant.when(Instant::now).thenReturn(fixedInstant);

        Order order = orderService.createOrder("PROD-100", 2);

        assertEquals("00000000-0000-0000-0000-000000000001", order.getOrderId());
        assertEquals(fixedInstant, order.getCreatedAt());
    }
    // Outside try block, UUID.randomUUID() returns normal random UUIDs
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains how to use try-with-resources with MockedStatic to avoid static mock thread leakage.',
        'Explains why PowerMock is obsolete in Java 11/17+ and replaced by mockito-inline / standard Mockito 5.',
        'Explains the precedence of @InjectMocks and why constructor injection is superior for testing.'
      ],
      juniorOrMidRedFlags: [
        'Does not close MockedStatic, causing erratic test failures when tests run concurrently.',
        'Uses PowerMock on modern Java 17+ projects.'
      ],
      seniorDifferentiators: [
        'Explains how to use `Mockito.CALLS_REAL_METHODS` as the default answer for mockStatic to avoid breaking unaffected static helper methods.',
        'Recommends architectural refactoring (e.g. injecting a `java.time.Clock` bean) instead of overuse of static mocking.'
      ],
      followUpQuestions: [
        'How does injecting a Clock bean compare to mocking Instant.now() with mockStatic?'
      ]
    },
    tags: ['Mockito', 'mockStatic', 'Unit Testing', 'JUnit 5', 'Test Isolation']
  },
  {
    id: 'test-testcontainers-01',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'Integration Testing',
    title: 'Testcontainers: Ephemeral Docker Databases vs H2 In-Memory Mocks',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Why in-memory H2 databases hide dialect bugs, JSON/ARRAY column failures, and locking differences, and how to configure Testcontainers with @DynamicPropertySource in Spring Boot 3.',
    coreConcepts: [
      'The H2 In-Memory Trap: H2 uses different SQL syntax, does not support PostgreSQL-specific types (`JSONB`, `UUID[]`, `INET`), and does not replicate row-level locking or MVCC concurrency behavior, creating false confidence in CI pipelines.',
      'Testcontainers automatically starts and manages real, disposable Docker containers (PostgreSQL, Kafka, Redis, LocalStack) during test execution.',
      '`@DynamicPropertySource` dynamically injects the randomly assigned container port and JDBC URL into the Spring Environment before the ApplicationContext starts.'
    ],
    codeExamples: [
      {
        title: 'Spring Boot 3 + PostgreSQL Testcontainer Setup',
        language: 'java',
        code: `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class OrderServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void testPostgresJsonbAndLockingQuery() {
        Order saved = orderRepository.save(new Order("item-1", "{\\"coupon\\":\\"SAVE20\\"}"));
        assertNotNull(saved.getId());
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains why H2 in-memory databases lead to false positives/negatives in integration tests.',
        'Explains the role of @Container, @Testcontainers, and @DynamicPropertySource.',
        'Understands container lifecycle: Static container (shared across test methods in the class) vs Non-static container (fresh container per test method).'
      ],
      juniorOrMidRedFlags: [
        'Relies solely on H2 for verifying complex PostgreSQL JSONB queries or stored procedures.',
        'Hardcodes Docker host port bindings in integration tests, causing port collision failures in CI runners.'
      ],
      seniorDifferentiators: [
        'Explains the Singleton Container Pattern / Ryuk container cleanup to reuse a single database container across all test classes, speeding up test suite execution by 80%.'
      ],
      followUpQuestions: [
        'How does Ryuk ensure container cleanup even if the test JVM crashes abruptly?'
      ]
    },
    tags: ['Testcontainers', 'Integration Testing', 'PostgreSQL', 'Docker', 'Spring Boot 3']
  },
  {
    id: 'test-archunit-01',
    category: 'testing-frameworks',
    categoryName: 'Testing Frameworks (JUnit 5 & Mockito)',
    topic: 'Architecture Governance',
    title: 'ArchUnit: Automated Architecture & Layer Boundary Governance',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Writing automated JUnit tests that enforce clean/hexagonal architecture rules, prevent circular package dependencies, and enforce framework conventions.',
    coreConcepts: [
      'ArchUnit analyzes compiled Java bytecode (`.class` files) to verify package dependencies, layer access rules, and annotation usage without running the full application.',
      'Prevents architecture erosion in large engineering teams (e.g. ensuring Controllers never bypass the Service layer to query Repositories directly).',
      'Enforces domain purity: Domain entity classes must have zero dependencies on web/persistence frameworks (`org.springframework.*`, `jakarta.persistence.*`).'
    ],
    codeExamples: [
      {
        title: 'ArchUnit Layered Architecture Rule Test',
        language: 'java',
        code: `import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(packages = "com.myapp")
public class ArchitectureGovernanceTest {

    @ArchTest
    static final ArchRule layerDependenciesMustBeRespected = layeredArchitecture()
        .consideringAllDependencies()
        .layer("Controller").definedBy("..controller..")
        .layer("Service").definedBy("..service..")
        .layer("Repository").definedBy("..repository..")
        .layer("Domain").definedBy("..domain..")
        
        .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
        .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller", "Service")
        .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service")
        .whereLayer("Domain").mayOnlyBeAccessedByLayers("Controller", "Service", "Repository");
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains what ArchUnit is and how it analyzes bytecode within standard JUnit test runners.',
        'Provides practical examples of architecture rules (layered boundaries, avoiding circular dependencies, naming conventions).',
        'Explains how ArchUnit integrates into CI pipelines to fail builds when developers violate architectural boundaries.'
      ],
      juniorOrMidRedFlags: [
        'Thinks architecture reviews can only be conducted manually during PR reviews.',
        'Never heard of automated architecture unit testing.'
      ],
      seniorDifferentiators: [
        'Explains custom rules (e.g. ensuring all @Transactional methods are public or ensuring all exception classes extend RuntimeException and end with "Exception").',
        'Discusses Onion / Hexagonal architecture testing with ArchUnit.'
      ],
      followUpQuestions: [
        'How do you write an ArchUnit rule that bans `System.out.println` or `e.printStackTrace()` in favor of SLF4J logging?'
      ]
    },
    tags: ['ArchUnit', 'Architecture', 'Governance', 'JUnit 5', 'Clean Architecture']
  }
];
