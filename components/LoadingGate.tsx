"use client";

import { useEffect, useState } from "react";
import { profile, education, work, projects } from "@/lib/content";

/**
 * Full-screen loading gate shown until the experience is genuinely ready.
 *
 * The signature effect is the scroll-scrubbed background video, which only
 * scrubs smoothly once enough of the 11 MB file has buffered. If a visitor
 * scrolls before then, the effect looks frozen on first impression. This gate
 * holds the curtain (and locks scrolling) until three things are ready:
 *   1. the background video can play,
 *   2. the overlay gallery images are decoded,
 *   3. the web fonts are loaded.
 * A hard timeout guarantees it never traps the user on a slow connection.
 */

// Safety cap so a stalled resource can never keep the gate up forever.
const MAX_WAIT_MS = 5000;
// How long the fade-out lasts (kept in sync with the transition class below).
const FADE_MS = 600;

/** Every distinct overlay gallery image path across all sections. */
function galleryUrls(): string[] {
  const urls = new Set<string>();
  for (const item of [...education, ...work, ...projects]) {
    for (const img of item.images ?? []) {
      const src = typeof img === "string" ? img : img.src;
      if (src) urls.add(src);
    }
  }
  return [...urls];
}

export default function LoadingGate() {
  // `hidden` triggers the fade; `removed` unmounts once the fade has finished.
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let done = false;
    let fadeTimer: number | undefined;
    const prevOverflow = document.body.style.overflow;

    const finish = () => {
      if (done) return;
      done = true;
      document.body.style.overflow = prevOverflow;
      setHidden(true);
      fadeTimer = window.setTimeout(() => setRemoved(true), FADE_MS);
    };

    // Don't make reduced-motion users sit through a wait — reveal immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // Lock scrolling so nobody can scrub the video before it's ready.
    document.body.style.overflow = "hidden";

    // 1. Background video can play.
    const waitVideo = new Promise<void>((resolve) => {
      const video = document.querySelector<HTMLVideoElement>(
        'video[src="/background_video_scrub.mp4"]',
      );
      if (!video) return resolve();
      if (video.readyState >= 3) return resolve(); // HAVE_FUTURE_DATA or better
      const onReady = () => resolve();
      video.addEventListener("canplay", onReady, { once: true });
      video.addEventListener("canplaythrough", onReady, { once: true });
    });

    // 2. Overlay gallery images decoded (failures resolve too — never block).
    const waitImages = Promise.allSettled(
      galleryUrls().map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    );

    // 3. Web fonts ready.
    const waitFonts =
      "fonts" in document ? document.fonts.ready : Promise.resolve();

    const ready = Promise.allSettled([waitVideo, waitImages, waitFonts]);
    const timeout = new Promise<void>((resolve) =>
      window.setTimeout(resolve, MAX_WAIT_MS),
    );

    Promise.race([ready, timeout]).then(finish);

    return () => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-void transition-opacity duration-[600ms] ease-out ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-shadow-glow font-display text-xl font-normal tracking-wide text-haze sm:text-2xl">
        {profile.name}
      </p>

      {/* Indeterminate amber -> mint sweep on a faint track. */}
      <div className="relative h-px w-44 overflow-hidden rounded-full bg-white/10">
        <span className="loader-sweep absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-amber to-mint" />
      </div>
    </div>
  );
}
