# SOP: Adding Content and Deploying to Vercel

This is the standard operating procedure for adding new content to the AI Learning Ecosystem and deploying it. Follow every step in order. Do not skip steps.

---

## Project Structure

```
ai autonomy/
  launch.html              ← Gateway page (links to all courses)
  vercel.json              ← Vercel config (serves from project root)
  src/                     ← LLM Intelligence (core course, 34 gaps, 7 modules)
    css/style.css          ← Shared stylesheet for ALL courses
    js/nav.js              ← Navigation script (LLM Intelligence data)
    img/favicon.svg        ← Shared favicon
    index.html             ← LLM Intelligence course landing
    module-1/ ... module-7/
  ml-foundations/           ← ML Foundations (9 gaps, 2 modules)
    index.html
    js/nav.js
    module-1/ module-2/
  nn-from-scratch/          ← Building NNs From Scratch (9 gaps, 3 modules)
    index.html
    js/nav.js
    module-1/ module-2/ module-3/
  ai-engineering/           ← AI Engineering (11 gaps, 4 modules)
    index.html
    js/nav.js
    module-1/ module-2/ module-3/ module-4/
```

---

## Part 1: Adding a New Gap Page to an Existing Course

### Step 1 — Read Before Writing

Read these files before creating any content:

1. `src/template.html` — the canonical page anatomy every gap page follows
2. `src/css/style.css` — design tokens and all component styles
3. The course's `js/nav.js` — current MODULES and LEARNING_PATH arrays
4. An existing gap page from the same course — as a reference implementation
5. `launch.html` — only if the landing gateway needs updating

### Step 2 — Create the Gap Page

**File location:** `<course>/module-N/<slug>.html`

**Naming convention:** `<prefix><number>-<kebab-slug>.html`
- LLM Intelligence: `g01-weights.html` (prefix: g)
- ML Foundations: `f01-what-is-a-model.html` (prefix: f)
- Building NNs: `n01-autograd.html` (prefix: n)
- AI Engineering: `e01-prompt-engineering.html` (prefix: e)

**Asset paths from a module subpage:**
```html
<link rel="stylesheet" href="../../src/css/style.css">
<link rel="icon" href="../../src/img/favicon.svg" type="image/svg+xml">
<script src="../js/nav.js"></script>
<script>LLMNav.init('<slug>');</script>
```

Note: All courses share `src/css/style.css`. The path is always `../../src/css/style.css` from a module subpage. The nav.js is course-specific at `../js/nav.js`.

**Required page sections (in order):**

1. `<head>` — charset, viewport, title, stylesheet, favicon, og: meta tags
2. `a.skip-link` — "Skip to content" accessibility link
3. `div.scroll-progress` — scroll progress indicator
4. `button.mobile-nav-toggle` — hamburger menu
5. `div.overlay` — mobile nav overlay
6. `nav#sidebar` — rendered by nav.js
7. `main#main` containing:
   - `div.breadcrumb` — Home > Module N: Title > Gap Title
   - `div.hero` — gap-badge, h1, p.one-liner, span.reading-time, div.analogy
   - `div.callout.callout-why` — "Why This Matters" block
   - `div.callout.callout-argue` — "After This Page, You Can Argue" block
   - `div.prereqs` — prerequisite chips linking to other pages
   - `div.content` — main body (2,000-4,000 words)
   - At least ONE interactive element inside div.content
   - `div.key-insight` — single most important takeaway
   - `details.verification` or equivalent — collapsible verification questions
   - `div.page-nav` — Previous/Next navigation (rendered by nav.js)
8. `<script src="../js/nav.js"></script>` — at bottom of body
9. `<script>LLMNav.init('<slug>');</script>` — immediately after nav.js

**Interactive element options (choose one per page):**
- `div.toggle-reveal` with `div.toggle-reveal-header` + `div.toggle-reveal-body`
- Self-check quiz (2-3 multiple choice questions with instant feedback)
- Inline annotated SVG diagram with hover tooltips
- Before/after comparison in two columns

**Absolute rules:**
- No inline `<style>` blocks
- No new CSS classes — use only classes defined in `src/css/style.css`
- No external CDN links — everything works offline
- No changes to `src/css/style.css` unless adding a genuinely new component type

### Step 3 — Update the Course nav.js

Edit `<course>/js/nav.js` to register the new gap:

1. Add the gap entry to the correct module in the `MODULES` array:
   ```js
   { id: 'F10', slug: 'f10-new-gap', title: 'New Gap Title' }
   ```

2. Insert the slug into `LEARNING_PATH` at the correct position:
   ```js
   const LEARNING_PATH = ['f01-what-is-a-model', ..., 'f10-new-gap', ...];
   ```

The LEARNING_PATH array determines the Previous/Next chain. Position matters.

### Step 4 — Update Cross-References

- If the new page has prerequisites, add `prereq-chip` links in its `div.prereqs`
- If other pages should link to this new page, add forward-reference links in those pages
- Prerequisite links can cross courses: `href="../../other-course/module-N/slug.html"`

### Step 5 — Verify

Open the page in a browser and confirm:
- Sidebar renders with the new page listed and highlighted
- Previous/Next buttons navigate correctly
- Stylesheet loads (dark theme visible)
- All prerequisite chip links resolve
- Interactive element works
- Mobile hamburger menu works

---

## Part 2: Adding a New Module to an Existing Course

### Step 1 — Create the Module Directory

```
<course>/module-N/
```

### Step 2 — Create All Gap Pages

Follow Part 1 Steps 2-4 for each gap page in the module.

### Step 3 — Update nav.js

Add the new module object to the `MODULES` array:

```js
{
  id: N,
  title: 'Module Title',
  color: 'var(--cyan)',  // choose: --cyan, --green, --purple, --amber, --red, --blue
  gaps: [
    { id: 'XX', slug: 'xx-slug', title: 'Gap Title' },
    ...
  ]
}
```

Add all gap slugs to `LEARNING_PATH` in the correct position.

### Step 4 — Update the Course index.html

If the course `index.html` renders modules statically (not via JS), add the new module card. If it renders from nav.js data, it updates automatically.

---

## Part 3: Adding an Entirely New Course

### Step 1 — Create the Course Directory

```
<course-slug>/
  index.html
  js/nav.js
  module-1/
  module-2/
  ...
```

### Step 2 — Create js/nav.js

Copy the structure from any existing course's nav.js (e.g., `ml-foundations/js/nav.js`). Change ONLY:
- `MODULES` array — populate with the new course's modules and gaps
- `LEARNING_PATH` array — the linear sequence of gap slugs
- `STORAGE_KEY` — set to `'<course-slug>-progress'` for isolated progress tracking
- Sidebar title and subtitle strings

Keep ALL rendering logic, progress tracking, mobile menu, verification toggle, scroll progress, theme toggle, and quiz handling identical.

### Step 3 — Create index.html

Model after any existing course's `index.html`. Required elements:
- Title: `"<Course Name> — Course Overview"`
- Stylesheet: `<link rel="stylesheet" href="../src/css/style.css">`
- Favicon: `<link rel="icon" href="../src/img/favicon.svg" type="image/svg+xml">`
- "All Courses" back-link pointing to `../launch.html`
- Module cards showing all gaps with links to `./module-N/slug.html`
- "Start Learning" button linking to the first gap page
- Script: `<script src="./js/nav.js"></script>` at bottom of body

### Step 4 — Create All Gap Pages

Follow Part 1 for each gap page. Asset paths from module subpages:
```
../../src/css/style.css
../../src/img/favicon.svg
../js/nav.js
```

### Step 5 — Update launch.html

Add a course card to `launch.html` following the existing card HTML pattern. Place it in the correct position in the learning path sequence:
1. ML Foundations (BEFORE)
2. Building NNs From Scratch (BEFORE)
3. LLM Intelligence (CORE)
4. AI Engineering (AFTER)
5. [New course — position based on where it fits]

### Step 6 — Update vercel.json (only if needed)

The current `vercel.json` serves the entire project root:
```json
{
  "buildCommand": "true",
  "outputDirectory": ".",
  "rewrites": [
    { "source": "/", "destination": "/launch.html" },
    { "source": "/(.*)", "destination": "/$1" }
  ]
}
```

New course directories at the project root are served automatically. No config change needed unless you need custom rewrites.

---

## Part 4: Content Standards

### Writing voice
- Persona: Dr. Meridith Kane — authoritative, precise, warm. Never condescending.
- Audience: business consulting background, intermediate Python, no ML math beyond algebra.
- Analogies from: business consulting, project management, cricket, healthcare, everyday systems.
- Intuition sentence FIRST, then the formal definition.
- Short paragraphs. No sentence over 30 words. Active voice.
- Citations: `(Author et al., Year)` with a title attribute showing the full reference.
- Uncertainty language for contested claims: "evidence suggests," never "it is proven."

### Design tokens (from src/css/style.css)
```
Background:    #07090f (--bg)
Surfaces:      #0f1221, #161c30, #1e2640 (--surface, --surface2, --surface3)
Primary:       #00e5ff (--cyan)
Accents:       #c084fc (--purple), #34d399 (--green), #fbbf24 (--amber),
               #f87171 (--red), #60a5fa (--blue)
Text:          #e2e8f0 (--text), #8892a4 (--text-muted), #5a6375 (--text-dim)
```

### What NOT to do
- Never add inline `<style>` blocks
- Never invent new CSS classes
- Never link to external CDNs
- Never modify `src/css/style.css` unless adding a genuinely new reusable component
- Never modify existing gap pages in `src/` unless explicitly asked
- Never change the learning path order without explicit approval

---

## Part 5: Deploying to Vercel

### How it works

This project deploys via Vercel's GitHub integration. The deployment is automatic on push.

- **Repository:** `https://github.com/ramnathmur/llm-intelligence-course.git`
- **Branch:** `session/jun-14-landing-hub-handoff` (or whichever branch is configured in Vercel)
- **Live URL:** `https://llm-intelligence-course.vercel.app`
- **Root URL** (`/`) rewrites to `/launch.html`

### Deploy procedure

**Step 1 — Verify locally**

Open `launch.html` in a browser. Click through to the new/modified content. Confirm:
- [ ] Pages load with dark theme (stylesheet resolves)
- [ ] Sidebar navigation renders correctly
- [ ] Previous/Next links work across the entire chain
- [ ] All prerequisite chip links resolve
- [ ] Interactive elements function
- [ ] No console errors

**Step 2 — Stage and commit**

```bash
# Stage only the files you changed/added
git add <course-dir>/ launch.html

# Commit with a descriptive message
git commit -m "Add [description of what was added]"
```

Commit message conventions:
- `Add G35 — New Gap Title to Module 6` (single gap)
- `Add Module 8: New Module Title to LLM Intelligence` (new module)
- `Add new-course-name course (N gaps, M modules)` (new course)

**Step 3 — Push**

```bash
git push origin <branch-name>
```

Vercel auto-deploys within 1-2 minutes of the push.

**Step 4 — Verify live**

After Vercel deploys, open `https://llm-intelligence-course.vercel.app` and spot-check:
- [ ] Launch gateway shows all courses
- [ ] New content loads at the correct URL path
- [ ] Navigation works end-to-end

---

## QA Checklist (run after every content addition)

| Check | How to verify |
|-------|---------------|
| Stylesheet link correct | `grep 'src/css/style.css' <file>` — must be present |
| Favicon link correct | `grep 'src/img/favicon.svg' <file>` — must be present |
| nav.js script present | `grep 'nav.js' <file>` — must be present at bottom of body |
| LLMNav.init called | `grep 'LLMNav.init' <file>` — must be present with correct slug |
| No inline styles | `grep '<style>' <file>` — must return nothing |
| No CDN links | `grep -i 'cdn\|jsdelivr\|googleapis\|unpkg' <file>` — must return nothing |
| Required sections exist | Check for: breadcrumb, hero, callout-why, callout-argue, prereqs, content, key-insight, verification, page-nav |
| Interactive element exists | At least one toggle-reveal, quiz, or SVG diagram in div.content |
| LEARNING_PATH updated | The gap slug appears in the course's nav.js LEARNING_PATH array |
| MODULES updated | The gap entry appears in the correct module in the MODULES array |
| No src/ modifications | `git diff --name-only src/` returns empty (unless explicitly asked) |

---

## Quick Reference: Asset Path Cheat Sheet

| From this location | Stylesheet path | Favicon path | nav.js path |
|--------------------|-----------------|--------------|-------------|
| `<course>/index.html` | `../src/css/style.css` | `../src/img/favicon.svg` | `./js/nav.js` |
| `<course>/module-N/page.html` | `../../src/css/style.css` | `../../src/img/favicon.svg` | `../js/nav.js` |
| `src/index.html` | `./css/style.css` | `./img/favicon.svg` | `./js/nav.js` |
| `src/module-N/page.html` | `../css/style.css` | `../img/favicon.svg` | `../js/nav.js` |
| `launch.html` | `./src/css/style.css` | `./src/img/favicon.svg` | N/A |
