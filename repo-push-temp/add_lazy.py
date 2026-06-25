import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find <img ...> tags and add loading="lazy" decoding="async" if not already present
    def replace_img(match):
        img_tag = match.group(0)
        if 'loading="lazy"' not in img_tag:
            img_tag = img_tag.replace('<img ', '<img loading="lazy" decoding="async" ')
        return img_tag

    new_content = re.sub(r'<img [^>]*>', replace_img, content)

    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
