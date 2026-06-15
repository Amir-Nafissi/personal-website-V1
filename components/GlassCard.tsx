import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  accent?: "amber" | "mint";
  className?: string;
};

/**
 * A card that stays almost invisible (letting the video show through) and
 * only resolves into a frosted-glass panel with an accent glow on hover.
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
      className={`group text-shadow-soft relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-0 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.07] hover:backdrop-blur-md ${hover} ${className}`}
    >
      {children}
    </div>
  );
}
