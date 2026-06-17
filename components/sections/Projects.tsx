"use client";

import { useState } from "react";
import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import DetailModal from "@/components/DetailModal";
import { projects, type Project, type DetailLink } from "@/lib/content";

/** Build the overlay's link list from repo/live plus any extra links. */
function projectLinks(project: Project): DetailLink[] {
  const links: DetailLink[] = [];
  if (project.repo) links.push({ label: "Code", url: project.repo });
  if (project.live) links.push({ label: "Live", url: project.live });
  return [...links, ...(project.links ?? [])];
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section id="projects" eyebrow="03 — Projects" accent="amber">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <GlassCard key={project.title} className="flex flex-col text-left">
            <button
              type="button"
              onClick={() => setSelected(project)}
              aria-haspopup="dialog"
              className="flex flex-1 cursor-pointer flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <h2 className="font-display text-base font-normal text-haze sm:text-lg">
                {project.title}
              </h2>
              <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-haze/90 transition-colors duration-300 group-hover:text-haze">
                {project.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-light text-haze/60 transition-colors duration-200 group-hover:text-amber">
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
        title={selected?.title ?? ""}
        description={selected?.longDescription ?? selected?.description ?? ""}
        images={selected?.images}
        links={selected ? projectLinks(selected) : undefined}
      />
    </Section>
  );
}
