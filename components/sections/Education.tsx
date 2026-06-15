import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import { education } from "@/lib/content";

export default function Education() {
  return (
    <Section id="education" eyebrow="01 — Education" accent="amber">
      <div className="space-y-4">
        {education.map((item) => (
          <GlassCard key={item.institution} className="text-left">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="font-display text-lg font-normal text-haze sm:text-xl">
                {item.institution}
              </h2>
              <span className="text-xs font-light text-amber tracking-wide">
                {item.dates}
              </span>
            </div>
            <p className="mt-1 text-sm font-normal text-haze">
              {item.degree}
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed text-haze/90 transition-colors duration-300 group-hover:text-haze">
              {item.detail}
            </p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
