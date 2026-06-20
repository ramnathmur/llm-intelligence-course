/**
 * ML Foundations — Navigation & Progress
 *
 * Handles: sidebar rendering, active page highlighting, module expand/collapse,
 * progress tracking (localStorage), mobile menu, verification toggle.
 *
 * No dependencies. Works offline. All paths relative to ml-foundations/.
 */

const MODULES = [
  {
    id: 1,
    title: 'Models and Training',
    color: 'var(--cyan)',
    gaps: [
      { id: 'F01', slug: 'f01-what-is-a-model', title: 'What Is a Model?' },
      { id: 'F02', slug: 'f02-loss-functions', title: 'Loss Functions' },
      { id: 'F03', slug: 'f03-gradient-descent', title: 'Gradient Descent' },
      { id: 'F04', slug: 'f04-train-val-test', title: 'Train / Validation / Test Splits' },
    ]
  },
  {
    id: 2,
    title: 'Data, Evaluation, and Neural Nets',
    color: 'var(--green)',
    gaps: [
      { id: 'F05', slug: 'f05-features-and-data', title: 'Features and Data' },
      { id: 'F06', slug: 'f06-overfitting', title: 'Overfitting and Regularisation' },
      { id: 'F07', slug: 'f07-neural-networks', title: 'Neural Networks as Stacked Functions' },
      { id: 'F08', slug: 'f08-embeddings-intro', title: 'Embeddings — Dense Vectors' },
      { id: 'F09', slug: 'f09-model-evaluation', title: 'Evaluation Metrics' },
    ]
  }
];

const LEARNING_PATH = [
  'f01-what-is-a-model','f02-loss-functions','f03-gradient-descent','f04-train-val-test',
  'f05-features-and-data','f06-overfitting','f07-neural-networks',
  'f08-embeddings-intro','f09-model-evaluation'
];

const STORAGE_KEY = 'ml-foundations-progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function markVisited(slug) {
  const progress = getProgress();
  if (!progress[slug]) {
    progress[slug] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

function getVisitedCount() {
  return Object.keys(getProgress()).length;
}

function getModuleForSlug(slug) {
  for (const m of MODULES) {
    for (const g of m.gaps) {
      if (g.slug === slug) return m;
    }
  }
  return null;
}

function getGapForSlug(slug) {
  for (const m of MODULES) {
    for (const g of m.gaps) {
      if (g.slug === slug) return g;
    }
  }
  return null;
}

function resolveHref(slug, currentSlug) {
  if (!currentSlug) return `module-${getModuleForSlug(slug).id}/${slug}.html`;
  const currentModule = getModuleForSlug(currentSlug);
  const targetModule = getModuleForSlug(slug);
  if (currentModule && targetModule && currentModule.id === targetModule.id) {
    return `${slug}.html`;
  }
  return `../module-${targetModule.id}/${slug}.html`;
}

function getPrevNext(currentSlug) {
  const idx = LEARNING_PATH.indexOf(currentSlug);
  return {
    prev: idx > 0 ? LEARNING_PATH[idx - 1] : null,
    next: idx < LEARNING_PATH.length - 1 ? LEARNING_PATH[idx + 1] : null
  };
}

function renderSidebar(currentSlug) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const progress = getProgress();
  const visited = getVisitedCount();
  const total = LEARNING_PATH.length;
  const pct = Math.round((visited / total) * 100);

  const indexHref = currentSlug ? '../index.html' : 'index.html';

  const savedTheme = localStorage.getItem('ml-foundations-theme');
  const themeIcon = savedTheme === 'light' ? '☾' : '☀';

  let html = `
    <div class="sidebar-header">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h1><a href="${indexHref}">ML Foundations</a></h1>
        <button class="theme-toggle" aria-label="Toggle theme">${themeIcon}</button>
      </div>
      <p>The algebra-only on-ramp to machine learning</p>
      <div class="sidebar-progress">
        <div class="sidebar-progress-fill" style="width:${pct}%"></div>
      </div>
      <p style="margin-top:0.3rem;font-size:0.68rem;color:var(--text-dim)">${visited}/${total} completed</p>
    </div>
  `;

  for (const m of MODULES) {
    const isCurrentModule = m.gaps.some(g => g.slug === currentSlug);
    const expandedClass = isCurrentModule ? 'expanded' : '';
    const openClass = isCurrentModule ? 'open' : '';

    html += `
      <div class="nav-module-label ${expandedClass}" data-module="${m.id}">
        <span>Module ${m.id}: ${m.title}</span>
        <span class="chevron">&#9656;</span>
      </div>
      <div class="nav-module-gaps ${openClass}" data-module-gaps="${m.id}">
    `;

    for (const g of m.gaps) {
      const href = currentSlug ? resolveHref(g.slug, currentSlug) : `module-${m.id}/${g.slug}.html`;
      const activeClass = g.slug === currentSlug ? 'active' : '';
      const visitedClass = progress[g.slug] ? 'visited' : '';
      html += `
        <a href="${href}" class="nav-link ${activeClass} ${visitedClass}">
          <span class="status-dot"></span>
          <span>${g.id} — ${g.title}</span>
        </a>
      `;
    }

    html += '</div>';
  }

  sidebar.innerHTML = html;

  sidebar.querySelectorAll('.nav-module-label').forEach(label => {
    label.addEventListener('click', () => {
      const moduleId = label.dataset.module;
      const gaps = sidebar.querySelector(`[data-module-gaps="${moduleId}"]`);
      label.classList.toggle('expanded');
      gaps.classList.toggle('open');
    });
  });
}

function renderPageNav(currentSlug) {
  const navEl = document.querySelector('.page-nav');
  if (!navEl) return;

  const { prev, next } = getPrevNext(currentSlug);
  let html = '';

  if (prev) {
    const gap = getGapForSlug(prev);
    const href = resolveHref(prev, currentSlug);
    html += `
      <a href="${href}" class="prev">
        <span class="nav-direction">&larr; Previous</span>
        <span class="nav-title">${gap.id} — ${gap.title}</span>
      </a>
    `;
  } else {
    html += '<div></div>';
  }

  if (next) {
    const gap = getGapForSlug(next);
    const href = resolveHref(next, currentSlug);
    html += `
      <a href="${href}" class="next">
        <span class="nav-direction">Next &rarr;</span>
        <span class="nav-title">${gap.id} — ${gap.title}</span>
      </a>
    `;
  }

  navEl.innerHTML = html;
}

function initVerificationToggle() {
  document.querySelectorAll('.verification-header').forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('open');
      header.nextElementSibling.classList.toggle('open');
    });
  });
}

function initToggleReveals() {
  document.querySelectorAll('.toggle-reveal-header').forEach(header => {
    header.addEventListener('click', () => {
      header.nextElementSibling.classList.toggle('open');
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.overlay');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  });
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  }, { passive: true });
}

function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('ml-foundations-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    localStorage.setItem('ml-foundations-theme', next);
    btn.textContent = next === 'light' ? '☾' : '☀';
  });
  btn.textContent = saved === 'light' ? '☾' : '☀';
}

function initQuizzes() {
  document.querySelectorAll('.quiz').forEach(quiz => {
    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('.quiz-feedback');
    let answered = false;
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const isCorrect = opt.dataset.correct === 'true';
        opt.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
          const correct = quiz.querySelector('[data-correct="true"]');
          if (correct) correct.classList.add('correct');
        }
        if (feedback) {
          feedback.classList.add('show', isCorrect ? 'correct-feedback' : 'incorrect-feedback');
          feedback.textContent = isCorrect
            ? (feedback.dataset.correct || 'Correct!')
            : (feedback.dataset.incorrect || 'Not quite. See the highlighted answer.');
        }
      });
    });
  });
}

function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    const btns = tabs.querySelectorAll('.tab-btn');
    const panels = tabs.querySelectorAll('.tab-panel');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = tabs.querySelector('#' + btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });
}

function init(currentSlug) {
  if (currentSlug) markVisited(currentSlug);
  renderSidebar(currentSlug);
  if (currentSlug) renderPageNav(currentSlug);
  initVerificationToggle();
  initToggleReveals();
  initMobileNav();
  initScrollProgress();
  initThemeToggle();
  initQuizzes();
  initTabs();
}

window.LLMNav = { init, MODULES, LEARNING_PATH, getProgress, getVisitedCount, getGapForSlug, getModuleForSlug, resolveHref };
