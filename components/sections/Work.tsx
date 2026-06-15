import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import { work } from "@/lib/content";

export default function Work() {
  return (
    <Section id="work" eyebrow="02 — Experience" accent="amber">
      <div className="relative space-y-4">
        {work.map((item) => (
          <GlassCard key={`${item.company}-${item.role}`} className="text-left">
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
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
