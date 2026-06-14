# Next Session: Landing Hub + Course Deployment
**Start Here:** Read `HANDOFF-LANDING-HUB.md` first (same directory)

---

## What You're Doing

Deploying a cyberpunk-themed landing hub that serves as the entry point for 4 educational courses:
1. **LLM Intelligence & Agent Autonomy** (already live on Vercel)
2. **Agents Master Course** (needs deployment)
3. **book-to-html** (needs deployment)
4. **AI-first App Dev Blueprint** (needs deployment)

---

## Files You Have

**Claude Design Output:** `C:\Users\ramna\Downloads\design-output\`
- `AI Course Hub - Standalone.html` ← This is the landing hub (production-ready)
- `AI Course Hub.dc.html` ← Readable source version
- `support.js` ← Required dependency
- `screenshots/` ← Design preview images

**Source Materials (to be deployed):**
- `C:\Claude Cowork\CLAUDE OUTPUTS\agents master course\` ← 15 HTML files, full curriculum
- `C:\Claude Cowork\CLAUDE OUTPUTS\book-to-html\` ← Interactive book readers
- `C:\Claude Cowork\CLAUDE OUTPUTS\AI-first application development blueprint\` ← Playbook + diagrams

---

## Execution Plan

### ✅ Step 1: Extract Landing Hub to Project (5 min)
```
Source: C:\Users\ramna\Downloads\design-output\AI Course Hub - Standalone.html
Destination: C:\Claude Cowork\Projects\course-landing-hub\index.html
```
Create new directory structure and commit.

### ✅ Step 2: Create GitHub Repos (4 repos total)
1. `ramnathmur/course-landing-hub` ← landing hub
2. `ramnathmur/agents-master-course` ← already exists, just push from Projects folder
3. `ramnathmur/book-to-html` ← already exists, just push from Projects folder
4. `ramnathmur/ai-first-blueprint` ← already exists, just push from Projects folder

Each needs:
- README (use LLM Intelligence template style)
- vercel.json (copy from ai autonomy project)
- launch.html (optional but recommended)

### ✅ Step 3: Deploy All 4 to Vercel
```
vercel --prod
```
For each repo in sequence.

### ✅ Step 4: Verify Navigation Works
- Open landing hub
- Click each course card
- Verify links work
- Check responsive design

### ✅ Step 5: Final Cleanup
- Update course READMEs to link back to hub
- Test cross-navigation
- Create Twitter post announcing the hub

---

## Key URLs (Pre-Configured)

All embedded in landing hub HTML — no changes needed:

```
Landing Hub: https://course-landing-hub.vercel.app

Courses:
- LLM Intelligence: https://llm-intelligence-course.vercel.app [LIVE]
- Agents Master: https://agents-master-course.vercel.app [DEPLOYING]
- book-to-html: https://book-to-html.vercel.app [DEPLOYING]
- AI-first Blueprint: https://ai-first-blueprint.vercel.app [DEPLOYING]
```

---

## Design Notes (Don't Change)

Landing hub features:
- **Name:** NEURAL HUB
- **Tagline:** "Educational intelligence for practitioners"
- **Colors:** Cyberpunk (neon cyan, magenta, green on dark navy)
- **Courses:** 4 color-coded cards with animated corners, glow effects
- **Extensibility:** Easy to add new courses (see `HANDOFF-LANDING-HUB.md` for code)

Design is locked-in and approved. Pure deployment from here.

---

## Potential Issues to Watch

1. **book-to-html Index:** Multiple book readers exist. May need to create index.html or pick primary book.
2. **vercel.json:** Each course may need routing config (reference: `ai autonomy/vercel.json`).
3. **README Template:** Use LLM Intelligence course README as style guide.
4. **Testing:** Always test nav links after deployment.

---

## Success Criteria

✅ Landing hub deployed and accessible  
✅ All 4 course links work (click course card → course loads)  
✅ Responsive design works on mobile  
✅ Cross-navigation works (ability to return to hub from courses)  
✅ GitHub repos created and linked  
✅ Twitter ready to announce  

---

## Command Reference

```bash
# Deploy landing hub
cd C:\Claude Cowork\Projects\course-landing-hub
git init
git add .
git commit -m "Add Neural Hub landing page"
git remote add origin https://github.com/ramnathmur/course-landing-hub
git push -u origin master
vercel --prod

# Deploy each course (repeat for all 3)
cd C:\Claude Cowork\Projects\agents-master-course
git add .
git commit -m "Deploy to Vercel"
vercel --prod
```

---

## Reference Files

- `HANDOFF-LANDING-HUB.md` ← Full context and checklist
- `C:\Claude Cowork\Projects\ai autonomy\vercel.json` ← Config template
- `C:\Claude Cowork\Projects\ai autonomy\README.md` ← Style guide for READMEs
- `https://github.com/ramnathmur/llm-intelligence-course` ← Pattern to follow

---

## Memory Updated

Session context saved to: `ai-autonomy-landing-hub-deployment.md` (memory folder)

Includes:
- Landing hub design specs
- Pre-configured course URLs
- Deployment checklist
- Navigation requirements

---

**Ready to Deploy:** ✅ All design validated, all URLs configured, ready for execution.

Start with: Extract landing hub → Create GitHub repos → Deploy to Vercel → Test navigation.

---

*Last Updated: 2026-06-14 (Session end)*
*Next Session Start: Read HANDOFF-LANDING-HUB.md first*
