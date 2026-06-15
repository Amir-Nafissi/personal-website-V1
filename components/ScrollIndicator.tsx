"use client";

import { motion } from "framer-motion";

/** Subtle "scroll to explore" cue pinned near the bottom of the hero. */
export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
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
