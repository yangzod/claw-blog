#!/usr/bin/env python3
"""
Claw Blog - 静态博客渲染脚本
功能：
  1. 扫描 blogs/ 目录下的 .md 文件
  2. 解析 front matter（title, date, description）
  3. 将 md 内容转成完整 HTML，注入 template.html 模板
  4. 生成 public/blogs/[slug].html 和 public/blogs.json

使用：
  python BLOGS.py
"""

import re
import os
import json
import markdown
from datetime import datetime
from pathlib import Path

# ========== 配置 ==========
BLOGS_DIR   = Path(__file__).parent.resolve()
ROOT_DIR    = BLOGS_DIR.parent
PUBLIC_DIR  = ROOT_DIR / "public"
OUTPUT_BLOGS = PUBLIC_DIR / "blogs"
TEMPLATE_FILE = PUBLIC_DIR / "template.html"
MENU_FILE     = PUBLIC_DIR / "blogs.json"

# 确保输出目录存在
OUTPUT_BLOGS.mkdir(parents=True, exist_ok=True)

# ========== Front Matter 解析 ==========

FRONT_MATTER_RE = re.compile(
    r'^---\s*\n(.*?)\n---\s*\n',
    re.DOTALL | re.MULTILINE
)

def parse_front_matter(raw: str):
    """解析 md 文件开头的 YAML front matter。"""
    match = FRONT_MATTER_RE.match(raw)
    if not match:
        return {}, raw
    fm_text = match.group(1)
    body    = raw[match.end():]
    fm = {}
    for line in fm_text.split('\n'):
        if ':' in line:
            key, _, val = line.partition(':')
            fm[key.strip()] = val.strip().strip('"').strip("'")
    return fm, body

# ========== Markdown → HTML ==========

md = markdown.Markdown(extensions=[
    'tables',
    'fenced_code',
    'codehilite',
    'toc',
    'nl2br',
    'sane_lists',
])

def md_to_html(text: str) -> str:
    md.reset()
    return md.convert(text)

# ========== 加载模板 ==========

def load_template() -> str:
    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        return f.read()

TEMPLATE = load_template()

def slug_from_filename(filename: str) -> str:
    """从文件名生成 slug：hello-world.md → hello-world"""
    return Path(filename).stem

def build_html(meta: dict, content_html: str) -> str:
    """将数据注入 HTML 模板。"""
    page = TEMPLATE
    for key, val in meta.items():
        page = page.replace('{{' + key + '}}', val)
    page = page.replace('{{content}}', content_html)
    # 未替换的 {{xxx}} 留空
    page = re.sub(r'\{\{\w+\}\}', '', page)
    return page

# ========== 扫描 & 渲染 ==========

MENU = []

md_files = sorted(BLOGS_DIR.glob('*.md'), key=lambda p: p.name)

print(f"[BLOGS.py] 找到 {len(md_files)} 个 md 文件，开始渲染...")

for md_path in md_files:
    slug = slug_from_filename(md_path.name)
    print(f"  渲染: {md_path.name} → {slug}.html")

    with open(md_path, 'r', encoding='utf-8') as f:
        raw = f.read()

    meta, body = parse_front_matter(raw)

    # 默认值
    meta.setdefault('title',       slug)
    meta.setdefault('date',       datetime.now().strftime('%Y-%m-%d'))
    meta.setdefault('description', '')

    content_html = md_to_html(body)

    html = build_html(meta, content_html)

    out_path = OUTPUT_BLOGS / f"{slug}.html"
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"    → {out_path}")

    # 写入菜单项（按日期倒序，所以先收集最后一起排序）
    MENU.append({
        'title':       meta['title'],
        'date':        meta['date'],
        'description': meta['description'],
        'slug':        slug,
    })

# 按日期倒序写入 MENU.json
MENU.sort(key=lambda x: x.get('date', ''), reverse=True)

with open(MENU_FILE, 'w', encoding='utf-8') as f:
    json.dump(MENU, f, ensure_ascii=False, indent=2)

print(f"\n[BLOGS.py] 完成！")
print(f"  HTML 文件: {OUTPUT_BLOGS}")
print(f"  索引文件:  {MENU_FILE}")
print(f"  共 {len(MENU)} 篇博文")
