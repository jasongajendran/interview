import re

with open('src/types/index.ts', 'r') as f:
    content = f.read()

# Add Mid-Level to SeniorityLevel
content = content.replace(
    "export type SeniorityLevel = 'Senior (10-12 YOE)' | 'Lead / Architect (13-15+ YOE)' | 'Principal / Staff';",
    "export type SeniorityLevel = 'Mid-Level (4-6 YOE)' | 'Senior (10-12 YOE)' | 'Lead / Architect (13-15+ YOE)' | 'Principal / Staff';"
)

# Add Easy to difficulty
content = content.replace(
    "difficulty: 'Medium' | 'Hard' | 'Architect-Level';",
    "difficulty: 'Easy' | 'Medium' | 'Hard' | 'Architect-Level';"
)

# Add aws-cloud to CategoryId
content = content.replace(
    "  | 'ui-frontend'\n  | 'ides-diagnostics'\n  | 'production-scenarios';",
    "  | 'ui-frontend'\n  | 'aws-cloud'\n  | 'ides-diagnostics'\n  | 'production-scenarios';"
)

with open('src/types/index.ts', 'w') as f:
    f.write(content)
