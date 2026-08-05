import re

with open('src/components/Navigation.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "currentView: 'home' | 'category' | 'scenarios' | 'diagnostics';",
    "currentView: 'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals';"
)

content = content.replace(
    "onNavigate: (view: 'home' | 'category' | 'scenarios' | 'diagnostics', categoryId?: CategoryId) => void;",
    "onNavigate: (view: 'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals', categoryId?: CategoryId) => void;"
)

with open('src/components/Navigation.tsx', 'w') as f:
    f.write(content)

