import Section from "@/components/Section";
import GlassCard from "@/components/GlassCard";
import { projects } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";

export default function Projects() {
  return (
    <Section id="projects" eyebrow="03 — Projects" accent="amber">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <GlassCard key={project.title} className="flex flex-col text-left">
            <h2 className="font-display text-base font-normal text-haze sm:text-lg">
              {project.title}
            </h2>
            <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-haze-dim/80">
              {project.description}
            </p>
            <div className="mt-5 flex items-center gap-4">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code on GitHub`}
                  className="inline-flex items-center gap-1.5 text-xs font-light text-haze-dim transition-colors duration-200 hover:text-amber"
                >
                  <GithubIcon className="h-4 w-4" />
                  Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live site`}
                  className="inline-flex items-center gap-1.5 text-xs font-light text-haze-dim transition-colors duration-200 hover:text-amber"
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  Live
                </a>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
