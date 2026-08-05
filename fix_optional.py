import re

with open('src/types/index.ts', 'r') as f:
    content = f.read()

content = content.replace("detailedExplanation: string[];", "detailedExplanation?: string[];")
content = content.replace("codeExamples: CodeExample[];", "codeExamples?: CodeExample[];")

with open('src/types/index.ts', 'w') as f:
    f.write(content)
