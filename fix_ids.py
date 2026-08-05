import re

with open('src/data/javaCore.ts', 'r') as f:
    content = f.read()

count = 1
def replacer(match):
    global count
    res = f"id: 'java-{count:02d}',"
    count += 1
    return res

new_content = re.sub(r"id: 'java-\d+',", replacer, content)

with open('src/data/javaCore.ts', 'w') as f:
    f.write(new_content)
