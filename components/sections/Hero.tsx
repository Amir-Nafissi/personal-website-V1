"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-6 text-xs font-light tracking-spaced uppercase text-amber text-shadow-soft">
          Portfolio
        </p>
        <h1 className="font-display text-3xl font-light tracking-tight text-haze sm:text-5xl text-shadow-glow">
          {profile.name}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-haze sm:text-base text-shadow-soft">
          {profile.title}
        </p>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
