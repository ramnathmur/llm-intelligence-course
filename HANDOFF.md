# HANDOFF — AI Autonomy course build

**Last session:** 2026-06-13 · **Next session:** resume content authoring (Phase 1)
**Repo:** `C:\Claude Cowork\Projects\ai autonomy` · git initialized, 2 commits, working tree clean.

---

## TL;DR — where we are

- **Phase 0 is DONE and committed.** Safety floor, generator guard, G4 fix, new CSS classes all in.
- **Content authoring has NOT started.** All **34 pages are still `content-placeholder` scaffolds.** Nothing half-written.
- **You approved:** build all 34 pages via **multi-agent workflows, all phases nonstop, review only at the end.**
- **Interrupted in flight:** I had just marked the chapter "Phase 1 build (Module 1)" and was about to launch the Phase 1 workflow. It was **never launched** — no agent ran, no page changed.

**Resume = launch the Phase 1 workflow described in §"Resume steps" below.**

---

## What was built this session

1. **Pedagogical course review** (7 dimensions) — delivered in chat (not filed). Surfaced the 8 priority action items.
2. **`PROJECT-PLAN.md`** (project root) — the authoritative build plan: 7 action items, 4 phases, dependency ordering, copy-paste templates (§6), the G4 fix (§7), and ready-to-apply tables (§8: callback map, Think-Further questions for all 34 gaps, forward-reference list). **This is the source of truth for authoring.**
3. **Phase 0 executed + committed** (commit `390d906`):
   - **Generator overwrite guard** in `generate-pages.js` — SKIPs any page whose `content-placeholder` marker is gone (i.e. authored). Verified live: it printed `SKIP (has hand-written content)` and left the file untouched. `--force` path writes a timestamped `.bak` + requires manual re-merge. Editing-model banner added at top of the file.
   - **G4 analogy** reverted to water→ice phase transition in **both** `generate-pages.js` (line ~11) and `src/module-2/g04-scaling-laws.html` (line 40).
   - **New CSS classes** in `src/css/style.css`: `.callout-think` (purple, 🔭 `\1F52D`), `.callout-callback` (blue, 🔙 `\1F519`), `.token-chip` (cyan monospace). Verified via computed styles — they render as one color-emoji family with the existing labels and pick up theming.
   - **`.gitignore`** added; `src/template.html` retired (gitignored); `_test-callouts.html` render-test page in `src/` (gitignored).
   - **`ROADMAP.md`** updated with the Phase 0 section + the editing-model note.
   - **Commit `3966407`** is the pristine pre-edit floor (recovery baseline).
   - **Correction made:** the plan's §6.5 guessed the existing callout glyphs were monochrome; ground truth is they're **color emoji**, so the two new labels were matched to color emoji (not monochrome).

---

## What's pending

| Phase | Scope | Status |
|---|---|---|
| **Phase 1 — Module 1 MVP** | Author G11, G1, G12 (full content + interactive + mid-content quiz + Key Insight box + Think-Further + forward refs) | **NOT started** |
| **Phase 2/3 — Rollout** | The remaining 31 pages (Modules 2–7): full content + interactive + quiz + Key Insight + Think-Further + forward refs + callbacks per §8.1 | NOT started |
| **Phase 4 — Polish** | `src/index.html` review (it's JS-driven, mostly auto-reflects); final cross-link + prev/next audit; mark ROADMAP gaps complete | NOT started |

---

## Resume steps (tomorrow)

1. **Restart the preview server:** `preview_start` with name `static` (defined in `.claude/launch.json`, port 3847). The previous server (id ended `…a68c5c`) will be gone.
   - ⚠️ **`preview_screenshot` times out in this environment** — verify rendering with `preview_eval` + `getComputedStyle`/DOM queries instead. (See memory.)
2. **Re-confirm the workflow opt-in.** Workflow opt-in is per-session; the standing decision is "all phases nonstop." Either the user says "continue" or re-affirm before firing workflows.
3. **Launch Phase 1 workflow** — an author → adversarial-verify → auto-repair pipeline over the 3 pages below. Then verify, then launch Phase 2/3 (31 pages, using a finished Phase-1 page as the consistency exemplar), then Phase 4.

### Authoring contract (applies to every page agent)
- **Voice:** Dr. Meridith Kane — direct, concrete, Andrew Ng energy; analogies from consulting/cricket/family/healthcare. No AI-slop ("delve", "tapestry", "it's worth noting"). Every paragraph advances understanding.
- **Edit ONLY** the inner `<div class="content">` of the target file: replace the exact `content-placeholder` block; **preserve all other sections** (head, hero, why/argue callouts, prereqs, verification, page-nav, scripts). No inline `<style>` / `style=""` / page-local CSS. Page-local `<script>` allowed ONLY for the G11 tokenizer (after the `LLMNav.init(...)` line).
- **Per page:** 2,000–4,000 words answering every on-page verification question; ≥1 interactive (existing classes: `.toggle-reveal`, `.before-after`, `.walkthrough`, `.diagram-container`/SVG, `.quiz`); ≥1 **mid-content** `.quiz` (exactly one `data-correct="true"`); mandatory **Key Insight** box (`.callout-insight`); **Think-Further** callout (`.callout-think`); forward-ref links (early pages) and callback (`.toggle-reveal` recall-then-reveal) where assigned; inline citation `(Author, Year)`; uncertainty language for contested gaps (G7, G30, G31, G33).
- **Read first:** the target HTML (has hero/analogy/why/argue/verification), the curriculum row in `C:\Claude Cowork\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md` (READ-ONLY), and optionally `llm-intelligence-deep-dive_v1.html` (root) for prose reuse (~70% reusable for G1) + design language.
- Exact templates are in **PROJECT-PLAN.md §6**; callback map §8.1, Think-Further questions §8.2 (all 34), forward refs §8.3.

### Phase 1 page assignments
| Gap | File | Interactive | Citation | Forward refs | Callback |
|---|---|---|---|---|---|
| **G11** Tokenization (~2,500w, longest) | `src/module-1/g11-tokenization.html` | **Bespoke tokenizer** (page-local `<script>` after init; `<input>` in `.diagram-container`, chips as `.token-chip` with `.token-id` badge, live split e.g. `un\|happi\|ness`, 2–3 presets, deterministic, no CDN) | Sennrich, Haddow & Birch (2016) BPE; suppl. Mikolov et al. (2013) for king−man+woman (on-page note) | G2 → `../module-3/g02-attention.html`; G22 → `../module-5/g22-memory-architectures.html` | none (entry point) |
| **G1** What Weights Encode (~2,300w; ~70% prose reusable from v1) | `src/module-1/g01-weights.html` | **Before/after** (`.before-after`): "The Guesser View" (lookup table) vs "What's Actually Happening" (compressed world model); Burkina Faso capital example | Geva et al. (2021) | G26 → `../module-6/g26-mechanistic-interpretability.html`; G33 → `../module-3/g33-hallucination.html` | none |
| **G12** Training Objective (~2,050w, shortest) | `src/module-1/g12-training-objective.html` | **Walkthrough** (`.walkthrough` + `.walkthrough-step[data-step]`): a sentence whose next token needs reasoning ("The trophy didn't fit in the suitcase because it was too ___"; 37+48) | Radford et al. (2018) GPT | G5 → `../module-2/g05-emergence.html` | none |

The mechanical anchor for the content swap (identical on every page), replace this block:
```html
    <div class="content-placeholder">
      <strong>Content Coming Soon</strong>
      This concept page is scaffolded and ready for content. The full explanation, interactive elements, and citations will be added in the content-writing phase.
    </div>
```

---

## Guardrails / gotchas
- **Never plain-regenerate** (`node generate-pages.js`) after a page has content — the guard protects authored pages, but don't fight it; use `--force` + `.bak` + manual re-merge only for deliberate sitewide shell changes.
- **Curriculum file is READ-ONLY** (`…\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md`). Bibliography lives inside it; supplementary citations go on the gap page itself.
- **Verify before "done":** per-page acceptance bar in PROJECT-PLAN.md §4; offline `file://` + zero console errors is the master gate.
- Commit per phase so there's always a clean floor.
