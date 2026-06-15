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

      tween = gsap.to(proxy, {
        t: duration,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        onUpdate: () => {
          // HAVE_METADATA or better — safe to seek.
          if (video.readyState >= 1) {
            video.currentTime = Math.min(proxy.t, duration - 0.05);
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
