# AI Autonomy Learning Package — Roadmap

> **Authoritative build plan:** see `PROJECT-PLAN.md` for the full 7-item plan, phasing, dependencies, and copy-paste templates. The phase numbers below track per-module content; PROJECT-PLAN.md is the source of truth for sequencing.

## Phase 0: Safety & Build Conventions ✅
- [x] Git repository initialized; pristine scaffold committed as the recoverable floor
- [x] **Generator overwrite guard** — `generate-pages.js` now SKIPs any page whose `content-placeholder` marker is gone (i.e. authored), so re-running it can never silently wipe content. Use `node generate-pages.js --force` only for a deliberate re-scaffold: it writes a timestamped `.bak` and you must manually re-merge the `<div class="content">`.
- [x] G4 anchor analogy reverted to the water→ice phase-transition (curriculum-correct)
- [x] New CSS classes in `style.css`: `.callout-think` (Think Further), `.callout-callback` (spaced-retrieval), `.token-chip` (G11 tokenizer)
- [x] `src/template.html` retired (gitignored)

**Editing model (important):** the generator owns the structural shell of *placeholder* pages only. All deep content + interactives are **hand-written** into the `<div class="content">` of each HTML file. Once a page is authored the guard protects it — post-content structural changes are hand-edits or a deliberate `--force` + `.bak` + manual re-merge, never a plain regen.

## Phase 1: Foundation (Scaffolding) ✅
- [x] Curriculum v1 → v2 (34 gaps, 7 modules)
- [x] Self-evaluation and v2.1 revision
- [x] CLAUDE.md project instructions
- [x] ROADMAP.md
- [x] Folder structure (`src/` with module directories)
- [x] Shared CSS (`src/css/style.css`)
- [x] Navigation JS (`src/js/nav.js`)
- [x] Index page (`src/index.html`)
- [x] Gap page template (`src/template.html`)
- [x] All 34 skeleton gap pages generated

## Phase 2: Module 1 — From Text to Numbers ⬜
- [ ] `module-1/g11-tokenization.html` — Tokenization and Embedding Spaces
- [ ] `module-1/g01-weights.html` — What Weights Actually Encode
- [ ] `module-1/g12-training-objective.html` — The Training Objective

## Phase 3: Module 2 — The Learning Engine ⬜
- [ ] `module-2/g13-backpropagation.html` — Backpropagation and Gradient Descent
- [ ] `module-2/g04-scaling-laws.html` — Neural Scaling Laws
- [ ] `module-2/g14-pretraining-data.html` — Pre-Training Data
- [ ] `module-2/g15-fine-tuning.html` — Fine-Tuning and Transfer Learning
- [ ] `module-2/g05-emergence.html` — Emergent Capabilities

## Phase 4: Module 3 — The Reasoning Machine ⬜
- [ ] `module-3/g02-attention.html` — Transformer Attention
- [ ] `module-3/g03-in-context-learning.html` — In-Context Learning
- [ ] `module-3/g06-compositional-generalization.html` — Compositional Generalization
- [ ] `module-3/g33-hallucination.html` — Hallucination
- [ ] `module-3/g09-chain-of-thought.html` — Chain-of-Thought as Computation
- [ ] `module-3/g16-advanced-reasoning.html` — Advanced Reasoning
- [ ] `module-3/g17-extended-thinking.html` — Extended Thinking
- [ ] `module-3/g29-multimodal.html` — Multimodal Intelligence

## Phase 5: Module 4 — The Alignment Layer ⬜
- [ ] `module-4/g18-rlhf.html` — RLHF Deep Dive
- [ ] `module-4/g19-beyond-rlhf.html` — Beyond RLHF
- [ ] `module-4/g20-alignment.html` — The Alignment Problem
- [ ] `module-4/g21-adversarial.html` — Adversarial Robustness

## Phase 6: Module 5 — The Agent Architecture ⬜
- [ ] `module-5/g08-lens-picking.html` — How the Agent Picks the Right Lens
- [ ] `module-5/g22-memory-architectures.html` — Memory Architectures
- [ ] `module-5/g23-goal-decomposition.html` — Goal Decomposition
- [ ] `module-5/g24-multi-agent.html` — Multi-Agent Systems
- [ ] `module-5/g25-autonomy-spectrum.html` — The Autonomy Spectrum

## Phase 7: Module 6 — Seeing Inside ⬜
- [ ] `module-6/g26-mechanistic-interpretability.html` — Mechanistic Interpretability
- [ ] `module-6/g27-superposition.html` — Superposition and Polysemanticity
- [ ] `module-6/g34-world-models.html` — Internal World Models
- [ ] `module-6/g28-benchmarking.html` — Benchmarking Intelligence

## Phase 8: Module 7 — Philosophy of Machine Intelligence ⬜
- [ ] `module-7/g07-grounding.html` — The Grounding Question
- [ ] `module-7/g10-intelligence-consciousness.html` — Intelligence vs. Consciousness
- [ ] `module-7/g30-functionalism.html` — Functionalism
- [ ] `module-7/g31-intentionality.html` — Intentionality and Aboutness
- [ ] `module-7/g32-frontier.html` — The Current Frontier

## Phase 9: Polish and Integration ⬜
- [ ] Full cross-link audit (every prerequisite reference links to the right page)
- [ ] Navigation chain test (Previous/Next unbroken across all 34 pages)
- [ ] Progress tracking test (localStorage marks, sidebar indicators)
- [ ] Mobile responsiveness pass
- [ ] Final review of index page with all modules populated
