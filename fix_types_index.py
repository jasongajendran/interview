import re

with open('src/types/index.ts', 'r') as f:
    content = f.read()

content = content.replace("  | 'ui-frontend';", "  | 'ui-frontend'\n  | 'aws-cloud';")

with open('src/types/index.ts', 'w') as f:
    f.write(content)

with open('src/data/index.ts', 'r') as f:
    content = f.read()

content = content.replace("  ...uiFrontendQuestions\n];", "  ...uiFrontendQuestions,\n  ...awsCloudQuestions\n];")
content = content.replace("  uiFrontendQuestions,\n  productionScenarios", "  uiFrontendQuestions,\n  awsCloudQuestions,\n  productionScenarios")

with open('src/data/index.ts', 'w') as f:
    f.write(content)
