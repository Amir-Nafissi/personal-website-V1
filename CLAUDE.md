# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

A single-page personal portfolio ("personal-website-V1") built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**. The signature feature is a full-screen background video that scrubs frame-by-frame with scroll, narrating a journey from cosmic chaos (black hole) to serene rebirth (meadow).

The remote `origin` is a private GitHub repo: `https://github.com/Amir-Nafissi/personal-website-V1`. Auth works via the local Git credential manager (cached). The default branch is `main`.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (runs TypeScript type-check)
- `npm run start` — serve the production build
- `npm run lint` — ESLint

No test suite yet.

## Architecture

- **`app/`** — App Router. `layout.tsx` loads fonts (Space Grotesk display + Inter body via `next/font`) and metadata; `globals.css` defines the Tailwind v4 `@theme` (colors `void`/`amber`/`mint`/`haze`, fonts) and text-shadow utilities; `page.tsx` mounts `<ScrollVideo>` plus the five sections.
- **`components/ScrollVideo.tsx`** — the core effect. A fixed full-screen `<video>` (`/background_video_scrub.mp4`) whose `currentTime` is driven by scroll via **GSAP ScrollTrigger** (`scrub: 1`, mapped over the whole document height). The page is ~500vh (five `min-h-screen` sections), so each section ≈ 2s of footage. Honors `prefers-reduced-motion` by showing a still frame instead of scrubbing.
- **`components/`** — shared primitives: `Section` (Framer Motion reveal wrapper), `GlassCard` (transparent until hover → frosted blur + accent glow), `ScrollIndicator`, `BrandIcons` (inline GitHub/LinkedIn SVGs, since lucide-react removed brand icons). Section components live in `components/sections/`.
- **`lib/content.ts`** — all editable content (profile, education, work, projects, socials). Placeholders are marked `TODO`.
- **`public/`** — `background_video_scrub.mp4` (dense-keyframe re-encode for smooth seeking) and `poster.jpg` (first frame / reduced-motion fallback), copied from `assets/`.

## Notes

- **Contact form** posts to **Formspree**; set the real endpoint in `components/sections/Contact.tsx` (`FORM_ENDPOINT`, marked `TODO`).
- **Icons**: lucide-react 1.x has no brand logos — use `components/BrandIcons.tsx` for GitHub/LinkedIn.
- Tailwind v4 theme customization lives in `app/globals.css` via `@theme`, not a `tailwind.config.js`.
- `next.config.ts` pins `turbopack.root` to this folder because a stray `package-lock.json` in the home directory otherwise confuses Next's workspace-root inference.

## Local tooling (not committed)

The **UI/UX Pro Max** skill is installed at `.claude/skills/ui-ux-pro-max/`. The entire `.claude/` directory is gitignored, so it stays local and is not pushed. The skill provides UI/UX design-system data (color palettes, font pairings, UI styles, per-stack guidance) and activates automatically when building UI. Lean on it when scaffolding the site's design.

## Conventions

- `.gitignore` excludes `.claude/`, `node_modules/`, `.next/`, `dist/`, build output, and env files. Keep secrets and local tooling out of commits accordingly.
- Line endings: working copy uses LF; Git normalizes to CRLF on checkout on this Windows machine. The harmless `LF will be replaced by CRLF` warning is expected.
