# personal-website-V1

My personal portfolio — an "Interstellar / Futuristic Space" single-page site whose full-screen background video scrubs frame-by-frame as you scroll, moving from cosmic chaos to serene rebirth.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Framer Motion**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type-check
```

## Editing content

- **Text** (education, work, projects, socials): `lib/content.ts` — placeholders are marked `TODO`.
- **Contact form**: create a free form at [formspree.io](https://formspree.io), then set `FORM_ENDPOINT` in `components/sections/Contact.tsx` (marked `TODO`). No backend required.
- **Name / title / social links**: top of `lib/content.ts`.
- **Background video**: replace `public/background_video_scrub.mp4` (use a re-encode with dense keyframes for smooth scroll seeking) and `public/poster.jpg` (still fallback shown to reduced-motion users).
- **Theme colors / fonts**: `app/globals.css` (`@theme` block).

## How the scroll video works

The page is five full-height sections (~500vh total). `components/ScrollVideo.tsx` maps scroll progress 0→1 onto the video's `currentTime` 0→duration via GSAP ScrollTrigger, so each section spans ~2s of footage. Reduced-motion users see a static frame.

## Deploy

Any Next.js host works; [Vercel](https://vercel.com) is simplest. After deploying, set `metadataBase` in `app/layout.tsx` to your real domain so social preview images resolve.
