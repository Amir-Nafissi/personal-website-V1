import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  accent?: "amber" | "mint";
  /** Visual variant: "dark" (default, neutral dark glass) or "nebula" (indigo/violet glass for the cosmic projects section). */
  variant?: "dark" | "nebula";
  className?: string;
};

/**
 * A frosted-glass panel that's always blurred and darkened so the content
 * reads clearly over the video, with an accent glow and lift on hover.
 * The "nebula" variant tints the glass indigo/violet to match the purple/blue
 * cosmic section of the background video.
 */
export default function GlassCard({
  children,
  accent = "amber",
  variant = "dark",
  className = "",
}: GlassCardProps) {
  const hover =
    accent === "amber"
      ? "hover:border-amber/40 hover:shadow-[0_0_30px_-6px_rgba(245,194,107,0.35)]"
      : "hover:border-mint/40 hover:shadow-[0_0_30px_-6px_rgba(167,215,197,0.35)]";

  const variantClass =
    variant === "nebula"
      ? "border-white/15 bg-indigo-950/30 backdrop-brightness-[0.65]"
      : "border-white/20 bg-void/25 backdrop-brightness-[0.75]";

  return (
    <div
      className={`group text-shadow-soft relative rounded-2xl border ${variantClass} p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/30 ${hover} ${className}`}
    >
      {children}
    </div>
  );
}
