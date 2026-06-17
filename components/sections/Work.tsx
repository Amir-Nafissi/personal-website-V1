"use client";

import { useState } from "react";
import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import DetailModal from "@/components/DetailModal";
import { work, type Work as WorkItem } from "@/lib/content";

export default function Work() {
  const [selected, setSelected] = useState<WorkItem | null>(null);

  return (
    <Section id="work" eyebrow="02 — Experience" accent="amber">
      <div className="relative space-y-4">
        {work.map((item) => (
          <GlassCard key={`${item.company}-${item.role}`} className="text-left">
            <button
              type="button"
              onClick={() => setSelected(item)}
              aria-haspopup="dialog"
              className="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-display text-lg font-normal text-haze sm:text-xl">
                  {item.role}
                </h2>
                <span className="text-xs font-light text-amber tracking-wide">
                  {item.dates}
                </span>
              </div>
              <p className="mt-1 text-sm font-normal text-haze">
                {item.company}
              </p>
              <p className="mt-3 text-sm font-light leading-relaxed text-haze/90 transition-colors duration-300 group-hover:text-haze">
                {item.description}
              </p>
            </button>
          </GlassCard>
        ))}
      </div>

      <DetailModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        accent="amber"
        title={selected?.role ?? ""}
        meta={selected ? `${selected.company} · ${selected.dates}` : undefined}
        description={selected?.longDescription ?? selected?.description ?? ""}
        images={selected?.images}
        links={selected?.links}
      />
    </Section>
  );
}
