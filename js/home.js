/**
 * Claw Blog - 主页逻辑
 * 加载 blogs.json，渲染博客目录列表
 */

(function () {
  'use strict';

  async function loadBlogList() {
    var container = document.getElementById('blog-list');
    if (!container) return;

    try {
      var res = await fetch('blogs.json');
      if (!res.ok) throw new Error('Failed to load blogs.json');
      var blogs = await res.json();

      if (!blogs || blogs.length === 0) {
        container.innerHTML = '<p class="blog-empty">暂无博文</p>';
        return;
      }

      // 按日期倒序
      blogs.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

      var html = blogs.map(function (blog) {
        return '<a class="blog-item" href="blogs/' + blog.slug + '.html">' +
          '<div class="blog-item-date">' + blog.date + '</div>' +
          '<div class="blog-item-title">' + escapeHtml(blog.title) + '</div>' +
          (blog.description ? '<div class="blog-item-desc">' + escapeHtml(blog.description) + '</div>' : '') +
          '</a>';
      }).join('');

      container.innerHTML = '<div class="blog-list-header">目录 · ' + blogs.length + ' 篇</div>' + html;
    } catch (err) {
      container.innerHTML = '<p class="blog-empty">加载失败，请稍后重试</p>';
      console.error(err);
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', loadBlogList);
})();
