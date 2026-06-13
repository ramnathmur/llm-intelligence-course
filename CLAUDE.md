# AI Autonomy — Project Instructions

## What This Project Is

A self-contained HTML learning package that takes a reader from "LLMs are just supercharged next-word guessers" to a full, defensible understanding of how and why LLMs exhibit genuine artificial intelligence — and how that intelligence becomes autonomous action.

**Source of truth:** `C:\Claude Cowork\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md` — the 34-gap curriculum across 7 modules. Every HTML page maps to one gap. Every gap gets one page. No orphan pages, no missing gaps.

**Prior work:** `llm-intelligence-deep-dive_v1.html` is the original single-page explainer. It covers prerequisites (observe-reason-act loop, tool-calling, RLHF basics, context windows, autonomy as iteration depth). The new package replaces and extends it but preserves its design language.

---

## Architecture

```
src/
├── index.html                  # Landing page — module map, learning path, progress tracker
├── css/style.css               # Shared design tokens, layout, components
├── js/nav.js                   # Sidebar navigation, progress state, inter-page linking
├── img/                        # Diagrams, illustrations (SVG preferred)
├── module-1/                   # From Text to Numbers (G11, G1, G12)
├── module-2/                   # The Learning Engine (G13, G4, G14, G15, G5)
├── module-3/                   # The Reasoning Machine (G2, G3, G6, G9, G16, G17, G29, G33)
├── module-4/                   # The Alignment Layer (G18, G19, G20, G21)
├── module-5/                   # The Agent Architecture (G8, G22, G23, G24, G25)
├── module-6/                   # Seeing Inside (G26, G27, G28, G34)
└── module-7/                   # Philosophy of Machine Intelligence (G7, G10, G30, G31, G32)
```

### File naming

Gap pages: `g{number}-{slug}.html` — e.g., `g11-tokenization.html`, `g01-weights.html`.
Use the gap number as-is (g01 not g1) for sort-friendly filenames.

### Page manifest

| Module | File | Gap |
|--------|------|-----|
| 1 | `module-1/g11-tokenization.html` | G11 — Tokenization and Embedding Spaces |
| 1 | `module-1/g01-weights.html` | G1 — What Weights Actually Encode |
| 1 | `module-1/g12-training-objective.html` | G12 — The Training Objective |
| 2 | `module-2/g13-backpropagation.html` | G13 — Backpropagation and Gradient Descent |
| 2 | `module-2/g04-scaling-laws.html` | G4 — Neural Scaling Laws |
| 2 | `module-2/g14-pretraining-data.html` | G14 — Pre-Training Data |
| 2 | `module-2/g15-fine-tuning.html` | G15 — Fine-Tuning and Transfer Learning |
| 2 | `module-2/g05-emergence.html` | G5 — Emergent Capabilities |
| 3 | `module-3/g02-attention.html` | G2 — Transformer Attention |
| 3 | `module-3/g03-in-context-learning.html` | G3 — In-Context Learning |
| 3 | `module-3/g06-compositional-generalization.html` | G6 — Compositional Generalization |
| 3 | `module-3/g33-hallucination.html` | G33 — Hallucination |
| 3 | `module-3/g09-chain-of-thought.html` | G9 — Chain-of-Thought as Computation |
| 3 | `module-3/g16-advanced-reasoning.html` | G16 — Advanced Reasoning |
| 3 | `module-3/g17-extended-thinking.html` | G17 — Extended Thinking |
| 3 | `module-3/g29-multimodal.html` | G29 — Multimodal Intelligence |
| 4 | `module-4/g18-rlhf.html` | G18 — RLHF Deep Dive |
| 4 | `module-4/g19-beyond-rlhf.html` | G19 — Beyond RLHF |
| 4 | `module-4/g20-alignment.html` | G20 — The Alignment Problem |
| 4 | `module-4/g21-adversarial.html` | G21 — Adversarial Robustness |
| 5 | `module-5/g08-lens-picking.html` | G8 — How the Agent Picks the Right Lens |
| 5 | `module-5/g22-memory-architectures.html` | G22 — Memory Architectures |
| 5 | `module-5/g23-goal-decomposition.html` | G23 — Goal Decomposition |
| 5 | `module-5/g24-multi-agent.html` | G24 — Multi-Agent Systems |
| 5 | `module-5/g25-autonomy-spectrum.html` | G25 — The Autonomy Spectrum |
| 6 | `module-6/g26-mechanistic-interpretability.html` | G26 — Mechanistic Interpretability |
| 6 | `module-6/g27-superposition.html` | G27 — Superposition and Polysemanticity |
| 6 | `module-6/g34-world-models.html` | G34 — Internal World Models |
| 6 | `module-6/g28-benchmarking.html` | G28 — Benchmarking Intelligence |
| 7 | `module-7/g07-grounding.html` | G7 — The Grounding Question |
| 7 | `module-7/g10-intelligence-consciousness.html` | G10 — Intelligence vs. Consciousness |
| 7 | `module-7/g30-functionalism.html` | G30 — Functionalism |
| 7 | `module-7/g31-intentionality.html` | G31 — Intentionality and Aboutness |
| 7 | `module-7/g32-frontier.html` | G32 — The Current Frontier |

---

## Design System

### Visual continuity with v1

The existing `llm-intelligence-deep-dive_v1.html` established a dark-mode design language. The new package inherits it exactly:

- **Background:** `#07090f` (deep navy-black)
- **Surfaces:** `#0f1221`, `#161c30`, `#1e2640` (layered depth)
- **Primary accent:** `#00e5ff` (cyan) — headings, active nav, links
- **Secondary accents:** purple `#c084fc`, green `#34d399`, amber `#fbbf24`, red `#f87171`, blue `#60a5fa`
- **Text:** `#e2e8f0` (primary), `#8892a4` (muted), `#5a6375` (dim)
- **Typography:** System font stack, 1.75 line-height for body
- **Layout:** Sticky sidebar (260px) + scrollable main content (max 900px)

All tokens live in `src/css/style.css`. Individual pages link to the shared stylesheet — no inline `<style>` blocks.

### Page structure (every gap page)

Each gap page follows this anatomy:

1. **Sidebar** — persistent navigation showing all 7 modules, current page highlighted, progress indicators
2. **Breadcrumb** — `Module N > Gap Title`
3. **Hero block** — Gap number badge, title, one-liner, anchor analogy
4. **"Why This Matters" callout** — from the curriculum's "Why It Matters" column
5. **Prerequisites bar** — linked chips to prerequisite gap pages
6. **Main content** — the deep explanation (2,000–4,000 words per gap)
7. **Key insight box** — the single most important takeaway, visually distinct
8. **Interactive element** — at least one per page: a diagram, a toggle-reveal, a quiz, a before/after comparison, or a worked example
9. **Verification questions** — collapsible section with the curriculum's verification questions
10. **Navigation footer** — Previous / Next in learning path, plus "Up to Module" link
11. **Cross-links** — inline links to other gap pages wherever concepts reference each other

### Content guidelines

- **Persona:** Dr. Meridith Kane — authoritative, precise, uses real-world analogies
- **Audience:** Practitioner with business consulting background, intermediate Python, no ML/math background beyond basic algebra
- **Analogies:** Draw from business consulting, cricket, family, healthcare, everyday systems
- **Citations:** Every major claim links to the paper in the bibliography. Use inline citations `(Author et al., Year)` with a tooltip or footnote showing the full reference
- **Honesty:** Flag active debates. Use uncertainty language ("evidence suggests" not "it is proven") for contested claims (especially G7, G30, G31, G33)
- **Length:** 2,000–4,000 words per page. Shorter for narrow concepts (G12), longer for deep ones (G2, G7)
- **No fluff:** Every paragraph must advance understanding. Cut any sentence that restates what the previous one said

### Interactive elements (one minimum per page)

Choose from this toolkit:
- **Toggle-reveal:** Click to show the answer to a conceptual question before reading the explanation
- **Annotated diagram:** SVG with hover-tooltips on components (e.g., attention mechanism, transformer block)
- **Before/after comparison:** Two-column showing the "guesser" interpretation vs. the accurate interpretation
- **Worked example:** Step-by-step walkthrough of a concept with real text/tokens
- **Self-check quiz:** 2–3 multiple-choice questions with instant feedback, drawn from verification questions
- **Dependency mini-map:** SVG showing where this gap sits in the full learning path

---

## Navigation and Interlinking

### Sidebar

The sidebar is consistent across all pages. It shows:
- Package title ("LLM Intelligence")
- 7 module sections, each expandable to show its gap pages
- Current page highlighted with cyan left-border
- Completed pages marked (using localStorage progress state)

### Learning path navigation

Every page has Previous/Next buttons following the linear learning path:
```
G11→G1→G12→G13→G4→G14→G5→G15→G2→G3→G6→G33→G9→G16→G17→G29→G18→G19→G20→G21→G8→G22→G23→G24→G25→G26→G27→G34→G28→G7→G10→G30→G31→G32
```

### Cross-links

When a page references a concept covered in another gap, link to it:
- Forward references (concept not yet covered): `You'll explore this in <a href="...">G16 — Advanced Reasoning</a>`
- Back references (already covered): `As you saw in <a href="...">G2 — Transformer Attention</a>`

### Progress tracking

`nav.js` uses `localStorage` to track which pages the reader has visited. The index page and sidebar reflect this state. No server needed — everything is client-side, static HTML.

---

## Build and Preview

This is a static HTML package. No build step, no bundler, no framework.

- **Preview:** Open `src/index.html` in a browser. All paths are relative.
- **Deploy:** Copy `src/` to any static host (GitHub Pages, Netlify, S3).
- **Test:** Open each page, verify sidebar navigation, check all cross-links resolve, confirm Previous/Next chain is unbroken.

---

## Workflow for Creating Gap Pages

When building a gap page:

1. Read the gap's row in the curriculum (`ai-autonomy_Curriculum_v2.md`) — absorb the one-liner, why-it-matters, prerequisites, verification questions, anchor analogy, and bibliography citation.
2. Research the topic using the cited paper and current understanding.
3. Write the content following the page structure above.
4. Ensure all prerequisite links point to existing pages.
5. Add at least one interactive element.
6. Test the page in a browser — check styles, nav, links.
7. Update ROADMAP.md to mark the gap as complete.

---

## Rules

- Every page links `../css/style.css` and `../js/nav.js`. No inline styles, no per-page scripts except for page-specific interactives.
- SVG diagrams are inline in the HTML (not external files) unless shared across pages.
- No external CDN dependencies. Everything works offline.
- The learning path order in nav.js must match the curriculum exactly. If the curriculum changes, nav.js is the single place to update.
- Do not modify the curriculum file from this project. It lives in CLAUDE OUTPUTS and is the upstream source of truth.
