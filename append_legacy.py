import re
with open('src/data/legacyWeb.ts', 'r') as f:
    content = f.read()

new_content = """  {
    id: 'legacy-02',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'JSP',
    title: 'JSP (JavaServer Pages) Basics & JSTL',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Understanding the lifecycle of JSP and the use of JSTL/EL to avoid scriptlets.',
    coreConcepts: [
      'JSP is a server-side technology that gets compiled into a Java Servlet on the first request.',
      'Scriptlets (`<% java code %>`) are highly discouraged because they mix business logic with presentation.',
      'JSTL (JSP Standard Tag Library) and EL (Expression Language, `${user.name}`) should be used for rendering logic.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that a JSP is ultimately just a Servlet.',
        'Mentions the separation of concerns (MVC) and why scriptlets are bad.',
        'Knows about JSTL tags like `<c:forEach>` and `<c:if>`.'
      ],
      juniorOrMidRedFlags: [
        'Recommends using JSP for a brand new application in 2024.'
      ],
      seniorDifferentiators: [
        'Explains the performance cost of the first JSP compilation and how to precompile JSPs.'
      ],
      followUpQuestions: [
        'What are the 9 implicit objects in a JSP?'
      ]
    },
    tags: ['JSP', 'JSTL', 'Servlets']
  },
"""

content = content.replace("export const legacyWebQuestions: QuestionItem[] = [", "export const legacyWebQuestions: QuestionItem[] = [\n" + new_content)
with open('src/data/legacyWeb.ts', 'w') as f:
    f.write(content)
