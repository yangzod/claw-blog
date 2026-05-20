/**
 * Claw Blog - 博文页逻辑
 * 解析 URL slug，加载文章内容，构建侧边目录，监听滚动高亮
 */

(function () {
  'use strict';

  function getBasePath() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    // 当前在 blogs/xxx.html，所以往上退一级
    if (segments.length >= 1 && segments[segments.length - 1].endsWith('.html')) {
      segments.pop();
      return segments.join('/') + '/';
    }
    return '/';
  }

  function getSlugFromUrl() {
    const path = window.location.pathname;
    const match = path.match(//blogs/([^/]+)\.html/);
    return match ? match[1] : null;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 从 article-content 中提取标题，生成侧边目录
  function buildToc() {
    const content = document.querySelector('.article-body-text');
    const tocList = document.getElementById('toc-list');
    if (!content || !tocList) return;

    const headings = content.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
      document.querySelector('.toc-sidebar').style.display = 'none';
      return;
    }

    // 给所有标题加上 id
    headings.forEach((h, i) => {
      if (!h.id) h.id = `heading-${i}`;
    });

    const items = [];
    headings.forEach(h => {
      const level = parseInt(h.tagName[1], 10);
      items.push({
        id: h.id,
        text: h.textContent,
        level: level
      });
    });

    tocList.innerHTML = items.map(item => `
      <li class="toc-item">
        <a class="toc-link level-${item.level}"
           href="#${item.id}"
           data-target="${item.id}">${escapeHtml(item.text)}</a>
      </li>
    `).join('');

    // 目录项点击平滑跳转
    tocList.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.target);
        if (target) {
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '56', 10);
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // 监听滚动，高亮当前章节对应的目录项
  function setupScrollSpy() {
    const links = document.querySelectorAll('.toc-link[data-target]');
    if (links.length === 0) return;

    const headingIds = Array.from(links).map(l => l.dataset.target);
    const headings = headingIds.map(id => document.getElementById(id)).filter(Boolean);

    function getActiveIndex() {
      const scrollY = window.scrollY;
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '56', 10);
      for (let i = headings.length - 1; i >= 0; i--) {
        const top = headings[i].getBoundingClientRect().top + scrollY - offset - 32;
        if (scrollY >= top) return i;
      }
      return 0;
    }

    let current = -1;
    window.addEventListener('scroll', () => {
      const active = getActiveIndex();
      if (active !== current) {
        links.forEach((l, i) => l.classList.toggle('active', i === active));
        current = active;
      }
    }, { passive: true });
  }

  // 从当前页面读取标题注入导航栏
  function setupNav() {
    const h1 = document.querySelector('.article-body-text h1');
    const navTitle = document.getElementById('nav-title');
    if (h1 && navTitle) {
      navTitle.textContent = h1.textContent;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildToc();
    setupScrollSpy();
    setupNav();
  });
})();
