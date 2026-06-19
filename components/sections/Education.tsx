"use client";

import { useState } from "react";
import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import DetailModal from "@/components/DetailModal";
import { education, type Education as EducationItem } from "@/lib/content";

export default function Education() {
  const [selected, setSelected] = useState<EducationItem | null>(null);

  return (
    <Section id="education" eyebrow="01 — Education" accent="amber">
      <div className="space-y-4">
        {education.map((item) => (
          <GlassCard key={item.institution} className="text-left">
            <button
              type="button"
              onClick={() => setSelected(item)}
              aria-haspopup="dialog"
              className="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-display text-lg font-medium text-haze sm:text-xl">
                  {item.institution}
                </h2>
                <span className="text-xs font-light text-amber tracking-wide">
                  {item.dates}
                </span>
              </div>
              <p className="mt-1 text-sm font-normal text-haze">
                {item.degree}
              </p>
              <p className="mt-3 text-sm font-normal leading-relaxed text-haze">
                {item.detail}
              </p>
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
