"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import DetailModal from "@/components/DetailModal";
import { education, type Education as EducationItem } from "@/lib/content";

// Persisted flag so the "click to view" hint shows only the first time a
// visitor reaches the Education section, then never again.
const HINT_SEEN_KEY = "education-click-hint-seen";

export default function Education() {
  const [selected, setSelected] = useState<EducationItem | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (localStorage.getItem(HINT_SEEN_KEY)) return;
    const section = document.getElementById("education");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHintVisible(
          entry.isIntersecting && !localStorage.getItem(HINT_SEEN_KEY),
        );
      },
      { threshold: 0.4 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const markHintSeen = () => {
    localStorage.setItem(HINT_SEEN_KEY, "1");
    setHintVisible(false);
  };

  const bob = reduce ? undefined : { y: [0, -6, 0] };
  const bobTransition = {
    duration: 1.4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <Section
      id="education"
      eyebrow="01 — Education"
      accent="amber"
      heightClass="min-h-[70vh]"
    >
      <div className="relative space-y-4">
        <AnimatePresence>
          {hintVisible && (
            <motion.div
              className="pointer-events-none absolute -bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                animate={bob}
                transition={bobTransition}
                className="mb-1 text-amber"
              >
                <ArrowUp className="h-5 w-5" aria-hidden="true" />
              </motion.span>
              <span className="text-shadow-soft whitespace-nowrap rounded-full border border-white/15 bg-void/70 px-3.5 py-1.5 text-sm font-medium text-haze backdrop-blur-md">
                Click to view
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {education.map((item) => (
          <GlassCard key={item.institution} className="text-left">
            <button
              type="button"
              onClick={() => {
                setSelected(item);
                markHintSeen();
              }}
              aria-haspopup="dialog"
              className="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-display text-lg font-medium text-haze sm:text-xl">
                  {item.institution}
                </h2>
                <span className="text-xs font-semibold text-amber tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                  {item.dates}
                </span>
              </div>
              <p className="mt-1 text-sm font-normal text-haze">
                {item.degree}
              </p>
              <p className="mt-3 text-sm font-normal leading-relaxed text-haze">
                {item.detail}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-amber [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                View details →
              </span>
            </button>
          </GlassCard>
        ))}
      </div>

      <DetailModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        accent="amber"
        title={selected?.institution ?? ""}
        meta={
          selected ? `${selected.degree} · ${selected.dates}` : undefined
        }
        description={selected?.longDescription ?? selected?.detail ?? ""}
        images={selected?.images}
        links={selected?.links}
      />
    </Section>
  );
}
