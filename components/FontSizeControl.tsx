"use client";

import { useEffect, useState } from "react";
import { Type } from "lucide-react";

// Font scale steps. Clicking cycles through these and wraps back to normal.
const SCALES = [1, 1.15, 1.3] as const;
const STORAGE_KEY = "font-scale";

export default function FontSizeControl() {
  const [level, setLevel] = useState(0);

  // Restore the saved level on mount.
  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < SCALES.length) {
      setLevel(saved);
    }
  }, []);

  // Apply the scale to the document root (Tailwind sizes are rem-based) + persist.
  useEffect(() => {
    document.documentElement.style.fontSize = `${SCALES[level] * 100}%`;
    localStorage.setItem(STORAGE_KEY, String(level));
  }, [level]);

  const percent = Math.round(SCALES[level] * 100);
  const next = () => setLevel((l) => (l + 1) % SCALES.length);

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`Increase font size (currently ${percent}%)`}
      title={`Font size: ${percent}% — click to increase`}
      className="text-shadow-soft fixed bottom-[48px] right-[116px] z-50 inline-flex h-[56px] w-[56px] items-center justify-center gap-[2px] rounded-full border border-white/10 bg-white/[0.07] text-haze backdrop-blur-md transition-all duration-300 ease-out hover:border-amber/40 hover:bg-white/[0.12] hover:text-amber hover:shadow-[0_0_30px_-6px_rgba(245,194,107,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <Type className="h-[22px] w-[22px]" aria-hidden="true" />
      <span className="text-[13px] font-medium leading-none" aria-hidden="true">
        +
      </span>
    </button>
  );
}
