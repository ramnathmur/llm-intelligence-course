# Landing Hub Publishing — Session Handoff
**Date:** 2026-06-14  
**Status:** Ready for immediate deployment  
**Next Action:** Publish landing hub + deploy 3 new courses  

---

## Executive Summary

Claude Design has completed a cyberpunk-themed landing hub that aggregates 4 educational courses. The design is validated, extensible, and ready for deployment. All URLs are pre-configured. Next session: deploy to Vercel and test navigation.

---

## Design Deliverable

**File Location:** `C:\Users\ramna\Downloads\design-output\`

**Main Files:**
- `AI Course Hub - Standalone.html` (172 KB, production bundle)
- `AI Course Hub.dc.html` (21 KB, readable Claude Design source)
- `support.js` (51 KB, required dependency)
- `screenshots/` (3 preview images showing hero + cards)

**Design Validation:** ✅ APPROVED
- Cyberpunk aesthetic (neon cyan/magenta/green on dark navy)
- Minimalist, classy, professional
- Fully responsive (mobile, tablet, desktop)
- Animated hero title, scanline effects, card hover states
- Sticky header with navigation
- Course cards with color-coded accents
- Footer with GitHub and course links

---

## Landing Hub Configuration

**Site Name:** NEURAL HUB (Intelligence Systems)

**Courses (Pre-configured in HTML):**

| ID | Course | Status | URL | Accent | Tag |
|----|--------|--------|-----|--------|-----|
| 01 | LLM Intelligence & Agent Autonomy | Live | https://llm-intelligence-course.vercel.app | Cyan #00d9ff | LIVE NOW |
| 02 | Agents Master Course | Ready | https://agents-master-course.vercel.app | Magenta #d946ef | COMING SOON |
| 03 | book-to-html | Ready | https://book-to-html.vercel.app | Green #00ff41 | COMING SOON |
| 04 | AI-first App Dev Blueprint | Ready | https://ai-first-blueprint.vercel.app | Amber #ffb800 | COMING SOON |

**All URLs are correct and already embedded in the HTML.**

---

## Next Session: Deployment Checklist

### Phase 1: Extract & Prepare Landing Hub (10 min)
- [ ] Copy `AI Course Hub - Standalone.html` to `C:\Claude Cowork\Projects\`
- [ ] Rename to `index.html` (or keep as-is for Vercel routing)
- [ ] Create GitHub repo: `course-landing-hub`
- [ ] Initialize git, commit, push

### Phase 2: Create GitHub Repos for 3 New Courses (15 min)

#### Agents Master Course
```bash
# Source: C:\Claude Cowork\CLAUDE OUTPUTS\agents master course\
# GitHub: ramnathmur/agents-master-course
# Vercel: agents-master-course.vercel.app (already live)
# Tasks:
# - Copy to C:\Claude Cowork\Projects\agents-master-course
# - Create README (use LLM Intelligence template)
# - Add launch.html gateway
# - Create vercel.json
# - Deploy to Vercel --prod
```

#### book-to-html
```bash
# Source: C:\Claude Cowork\CLAUDE OUTPUTS\book-to-html\
# GitHub: ramnathmur/book-to-html
# Vercel: book-to-html.vercel.app
# Tasks:
# - Copy to C:\Claude Cowork\Projects\book-to-html
# - index.html already exists (serves as gateway)
# - Create README explaining the readers
# - Create vercel.json if needed
# - Deploy to Vercel --prod
```

#### AI-first App Dev Blueprint
```bash
# Source: C:\Claude Cowork\CLAUDE OUTPUTS\AI-first application development blueprint\
# GitHub: ramnathmur/ai-first-blueprint
# Vercel: ai-first-blueprint.vercel.app
# Tasks:
# - Copy to C:\Claude Cowork\Projects\ai-first-blueprint
# - Identify main HTML file (ai-first-blueprint_Playbook_v2.html likely)
# - Rename to index.html or create landing
# - Create README
# - Create vercel.json
# - Deploy to Vercel --prod
```

### Phase 3: Deploy Landing Hub (10 min)
```bash
# Create repo at ramnathmur/course-landing-hub
# Deploy to Vercel --prod
# Landing hub URL: https://course-landing-hub.vercel.app (or custom domain)
```

### Phase 4: Verify Navigation (5 min)
- [ ] Open landing hub
- [ ] Click each course card
- [ ] Verify navigation works (courses appear, links work)
- [ ] Test cross-navigation (from course back to hub via links or browser back)
- [ ] Check responsive design on mobile

### Phase 5: Final Configuration (5 min)
- [ ] Update GitHub repo descriptions
- [ ] Add landing hub URL to all course READMEs
- [ ] Update all course repos to link back to hub
- [ ] Test all URLs one final time

---

## Design Code Structure (Reference)

**Key JavaScript Function for Adding Courses:**

```javascript
const makeCourse = ({ id, title, description, duration, tag, link, accent, r, g, b }) => {
  // Course data structure — to add a new course, call:
  // makeCourse({
  //   id: '05',
  //   title: 'New Course',
  //   description: '...',
  //   duration: 'TBD',
  //   tag: 'COMING SOON',
  //   link: 'https://new-course.vercel.app',
  //   accent: '#ffffff',
  //   r: 255, g: 255, b: 255
  // })
  // ...grid auto-adapts, no HTML changes needed
};
```

All 4 courses are pre-configured. No code changes needed for initial deployment.

---

## Files to Collect/Prepare

**From Downloads:**
- Extract all files from `C:\Users\ramna\Downloads\design-output\`
- Keep together in project folder for reference

**From CLAUDE OUTPUTS (Source Material):**
1. `agents master course/` — full directory
2. `book-to-html/` — full directory
3. `AI-first application development blueprint/` — full directory

**Git Repos Already Created:**
- ✅ https://github.com/ramnathmur/llm-intelligence-course (live)
- ⏳ Need to create: `course-landing-hub`, `agents-master-course`, `book-to-html`, `ai-first-blueprint`

---

## Known Issues / Notes

- **book-to-html:** Contains multiple reader HTML files (Atomic Habits, 48 Laws, etc.). May need to create landing page that lists them, or pick one as primary entry point.
- **AI-first blueprint:** Multiple playbook versions exist (v1, v2). Use v2 as primary.
- **Vercel Routing:** Each course may need `vercel.json` for proper static file serving (reference: `C:\Claude Cowork\Projects\ai autonomy\vercel.json`).

---

## Reference: LLM Intelligence Course (Template)

This project is the proven template:
- GitHub: https://github.com/ramnathmur/llm-intelligence-course
- Vercel: https://llm-intelligence-course.vercel.app
- Landing Page: `/launch.html` → leads to `/src/index.html`
- Config: `vercel.json` for routing
- README: Professional, externally-publishable format

**Use this as the pattern for all 3 new courses.**

---

## Session Context Saved To Memory

See: `ai-autonomy-landing-hub-deployment.md` in memory folder.

Key facts captured:
- Landing hub is Claude Design-generated, cyberpunk theme, 4 courses configured
- All URLs pre-set, ready for deployment
- 3 new courses need GitHub repos + Vercel deployment
- Navigation must be tested cross-course
- Pattern: follow LLM Intelligence setup for each course

---

## Questions for Next Session

1. **book-to-html:** Should we create a master index listing all readers, or pick one book as the main entry point?
2. **Custom Domains:** Do you want `llm-intelligence-course.com` or similar branded domains? (Nice-to-have, not blocking)
3. **Footer Links:** Landing hub footer references "GITHUB" generically — should we link to a specific org profile or leave as-is?

---

**Ready for Next Session:** ✅ Yes. All design validated, all data pre-configured. Pure deployment execution.
