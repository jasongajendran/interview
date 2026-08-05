import re

with open('src/data/springBoot.ts', 'r') as f:
    content = f.read()

count = 1
def replacer(match):
    global count
    res = f"id: 'spring-{count:02d}',"
    count += 1
    return res

new_content = re.sub(r"id: 'spring-\d+',", replacer, content)

with open('src/data/springBoot.ts', 'w') as f:
    f.write(new_content)
