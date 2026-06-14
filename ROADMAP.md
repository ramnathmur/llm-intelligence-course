# AI Autonomy Learning Package — Roadmap

> **Authoritative build plan:** see `PROJECT-PLAN.md` for the full 7-item plan, phasing, dependencies, and copy-paste templates.

> **✅ COMPLETE (2026-06-14):** All 34 gap pages authored (full content + interactives + quizzes + Key Insight boxes + Think-Further callouts + callbacks/forward-refs), plus landing page. Independently verified: 34/34 pages pass static QA (required anatomy, single-answer quizzes, no inline styles, intact nav, **zero broken links, zero placeholders**); all 14 inline SVGs well-formed. See `HANDOFF.md` for build history.

## Phase 0: Safety & Build Conventions ✅
- [x] Git repository initialized; pristine scaffold committed as the recoverable floor
- [x] **Generator overwrite guard** — `generate-pages.js` SKIPs any authored page (no `content-placeholder` marker); `--force` writes a timestamped `.bak` for deliberate re-scaffolds
- [x] G4 anchor analogy reverted to the water→ice phase-transition
- [x] New CSS classes: `.callout-think`, `.callout-callback`, `.token-chip`; responsive-SVG rule for `.diagram-container svg`
- [x] `src/template.html` retired (gitignored)

**Editing model:** the generator owns the structural shell of *placeholder* pages only. All content + interactives are hand-edited into the `<div class="content">`. The guard permanently protects authored pages.

## Phase 1: Foundation (Scaffolding) ✅
- [x] Curriculum v2 (34 gaps, 7 modules); shared CSS, nav JS, index page, generator; all 34 skeleton pages

## Module 1 — From Text to Numbers ✅
- [x] `g11-tokenization.html` — Tokenization & Embedding Spaces (live tokenizer demo)
- [x] `g01-weights.html` — What Weights Actually Encode (before/after)
- [x] `g12-training-objective.html` — The Training Objective (worked-example walkthrough)

## Module 2 — The Learning Engine ✅
- [x] `g13-backpropagation.html` · [x] `g04-scaling-laws.html` (SVG scaling curve) · [x] `g14-pretraining-data.html` · [x] `g15-fine-tuning.html` · [x] `g05-emergence.html`

## Module 3 — The Reasoning Machine ✅
- [x] `g02-attention.html` (SVG) · [x] `g03-in-context-learning.html` · [x] `g06-compositional-generalization.html` · [x] `g33-hallucination.html` (SVG) · [x] `g09-chain-of-thought.html` (SVG) · [x] `g16-advanced-reasoning.html` · [x] `g17-extended-thinking.html` · [x] `g29-multimodal.html` (SVG)

## Module 4 — The Alignment Layer ✅
- [x] `g18-rlhf.html` · [x] `g19-beyond-rlhf.html` · [x] `g20-alignment.html` · [x] `g21-adversarial.html`

## Module 5 — The Agent Architecture ✅
- [x] `g08-lens-picking.html` · [x] `g22-memory-architectures.html` · [x] `g23-goal-decomposition.html` · [x] `g24-multi-agent.html` · [x] `g25-autonomy-spectrum.html`

## Module 6 — Seeing Inside ✅
- [x] `g26-mechanistic-interpretability.html` (SVG) · [x] `g27-superposition.html` (SVG) · [x] `g34-world-models.html` · [x] `g28-benchmarking.html`

## Module 7 — Philosophy of Machine Intelligence ✅
- [x] `g07-grounding.html` · [x] `g10-intelligence-consciousness.html` · [x] `g30-functionalism.html` · [x] `g31-intentionality.html` · [x] `g32-frontier.html` (capstone)

## Phase 9: Polish and Integration ✅
- [x] Cross-link audit — 0 broken links across all 34 pages
- [x] Navigation chain — Previous/Next unbroken; sidebar shows all 34
- [x] Progress tracking (localStorage) verified
- [x] Index page populated and rendering (7 module cards, 34 gap links)
- [ ] Pixel-level visual eyeball in a real desktop browser (the preview tool reports a 0×0 viewport, so final visual polish should be confirmed by opening `src/index.html` directly)
