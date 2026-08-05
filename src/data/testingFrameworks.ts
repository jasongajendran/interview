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
  }
];
