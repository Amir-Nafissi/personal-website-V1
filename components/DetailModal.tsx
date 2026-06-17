"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ImageIcon, X } from "lucide-react";
import type { DetailLink } from "@/lib/content";
import { GithubIcon } from "@/components/BrandIcons";

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  accent?: "amber" | "mint";
  title: string;
  meta?: string;
  description: string;
  images?: string[];
  links?: DetailLink[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** One gallery cell: real image when `src` is set, otherwise an on-theme tile. */
function ImageTile({ src, alt }: { src: string; alt: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className="aspect-video w-full rounded-xl border border-white/10 object-cover"
      />
    );
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] text-haze/40">
      <ImageIcon className="h-5 w-5" aria-hidden="true" />
      <span className="text-[0.65rem] font-light tracking-spaced uppercase">
        Image
      </span>
    </div>
  );
}

export default function DetailModal({
  open,
  onClose,
  accent = "amber",
  title,
  meta,
  description,
  images,
  links,
}: DetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const glow =
    accent === "amber"
      ? "border-amber/40 shadow-[0_0_60px_-12px_rgba(245,194,107,0.45)]"
      : "border-mint/40 shadow-[0_0_60px_-12px_rgba(167,215,197,0.45)]";
  const accentText = accent === "amber" ? "text-amber" : "text-mint";
  const linkHover =
    accent === "amber" ? "hover:text-amber" : "hover:text-mint";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`text-shadow-soft relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border bg-white/[0.07] p-6 backdrop-blur-xl sm:p-8 ${glow}`}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              autoFocus
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-haze/70 transition-colors duration-200 hover:bg-white/10 hover:text-haze"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <header className="pr-10">
              <h2 className="font-display text-xl font-normal text-haze sm:text-2xl">
                {title}
              </h2>
              {meta && (
                <p
                  className={`mt-1 text-xs font-light tracking-wide ${accentText}`}
                >
                  {meta}
                </p>
              )}
            </header>

            {images && images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((src, i) => (
                  <ImageTile key={i} src={src} alt={`${title} image ${i + 1}`} />
                ))}
              </div>
            )}

            {description && (
              <p className="mt-6 text-sm font-light leading-relaxed text-haze/90">
                {description}
              </p>
            )}

            {links && links.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
                {links.map((link) => {
                  const isGithub = /github\.com/i.test(link.url);
                  return (
                    <a
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-xs font-light text-haze/80 transition-colors duration-200 ${linkHover}`}
                    >
                      {isGithub ? (
                        <GithubIcon className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      )}
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
