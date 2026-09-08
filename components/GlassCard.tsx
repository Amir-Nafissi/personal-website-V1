import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  accent?: "amber" | "mint";
  className?: string;
};

/**
 * A frosted-glass panel that's always blurred and darkened so the content
 * reads clearly over the video, with an accent glow and lift on hover.
 */
export default function GlassCard({
  children,
  accent = "amber",
  className = "",
}: GlassCardProps) {
  const hover =
    accent === "amber"
      ? "hover:border-amber/40 hover:shadow-[0_0_30px_-6px_rgba(245,194,107,0.35)]"
      : "hover:border-mint/40 hover:shadow-[0_0_30px_-6px_rgba(167,215,197,0.35)]";

  return (
    <div
      className={`group text-shadow-soft relative rounded-2xl border border-white/20 bg-void/25 p-6 backdrop-brightness-[0.75] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/30 ${hover} ${className}`}
    >
      {children}
    </div>
  );
}
