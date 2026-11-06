# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React · TypeScript · Tailwind CSS · shadcn-ui · Vite (originally scaffolded in Lovable)

## Users

**Primary:** Recruiters and hiring managers evaluating Jiwon as a software engineering internship or new-grad candidate. They arrive with limited time, compare many candidates, and need to quickly confirm technical depth and differentiation before deciding to reach out.

**Secondary:** Potential collaborators and hackathon teammates who want to understand Jiwon's skills and working style.

**Success for the primary user:** They feel confident enough in Jiwon's abilities to send a message or forward the résumé.

## Product Purpose

A personal portfolio for Jiwon Lee — CS student at Western University (BSc, 2023–2028, GPA 3.5/4.0), currently a Software Engineering Intern at INVENTIS Korea (Seoul, Sep 2026 – Feb 2027). The site showcases full-stack development, GPU simulation, and ML work, and gives recruiters a richer signal than a résumé alone.

What makes it possible to get that signal fast: an AI chat assistant ("Ask my AI") answers questions about Jiwon directly, so visitors who want depth can get it without reading every line.

## Positioning

The editorial newspaper frame (masthead, dateline, slug lines, "Morning / Night edition") is the visual identity that makes this portfolio immediately distinguishable from generic developer portfolios. The in-page AI assistant adds a second differentiator that is functionally unique: it lets recruiters interrogate the portfolio rather than just scan it.

## Operating Context

Viewed primarily on desktop by recruiters with many tabs open. Dark-mode use is plausible (the site supports it). The résumé PDF is a primary export artifact. The site is public and must load fast on a standard corporate network.

## Capabilities and Constraints

**Sections:** Hero (masthead + Toronto skyline + live clock), Projects, Experience, About, Skills, Contact, AI chat.

**Featured projects (confirmed):**
- **ROCsim** — real-time GPU N-body physics engine targeting AMD and NVIDIA via CUDA + HIP/ROCm, Qt 6/OpenGL UI, 60 FPS at 500–1,000 particles.
- **Sentimentrix** — Reddit sentiment classification pipeline; SVM on BERT embeddings, 78.4% accuracy, 0.83 ROC AUC.
- **Pong RL** — curriculum learning vs. direct training for a PPO agent in Atari Pong.

**Tech stack of the product itself:** React, TypeScript, Tailwind, shadcn-ui, Vite.

**Distinctive UI elements:** handcrafted Toronto skyline SVG, live clock, custom bat cursor, dark/light theme toggle, scroll-reveal animations.

**Constraints:** The newspaper editorial frame, the AI chat section, and the Toronto skyline illustration are identity-defining and must be preserved through any refinement. Future work is directed by Jiwon per prompt; do not plan builds without explicit instruction.

## Brand Commitments

- Name: **Jiwon Lee** (handle: JiwiKiwi19 on GitHub)
- Voice: editorial, precise, slightly wry — matches the newspaper aesthetic without being stiff.
- Identity anchor: newspaper masthead with dateline (Toronto, ON · 43.65° N 79.38° W), "Morning / Night edition" toggle.
- Primary color accent: `text-primary` (green dot / accent) used sparingly.

## Evidence on Hand

- GitHub: https://github.com/JiwiKiwi19
- LinkedIn: https://linkedin.com/in/jiwon-lee-7614362ab
- Project source code and screenshots in repo.
- Résumé PDF (linked as /resume.pdf).
- ROCsim live demo: https://rock-sim2-d38fmr76a-jiwons-projects-b2d4314d.vercel.app/

## Product Principles

1. **Depth over breadth.** Each project shows the hard technical problem solved, not just the stack used.
2. **The editorial frame is the brand.** Typography, layout rhythm, and the newspaper metaphor must hold at every touch point.
3. **Fast to trust.** A recruiter with 90 seconds should be able to confirm Jiwon's level and find the contact link without scrolling the whole page.
4. **AI as genuine utility.** The chat assistant exists to answer real questions, not as a gimmick — it earns its place by actually accelerating a recruiter's decision.

## Accessibility & Inclusion

No specific requirement stated. Standard WCAG 2.1 AA is implied by a public professional portfolio.
