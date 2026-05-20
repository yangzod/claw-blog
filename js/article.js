/**
 * Claw Blog - 博文页逻辑
 * 生成侧边目录、滚动高亮、注入导航栏标题
 */

(function () {
  function buildToc() {
    var content = document.querySelector('.article-body-text');
    var tocList = document.getElementById('toc-list');
    if (!content || !tocList) return;

    var headings = content.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
      document.querySelector('.toc-sidebar').style.display = 'none';
      return;
    }

    // 给所有标题加上 id
    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'heading-' + i;
    });

    // 生成目录 HTML
    var html = '';
    headings.forEach(function (h) {
      var level = parseInt(h.tagName[1], 10);
      html += '<li class="toc-item">';
      html += '<a class="toc-link level-' + level + '" href="#' + h.id + '">' + h.textContent + '</a>';
      html += '</li>';
    });
    tocList.innerHTML = html;

    // 点击平滑滚动
    tocList.querySelectorAll('.toc-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (target) {
          var top = target.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  function setupScrollSpy() {
    var links = document.querySelectorAll('.toc-link');
    if (links.length === 0) return;

    var headings = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) headings.push(el);
    });

    var lastActive = -1;
    function update() {
      var scrollY = window.scrollY;
      var activeIdx = 0;
      for (var i = headings.length - 1; i >= 0; i--) {
        if (headings[i].getBoundingClientRect().top + scrollY <= scrollY + 100) {
          activeIdx = i;
          break;
        }
      }
      if (activeIdx !== lastActive) {
        links.forEach(function (l, i) {
          l.classList.toggle('active', i === activeIdx);
        });
        lastActive = activeIdx;
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function setupNav() {
    var h1 = document.querySelector('.article-body-text h1');
    var navTitle = document.getElementById('nav-title');
    if (h1 && navTitle) navTitle.textContent = h1.textContent;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildToc();
      setupScrollSpy();
      setupNav();
    });
  } else {
    buildToc();
    setupScrollSpy();
    setupNav();
  }
})();
