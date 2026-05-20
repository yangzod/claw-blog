/**
 * Claw Blog - 主页逻辑
 * 加载 blogs.json，渲染博客目录列表
 */

(function () {
  'use strict';

  // 动态获取 base path（支持子目录部署）
  function getBasePath() {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    // 去掉文件名，定位到站点根目录
    if (pathSegments.length > 0 && !pathSegments[pathSegments.length - 1].endsWith('.html')) {
      // 说明在子路径下
      return pathSegments.join('/') + '/';
    } else if (pathSegments.length > 1) {
      pathSegments.pop();
      return pathSegments.join('/') + '/';
    }
    return '/';
  }

  async function loadBlogList() {
    const base = getBasePath();
    const jsonUrl = base + 'blogs.json';
    const container = document.getElementById('blog-list');

    if (!container) return;

    try {
      const res = await fetch(jsonUrl);
      if (!res.ok) throw new Error('Failed to load blogs.json');
      const blogs = await res.json();

      if (!blogs || blogs.length === 0) {
        container.innerHTML = '<p class="blog-empty">暂无博文</p>';
        return;
      }

      // 按日期倒序
      blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

      const html = blogs.map(blog => `
        <a class="blog-item" href="${base}blogs/${blog.slug}.html">
          <div class="blog-item-date">${blog.date}</div>
          <div class="blog-item-title">${escapeHtml(blog.title)}</div>
          ${blog.description ? `<div class="blog-item-desc">${escapeHtml(blog.description)}</div>` : ''}
        </a>
      `).join('');

      container.innerHTML = `
        <div class="blog-list-header">目录 · ${blogs.length} 篇</div>
        ${html}
      `;
    } catch (err) {
      container.innerHTML = `<p class="blog-empty">加载失败，请稍后重试</p>`;
      console.error(err);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', loadBlogList);
})();
