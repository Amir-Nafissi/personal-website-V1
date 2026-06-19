"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// How long the hints stay before fading out on their own.
const SHOW_MS = 15000;
// Treat anything within this many px of the top as "at the very top".
const TOP_THRESHOLD = 4;

/**
 * Onboarding hints that point at the two corner controls: the music button
 * (bottom-left) and the font-size button (bottom-right). They show while the
 * user is at the very top of the page, fade out after a while or once the user
 * scrolls down, and come back whenever the user scrolls back to the top.
 * Non-interactive (pointer-events-none) so they never block the buttons.
 */
export default function OnboardingHints() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const atTop = () => window.scrollY <= TOP_THRESHOLD;

    const show = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), SHOW_MS);
    };

    let wasTop = atTop();
    if (wasTop) show();

    const onScroll = () => {
      const now = atTop();
      if (now && !wasTop) {
        show(); // returned to the very top — bring the hints back
      } else if (!now) {
        setVisible(false);
        clearTimeout(timer);
      }
      wasTop = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const bob = reduce ? undefined : { y: [0, 6, 0] };
  const bobTransition = {
    duration: 1.4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  const pill =
    "text-shadow-soft whitespace-nowrap rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-light text-haze backdrop-blur-md";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Music button hint (bottom-left, centered on the button at x=144). */}
          <motion.div
            className="pointer-events-none fixed bottom-[112px] left-[144px] z-50 flex -translate-x-1/2 flex-col items-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className={pill}>Play music</span>
            <motion.span
              animate={bob}
              transition={bobTransition}
              className="mt-1 text-amber"
            >
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </motion.span>
          </motion.div>

          {/* Font-size button hint (bottom-right, centered on the button). */}
          <motion.div
            className="pointer-events-none fixed bottom-[112px] right-[144px] z-50 flex translate-x-1/2 flex-col items-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className={pill}>Change text size</span>
            <motion.span
              animate={bob}
              transition={bobTransition}
              className="mt-1 text-amber"
            >
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </motion.span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
