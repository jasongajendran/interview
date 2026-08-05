import re
with open('src/data/springBoot.ts', 'r') as f:
    content = f.read()

new_content = """  {
    id: 'spring-10',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'REST API',
    title: 'REST API Best Practices & Status Codes',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding REST constraints, HTTP methods, and appropriate status codes in Spring MVC.',
    coreConcepts: [
      'Use proper HTTP methods: GET (read), POST (create), PUT (update/replace), PATCH (partial update), DELETE (remove).',
      'Use proper HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.',
      'In Spring, @RestController combines @Controller and @ResponseBody.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Knows the difference between PUT (idempotent) and POST (not idempotent).',
        'Understands when to return 201 Created vs 200 OK.',
        'Explains @ExceptionHandler or @RestControllerAdvice for global exception handling.'
      ],
      juniorOrMidRedFlags: [
        'Returns 200 OK for everything, with custom error objects containing error codes.',
        'Uses GET for state-changing operations.'
      ],
      seniorDifferentiators: [
        'Explains HATEOAS (Hypermedia as the Engine of Application State).'
      ],
      followUpQuestions: [
        'What is the difference between 401 Unauthorized and 403 Forbidden?'
      ]
    },
    tags: ['REST', 'HTTP', 'Spring MVC']
  },
  {
    id: 'spring-11',
    category: 'spring-boot',
    categoryName: 'Spring Boot 3.x & Spring 6',
    topic: 'Spring Security',
    title: 'Spring Security Architecture Basics',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'How Spring Security intercepts requests and authenticates users.',
    coreConcepts: [
      'Spring Security is based on a chain of Servlet Filters (DelegatingFilterProxy -> FilterChainProxy).',
      'Authentication involves verifying WHO the user is (AuthenticationManager, AuthenticationProvider, UserDetailsService).',
      'Authorization (Access Control) involves checking if the authenticated user HAS PERMISSION to access a resource.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Understands the role of the SecurityFilterChain in Spring Security 5/6.',
        'Knows what UserDetailsService does (loads user-specific data).',
        'Distinguishes between authentication and authorization.'
      ],
      juniorOrMidRedFlags: [
        'Still references extending WebSecurityConfigurerAdapter (removed in Spring Security 6).'
      ],
      seniorDifferentiators: [
        'Explains how the SecurityContextHolder stores the principal using ThreadLocal.'
      ],
      followUpQuestions: [
        'How does Spring Security handle CSRF attacks by default?'
      ]
    },
    tags: ['Spring Security', 'Authentication', 'Authorization']
  },
"""

content = content.replace("export const springBootQuestions: QuestionItem[] = [", "export const springBootQuestions: QuestionItem[] = [\n" + new_content)
with open('src/data/springBoot.ts', 'w') as f:
    f.write(content)
