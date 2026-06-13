/**
 * LLM Intelligence Learning Package — Navigation & Progress
 *
 * Handles: sidebar rendering, active page highlighting, module expand/collapse,
 * progress tracking (localStorage), mobile menu, verification toggle.
 *
 * No dependencies. Works offline. All paths relative to src/.
 */

const MODULES = [
  {
    id: 1,
    title: 'From Text to Numbers',
    color: 'var(--cyan)',
    gaps: [
      { id: 'G11', slug: 'g11-tokenization', title: 'Tokenization & Embedding Spaces' },
      { id: 'G1',  slug: 'g01-weights', title: 'What Weights Actually Encode' },
      { id: 'G12', slug: 'g12-training-objective', title: 'The Training Objective' },
    ]
  },
  {
    id: 2,
    title: 'The Learning Engine',
    color: 'var(--green)',
    gaps: [
      { id: 'G13', slug: 'g13-backpropagation', title: 'Backpropagation & Gradient Descent' },
      { id: 'G4',  slug: 'g04-scaling-laws', title: 'Neural Scaling Laws' },
      { id: 'G14', slug: 'g14-pretraining-data', title: 'Pre-Training Data' },
      { id: 'G5',  slug: 'g05-emergence', title: 'Emergent Capabilities' },
      { id: 'G15', slug: 'g15-fine-tuning', title: 'Fine-Tuning & Transfer Learning' },
    ]
  },
  {
    id: 3,
    title: 'The Reasoning Machine',
    color: 'var(--purple)',
    gaps: [
      { id: 'G2',  slug: 'g02-attention', title: 'Transformer Attention' },
      { id: 'G3',  slug: 'g03-in-context-learning', title: 'In-Context Learning' },
      { id: 'G6',  slug: 'g06-compositional-generalization', title: 'Compositional Generalization' },
      { id: 'G33', slug: 'g33-hallucination', title: 'Hallucination' },
      { id: 'G9',  slug: 'g09-chain-of-thought', title: 'Chain-of-Thought as Computation' },
      { id: 'G16', slug: 'g16-advanced-reasoning', title: 'Advanced Reasoning' },
      { id: 'G17', slug: 'g17-extended-thinking', title: 'Extended Thinking' },
      { id: 'G29', slug: 'g29-multimodal', title: 'Multimodal Intelligence' },
    ]
  },
  {
    id: 4,
    title: 'The Alignment Layer',
    color: 'var(--amber)',
    gaps: [
      { id: 'G18', slug: 'g18-rlhf', title: 'RLHF Deep Dive' },
      { id: 'G19', slug: 'g19-beyond-rlhf', title: 'Beyond RLHF' },
      { id: 'G20', slug: 'g20-alignment', title: 'The Alignment Problem' },
      { id: 'G21', slug: 'g21-adversarial', title: 'Adversarial Robustness' },
    ]
  },
  {
    id: 5,
    title: 'The Agent Architecture',
    color: 'var(--blue)',
    gaps: [
      { id: 'G8',  slug: 'g08-lens-picking', title: 'How the Agent Picks the Right Lens' },
      { id: 'G22', slug: 'g22-memory-architectures', title: 'Memory Architectures' },
      { id: 'G23', slug: 'g23-goal-decomposition', title: 'Goal Decomposition' },
      { id: 'G24', slug: 'g24-multi-agent', title: 'Multi-Agent Systems' },
      { id: 'G25', slug: 'g25-autonomy-spectrum', title: 'The Autonomy Spectrum' },
    ]
  },
  {
    id: 6,
    title: 'Seeing Inside',
    color: 'var(--red)',
    gaps: [
      { id: 'G26', slug: 'g26-mechanistic-interpretability', title: 'Mechanistic Interpretability' },
      { id: 'G27', slug: 'g27-superposition', title: 'Superposition & Polysemanticity' },
      { id: 'G34', slug: 'g34-world-models', title: 'Internal World Models' },
      { id: 'G28', slug: 'g28-benchmarking', title: 'Benchmarking Intelligence' },
    ]
  },
  {
    id: 7,
    title: 'Philosophy of Machine Intelligence',
    color: 'var(--purple)',
    gaps: [
      { id: 'G7',  slug: 'g07-grounding', title: 'The Grounding Question' },
      { id: 'G10', slug: 'g10-intelligence-consciousness', title: 'Intelligence vs. Consciousness' },
      { id: 'G30', slug: 'g30-functionalism', title: 'Functionalism' },
      { id: 'G31', slug: 'g31-intentionality', title: 'Intentionality & Aboutness' },
      { id: 'G32', slug: 'g32-frontier', title: 'The Current Frontier' },
    ]
  }
];

const LEARNING_PATH = [
  'g11-tokenization','g01-weights','g12-training-objective','g13-backpropagation',
  'g04-scaling-laws','g14-pretraining-data','g05-emergence','g15-fine-tuning',
  'g02-attention','g03-in-context-learning','g06-compositional-generalization',
  'g33-hallucination','g09-chain-of-thought','g16-advanced-reasoning',
  'g17-extended-thinking','g29-multimodal','g18-rlhf','g19-beyond-rlhf',
  'g20-alignment','g21-adversarial','g08-lens-picking','g22-memory-architectures',
  'g23-goal-decomposition','g24-multi-agent','g25-autonomy-spectrum',
  'g26-mechanistic-interpretability','g27-superposition','g34-world-models',
  'g28-benchmarking','g07-grounding','g10-intelligence-consciousness',
  'g30-functionalism','g31-intentionality','g32-frontier'
];

const STORAGE_KEY = 'llm-intelligence-progress';

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

  const savedTheme = localStorage.getItem('llm-intelligence-theme');
  const themeIcon = savedTheme === 'light' ? '☾' : '☀';

  let html = `
    <div class="sidebar-header">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h1><a href="${indexHref}">LLM Intelligence</a></h1>
        <button class="theme-toggle" aria-label="Toggle theme">${themeIcon}</button>
      </div>
      <p>The Full Arc: Guesser → Genuine AI</p>
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
  const saved = localStorage.getItem('llm-intelligence-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    localStorage.setItem('llm-intelligence-theme', next);
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
