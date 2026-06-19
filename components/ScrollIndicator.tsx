"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Subtle "scroll to explore" cue pinned near the bottom of the hero. */
export default function ScrollIndicator() {
  // Visible only at the very top — fades out on scroll, returns at the top
  // (mirrors the onboarding hints).
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: atTop ? 1 : 0 }}
      transition={{ delay: atTop ? 0.4 : 0, duration: 0.7 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <span className="text-[0.65rem] font-light tracking-spaced uppercase text-haze-dim text-shadow-soft">
        Scroll to explore
      </span>
      <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-amber"
          animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}
