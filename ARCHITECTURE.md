# Architecture

This document explains, in depth, how **personal-website-V1** is built — the
rendering model, the signature scroll-scrubbed video effect, the content
pipeline, the shared component patterns, the cross-component event bus, the
design system, and the accessibility/mobile considerations that shape the code.

It is aimed at a developer who needs to understand *why* the code is shaped the
way it is before changing it. For day-to-day commands and conventions see
[`CLAUDE.md`](./CLAUDE.md); this document is the deeper companion.

---

## 1. Concept

The site is a **single-page portfolio** whose defining feature is a full-screen
background video that **scrubs frame-by-frame with the scroll position**,
narrating a journey from cosmic chaos (a black hole / accretion disk) to serene
rebirth (a meadow). Everything else — the color palette, the amber→mint accent
shift, the glass cards floating over the footage — exists to support that
single continuous cinematic scroll.

The page is **~5 viewport-heights tall**, divided into five stacked sections
(Hero → Education → Experience → Projects → Contact). Scroll progress `0→1` maps
linearly onto the video timeline `0→duration`, so each section corresponds to
roughly one narrative "beat" of the footage.

---

## 2. Tech stack

| Layer            | Choice                                    | Notes |
|------------------|-------------------------------------------|-------|
| Framework        | **Next.js 16** (App Router) + **React 19**| Turbopack dev server |
| Language         | **TypeScript 5** (strict)                 | Type-checked at build |
| Styling          | **Tailwind CSS v4**                       | Config lives in CSS via `@theme`, not `tailwind.config.js` |
| Scroll engine    | **GSAP + ScrollTrigger**                  | Drives the video scrub + section snapping |
| UI animation     | **Framer Motion** (`framer-motion` v12)   | Section reveals, modal transitions, micro-motion |
| Icons            | **lucide-react** + local `BrandIcons`     | lucide 1.x dropped brand logos, so GitHub/LinkedIn are hand-inlined |
| Fonts            | `next/font/google` — Space Grotesk + Inter| Self-hosted, no external requests at runtime |
| Audio            | HTML `<audio>` + **Web Audio API**        | Gain-node volume control (works on iOS) |

There is **no state-management library, no CSS-in-JS runtime, and no backend**.
State is local React state; the only cross-component coordination is a
lightweight `window` event bus (see §7). The contact form posts directly to a
third-party endpoint (Formspree).

---

## 3. Directory layout

```
app/
  layout.tsx        Root layout: fonts, metadata, <body>, and the always-on
                    overlay components (music, font size, hints, loading gate).
  page.tsx          The page itself: <ScrollVideo/> + <main> with 5 sections.
  globals.css       Tailwind import + @theme design tokens + custom utilities.

components/
  ScrollVideo.tsx       The signature scroll-scrubbed video (GSAP).
  Section.tsx           Reveal-on-scroll wrapper with an "eyebrow" label.
  GlassCard.tsx         Transparent-until-hover frosted card primitive.
  DetailModal.tsx       Click-to-open overlay + fullscreen image lightbox.
  MusicPlayer.tsx       Ambient music control (bottom-left).
  FontSizeControl.tsx   Root font-size cycler (bottom-right).
  OnboardingHints.tsx   First-load hints pointing at the two corner controls.
  ScrollIndicator.tsx   "Scroll to explore" cue in the hero.
  LoadingGate.tsx       Full-screen curtain until the experience is ready.
  BrandIcons.tsx        Inline GitHub/LinkedIn SVGs.
  sections/
    Hero.tsx, Education.tsx, Work.tsx, Projects.tsx, Contact.tsx

lib/
  content.ts        ALL editable content + the TypeScript types for it.

public/
  background_video_scrub.mp4   Dense-keyframe re-encode for smooth seeking.
  poster.jpg                   First frame / reduced-motion fallback.
  reflections-reprise.mp3      Ambient background track.
  amirhossein_nafissi_resume_2026.pdf
  gallery/…                    Overlay images, grouped by section/item.
```

---

## 4. Rendering model

### Server vs. client components

`app/layout.tsx` and `app/page.tsx` are **server components** (no `"use client"`).
They emit static markup: the layout shell, `<ScrollVideo/>`, and the five
sections. Every component that needs the browser — scroll listeners, refs,
`localStorage`, audio, Framer Motion — is a **client component** marked
`"use client"`. This keeps the server output minimal and pushes interactivity to
the leaves of the tree.

### `layout.tsx`

- Loads **Inter** (body) and **Space Grotesk** (display) via `next/font`, exposing
  them as the CSS variables `--font-inter` / `--font-space-grotesk` that
  `globals.css` maps to `--font-sans` / `--font-display`.
- Declares page + Open Graph **metadata**.
- Renders `children` (the page) followed by the four **persistent overlays** that
  must exist on every part of the page regardless of scroll:
  `<MusicPlayer/>`, `<FontSizeControl/>`, `<OnboardingHints/>`, `<LoadingGate/>`.
  Their **source order matters** — see the effect-ordering note in §7.

### `page.tsx`

```
<ScrollVideo/>                 fixed, z-0, behind everything
<main className="z-10">        the scrolling content
  <Hero/> <Education/> <Work/> <Projects/> <Contact/>
</main>
```

The video is a fixed full-screen layer at `z-0`; `<main>` sits above it at
`z-10`; the corner controls and modals sit at `z-50`/`z-[60]`; the loading gate
is the topmost layer at `z-[100]`.

---

## 5. The signature effect — `ScrollVideo`

This is the heart of the site and the most subtle piece of code. It is a fixed,
muted, `playsInline` `<video>` whose `currentTime` is **driven by scroll** rather
than by playback.

### Scroll → time mapping

A GSAP `ScrollTrigger` spans the whole document (`start: "top top"`,
`end: "bottom bottom"`) and tweens a proxy object `{ t: 0 } → { t: duration }`
with `ease: "none"`. On every update, `onUpdate` seeks the video:

```
video.currentTime = min(proxy.t, duration - 0.05)
```

Key robustness details baked into the code:

- **`scrub: 0.6`** — a short catch-up so the video settles quickly after the user
  stops, without a long lingering "tail" that reads as jitter.
- **Sub-frame seek suppression** — a seek is only issued when the target differs
  from the current time by more than `1/48s`. Redundant micro-seeks make the
  decoder thrash and visibly stutter.
- **Readiness guard** — seeks only happen once `video.readyState >= 1`
  (`HAVE_METADATA`).

### Section-center snapping

Instead of snapping section *tops* to the viewport top, the code snaps each
section's **center to the viewport center**. Because sections have different
heights (e.g. Experience is shorter), snap points are **measured live** on every
snap from the DOM:

```
centerScroll = section.offsetTop + section.offsetHeight/2 - viewportHeight/2 - trigger.start
snapPoint    = clamp(centerScroll / (trigger.end - trigger.start), 0, 1)
```

Crucially the progress is normalized by **ScrollTrigger's own scroll range**
(`end - start`), the same scale as the `value` passed to `snapTo`; using a
separately-measured `scrollHeight` would put the target on a different scale and
snap sections off-center. The snap is **proximity-based**: it only engages when
the user rests within `0.06` progress of a section center, leaving a wide dead
band for free scrolling.

### Priming for iOS/Safari

Mobile Safari won't decode frames for seeking until the video has been "primed"
by a muted, inline `play()`. `prime()` does exactly one muted play→pause→reset
before building the scrubber, then relies on seeking thereafter.

### Re-measuring layout

The scrub range and snap centers depend on final layout, which isn't settled at
first paint. `ScrollTrigger.refresh()` is re-run:

- on `window` `load`,
- when `document.fonts.ready` resolves,
- and on the custom **`font-scale-change`** event (deferred one frame), because
  changing the root font size reflows every section to a new height.

### Reduced motion

If `prefers-reduced-motion: reduce`, the scrubber is never built; the video is
paused on a calm still frame (`poster.jpg` covers any seek gap).

---

## 6. Readiness gating — `LoadingGate`

The scrub effect looks broken if the user scrolls before enough of the ~11 MB
video has buffered. `LoadingGate` is a full-screen curtain (`z-[100]`) that
**locks body scroll** and holds until three promises settle (raced against a
**5 s safety timeout**):

1. the background video can play (`readyState >= 3` or `canplay`),
2. all overlay gallery images have decoded (failures resolve too — never block),
3. web fonts are ready (`document.fonts.ready`).

When it finishes it:

- restores `body` overflow,
- sets `window.__loadingComplete = true`,
- dispatches the **`loading-complete`** event (consumed by `OnboardingHints`),
- fades out over 600 ms, then unmounts.

Reduced-motion users skip the wait entirely.

---

## 7. Cross-component coordination — the `window` event bus

There is no shared store. Independent components coordinate through a handful of
**`window` CustomEvents** plus one global flag. This keeps components decoupled —
each one only listens for what it cares about.

| Signal                        | Dispatched by            | Consumed by            | Purpose |
|-------------------------------|--------------------------|------------------------|---------|
| `overlay-open` / `overlay-close` | `DetailModal`         | `MusicPlayer`          | Duck music volume while a detail overlay is open (ref-counted). |
| `font-scale-change`           | `FontSizeControl`        | `ScrollVideo`          | Re-measure the scrub range after the root font size reflows the page. |
| `loading-complete` + `window.__loadingComplete` | `LoadingGate` | `OnboardingHints` | Reveal the hints exactly when the page becomes visible (and scroll is unlocked at the top). |

**Effect-ordering note:** React runs passive effects in tree order, so because
`OnboardingHints` appears **before** `LoadingGate` in `layout.tsx`, its
`loading-complete` listener is registered before the gate can dispatch — even in
the synchronous reduced-motion path. The `window.__loadingComplete` flag is a
belt-and-suspenders fallback for any late mount.

---

## 8. Content model — `lib/content.ts`

All copy, links, and image lists live in **one typed module**. Sections import
from it and render generically — there is no content embedded in JSX.

- `profile` — name, title, social URLs, email, résumé path.
- `education: Education[]`, `work: Work[]`, `projects: Project[]` — each item has
  a short card description plus an optional richer overlay (`longDescription`,
  `images`, `links`).
- Shared types:
  - `GalleryImage = string | { src; caption? }` — a bare path or a captioned
    image; `""` renders an empty placeholder tile.
  - `DetailLink = { label; url }` — a labelled external link in the overlay.
- Item-level presentation flags live here too, e.g. `Project.swapEndsOnMobile`,
  which asks the overlay to swap the first/last gallery images on mobile only.

To edit the site's content you almost always touch **only this file**.

---

## 9. Section rendering pattern

The three "list" sections (Education, Experience, Projects) all follow the same
shape, composed from two primitives:

### `Section`

A Framer-Motion reveal wrapper: it fades/slides its children in when scrolled
into view (`whileInView`, re-triggering each time), renders the uppercase
**eyebrow** label (e.g. `01 — Education`) with an accent rule, and accepts an
`accent` (`amber`/`mint`), `align`, and `heightClass` (which tunes how much
scroll — and therefore how much video footage — the section spans).

### `GlassCard`

The recurring visual primitive: a card that is nearly invisible (letting the
video show through) and only resolves into a **frosted panel** on hover. Hover
does *not* paint an opaque fill — it uses `backdrop-brightness` to **dim the
video behind the glass**, so the card reads dark yet stays translucent and its
text stays legible. An accent border + glow complete the hover state.

### A section component

Each section (e.g. `Work.tsx`) maps its content array to `GlassCard`s wrapping a
`<button>` (so the whole card is a keyboard-focusable control), tracks a
`selected` item in local state, and renders a single shared `DetailModal` driven
by that selection. `Hero` and `Contact` are bespoke (no list): Hero is the title
card with the `ScrollIndicator`; Contact is the form + socials.

---

## 10. Detail overlay & lightbox — `DetailModal`

Rendered through a **React portal** into `document.body` so it escapes any
section stacking context. It has two layers:

1. **The overlay panel** (`z-50`) — a dark-but-translucent glass sheet (same
   `backdrop-brightness` treatment as the cards) holding the title, a gallery,
   the long description, and external links. Framer Motion animates it in/out.
2. **The lightbox** (`z-[60]`) — a fullscreen viewer for a single gallery image
   with prev/next navigation and a caption.

Behaviors worth knowing:

- **Body scroll lock** while open, plus it fires `overlay-open`/`overlay-close`
  so the music ducks.
- **Keyboard**: `Esc` closes the lightbox first, then the modal; arrow keys page
  through photos while the lightbox is open.
- **Gallery ordering**: `centerLogo()` reorders images so a file whose name
  contains "logo" sits in the middle, with the rest split evenly around it.
  `swapEndsOnMobile` additionally swaps the two end tiles on mobile via flexbox
  `order` (reset at `sm:`), leaving the desktop row unchanged.
- **First-time hint**: the first time any image overlay is opened, a one-shot
  "click a photo to enlarge" pill appears (persisted via `localStorage` so it
  never repeats), and the image tiles get an amber hover border + glow to signal
  they're clickable.
- **Mobile lightbox**: the content is in an `overflow-y-auto` layer so a tall
  photo plus a long caption is never cropped; the image is capped in **`dvh`**
  (dynamic viewport height) so iOS's toolbar-inclusive `vh` doesn't push it under
  the pinned, high-contrast close button.

---

## 11. Persistent controls

These live in `layout.tsx` and are present at every scroll position.

### `MusicPlayer` (bottom-left)

Ambient background track behind a record-player disc (spins while playing).
Starts paused/silent (autoplay-safe); play never auto-resumes. The volume slider
reveals on hover/focus (desktop) or when the disc is tapped (touch) and hides on
scroll / mouse-leave. Volume persists in `localStorage`.

The important subtlety: **iOS Safari ignores `HTMLMediaElement.volume`**. To make
the slider work there, the element is routed through the **Web Audio API**
(`MediaElementSource → GainNode → destination`), built and `resume()`d inside the
play tap (required by iOS gesture rules), and volume is driven by the gain node
(with an `element.volume` fallback for browsers without Web Audio). Volume
changes and the overlay-ducking both **ramp the gain smoothly**. The slider thumb
is enlarged and uses `touch-action: none` so drags aren't stolen by page scroll.

### `FontSizeControl` (bottom-right)

Cycles the **root font size** through `1 / 1.15 / 1.3`. Because every Tailwind
size is `rem`-based, changing `documentElement.style.fontSize` reflows the whole
page; the control then dispatches `font-scale-change` so `ScrollVideo` re-measures
its snap centers. The level persists in `localStorage`.

### `OnboardingHints`

Two pointer pills that point at the music and font-size controls. They appear on
`loading-complete` (see §6/§7), auto-fade after 15 s, hide on a deliberate scroll
into content, and return when the user scrolls back to the very top. The
show-on-`loading-complete` design (rather than a mount-time scroll check) plus a
short post-show grace window is specifically to survive iOS's address-bar scroll
jitter, which previously suppressed them on first load.

### `ScrollIndicator`

A small "scroll to explore" cue in the hero, visible only at the very top.

---

## 12. Design system & theming

Tailwind v4 is configured **in CSS** via the `@theme` block in `globals.css`
(there is no `tailwind.config.js`). Tokens include:

- **Colors** — `void`/`space` (deep-space base), `amber`/`amber-deep`
  (accretion-disk accent), `mint`/`mint-deep` (meadow/rebirth accent),
  `haze`/`haze-dim` (text). Amber accents the early sections, mint the Contact
  finale — mirroring the video's arc.
- **Fonts** — `--font-display` (Space Grotesk) and `--font-sans` (Inter).

Custom utilities defined alongside the tokens:

- `.text-shadow-soft` / `.text-shadow-glow` — layered shadows so small text stays
  legible over the shifting video **without a heavy background plate**. These are
  applied liberally to text that floats directly on the footage.
- `.tracking-spaced` — the wide `0.32em` letter-spacing on the uppercase labels.
- The `marquee`, `loader-sweep` keyframes and the `.music-volume` range-thumb
  styling.

---

## 13. Accessibility & reduced motion

- **Reduced motion** is honored deeply: `ScrollVideo` shows a still frame,
  `LoadingGate` reveals immediately, and a global media query collapses animation
  and transition durations to ~0.
- Cards are real `<button>`s with visible `focus-visible` rings; the modal is a
  labelled `role="dialog"` with full keyboard control; images in the lightbox are
  reachable/zoomable via keyboard.
- Decorative media (`<video>`, gallery placeholders) is `aria-hidden`; icons are
  `aria-hidden` with text or `aria-label` alternatives.

---

## 14. Mobile / iOS-specific engineering

Several pieces exist purely to handle mobile Safari quirks, and are easy to
regress if you're testing only on desktop:

- **Video priming** so seeking works on iOS (§5).
- **`dvh` image sizing** in the lightbox so photos fit the visible area and the
  close button stays clear (§10).
- **Web Audio volume** because `element.volume` is a no-op on iOS (§11).
- **Onboarding hints keyed to `loading-complete`** + grace window to survive
  address-bar scroll jitter (§11).
- **`touch-action: none`** on the volume slider so drags aren't hijacked by
  scroll.

When touching any of these, verify on a real iPhone (or the network dev URL),
not just desktop emulation.

---

## 15. Configuration & build

- **`next.config.ts`** pins `turbopack.root` to this folder (a stray
  `package-lock.json` in the home directory otherwise confuses Next's
  workspace-root inference) and hides the dev indicator badge.
- **TypeScript** is type-checked as part of `npm run build`.
- **Formspree**: the contact form posts to the endpoint in `Contact.tsx`
  (`FORM_ENDPOINT`, overridable via `NEXT_PUBLIC_FORMSPREE_ENDPOINT`). No backend.
- **Assets**: the scrub video and poster live in `public/`; the video is a
  dense-keyframe re-encode specifically so `currentTime` seeking is smooth.

### Commands

| Command          | Purpose |
|------------------|---------|
| `npm run dev`    | Turbopack dev server at `http://localhost:3000` |
| `npm run build`  | Production build (includes the TypeScript type-check) |
| `npm run start`  | Serve the production build |
| `npm run lint`   | ESLint |

---

## 16. Data & control flow at a glance

```
                       scroll position
                             │
                             ▼
   ┌──────────────┐   GSAP ScrollTrigger   ┌───────────────────────────┐
   │  <main> 5×   │─────────(scrub)────────▶│ ScrollVideo: video.current│
   │  sections    │                         │ Time = progress×duration  │
   └──────┬───────┘                         └───────────────────────────┘
          │ maps content from
          ▼
   ┌──────────────┐    click a card     ┌───────────────┐
   │ lib/content  │────────────────────▶│  DetailModal   │
   │  (typed data)│                     │  + Lightbox    │
   └──────────────┘                     └──────┬─────────┘
                                               │ overlay-open/close
                                               ▼
   ┌──────────────┐  font-scale-change   ┌───────────────┐
   │ FontSize     │─────────────────────▶│  ScrollVideo   │ (re-measure)
   │ Control      │                      └───────────────┘
   └──────────────┘
   ┌──────────────┐  loading-complete    ┌───────────────┐
   │ LoadingGate  │─────────────────────▶│ OnboardingHints│
   └──────────────┘                      └───────────────┘
   ┌──────────────┐   duck on overlay    ┌───────────────┐
   │ DetailModal  │─────────────────────▶│  MusicPlayer   │
   └──────────────┘                      └───────────────┘
```

The through-line: **scroll drives the video**, **`lib/content.ts` drives the
DOM**, and a small set of **`window` events** keeps the otherwise-independent
overlays in sync.
