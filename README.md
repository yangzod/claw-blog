# Claw Blog

一个极简的静态博客系统，零后端依赖，适合部署在 GitHub Pages。

## 快速开始

### 目录结构

```
claw-blog-test/
├── BLOGS/                      # 博文源文件（Markdown）
│   ├── BLOGS.py                 # 渲染脚本
│   └── *.md                     # 你的博文
│
└── public/                     # GitHub Pages 部署目录（推送到 gh-pages 分支）
    ├── index.html
    ├── blogs.json
    ├── blogs/                   # 渲染后的 HTML 博文
    ├── css/style.css
    ├── js/
    └── template.html
```

### 写作流程

```bash
# 1. 在 BLOGS/ 目录下新建 .md 文件
# 2. 运行渲染脚本
python3 BLOGS/BLOGS.py

# 3. 将 public/ 目录内容推送到 GitHub Pages
```

### 博文格式

每个 `.md` 文件开头使用 YAML front matter：

```markdown
---
title: "文章标题"
date: "2024-11-20"
description: "文章摘要"
---

正文内容...
```

## 开发

```bash
# 本地预览（启动任意静态服务器）
cd public
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 部署到 GitHub Pages

1. 将 `public/` 目录内容推送到 `gh-pages` 分支
2. 或在 GitHub 仓库 Settings → Pages → Source 选择 `gh-pages` 分支

## 技术栈

- 渲染脚本：Python 3（仅需 `markdown` 库）
- 样式：纯 CSS（淡米黄背景 + 衬线字体）
- 交互：原生 JavaScript
- 字体：Noto Serif SC（Google Fonts CDN）
