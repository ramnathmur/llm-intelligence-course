# AI Autonomy — Build Plan: From Scaffold to Shippable Course

**Author/Owner:** solo learner-practitioner (consulting → AI engineering)
**Curriculum architect:** Dr. Meridith Kane
**Status of repo (verified):** 34 gap pages exist as pristine scaffolds. Every page still carries the `content-placeholder` "Content Coming Soon" block. No page has been hand-edited. Not under git.

---

## 1. Overview

**The goal.** You have a 34-page, 7-module static HTML package that is fully scaffolded and zero percent written. The shell is real — sidebar, prereq chips, hero blocks, verification sections, prev/next nav all render and wire up correctly from `nav.js`. What's missing is the actual teaching: every `<div class="content">` is a placeholder. This plan takes you from "credible-looking skeleton" to "credible course."

**The MVP milestone.** Module 1 — **G11 Tokenization, G1 What Weights Encode, G12 Training Objective** — fully built. These three pages carry the opening argument that collapses the "LLM is just a next-word guesser" frame. They are also the highest-reuse pages (v1 gives you ~70% of G1's prose) and they exercise all three interactive patterns you'll need everywhere else (live demo, before/after, worked example). **If Module 1 ships clean, the architecture is proven and Phases 2–3 are mechanical repetition.** Do not start the other 31 pages until Module 1 is done and reviewed against itself as the template.

**What "shippable" means here.** Static HTML, opens offline by double-clicking `src/index.html`, no build step, no CDN, no API. Every page: 2,000–4,000 words, a **Key Insight box** (`.callout-insight`) wrapping the single most important takeaway, ≥1 quiz, ≥1 interactive, a Think-Further callout, forward references, and (for later pages) a spaced-retrieval callback to an earlier gap. The landing page (`src/index.html`) must reflect the finished content — see Phase 4.

**The offline test is the master shippability gate.** Section 1 promises "opens offline by double-clicking," so every phase's Definition of Done ends with the same concrete check: open the page via `file://` (double-click `index.html` and navigate, or open the gap page directly), open devtools, confirm zero console errors, and confirm the quiz/tokenizer/toggle all function. No page is "done" until it passes this from `file://`, not a local server.

---

## 2. Guiding Decisions (settle these ONCE, before any content is written)

### 2.1 Editing model — **HYBRID (generator owns initial structure, hand-edit owns everything after)**

This is the governing decision. Every item below is executed under it.

- **The generator (`generate-pages.js`) OWNS the structural shell — but ONLY for pages that are still placeholders.** DOCTYPE/head/meta, sidebar mount, breadcrumb, hero block, why/argue callouts, prerequisite chips, the verification-questions list, the page-nav mount, and the `nav.js` bootstrap are all mechanically derived from the `gaps` array and identical across 34 pages. The generator is how you initially scaffold and how you re-scaffold a page that has *not yet* been written.
- **Deep content + interactives are HAND-WRITTEN** directly into the `<div class="content">` region of each HTML file — the 2,000–4,000-word explanation, the Key Insight box, inline SVG, toggle-reveals, quizzes, worked examples, cross-links. Rich prose + SVG + interactive markup does not belong in a JS template literal.

**Why not the two pure alternatives:** Pure "extend the generator" is impractical (prose+SVG in a JS string is unmaintainable). Pure "edit HTML only" throws away the ability to safely scaffold new pages from one source. Hybrid keeps both powers — *but only if the generator is made non-destructive first.*

**The cost of the guard (read this before you rely on regeneration — see 2.3 #2).** Once a page has hand-written content, the guard makes the generator **refuse to touch it**. That is the whole point, and it has a deliberate consequence: **after content exists, you can no longer use the generator to push a sitewide structural fix** (e.g., a `<head>`/meta change, a new sidebar item) to already-written pages — the guard skips every one of them. Do not treat "regenerate to fix structure" as a live capability past Phase 1. See 2.3 #2 for the two sanctioned ways to make a structural change after writing has started.

### 2.2 Regeneration risk — **CATASTROPHIC AND SILENT** (must be neutralized before Phase 1)

`generate-pages.js` line 146 does an **unconditional** `fs.writeFileSync(file, html, 'utf8')` for every gap, with no existence check and no placeholder guard. Re-running `node generate-pages.js` after content is written will overwrite all 34 files back to the "Content Coming Soon" placeholder (generator lines 117–123). No prompt, no diff, no `.bak`, no warning — it just prints `Created 34 gap pages.` The directory is **not** under git, so there is **no recovery path**. The command looks innocuous (it's the documented build step) and a future session could run it reflexively.

### 2.3 Safeguard — do ALL of these in Phase 0, in this order

1. **`git init` + first commit NOW.** Single highest-leverage protection. Currently nothing is tracked; any overwrite today is unrecoverable. Commit the pristine scaffold so you always have a floor.
2. **Add a hard no-overwrite guard to the generator.** Before the write at line 146:
   ```js
   if (fs.existsSync(file)) {
     const existing = fs.readFileSync(file, 'utf8');
     if (!existing.includes('content-placeholder')) {
       console.warn('SKIP (has hand-written content): ' + file);
       continue;
     }
   }
   ```
   Because every pristine page still contains `class="content-placeholder"` and a hand-edited page will have that block replaced, the generator can now safely (re)scaffold only untouched pages and will refuse to clobber finished ones.
   **What this does NOT let you do, by design:** once a page has content, this guard skips it forever — so the generator can **never again** be the mechanism that propagates a structural fix into a written page. Pick a sanctioned path for post-content structural changes and use only that:
   - **(a) Hand-edit (default for ≤ a few pages):** make the shell change directly in each affected HTML file. Fine when the change is small or touches few pages.
   - **(b) `--force` + `.bak` re-merge (for true sitewide shell changes):** add an opt-in `--force` flag that, before overwriting a non-placeholder file, writes a timestamped `.bak`, regenerates the fresh shell, and then you **manually re-merge the hand-written `<div class="content">` from the `.bak` back into the regenerated file.** This is deliberate, slow, and per-file — it is NOT "just re-run the generator." Never run `--force` without the `.bak` step.
3. **Retire the generator once all 34 pages have real content.** Move it to `scripts/_retired/generate-pages.SCAFFOLD-ONLY.js` with a top-of-file banner: `// DO NOT RUN — pages are hand-edited; this overwrites content.`
4. **Document the editing model** in `CLAUDE.md`/`ROADMAP.md`: *Structure = generator-owned for placeholder pages only; content+interactives = hand-edited into the content div; the guard permanently protects written pages, so post-content structural changes are hand-edits or a deliberate `--force`+`.bak`+re-merge — never a plain regen.*

### 2.4 Other one-time decisions

- **CSS lives in `src/css/style.css` only. No exceptions for CSS.** No inline `<style>` blocks, no inline `style=""` attributes, no page-local CSS rules. New variant classes (`.callout-insight` already exists; add `.callout-think`, optional `.callout-callback`, and the `.token-chip` class the G11 tokenizer needs) all go in `style.css` next to the existing callout/interactive component classes (~lines 260–285) or the ARGUE block (lines 616–622). The `.token-chip` rule belongs with the other interactive-component classes because it is a reusable widget style — it is NOT a per-page exception. This matches CLAUDE.md exactly.
- **The Key Insight box is mandatory anatomy on every page (CLAUDE.md item 7).** The single most important takeaway on each page is wrapped in `<div class="callout callout-insight">` (the cyan class already ships in `style.css`). This is a required element on the per-page acceptance bar — a page without it is anatomy-incomplete.
- **Page-local `<script>` is the ONLY sanctioned exception** (per CLAUDE.md — the exception is for scripts, not styles) and only for bespoke interactives that `nav.js` can't wire (e.g., the G11 tokenizer). Place every page-local script **after** the `LLMNav.init('<slug>')` call so the DOM and base wiring exist first.
- **Callbacks reuse the already-wired `.toggle-reveal`** (recall-then-reveal, zero new CSS) as the default. The static `.callout-callback` variant is optional. Do **not** route callbacks into the verification section — that single collapsible is owned by the curriculum's end-of-page questions.
- **Supplementary citations live ON the page, never in the curriculum.** The curriculum file (`…\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md`) is read-only and **the bibliography lives inside it** — there is no separate bibliography artifact in the package. So any citation NOT already in the curriculum (e.g., Mikolov et al., 2013 for G11 embedding arithmetic) is added as a **self-contained inline citation plus a footnote/reference note on the gap page itself**, flagged as supplementary. Do not instruct anyone to "add it to the bibliography" — that would require editing the read-only curriculum.
- **Curriculum file is read-only.** `…\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md` is upstream source of truth. Never edit it.
- **Effort is sized in work-sessions (a focused 1–3h block), not dates or dollars.** No API/paid steps anywhere — every interactive is deterministic client-side JS or pure CSS.

---

## 3. Dependency Ordering (what unblocks what)

```
git init + generator guard (2.3)  ──►  the ONLY hard gate before ANY writing
                                        (nothing hand-written until the
                                         generator can't destroy it)

new CSS classes in style.css      ──►  NOT a blanket gate. Required ONLY for:
   (.callout-think; optional             - Think-Further (needs .callout-think)
    .callout-callback;                    - static callbacks (need .callout-callback)
    .token-chip)                          - G11 tokenizer chips (needs .token-chip)
        │
        │   Quizzes, before/after, worked examples need ZERO new CSS
        │   (.quiz / .before-after / .walkthrough / .callout-insight all ship).
        │   => Module 1 bodies + their 3 interactives + quizzes + Key Insight
        │      can proceed with NO new CSS if Think-Further is added last.
        │
        ├─►  Think-Further (Item 5) needs .callout-think
        ├─►  Callbacks (Item 4) need .callout-callback OR use .toggle-reveal (no dep)
        └─►  G11 tokenizer chips (Item 7) need .token-chip

Module 1 content (Item 1)  ──►  is the carrier for Items 7, 2, 5, 6 on M1
        │
        └─►  Module 1 = the proven TEMPLATE  ──►  unblocks Phase 2 rollout
                                                   (Items 2,4,5,6 at scale)
G4 analogy fix (Item 3)  ── independent, do it in Phase 0 (touches 2 files)
index.html review (Phase 4)  ── after all 34 bodies exist
```

**Hard rule:** No `<div class="content">` gets a single hand-written word until 2.3 (git + guard) is done. The **only** content blocked on new CSS is the specific element that uses it (Think-Further → `.callout-think`; tokenizer chips → `.token-chip`; static callback → `.callout-callback`). Module 1's three mandated interactives (G11 tokenizer aside, which needs `.token-chip` added in Phase 0; G1 before/after; G12 worked example) and the quizzes and the Key Insight box use only existing classes — do not wait on CSS you don't need yet.

---

## 4. Phased Plan

| Phase | What ships | Definition of Done |
|-------|-----------|--------------------|
| **Phase 0 — Setup & quick wins** | git init + commit; generator guard (+ optional `--force`/`.bak` path documented); G4 analogy fix; new CSS classes (`.callout-think`, `.token-chip`, optional `.callout-callback`) | `node generate-pages.js` prints SKIP for any non-placeholder file; G4 shows the phase-transition analogy in both files; new CSS classes render correctly on a throwaway test page **with all six callout labels (4 existing + 2 new) verified visually consistent on the target Windows browser** (see §6.5); clean git commit exists; opens from `file://` with zero console errors |
| **Phase 1 — Module 1 MVP** | G11, G1, G12 fully written (Item 1); their 3 interactives (Item 7); a mid-content quiz each (Item 2); Key Insight box each; Think-Further (Item 5) + forward refs (Item 6) on all three | Each page meets the full **per-page acceptance bar** (below); tokenizer demo fractures live input; before/after + worked example render; **`.callout-insight` Key Insight box present on each page**; offline `file://` open works with zero console errors and all interactives function; committed |
| **Phase 2 — Systematic rollout (the 31 pages, structure layer)** | Apply Items 2, 4, 5, 6 to every remaining page as its content is written, using the tables in §8 | Every written page has: ≥1 mid-content quiz, its assigned callback (if listed), its Think-Further question, its forward ref(s); cross-link chain unbroken |
| **Phase 3 — Remaining module content** | The 2,000–4,000-word bodies + ≥1 bespoke interactive + Key Insight box for the 31 non-Module-1 pages, module by module in learning-path order | All 34 `content-placeholder` blocks gone; **every page has a `.callout-insight` Key Insight box**; prev/next chain unbroken end-to-end; generator retired to `scripts/_retired/`; every page opens from `file://` with zero console errors |
| **Phase 4 — Landing-page polish** | Review and update `src/index.html` against the finished pages | `index.html` renders the module map, the learning-path CTA/entry, and the progress tracker correctly against the 34 finished pages; no placeholder/stale copy; opens from `file://` with zero console errors; ROADMAP marks all gaps + index complete |

> **The per-page acceptance bar (every gap page must satisfy ALL):** 2,000–4,000 words (rebalanced per §5 Item 1 — G12 is the *shortest* in Module 1) answering every verification question; **a `<div class="callout callout-insight">` Key Insight box wrapping the single most important takeaway**; ≥1 mid-content quiz; ≥1 working interactive; one Think-Further callout; ≥1 forward reference (early pages) and its assigned callback (later pages); inline + supplementary citations on-page; links `../css/style.css` and `../js/nav.js`; **opens from `file://` with zero console errors and all interactives functional.**

> Phases 2 and 3 interleave in practice: when you write a page's body (Phase 3 work), you add its quiz/callback/think-further/forward-ref/Key-Insight (Phase 2 + anatomy work) in the same sitting. They're listed separately so the "structure layer" checklist is explicit and nothing gets skipped.

> **Callback sequencing rule (so a callback never links to a placeholder during a real-reader phase):** A callback may be *authored* the moment its host page is being written. Its answer/link must point to a prerequisite page that already exists as a **navigable file** — all 34 do, so callback links always resolve structurally even to an unwritten page. The only real risk is sending a reader to a "Content Coming Soon" page. Because the earliest callback host (G4, Module 2) is never written during the Module-1 MVP, no callback work happens in Phase 1 at all. In Phase 3 you write in learning-path order, so a callback's *target* prerequisite is already written by the time you reach the host. Linking to a still-placeholder target is acceptable only transiently during Phase 3 interleave — it is **not** a reason to block authoring a callback, and it must be resolved (target written) before the package is called shippable.

---

## 5. The 7 Action Items — Scope, Tasks, Files, Acceptance, Effort

### Item 1 — Write Module 1 content (G11, G1, G12) FIRST
**Scope.** The three opening pages that carry the guesser-frame collapse, one interactive each (Item 7), one mid-content quiz each (Item 2), and a `.callout-insight` Key Insight box each. **Word budget rebalanced to honor CLAUDE.md's "shorter for narrow concepts (G12)" guidance:** G11 (the entry point, carrying tokenization + embedding geometry + the bespoke tokenizer) is the **longest**; G12 (curriculum read-time ~8 min, the narrowest concept) is the **shortest**.
**Files (hand-edit the `<div class="content">` only):**
- `C:\Claude Cowork\Projects\ai autonomy\src\module-1\g11-tokenization.html`
- `C:\Claude Cowork\Projects\ai autonomy\src\module-1\g01-weights.html`
- `C:\Claude Cowork\Projects\ai autonomy\src\module-1\g12-training-objective.html`
**Section maps & word budgets (rebalanced):**

*G11 — Tokenization & Embedding Space (~2,500 words — LONGEST in Module 1):*
| Section | Focus | Words |
|---|---|---|
| Hero + Anchor | Postal addresses → GPS coordinates; "guesser assumes WORDS — it doesn't" hook | 190 |
| Why This Matters | First crack in the guesser frame; meaning has geometric structure | 130 |
| Part 1 — Tokenization | Sub-word chunks; `unhappiness`→`un+happi+ness`; BPE conceptually (answers verif. a) | 540 |
| Part 2 — Embedding Space | Tokens→vectors; "high-dimensional" in plain language; distance = similarity | 540 |
| Part 3 — Meaning Has Geometry | `king − man + woman ≈ queen`; clusters; relations as directions (answers verif. b) | 500 |
| Why This Beats a Dictionary | Continuous & compositional vs discrete & brittle (answers verif. c) | 330 |
| **Key Insight box (`.callout-insight`)** + Verification | Tokens in a geometric meaning-space, not words in a lookup table | 270 |

*G1 — What Weights Actually Encode (~2,300 words, ~70% of PROSE portable from v1):*
| Section | Focus | Words |
|---|---|---|
| Hero + Anchor | Compressed river-physics map, not a list of rivers (reuse v1 line 564) | 200 |
| Why This Matters + prereq G11 | Guesser frame survives only until you know what weights store | 140 |
| Misconception: NOT a lookup table | Too many sequences to memorize; gradient descent forces compaction (v1 570–571; verif. a) | 480 |
| What gets stored: compressed world structure | Concepts as vectors w/ relational geometry (v1 572–579) | 520 |
| Why "Paris…France" has no address | Fact lives in the neighborhood; Lisbon follows from geometry (v1 581; verif. b) | 380 |
| Asking an unseen question | Structured prediction vs retrieval; Burkina Faso case (v1 648; verif. c) | 320 |
| **Key Insight box (`.callout-insight`)** + Verification | Weights = compressed world model, not a fact DB (v1 takeaway 639–640) | 260 |

*G12 — The Training Objective (~2,050 words — SHORTEST in Module 1, per ~8-min read-time; ~10% portable):*
| Section | Focus | Words |
|---|---|---|
| Hero + Anchor | Learning cricket by predicting the next ball — simple objective, deep demands | 180 |
| Why This Matters + prereqs G11,G1 | Direct rebuttal: to guess WELL it must learn everything language encodes | 140 |
| What next-token prediction is | Hide token, predict, compare, adjust; ties to G11 & G1 (v1 583) | 380 |
| Why predicting well forces learning everything | grammar→facts→reasoning→theory of mind (verif. a) — kept tight | 420 |
| Self-supervised learning & why it scales | Labels free from text; no annotation bottleneck (verif. b) | 360 |
| When next-word needs reasoning | Arithmetic carry, mystery culprit, valid code (verif. c) | 290 |
| **Key Insight box (`.callout-insight`)** + Verification | Simple objective, non-trivial consequence; forward link to G13 | 280 |

**Citations to wire inline (link to the curriculum bibliography for designated refs; on-page footnote for supplements):**
- G11: Sennrich, Haddow & Birch (2016) for BPE/sub-word (curriculum-designated). Mikolov et al. (2013) word2vec for vector arithmetic — **supplementary; add as an inline citation + on-page footnote on the G11 page itself** (the curriculum's G11 ref covers tokenization, not embedding arithmetic, and the curriculum is read-only — see §2.4).
- G1: Geva et al. (2021) "Transformer Feed-Forward Layers Are Key-Value Memories" (curriculum-designated G1 ref).
- G12: Radford et al. (2018) GPT (curriculum-designated G12 ref).
**Acceptance (full per-page bar from §4):** each page within its rebalanced budget and inside 2,000–4,000 words; every verification question answered somewhere in the body; **`.callout-insight` Key Insight box present**; honesty/uncertainty language where the curriculum flags debate; no inline `<style>` or page-local CSS; links `../css/style.css` and `../js/nav.js`; opens from `file://` with zero console errors and all interactives working.
**Effort: L — ~3 work-sessions, budget ~1 full session per page regardless of prose reuse.** Reuse buys prose, not deliverables: every page still needs a net-new interactive, a mid-content quiz, 1–2 forward refs, on-page citations, and a Key Insight box — none of which exist in v1 (v1's G1 interactive is a self-test, not the required before/after). **Per-page net-new element count (the honest sizing signal, not "fastest/slowest"):**
  - **G11:** 1 bespoke tokenizer (the heaviest single build in Module 1 — page-local script + `.token-chip` CSS) + 1 quiz + 1 Think-Further + 2 forward refs (G2, G22) + on-page Mikolov footnote + Key Insight box. → ~1 full session, longest page.
  - **G1:** ~70% prose ports from v1, but net-new = 1 before/after interactive (rebuilt, not ported) + 1 quiz + 1 Think-Further + 2 forward refs (G26, G33) + Geva 2021 citation + Key Insight box. → ~1 full session despite reuse.
  - **G12:** ~10% prose ports; net-new = 1 worked-example walkthrough + 1 quiz + 1 Think-Further + 1 forward ref (G5) + Radford 2018 citation + Key Insight box; shortest body. → ~1 session.

---

### Item 2 — One mid-content MC quiz per page (existing `initQuizzes`)
**Scope.** Drop a `.quiz` block **mid-content** (not at the end) on every gap page, drawn from that page's verification questions. Zero new infra — `initQuizzes` (nav.js:330) grades, locks after first click, auto-highlights the `data-correct="true"` option, and fills `.quiz-feedback` from its `data-correct`/`data-incorrect` attributes.
**Files.** All 34 gap HTML files (Phase 1 for M1; Phase 2 at scale).
**Template (paste-and-go — see §6.1).**
**Acceptance.** Quiz sits mid-content; clicking grades and locks; correct option highlights; feedback text shows; `LLMNav.init()` runs (it always calls `initQuizzes`); verified functional from `file://`. One quiz per page minimum.
**Effort: S per page; trivial at scale.** Phase 1: ~0.5 session for 3 pages.

---

### Item 3 — Fix G4 anchor analogy (revert to phase-transition)
**Scope.** The G4 analogy was wrongly changed to "compound interest." Revert to the curriculum's water→ice phase-transition analogy — the discontinuity is the entire point of scaling laws.
**Files (BOTH — the generator seeds it, the HTML carries it):**
- `C:\Claude Cowork\Projects\ai autonomy\generate-pages.js` (line 11, inside the `gaps` array)
- `C:\Claude Cowork\Projects\ai autonomy\src\module-2\g04-scaling-laws.html` (line 40)

**Exact before/after — see §7.**
**Acceptance.** Both files show the phase-transition text; the strings match so a guarded regen won't reintroduce drift; G4 page renders the new analogy in the hero block.
**Effort: S — <0.25 session.**

---

### Item 4 — Callback questions (spaced retrieval to prior gaps)
**Scope.** On later pages, add a question that explicitly tests a PREREQUISITE concept from an earlier gap, *before* the reader sees the answer. **Default mechanism: the already-wired `.toggle-reveal`** (recall-then-reveal, zero new CSS). Optional static variant: `.callout-callback` (needs the CSS in §2.3/§6.3). Obey the **callback sequencing rule** in §4 — link only to navigable prerequisite pages, and ensure targets are written before shippable.
**Files.** The 14 pages in the callback map (§8.1).
**Acceptance.** Each listed page has its callback, placed mid-content; the reveal works (toggle) or the styled callout renders (static); the answer links to the prerequisite gap page; not placed in the verification section.
**Effort: S per page; M total across 14 pages (Phase 2 — note: zero callbacks fall in the Module-1 MVP, since the earliest host is G4 in Module 2).**

---

### Item 5 — "Think Further" callout (comprehension → synthesis)
**Scope.** One Think-Further callout per page posing a grounded extrapolation question. Static, no JS. Reuses base `.callout` box; needs the new `.callout-think` (purple) class in `style.css`.
**Files.** `src/css/style.css` (add `.callout-think` once) + every gap page (one block each).
**Template & CSS — see §6.2.**
**Acceptance.** `.callout-think` exists in style.css; each page has exactly one Think-Further block reading as reflective/purple, distinct from why/insight/warning/argue; the label glyph is verified consistent with the existing callout set on the target browser (§6.5); question is grounded and synthesis-level (use the §8.2 table).
**Effort: CSS = S (one-time). Per page = S (drop in the assigned question from §8.2).**

---

### Item 6 — Forward-reference links in early pages
**Scope.** Add inline forward references so early pages point to where a concept gets traced/expanded later (e.g., G1 → G27 compression-style argument via G26; G2 → G26 circuits). Pure anchor tags, no infra.
**Files.** The "fromPage" files in the forward-ref list (§8.3) — concentrated in Modules 1–3.
**Acceptance.** Each listed forward ref present as a working relative `<a href>` to the target gap page; phrasing uses "you'll see/explore in…" style; link resolves offline from `file://`.
**Effort: S — bundle into the same session as each page's body.**

---

### Item 7 — Build Module 1 interactives
**Scope.** Three interactives for Module 1. Only the tokenizer needs bespoke JS; the other two reuse READY CSS.

1. **G11 Tokenizer demo — BESPOKE `<script>` REQUIRED.** `nav.js` has no tokenize/text-input logic. Reuse visual shells only: wrap in `.diagram-container` (or `.slider-interactive` if length-driven) with live output in `.slider-output`. Author a small page-local script that splits a pre-filled sentence (e.g., `unhappiness redefined the playoffs`) into illustrative sub-word chips (`un|happi|ness`) with token-count and token-ID badges, deterministic rule set, 2–3 preset example buttons. Place the script **after** `LLMNav.init('g11-tokenization')`. **Chip styling uses a `.token-chip` rule added to `src/css/style.css` (Phase 0) — NOT inline styles and NOT a page-local CSS block (see §2.4). The only sanctioned page-local artifact here is the `<script>`.**
2. **G1 Before/After comparison — NO JS.** `.before-after` with two `.panel` children (`.before` "The Guesser View" / `.after` "What's Actually Happening") + `.panel-label`. Flip a concrete query (`capital of Burkina Faso?`) between lookup-table vs world-model framings. v1 vector-space SVG can sit beside the "after" panel.
3. **G12 Worked example — NO JS.** `.walkthrough` with `.walkthrough-step` items carrying `data-step="1"`, `data-step="2"`… (CSS `::before` renders the numbered circle). Sentence that *requires* reasoning: "The trophy didn't fit in the suitcase because it was too ___" or `37 + 48 = ___`. For click-to-reveal, wrap the `.walkthrough` in a `.toggle-reveal` (auto-wired, no script).

**Files.** The three Module-1 HTML files (+ `.token-chip` in `style.css`, added in Phase 0).
**Acceptance.** Tokenizer visibly fractures the reader's own typed text into sub-word chips with counts/IDs and reacts on input; before/after renders two panels; worked example renders numbered steps (or reveal-on-click); all work offline from `file://` with no CDN and zero console errors; bespoke script sits after `LLMNav.init`; chip styling comes from `.token-chip` in `style.css`.
**Effort: G11 tokenizer = M (the only real build, heaviest single element in Module 1). Before/after = S. Worked example = S. Item total ≈ 1 session.**

---

## 6. Reusable Templates (copy-paste)

### 6.1 Mid-content MC quiz (Item 2) — wired automatically by `initQuizzes()`
```html
<!-- Mid-content MC quiz. Wired by initQuizzes() in nav.js.
     Reads .quiz-option[data-correct="true"] to grade, locks after first click,
     fills .quiz-feedback from its data-correct / data-incorrect attributes.
     data-letter drives the A/B/C bubble (::before). -->
<div class="quiz">
  <div class="quiz-header">Self-Check</div>
  <div class="quiz-question">When a model "predicts the next token," what is it actually computing?</div>
  <button class="quiz-option" data-letter="A">A single guessed word chosen at random.</button>
  <button class="quiz-option" data-letter="B" data-correct="true">A probability distribution over the entire vocabulary.</button>
  <button class="quiz-option" data-letter="C">A lookup of the most common sentence in its training data.</button>
  <div class="quiz-feedback"
       data-correct="Correct. The model outputs a full probability distribution over every token in the vocabulary; sampling then selects one."
       data-incorrect="Not quite. See the highlighted answer: the model produces a probability distribution over the whole vocabulary, not a single hard-coded guess."></div>
</div>
```

### 6.2 Key Insight box (mandatory anatomy) + Think-Further callout (Item 5)
**Key Insight box — `.callout-insight` ALREADY EXISTS in `style.css` (cyan). Required on every page:**
```html
<!-- Mandatory Key Insight box (CLAUDE.md anatomy item 7). Cyan class already ships. -->
<div class="callout callout-insight">
  <div class="callout-label">Key Insight</div>
  <p>A token is not a word and the weights are not a dictionary: the model operates
  on points in a continuous geometric meaning-space, which is exactly why it can
  answer questions no one ever wrote down.</p>
</div>
```
**Think-Further — add `.callout-think` once to `src/css/style.css`** (next to the callout block, ~lines 260–285, or the ARGUE block, 616–622). **Use a monochrome symbol glyph (matching the existing dingbat-style labels), not a color-emoji codepoint — see §6.5:**
```css
/* ===== THINK FURTHER CALLOUT (new) ===== */
/* Inherits base .callout box rules. Purple accent = reflective/open-ended,
   distinct from amber 'why', cyan 'insight', red 'warning', green 'argue'.
   Glyph chosen from the same monochrome-symbol family as existing labels
   (NOT a color-emoji) so all six callout labels render consistently. */
.callout-think {
  background: var(--purple-dim);
  border-left: 4px solid var(--purple);
}
.callout-think .callout-label { color: var(--purple); }
.callout-think .callout-label::before { content: '\203B '; } /* reference mark ※ (monochrome) */
```
**HTML (one per page, static, no JS):**
```html
<!-- Think Further callout. Reuses base .callout box. -->
<div class="callout callout-think">
  <div class="callout-label">Think Further</div>
  <p>If the model only ever sees text, where does its apparent understanding of
  three-dimensional space come from? Hold this question as you move into
  <a href="../module-6/g34-world-models.html">G34 — Internal World Models</a>.</p>
</div>
```

### 6.3 Callback question (Item 4)
**RECOMMENDED — zero new CSS, reuses the JS-wired `.toggle-reveal`:**
```html
<!-- Callback (recall-then-reveal). Wired by initToggleReveals(). -->
<div class="toggle-reveal">
  <div class="toggle-reveal-header">
    <span>Callback: back in G2, why did attention let tokens 'look at' each other? Recall before revealing.</span>
    <span>+</span>
  </div>
  <div class="toggle-reveal-body">
    <p>Attention computes a weighted blend of every other token's value vector,
    so each position can pull in context from anywhere in the sequence —
    see <a href="../module-3/g02-attention.html">G2 — Transformer Attention</a>.</p>
  </div>
</div>
```
**ALTERNATIVE — static, needs the `.callout-callback` CSS below. Use a monochrome glyph (§6.5):**
```css
/* ===== CALLBACK QUESTION CALLOUT (optional) ===== */
/* Blue accent = 'connect back to prior learning', matching the prereq-chip blue.
   Monochrome glyph for label-consistency with the existing callout set. */
.callout-callback {
  background: var(--blue-dim);
  border-left: 4px solid var(--blue);
}
.callout-callback .callout-label { color: var(--blue); }
.callout-callback .callout-label::before { content: '\21A9 '; } /* leftwards hook arrow (no VS16 -> monochrome) */
```
```html
<div class="callout callout-callback">
  <div class="callout-label">Callback</div>
  <p>Earlier, in <a href="../module-3/g02-attention.html">G2</a>, you saw how
  attention mixes context across positions. How does that mechanism make the
  in-context learning described here possible?</p>
</div>
```

### 6.4 Module-1 interactive shells (Item 7)
**Before/after (G1) — ready CSS, no JS:**
```html
<div class="before-after">
  <div class="panel before"><div class="panel-label">The "Guesser" View</div><p>Weights store facts like a dictionary: capital_of[France] = Paris.</p></div>
  <div class="panel after"><div class="panel-label">What's Actually Happening</div><p>Weights encode a geometric world model; "Paris" emerges from the neighborhood of capital-concepts.</p></div>
</div>
```
**Worked example (G12) — ready CSS, no JS:**
```html
<div class="walkthrough">
  <div class="walkthrough-step" data-step="1"><h4>Read the context</h4><p>"The trophy didn't fit in the suitcase because it was too ___"</p></div>
  <div class="walkthrough-step" data-step="2"><h4>Score candidate tokens</h4><p>"big" vs "small" — only resolvable by modeling what fits inside what.</p></div>
  <div class="walkthrough-step" data-step="3"><h4>Why the right token wins</h4><p>Getting this right at scale = having learned the underlying relationship, not a surface pattern.</p></div>
</div>
```
**Tokenizer (G11) — bespoke; chips styled by `.token-chip` in style.css; script placed AFTER `LLMNav.init`:**
```html
<div class="diagram-container">
  <input id="tok-input" type="text" value="unhappiness redefined the playoffs" />
  <div id="tok-output" class="slider-output"></div>
  <!-- preset buttons here; rendered chips get class="token-chip" (styled in style.css) -->
</div>
...
<script src="../js/nav.js"></script>
<script>LLMNav.init('g11-tokenization');</script>
<script>
  /* deterministic demonstrative tokenizer: split on a small built-in rule set,
     render token chips (class="token-chip") with count + mock ID badges,
     react on input, wire 2-3 preset example buttons. No model call, no CDN.
     Chip COLORS/styling live in style.css (.token-chip) — not inline. */
</script>
```

### 6.5 Callout-label glyph consistency check (one-time, Phase 0)
The four existing callout labels use monochrome symbol/dingbat codepoints (`\26A0\FE0F`, `\2728`, `\26D4`, `\2694\FE0F`). The base `.callout-label` rule sets no emoji font-family, so a **color-emoji** codepoint (e.g., the thought-balloon `\1F4AD` or hook-arrow with VS16 `\21A9\FE0F`) renders full-color on Windows while the others render monochrome — a visible inconsistency. **Decision: use monochrome glyphs for the two new labels** (`\203B` reference mark for Think-Further; bare `\21A9` hook arrow, no VS16, for Callback). **Verification step (Phase 0 DoD):** render a throwaway page with all six callout labels stacked and confirm on the target Windows browser that all six are visually consistent (monochrome, same weight) before rolling the classes out to 34 pages.

---

## 7. Item 3 — G4 Analogy Fix (exact before/after)

**Before (verbatim, present in both files):**
> `Compound interest on a savings account &mdash; each increment is small, but the relationship between input (compute) and output (capability) follows a precise, predictable mathematical curve.`

**After:**
> `Water cooling from 20&deg;C to 0&deg;C: mostly smooth change, then a phase transition into ice &mdash; a qualitatively new thing.`

**Files to change (both — confirmed present):**
- `C:\Claude Cowork\Projects\ai autonomy\generate-pages.js` (line 11, the G4 entry's `analogy` field)
- `C:\Claude Cowork\Projects\ai autonomy\src\module-2\g04-scaling-laws.html` (line 40)

Change the generator first, then the HTML, so the strings match and a guarded regen never reintroduces "compound interest."

---

## 8. Ready-to-Apply Tables

### 8.1 Callback-question map (Item 4)
| Page (file) | Tests prereq | Callback question |
|---|---|---|
| module-2/g04-scaling-laws.html | G13 Backprop | What is the underlying training process all that compute runs? In one sentence, what does each unit of compute buy you in weight adjustments (recall G13)? |
| module-2/g14-pretraining-data.html | G4 Scaling | From G4's scaling laws, why can't you freeze the dataset and keep adding parameters forever to get a smarter model? |
| module-2/g05-emergence.html | G4 Scaling | Using G4's curve, distinguish a capability improving smoothly along it from one that jumps discontinuously — and why Schaeffer says the jump may be a measurement artifact. |
| module-3/g02-attention.html | G11 Tokenization | Recall from G11 what each token IS by the time attention sees it — what mathematical object is attention reading from and writing to? |
| module-3/g03-in-context-learning.html | G2 Attention | Which mechanism from G2 lets a later token "see" and copy the structure of earlier in-prompt examples? Name it before revealing. |
| module-3/g09-chain-of-thought.html | G3 ICL | Connect to G3: why do worked-example reasoning traces in the prompt change behavior without retraining? |
| module-4/g18-rlhf.html | G15 Fine-tuning + G13 Backprop | What optimization mechanism is adjusting the weights here, and how does this differ from the supervised fine-tuning in G15? |
| module-4/g20-alignment.html | G5 Emergence | Why does G20 list emergent capabilities (G5) as a prerequisite? How does unpredictable capability at scale make alignment harder? |
| module-5/g23-goal-decomposition.html | G16 Advanced Reasoning | Which strategy from G16 (tree-of-thought, reflection, self-correction) maps onto an agent backtracking after a failed sub-task? Justify. |
| module-5/g25-autonomy-spectrum.html | G20 Alignment | Recall the literal-minded-intern analogy from G20: what changes about the cost of one misaligned action as you move from human-in-the-loop to full autonomy? |
| module-6/g27-superposition.html | G26 Mech Interp | Which G26 technique confirms one neuron encodes BOTH "cat" and "car" rather than just appearing to — and why does that make polysemanticity a finding, not noise? |
| module-6/g34-world-models.html | G26 Mech Interp | Recall the probe caution from G26: probe FINDING a representation vs CREATING one through its own training — why does that decide whether the world-model claim holds? |
| module-7/g07-grounding.html | G34 World Models (+G5,G26) | How does the Othello world-model result from G34 act as evidence for "genuine semantics" — and what does the stochastic-parrot camp reply? |
| module-7/g30-functionalism.html | G10 Intelligence vs Consciousness | Does substrate-independence apply equally to intelligence AND consciousness, or does G10's split let you accept functionalism for one but stay agnostic on the other? |

### 8.2 Think-Further questions (Item 5) — one per page
| Gap (file) | Think-Further question |
|---|---|
| G11 (module-1/g11-tokenization.html) | If tokenization causes letter-miscounting and long-number arithmetic errors, what changes if a lab ships a truly character-level model — and what would it cost? |
| G1 (module-1/g01-weights.html) | If weights store the "physics of language" not discrete facts, how reliably can you edit one fact (e.g., a new CEO) without corrupting related knowledge — and why is model editing hard? |
| G12 (module-1/g12-training-objective.html) | If next-token prediction forces theory of mind to predict dialogue, what categories of human knowledge are systematically UNDER-learned because they rarely appear in writing? |
| G13 (module-2/g13-backpropagation.html) | Backprop must store activations for the backward pass, dominating training memory. How does that one constraint shape which architectures are economically trainable? |
| G4 (module-2/g04-scaling-laws.html) | Scaling laws are smooth on loss but silent on which capability unlocks when. With a fixed compute budget, how does that gap change how you'd bet on a new model? |
| G5 (module-2/g05-emergence.html) | If Schaeffer is right that many "emergent" jumps are metric artifacts, what does that imply for safety arguments relying on sudden, unwarned capabilities? |
| G15 (module-2/g15-fine-tuning.html) | Given catastrophic forgetting, when fine-tune vs reach for RAG (G22) or ICL (G3) — and what signal tells you which a problem needs? |
| G2 (module-3/g02-attention.html) | Self-attention is quadratic in length. If that cost vanished tomorrow, which awkward agent designs (e.g., whole-codebase reasoning in one pass) become trivial — and which problems remain? |
| G3 (module-3/g03-in-context-learning.html) | If ICL is genuine runtime reasoning, why does quality degrade past a point as you add examples — and what does that ceiling say about how much "learning" happens in the prompt? |
| G6 (module-3/g06-compositional-generalization.html) | Dziri et al. found transformers fail on deep compositional tasks. If CoT/tools paper over some, is that genuine ability or external scaffold — and how would you design a test to tell them apart? |
| G33 (module-3/g33-hallucination.html) | If hallucination is partly intrinsic to sampling a compressed distribution, can it hit zero without killing generalization — and where would you set precision/coverage for a medical vs brainstorming agent? |
| G9 (module-3/g09-chain-of-thought.html) | If the CoT tokens ARE the computation, what does it mean that models sometimes reach the right answer via a demonstrably unfaithful trace — should you trust stated reasoning as an audit trail? |
| G16 (module-3/g16-advanced-reasoning.html) | Tree-of-thought/reflection cost extra compute per query. When does search-style reasoning's latency/token cost outweigh just calling a larger model once — how would you measure that crossover? |
| G17 (module-3/g17-extended-thinking.html) | With variable compute per problem, what stops over-thinking easy ones / under-thinking hard ones — and what would a reliable difficulty estimator actually require? |
| G29 (module-3/g29-multimodal.html) | If images and text share one space, what new adversarial surface opens (instructions hidden in an image) — and how does that complicate the G21 trust boundary? |
| G18 (module-4/g18-rlhf.html) | RLHF optimizes a reward MODEL, not values directly. What failure modes follow from an imperfect proxy — and how does the KL penalty both help and limit what RLHF can fix? |
| G19 (module-4/g19-beyond-rlhf.html) | If Constitutional AI lets a model self-critique against written principles, who writes them — and what happens when two principles conflict on a prompt? |
| G20 (module-4/g20-alignment.html) | If reward hacking means optimizing what you measured not what you meant, name one metric in your own agent work an adversarial optimizer could satisfy while defeating intent. |
| G21 (module-4/g21-adversarial.html) | If every input is a potential jailbreak, where should the trust boundary sit in an agent that browses then acts — and what's the minimum architectural change that contains a successful injection? |
| G8 (module-5/g08-lens-picking.html) | If the lens lives in the system prompt and is applied via in-context reasoning, how would you detect at runtime that the agent silently drifted to the wrong lens mid-task? |
| G22 (module-5/g22-memory-architectures.html) | RAG can retrieve a confidently wrong passage and the model reasons faithfully from it. How do you design memory so retrieval failures degrade gracefully, not produce fluent sourced-looking errors? |
| G23 (module-5/g23-goal-decomposition.html) | If an agent decomposes a goal wrongly at the top, every sub-task inherits the error. What checkpoint catches a bad decomposition before it burns the budget? |
| G24 (module-5/g24-multi-agent.html) | Multi-agent debate adds coordination cost. For what tasks does one strong model with extended thinking (G17) beat a team of weaker agents — how would you decide before building? |
| G25 (module-5/g25-autonomy-spectrum.html) | Where on L0–L5 should each agent in your stack sit — and what concrete failure forces you to move one step DOWN toward more human control? |
| G26 (module-6/g26-mechanistic-interpretability.html) | We reverse-engineer circuits today only for small models/narrow behaviors. What must be true for interpretability to scale to a frontier model fast enough to be a real safety tool, not a post-hoc autopsy? |
| G27 (module-6/g27-superposition.html) | If superposition packs more concepts than dimensions, can you ever get fully monosemantic features — and what tradeoff are sparse autoencoders making to try? |
| G34 (module-6/g34-world-models.html) | Othello is closed and fully observable. What's the strongest reason a clean internal world model there might NOT generalize to the open, partially-observable real world an LLM trains on? |
| G28 (module-6/g28-benchmarking.html) | If every public benchmark eventually leaks into training, what does a durable eval look like — how would you build a private eval that stays uncontaminated across a year of upgrades? |
| G7 (module-7/g07-grounding.html) | If the honest answer is "partial grounding," what single experiment would move you decisively to "genuine semantics" — and what result would move you back to "stochastic parrot"? |
| G10 (module-7/g10-intelligence-consciousness.html) | We deny LLMs consciousness largely from absence of evidence. As models report richer internal states, how do you avoid both dismissing real evidence AND being fooled by trained-in mimicry? |
| G30 (module-7/g30-functionalism.html) | If functionalism is right and substrate is irrelevant, does a detailed brain simulation on silicon have the same mental states — and where, if anywhere, do you get off that train? |
| G31 (module-7/g31-intentionality.html) | If embodiment (robotics) gave the "cat" token a causal link to actual cats, would that settle aboutness — or does Searle's Chinese Room survive embodiment unchanged? |
| G32 (module-7/g32-frontier.html) | Of scaling, world models, alignment-scaling, transformer limits — which, if resolved in two years, most changes how you build agents, and what early signal flags it's being resolved? |

### 8.3 Forward-reference list (Item 6)
| From page | To gap | Sentence to insert |
|---|---|---|
| module-1/g11-tokenization.html | G2 Attention | "These token vectors aren't read in isolation — you'll see in `<a href="../module-3/g02-attention.html">`G2 — Transformer Attention`</a>` how the model routes information between them based on relevance." |
| module-1/g11-tokenization.html | G22 Memory | "The same geometry that makes 'king − man + woman ≈ queen' work is what later powers semantic search — explored in `<a href="../module-5/g22-memory-architectures.html">`G22 — Memory Architectures`</a>`." |
| module-1/g01-weights.html | G26 Mech Interp | "If the weights really encode structured concepts rather than a lookup table, you should be able to find that structure inside the network — which is exactly what `<a href="../module-6/g26-mechanistic-interpretability.html">`G26 — Mechanistic Interpretability`</a>` does." |
| module-1/g01-weights.html | G33 Hallucination | "Because facts live as compressed structure rather than stored entries, the model can interpolate a fluent-but-false answer — the failure mode you'll dissect in `<a href="../module-3/g33-hallucination.html">`G33 — Hallucination`</a>`." |
| module-1/g12-training-objective.html | G5 Emergence | "This single objective — predict the next token — is also what gives rise, at sufficient scale, to the new abilities covered in `<a href="../module-2/g05-emergence.html">`G5 — Emergent Capabilities`</a>`." |
| module-2/g13-backpropagation.html | G18 RLHF | "This same gradient-descent machinery is later repurposed to optimize against human preferences rather than raw text — the mechanism behind `<a href="../module-4/g18-rlhf.html">`G18 — RLHF Deep Dive`</a>`." |
| module-2/g05-emergence.html | G20 Alignment | "The fact that capabilities can appear unpredictably at scale is precisely what makes `<a href="../module-4/g20-alignment.html">`G20 — The Alignment Problem`</a>` so hard — you can't pre-align a capability you didn't know was coming." |
| module-3/g02-attention.html | G3 ICL | "This same relevance-routing is what lets the model copy a pattern from earlier in the prompt with no weight update — the basis of `<a href="../module-3/g03-in-context-learning.html">`G3 — In-Context Learning`</a>`." |
| module-3/g02-attention.html | G29 Multimodal | "Because attention operates on any token vectors, the very same mechanism extends to image and audio tokens — the foundation of `<a href="../module-3/g29-multimodal.html">`G29 — Multimodal Intelligence`</a>`." |
| module-3/g03-in-context-learning.html | G8 Lens-picking | "This is exactly how an agent 'knows' which lens to apply — the criteria sit in its context and are applied by in-context reasoning, as you'll see in `<a href="../module-5/g08-lens-picking.html">`G8 — How the Agent Picks the Right Lens`</a>`." |
| module-3/g09-chain-of-thought.html | G16 Advanced Reasoning | "Once you see the intermediate tokens as computation, the natural next step is to branch, evaluate, and backtrack over them — the strategies in `<a href="../module-3/g16-advanced-reasoning.html">`G16 — Advanced Reasoning`</a>`." |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Generator silently wipes hand-written content** | High if unguarded | Catastrophic, unrecoverable (no git) | Phase 0: `git init` + commit; add placeholder guard at line 146; retire generator after Phase 3. This is the #1 priority — do it before writing one word. |
| **"Regenerate to fix structure" used after content exists** | Medium | Lost content OR a confused author who can't push a shell fix | The guard intentionally blocks this (§2.3 #2). Post-content structural changes are hand-edits or a deliberate `--force`+`.bak`+manual-re-merge — documented as the ONLY two sanctioned paths. |
| **Page ships missing the mandated Key Insight box** | Medium (checklist omission) | Anatomy-incomplete page, silent CLAUDE.md violation | `.callout-insight` Key Insight box is on the per-page acceptance bar and in the Phase 1 & 3 DoD. Every section map allocates words to it. |
| **index.html left with placeholder/stale copy** | Medium | First page a reader sees misrepresents a finished course | Phase 4 explicitly reviews/updates `src/index.html` (module map, learning-path CTA, progress tracker) against finished pages; in touched-files list. |
| G4 analogy drifts back after a regen | Medium | Low | Fix BOTH files (generator line 11 + HTML line 40) so strings match; guard prevents HTML overwrite anyway. |
| New CSS class referenced before it exists | Medium | Pages render unstyled callouts/chips | Add `.callout-think`, `.token-chip` (and optional `.callout-callback`) in Phase 0 before any snippet uses them. |
| Callout labels render inconsistently (color emoji vs monochrome) | Medium | Visual inconsistency the design claims to avoid | Use monochrome glyphs for the two new labels; Phase 0 DoD verifies all six labels render consistently on the target Windows browser (§6.5). |
| Quiz not grading | Low | One broken interactive | Ensure `LLMNav.init('<slug>')` runs (it always calls `initQuizzes`); confirm exactly one `data-correct="true"` per quiz; verify from `file://`. |
| Bespoke tokenizer script runs before DOM/wiring exists | Low | Demo dead on load | Place the `<script>` AFTER `LLMNav.init`. |
| Offline (`file://`) load fails — broken paths / blocked script | Low–Med | The core shippability claim is false | Every phase DoD requires opening from `file://`, devtools open, zero console errors, all interactives functional. This is the master gate. |
| Cross-link / prev-next chain breaks | Medium | Navigation dead ends | After each page, click prev/next and every new `<a href>`; the learning-path order in `nav.js` is the single source — don't hand-edit hrefs out of sync. |
| Callback links a reader to a "Content Coming Soon" page | Low (Phase-3 only) | Reader hits a placeholder | Follow the §4 callback sequencing rule: links always resolve structurally; write in learning-path order so targets exist; resolve any transient placeholder target before shippable. |
| Supplementary citation (Mikolov 2013 for G11) has no home | Low | Citation can't be placed (curriculum is read-only) | Put it as an inline citation + on-page footnote on the G11 page itself — never edit the curriculum bibliography (§2.4). |
| Stray duplicate v1 / `template.html` committed ambiguously | Medium | Unclear which v1 is canonical; committed clutter | Phase 0: pick the **in-project root copy** of v1 as the reuse source (byte-identical to the CLAUDE OUTPUTS copy, keeps reuse offline/self-contained); `.gitignore` or retire `src/template.html` and the duplicate v1 so the committed repo is unambiguous (§ touched-files). |
| Scope creep (decorative SVGs, extra tooling) | Medium | Slows MVP | Finish Module 1 before any polish; per CLAUDE.md, no surprise files. |

---

## 10. Definition of Done (per phase, consolidated)

**Phase 0 done when:** repo is a git repo with a clean commit of the pristine scaffold; running `node generate-pages.js` prints `SKIP (has hand-written content)` for any non-placeholder file and only (re)writes placeholder pages; the `--force`+`.bak`+manual-re-merge path for post-content structural changes is documented; G4 shows the water→ice phase-transition analogy in both `generate-pages.js` and `g04-scaling-laws.html`; `.callout-think`, `.token-chip` (and optional `.callout-callback`) exist in `style.css`; a throwaway page shows all six callout labels rendering consistently (monochrome) on the target Windows browser; the duplicate v1 and `src/template.html` are `.gitignore`d or retired and the in-project root v1 is named the reuse source; the test page opens from `file://` with zero console errors.

**Phase 1 (MVP) done when:** G11, G1, G12 each meet the full per-page acceptance bar — within their rebalanced budgets and inside 2,000–4,000 words (G12 the shortest), answering all verification questions; **each carries a `.callout-insight` Key Insight box**; G11 tokenizer fractures live input into sub-word chips (styled via `.token-chip`); G1 before/after renders; G12 worked example renders; each page has exactly one working mid-content quiz, one Think-Further callout, and ≥1 forward reference; all three open from `file://` with no CDN, zero console errors, and every interactive functional; committed. **The architecture is proven.**

**Phase 2 done when:** every written page carries its assigned quiz, callback (if in §8.1, obeying the sequencing rule), Think-Further (§8.2), and forward refs (§8.3); the cross-link and prev/next chains are unbroken.

**Phase 3 done when:** all 34 `content-placeholder` blocks are gone; **every page meets the per-page acceptance bar including a `.callout-insight` Key Insight box, ≥1 quiz, ≥1 interactive, Think-Further, on-page citations, and length**; prev/next chain works end-to-end across the full learning-path order; every page opens from `file://` with zero console errors; generator moved to `scripts/_retired/` with its banner.

**Phase 4 done when:** `src/index.html` renders the module map, the learning-path CTA/entry, and the progress tracker correctly against the 34 finished pages with no placeholder or stale copy; it opens from `file://` with zero console errors; ROADMAP marks all 34 gaps **and** the index page complete.

---

### Files this plan touches (absolute paths)
- `C:\Claude Cowork\Projects\ai autonomy\generate-pages.js` — guard (line 146), optional `--force`/`.bak` path, G4 analogy (line 11), eventual retirement
- `C:\Claude Cowork\Projects\ai autonomy\src\css\style.css` — `.callout-think`, `.token-chip` (+ optional `.callout-callback`), near lines 260–285 / 616–622 (Key Insight uses the existing `.callout-insight`)
- `C:\Claude Cowork\Projects\ai autonomy\src\module-2\g04-scaling-laws.html` — G4 analogy (line 40)
- `C:\Claude Cowork\Projects\ai autonomy\src\module-1\g11-tokenization.html`, `…\g01-weights.html`, `…\g12-training-objective.html` — Phase 1 content + interactives
- The remaining 31 `src\module-*\*.html` gap pages — Phase 2/3
- `C:\Claude Cowork\Projects\ai autonomy\src\index.html` — Phase 4 landing-page review/update (module map, learning-path CTA, progress tracker)
- `C:\Claude Cowork\Projects\ai autonomy\src\template.html` — Phase 0: `.gitignore` or retire (resolve ambiguity vs the generator)
- `C:\Claude Cowork\Projects\ai autonomy\llm-intelligence-deep-dive_v1.html` — **named reuse source** (in-project root copy; byte-identical to the CLAUDE OUTPUTS copy, kept for offline/self-contained reuse). The line refs used above land against this file (it is ~1284 lines; exact count not load-bearing).
- Duplicate v1 at `C:\Claude Cowork\CLAUDE OUTPUTS\Topic Briefer\llm-intelligence-deep-dive_v1.html` — identical copy; not the reuse source; leave untouched
- Source of truth (READ-ONLY, never edit — the bibliography lives inside it): `C:\Claude Cowork\CLAUDE OUTPUTS\ai autonomy\ai-autonomy_Curriculum_v2.md`
