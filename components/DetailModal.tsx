"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import type { DetailLink, GalleryImage } from "@/lib/content";
import { GithubIcon } from "@/components/BrandIcons";

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  accent?: "amber" | "mint";
  title: string;
  meta?: string;
  description: string;
  images?: GalleryImage[];
  links?: DetailLink[];
};

/** A gallery image after normalizing the `string | { src, caption }` union. */
type NormalImage = { src: string; caption?: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/** Normalize the `string | { src, caption }` union into a uniform shape. */
function normalizeImages(images: GalleryImage[]): NormalImage[] {
  return images.map((img) => (typeof img === "string" ? { src: img } : img));
}

/**
 * Reorder a gallery so a logo (filename contains "logo") sits in the middle,
 * with the remaining photos split evenly to its left and right.
 */
function centerLogo(images: NormalImage[]): NormalImage[] {
  const logoIndex = images.findIndex((img) => /logo/i.test(img.src));
  if (logoIndex < 0 || images.length < 2) return images;
  const others = images.filter((_, i) => i !== logoIndex);
  const mid = Math.ceil(others.length / 2);
  return [...others.slice(0, mid), images[logoIndex], ...others.slice(mid)];
}

/** One gallery cell: a clickable image when `src` is set, otherwise an on-theme tile. */
function ImageTile({
  src,
  alt,
  onOpen,
}: {
  src: string;
  alt: string;
  onOpen?: () => void;
}) {
  if (src) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${alt} fullscreen`}
        className="block w-full cursor-zoom-in rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-auto w-full rounded-xl border border-white/10"
        />
      </button>
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

/** Fullscreen lightbox with a reserved caption area below the photo. */
function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: NormalImage[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const current = images[index];
  const many = images.length > 1;
  const go = (delta: number) =>
    onNavigate((index + delta + images.length) % images.length);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-void/90 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-haze/70 transition-colors duration-200 hover:bg-white/10 hover:text-haze"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {many && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-haze/70 transition-colors duration-200 hover:bg-white/10 hover:text-haze sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-haze/70 transition-colors duration-200 hover:bg-white/10 hover:text-haze sm:right-6"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}

      <div
        className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt=""
          className="max-h-[72vh] max-w-full rounded-xl object-contain"
        />
        {/* Reserved space for a short caption — filled in when provided. */}
        <div className="flex min-h-[3rem] max-w-2xl items-center justify-center px-2 text-center">
          {current.caption ? (
            <p className="text-sm font-light leading-relaxed text-haze/90">
              {current.caption}
            </p>
          ) : (
            <p className="text-xs font-light italic text-haze/40">
              Add a short description for this photo.
            </p>
          )}
        </div>
      </div>
    </motion.div>
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
  // Index of the photo shown fullscreen in the lightbox, or null when closed.
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const gallery = centerLogo(normalizeImages(images ?? []));

  useEffect(() => setMounted(true), []);

  // Close the modal, making sure any open lightbox is cleared too so it does
  // not reappear the next time the modal opens.
  const close = () => {
    setLightbox(null);
    onClose();
  };

  // Lock background scroll while open and tell the music player to duck.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("overlay-open"));
    return () => {
      document.body.style.overflow = prevOverflow;
      window.dispatchEvent(new Event("overlay-close"));
    };
  }, [open]);

  // Keyboard: Escape closes the lightbox first (else the modal); arrows page
  // through photos while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox !== null) setLightbox(null);
        else onClose();
      } else if (lightbox !== null && gallery.length > 1) {
        if (e.key === "ArrowRight")
          setLightbox((i) => (i === null ? i : (i + 1) % gallery.length));
        else if (e.key === "ArrowLeft")
          setLightbox((i) =>
            i === null ? i : (i - 1 + gallery.length) % gallery.length,
          );
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, lightbox, gallery.length]);

  if (!mounted) return null;

  const glow =
    accent === "amber"
      ? "border-amber/40 shadow-[0_0_30px_-6px_rgba(245,194,107,0.35)]"
      : "border-mint/40 shadow-[0_0_30px_-6px_rgba(167,215,197,0.35)]";
  const accentText = accent === "amber" ? "text-amber" : "text-mint";
  const linkHover =
    accent === "amber" ? "hover:text-amber" : "hover:text-mint";

  return createPortal(
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`text-shadow-soft relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border bg-white/[0.07] p-6 backdrop-blur-md sm:p-10 ${glow}`}
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
              onClick={close}
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
                  className={`mt-1 text-xs font-normal tracking-wide ${accentText}`}
                >
                  {meta}
                </p>
              )}
            </header>

            {gallery.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className="w-full sm:w-[calc(33.333%-0.5rem)]">
                    <ImageTile
                      src={img.src}
                      alt={`${title} image ${i + 1}`}
                      onOpen={() => setLightbox(i)}
                    />
                  </div>
                ))}
              </div>
            )}

            {description && (
              <p className="mt-6 text-[0.95rem] font-normal leading-relaxed text-haze">
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
                      className={`inline-flex items-center gap-1.5 text-sm font-medium text-haze transition-colors duration-200 ${linkHover}`}
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
    </AnimatePresence>

    <AnimatePresence>
      {open && lightbox !== null && gallery[lightbox] && (
        <Lightbox
          images={gallery}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
        />
      )}
    </AnimatePresence>
    </>,
    document.body,
  );
}
