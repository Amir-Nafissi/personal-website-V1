import ScrollVideo from "@/components/ScrollVideo";
import Hero from "@/components/sections/Hero";
import Education from "@/components/sections/Education";
import Work from "@/components/sections/Work";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Fixed, scroll-scrubbed background video (the star of the show). */}
      <ScrollVideo />

      {/* Five stacked full-height sections. Total height ~500vh maps linearly
          to the ~10s video: each section ≈ 2s of footage. */}
      <main className="relative z-10">
        <Hero />
        <Education />
        <Work />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
