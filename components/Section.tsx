"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  /** Small uppercase label above the heading (e.g. "02 — Education"). */
  eyebrow?: string;
  /** Accent color used for the eyebrow + rule. */
  accent?: "amber" | "mint";
  /** Horizontal placement of the content column. */
  align?: "center" | "left";
  children: ReactNode;
};

const accentClass = {
  amber: "text-amber",
  mint: "text-mint",
};

const ruleClass = {
  amber: "bg-amber/60",
  mint: "bg-mint/60",
};

export default function Section({
  id,
  eyebrow,
  accent = "amber",
  align = "center",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative flex min-h-screen w-full flex-col justify-center px-6 py-24 sm:px-10 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-3xl ${align === "left" ? "" : "mx-auto"}`}
      >
        {eyebrow && (
          <div
            className={`mb-5 flex items-center gap-3 text-xs font-normal tracking-spaced uppercase ${
              align === "center" ? "justify-center" : ""
            } ${accentClass[accent]}`}
          >
            <span className={`h-px w-8 ${ruleClass[accent]}`} />
            <span className="text-shadow-soft">{eyebrow}</span>
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
