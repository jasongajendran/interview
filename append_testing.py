import re
with open('src/data/testingFrameworks.ts', 'r') as f:
    content = f.read()

new_content = """  {
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
"""

content = content.replace("export const testingFrameworkQuestions: QuestionItem[] = [", "export const testingFrameworkQuestions: QuestionItem[] = [\n" + new_content)
with open('src/data/testingFrameworks.ts', 'w') as f:
    f.write(content)
