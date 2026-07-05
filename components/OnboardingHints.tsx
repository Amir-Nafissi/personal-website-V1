"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// How long the hints stay before fading out on their own.
const SHOW_MS = 15000;
// Treat anything within this many px of the top as "at the very top".
const TOP_THRESHOLD = 4;
// After showing, ignore scroll-driven hiding for a moment. iOS Safari fires
// stray scroll events as the address bar settles right after load, which would
// otherwise dismiss the hints before the user ever sees them.
const HIDE_GRACE_MS = 1500;
// Only a deliberate downward scroll (this fraction of the viewport) dismisses
// the hints — not the few-px jitter iOS reports at the top.
const HIDE_FRACTION = 0.2;

/**
 * Onboarding hints that point at the two corner controls: the music button
 * (bottom-left) and the font-size button (bottom-right). They show while the
 * user is at the very top of the page, fade out after a while or once the user
 * scrolls down, and come back whenever the user scrolls back to the top.
 * Non-interactive (pointer-events-none) so they never block the buttons.
 */
export default function OnboardingHints() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    // Timestamp until which scroll events may not hide the hints.
    let hideBlockedUntil = 0;
    const atTop = () => window.scrollY <= TOP_THRESHOLD;
    const scrolledIntoContent = () =>
      window.scrollY > window.innerHeight * HIDE_FRACTION;

    const show = () => {
      setVisible(true);
      hideBlockedUntil = Date.now() + HIDE_GRACE_MS;
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), SHOW_MS);
    };

    // First appearance is keyed off the loading gate lifting rather than the
    // mount-time scroll position. On mobile the initial scrollY can read
    // non-zero (address-bar collapse / scroll restoration) while the effect
    // runs, which previously made `atTop()` false and suppressed the hints on
    // first load — they only reappeared once the user scrolled back to the top.
    // Showing on `loading-complete` (fired while scroll is still locked at the
    // top) guarantees they appear on initial load on every device.
    if (window.__loadingComplete) show();
    window.addEventListener("loading-complete", show);

    let wasTop = atTop();
    const onScroll = () => {
      const now = atTop();
      if (now && !wasTop) {
        show(); // returned to the very top — bring the hints back
      } else if (scrolledIntoContent() && Date.now() >= hideBlockedUntil) {
        // Only a deliberate scroll into the content dismisses the hints; small
        // iOS address-bar jitter near the top is ignored.
        setVisible(false);
        clearTimeout(timer);
      }
      wasTop = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("loading-complete", show);
    };
  }, []);

  const bob = reduce ? undefined : { y: [0, 6, 0] };
  const bobTransition = {
    duration: 1.4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  const pill =
    "text-shadow-soft whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-sm font-medium text-haze backdrop-blur-md";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Music button hint (bottom-left). On mobile the pill pins to the
              left edge (so it never overflows); the arrow stays under the pill's
              middle and tilts down-left toward the button below. At sm+ the
              column centers on the button at x=144 and the arrow points straight
              down. */}
          <motion.div
            className="pointer-events-none fixed bottom-[112px] left-4 z-50 flex flex-col items-center sm:left-[144px] sm:-translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className={pill}>Play music</span>
            <motion.span
              animate={bob}
              transition={bobTransition}
              className="mt-1 text-amber"
            >
              <ArrowDown
                className="h-5 w-5 origin-top rotate-[35deg] sm:rotate-0"
                aria-hidden="true"
              />
            </motion.span>
          </motion.div>

          {/* Font-size button hint (bottom-right). Mirror of the music hint:
              on mobile the pill pins to the right edge and the arrow tilts
              down-right from the pill's middle toward the button; at sm+ it
              centers on the button and points straight down. */}
          <motion.div
            className="pointer-events-none fixed bottom-[112px] right-4 z-50 flex flex-col items-center sm:right-[144px] sm:translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className={pill}>Change text size</span>
            <motion.span
              animate={bob}
              transition={bobTransition}
              className="mt-1 text-amber"
            >
              <ArrowDown
                className="h-5 w-5 origin-top rotate-[-40deg] sm:rotate-0"
                aria-hidden="true"
              />
            </motion.span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
