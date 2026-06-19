"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Full-screen, fixed background video whose playback head is driven by the
 * page scroll position (the site's signature effect).
 *
 * Implementation notes:
 * - Uses `background_video_scrub.mp4`, which is re-encoded with dense keyframes
 *   so `currentTime` seeking is smooth frame-to-frame.
 * - Scroll 0 -> 1 maps linearly to video 0s -> duration. The page is 5 sections
 *   tall (~500vh), so each section spans ~2s of footage, matching the intended
 *   narrative beats (black hole -> falling -> wormhole -> meadow).
 * - Respects `prefers-reduced-motion`: skips scrubbing and shows a still frame.
 */
export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reduced motion: keep a calm, static frame instead of scrubbing.
    if (prefersReduced) {
      video.pause();
      try {
        video.currentTime = 0.05;
      } catch {
        /* seeking may not be ready yet; poster covers this */
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const proxy = { t: 0 };
    let tween: gsap.core.Tween | null = null;

    const buildScrubber = () => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      // Snap so each section is CENTERED in the viewport. Sections differ in
      // height (e.g. the shorter Experience section), so derive each point from
      // the scroll position that puts the section's center at the viewport
      // center, not its top at the viewport top.
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const vh = window.innerHeight;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("main section"),
      );
      const points =
        scrollable > 0
          ? sections.map((s) => {
              const centerScroll = s.offsetTop + s.offsetHeight / 2 - vh / 2;
              return Math.min(1, Math.max(0, centerScroll / scrollable));
            })
          : [0];

      tween = gsap.to(proxy, {
        t: duration,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          // Slightly tighter scrub so the video settles quickly after the user
          // stops (less lingering catch-up "tail" that reads as jitter).
          scrub: 0.6,
          // Gentle, proximity-based snap: ease to the nearest section only when
          // the user stops close to one; leave free scrolling untouched otherwise.
          snap: {
            snapTo: (value) => {
              const nearest = points.reduce((a, b) =>
                Math.abs(b - value) < Math.abs(a - value) ? b : a,
              );
              // Only snap when a section is genuinely near center; leave a wide
              // dead band in between where resting on a mid-section frame won't snap.
              return Math.abs(nearest - value) < 0.06 ? nearest : value;
            },
            duration: { min: 0.25, max: 0.6 },
            delay: 0.1,
            ease: "power2.inOut",
            inertia: false,
          },
        },
        onUpdate: () => {
          // HAVE_METADATA or better — safe to seek. Skip redundant sub-frame
          // seeks (they cause the decoder to thrash and visibly jitter).
          if (video.readyState >= 1) {
            const target = Math.min(proxy.t, duration - 0.05);
            if (Math.abs(video.currentTime - target) > 1 / 48) {
              video.currentTime = target;
            }
          }
        },
      });

      ScrollTrigger.refresh();
    };

    // iOS/Safari won't decode frames for seeking until the video has been
    // "primed" by a (muted, inline) play attempt. Do it once, then pause.
    const prime = () => {
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.then === "function") {
        playAttempt
          .then(() => {
            video.pause();
            video.currentTime = 0;
          })
          .catch(() => {
            /* autoplay blocked — desktop seeking still works fine */
          });
      }
    };

    const onReady = () => {
      prime();
      buildScrubber();
    };

    if (video.readyState >= 1 && video.duration) {
      onReady();
    } else {
      video.addEventListener("loadedmetadata", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/background_video_scrub.mp4"
        poster="/poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}
