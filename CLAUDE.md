# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

This is a **static HTML learning package** — a multi-course platform with 4 integrated courses teaching LLM intelligence and AI concepts. There is no build step, bundler, or test suite. All content is client-side HTML/CSS/JavaScript that runs offline after the first load.

**Courses in this package:**
1. **LLM Intelligence** (34 gaps, 7 modules) — core course on how LLMs work
2. **ML Foundations** (9 gaps, 2 modules) — prerequisite concepts
3. **Building NNs From Scratch** (9 gaps, 3 modules) — hands-on neural network concepts
4. **AI Engineering** (11 gaps, 4 modules) — practical agent building patterns

**Source of truth for content:** The curriculum markdown files in `C:\Claude Cowork\CLAUDE OUTPUTS\ai autonomy\` — all pages must map 1:1 to curriculum gaps.

---

## Architecture at a Glance

```
ai autonomy/
├── launch.html                # Gateway: links to all 4 courses
├── vercel.json               # Vercel config: / rewrites to /launch.html
├── src/                      # LLM Intelligence course (main course)
│   ├── index.html            # Course home page
│   ├── css/style.css         # Shared design tokens for ALL courses
│   ├── js/nav.js             # Navigation engine for LLM Intelligence
│   ├── img/favicon.svg       # Shared favicon
│   └── module-1/ ... module-7/  # 7 module directories with gap pages
├── ml-foundations/           # ML Foundations course
│   ├── index.html
│   ├── js/nav.js             # ML Foundations navigation (separate from LLM)
│   └── module-1/ module-2/
├── nn-from-scratch/          # Building NNs course
│   ├── index.html
│   ├── js/nav.js
│   └── module-1/ module-2/ module-3/
├── ai-engineering/           # AI Engineering course
│   ├── index.html
│   ├── js/nav.js
│   └── module-1/ ... module-4/
├── generate-pages.js         # Node.js scaffolding tool (safety guards included)
├── SOP-CONTENT-AND-DEPLOY.md # Comprehensive procedures for adding content
└── [other docs]
```

### Critical constraint: Shared CSS

All 4 courses share **one stylesheet** at `src/css/style.css`. Any change to design affects all courses. Changes must preserve compatibility across all courses and asset paths.

---

## Development Commands

This is a static site, so there are no build, test, or lint commands. Instead:

### Preview locally
```bash
# Start a local web server to test locally (Python 3)
python -m http.server 8000

# Then open in browser: http://localhost:8000/launch.html
```

**Why a local server?** The courses use `localStorage` for progress tracking, which requires HTTP (not `file://`).

### Create a new gap page

Do NOT manually write HTML from scratch. Use the generator:

```bash
node generate-pages.js
```

This scaffolds gap pages with the correct anatomy, stylesheet links, navigation hooks, and safety guards. See `SOP-CONTENT-AND-DEPLOY.md` Part 1 for the full workflow.

### Deploy to Vercel

This is automatic on push to the configured branch. To manually verify:

```bash
# Verify locally first (see Preview above)
git add <course-dir>/ launch.html
git commit -m "Add [description]"
git push origin <branch-name>
```

Vercel deploys within 1–2 minutes. Live URL: `https://llm-intelligence-course.vercel.app`

---

## Key Architecture Decisions

### Static site, no bundler
- **Why:** Offline-first, no deployment overhead, simplicity. Courses work in any browser immediately after first load.
- **Impact:** All CSS must go into one shared stylesheet. No tree-shaking, no minification. No external CDN dependencies.

### Client-side navigation with localStorage
- **Why:** No server required. Readers can bookmark the gateway and return anytime; progress persists.
- **Impact:** Each course has its own `js/nav.js` with course-specific MODULES and LEARNING_PATH arrays. These are NOT shared. If you add a gap, you must update the course's nav.js.

### One shared CSS, four separate nav.js files
- **Why:** All courses share visual design. Each course has its own learning path order (immutable).
- **Impact:** When adding a course, you must:
  1. Create `<course>/js/nav.js` with the course's MODULES and LEARNING_PATH
  2. Do NOT modify `src/css/style.css` unless adding a new reusable component type across all courses

### Asset path conventions (critical)
Asset paths vary by location. Get them wrong and styles don't load. Use this table:

| From location | Stylesheet | Favicon | nav.js | Module sibling |
|---|---|---|---|---|
| `<course>/index.html` | `../src/css/style.css` | `../src/img/favicon.svg` | `./js/nav.js` | `./module-N/` |
| `<course>/module-N/page.html` | `../../src/css/style.css` | `../../src/img/favicon.svg` | `../js/nav.js` | `./g##-slug.html` |
| `src/index.html` | `./css/style.css` | `./img/favicon.svg` | `./js/nav.js` | `./module-N/` |
| `src/module-N/page.html` | `../css/style.css` | `../img/favicon.svg` | `../js/nav.js` | `./g##-slug.html` |
| `launch.html` (root) | `./src/css/style.css` | `./src/img/favicon.svg` | N/A | `./src/`, `./ml-foundations/`, etc. |

**If styling breaks on a page:** The path to `src/css/style.css` is almost certainly wrong.

---

## How to Add Content

**Start here:** `SOP-CONTENT-AND-DEPLOY.md` — it's the comprehensive, step-by-step procedure.

Brief summary:

### To add a gap page to an existing course:

1. **Scaffold:** Run `node generate-pages.js` to create the skeleton with correct anatomy.
2. **Write:** Edit the gap page's `<div class="content">` with the page body (2,000–4,000 words).
3. **Add interactivity:** Include at least one of: toggle-reveal, quiz, SVG diagram, or before/after comparison.
4. **Update nav.js:** Add the gap to the course's `js/nav.js` MODULES and LEARNING_PATH arrays.
5. **Link prerequisites:** Add `prereq-chip` links in the gap page's `div.prereqs`.
6. **Test locally:** Open in browser, verify sidebar navigation and Previous/Next chain.
7. **Deploy:** Commit and push.

### To add a new course:

1. Create `<course>/` directory with `index.html`, `js/nav.js`, `module-1/` etc.
2. Copy the nav.js structure from an existing course (e.g., `ml-foundations/js/nav.js`). Change ONLY MODULES and LEARNING_PATH.
3. Follow "add a gap page" steps above for each gap.
4. Update `launch.html` with a card linking to the new course.
5. Deploy.

---

## Navigation and Learning Path

### The learning path is immutable

Each course's learning path is defined in `<course>/js/nav.js` as the `LEARNING_PATH` array. This determines the Previous/Next chain across every page.

**For LLM Intelligence:**
```
G11 → G1 → G12 → G13 → G4 → G14 → G5 → G15 → G2 → G3 → G6 → G33 → G9 → G16 → G17 → G29 → G18 → G19 → G20 → G21 → G8 → G22 → G23 → G24 → G25 → G26 → G27 → G34 → G28 → G7 → G10 → G30 → G31 → G32
```

**Changing the learning path requires explicit approval.** The curriculum is the source of truth; the learning path order is derived from it.

### Cross-course linking is allowed

Pages can link to gaps in other courses using relative paths:
```html
<a href="../../other-course/module-N/slug.html">Gap Title</a>
```

---

## Page Anatomy (Required for Every Gap Page)

Every gap page must include these sections in order (see `SOP-CONTENT-AND-DEPLOY.md` Part 1 Step 2 for the full checklist):

```html
<!DOCTYPE html>
<html>
<head>
  <!-- charset, viewport, title, stylesheet, favicon, og: meta tags -->
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="scroll-progress"></div>
  <button class="mobile-nav-toggle">☰</button>
  <div class="overlay"></div>
  
  <nav id="sidebar"><!-- rendered by nav.js --></nav>
  
  <main id="main">
    <div class="breadcrumb">Home > Module N > Gap Title</div>
    <div class="hero">
      <span class="gap-badge">G##</span>
      <h1>Gap Title</h1>
      <p class="one-liner">One-liner from curriculum</p>
      <span class="reading-time">~10 min</span>
      <div class="analogy">Anchor analogy from curriculum</div>
    </div>
    
    <div class="callout callout-why">Why This Matters</div>
    <div class="callout callout-argue">After This Page, You Can Argue</div>
    
    <div class="prereqs">
      <!-- prerequisite chips -->
    </div>
    
    <div class="content">
      <!-- 2,000–4,000 words of body content -->
      <!-- At least ONE interactive element: toggle-reveal, quiz, SVG, before/after -->
    </div>
    
    <div class="key-insight">Single most important takeaway</div>
    
    <details class="verification">
      <summary>Verification Questions</summary>
      <!-- 2–3 questions from curriculum -->
    </details>
    
    <div class="page-nav">
      <!-- Previous/Next buttons rendered by nav.js -->
    </div>
  </main>
  
  <script src="../js/nav.js"></script>
  <script>LLMNav.init('<slug>');</script>
</body>
</html>
```

**Absolute rules:**
- No inline `<style>` blocks — use `src/css/style.css` only
- No new CSS classes — use only what's defined in `src/css/style.css`
- No external CDN links — everything must work offline
- Every page must include `../js/nav.js` and call `LLMNav.init('<slug>')`

---

## Design System

All color tokens are CSS variables in `src/css/style.css`:

```css
--bg: #07090f;              /* deep navy-black */
--surface: #0f1221;         /* layer 1 */
--surface2: #161c30;        /* layer 2 */
--surface3: #1e2640;        /* layer 3 */
--cyan: #00e5ff;            /* primary accent */
--purple: #c084fc;          /* secondary accents */
--green: #34d399;
--amber: #fbbf24;
--red: #f87171;
--blue: #60a5fa;
--text: #e2e8f0;            /* primary text */
--text-muted: #8892a4;      /* secondary text */
--text-dim: #5a6375;        /* tertiary text */
```

**Layout:** Sticky sidebar (260px) + scrollable main (max 900px). Dark theme. System font stack. 1.75 line-height.

If styling ever looks broken, the most likely issue is: asset path to `src/css/style.css` is wrong.

---

## File Naming Conventions

### Gap page files

Format: `g{number}-{kebab-slug}.html`

| Course | Example | Prefix | Format |
|--------|---------|--------|--------|
| LLM Intelligence | `g11-tokenization.html` | `g` | G + number (g01, g02, ..., g34) |
| ML Foundations | `f01-what-is-a-model.html` | `f` | F + number |
| Building NNs | `n01-autograd.html` | `n` | N + number |
| AI Engineering | `e01-prompt-engineering.html` | `e` | E + number |

**Always use leading zero:** `g01`, not `g1` — this keeps files sort-friendly.

---

## Project-Specific Rules

### 1. Generator safety guards
`generate-pages.js` protects authored content:
- It **skips** any page with hand-written content (no `content-placeholder` marker)
- It **refuses** to overwrite unless you run `--force`
- If you run `--force`, it creates a `.bak` timestamped backup

**Never run `--force` without manually re-merging your content into the generated page.**

### 2. Do not modify `src/` directly
Except for new gaps following the procedure in `SOP-CONTENT-AND-DEPLOY.md`, do not manually edit files in `src/`. The generator owns the scaffolding of new pages.

### 3. Curriculum is upstream, never modified in this repo
The authoritative curriculum is in `C:\Claude Cowork\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md`. Every page's gap number, prerequisites, "Why It Matters" text, and verification questions come FROM that file. Never change the curriculum from within this repo.

### 4. Every gap page maps to exactly one curriculum row
- No orphan pages (page without a curriculum row)
- No missing gaps (curriculum row without a page)

The ROADMAP.md tracks which pages are done. When you complete a gap, update the ROADMAP.

---

## QA Checklist (After Adding Content)

Before committing, verify:

- [ ] **Stylesheet present:** `grep 'src/css/style.css' <file>` returns the correct relative path
- [ ] **nav.js present:** `grep 'nav.js' <file>` at bottom of body, plus `LLMNav.init('<slug>')` call
- [ ] **No inline styles:** `grep '<style>' <file>` returns nothing
- [ ] **No CDN links:** `grep -i 'cdn\|jsdelivr\|googleapis' <file>` returns nothing
- [ ] **Page anatomy complete:** breadcrumb, hero, callout-why, callout-argue, prereqs, content, key-insight, verification, page-nav all present
- [ ] **Interactive element exists:** At least one toggle-reveal, quiz, SVG, or before/after in content
- [ ] **nav.js updated:** Gap slug in MODULES array and LEARNING_PATH array (in correct order)
- [ ] **Links work:** Open in browser, test Previous/Next chain, test all prerequisite chips
- [ ] **No broken cross-links:** All forward/back references to other gaps resolve

---

## Deployment

Deployment is **automatic** on push to the configured branch.

**Live URL:** `https://llm-intelligence-course.vercel.app`

**Vercel config:** `vercel.json` rewrites `/` to `/launch.html` and serves all files from root.

**To deploy:**
1. Verify locally with `python -m http.server 8000` and `http://localhost:8000/launch.html`
2. `git add <course-dir>/ launch.html` (only changed files)
3. `git commit -m "Add [description]"`
4. `git push origin <branch-name>`
5. Vercel deploys within 1–2 minutes

---

## Troubleshooting

### "Styles not loading on a page I just created"
→ Check the relative path to `src/css/style.css`. Use the table in the Architecture section.

### "Sidebar shows old page list (new gap not listed)"
→ You forgot to update `<course>/js/nav.js`. Add the gap to MODULES and LEARNING_PATH arrays.

### "Previous/Next buttons don't navigate correctly"
→ Gap slug in `LEARNING_PATH` is misspelled or in the wrong order.

### "generate-pages.js says 'page exists, skipping'"
→ The page already has authored content. The generator won't overwrite it. If you need to re-scaffold, run `node generate-pages.js --force` (creates a .bak, then re-merge your content).

### "localStorage progress isn't persisting"
→ You opened the page via `file://` (local file). Use `python -m http.server 8000` instead. `localStorage` requires HTTP.

---

## Further Reading

- **`SOP-CONTENT-AND-DEPLOY.md`** — Comprehensive step-by-step procedures for all content tasks
- **`ROADMAP.md`** — Build status and completion tracking
- **`PROJECT-PLAN.md`** — Original project plan and design decisions
- **`README.md`** — User-facing course overview
- **`HANDOFF.md`** — Build history and handoff notes

---

## Contact & Context

This project is maintained as part of the AI Autonomy learning initiative. All content follows the voice and standards defined in the existing gap pages and curriculum.

For questions about adding content, refer to `SOP-CONTENT-AND-DEPLOY.md` first. It covers every scenario.
