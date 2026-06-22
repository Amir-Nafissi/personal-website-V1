"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3, Play, Pause } from "lucide-react";

const STORAGE_KEY = "music-volume";
const DEFAULT_VOLUME = 0.2;
// Now-playing credit shown in the ticker under the button.
const SONG = "Reflections — Toshifumi Hinata";
const SONG_URL = "https://www.youtube.com/watch?v=v_s3h1CS-c4";
// While an overlay is open the music ducks to this fraction of the user's volume.
const DUCK_FACTOR = 0.4;
const FADE_MS = 500;

/**
 * Ambient background music with a record-player control (bottom-left).
 * Starts paused/silent (autoplay-safe). The disc spins while playing and acts as
 * a toggle that opens a control panel (play/pause + volume slider) — on desktop
 * the panel also reveals on hover/focus. Volume persists; play never auto-resumes.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME); // the user's chosen volume
  const [ducked, setDucked] = useState(false); // true while an overlay is open
  const [expanded, setExpanded] = useState(false); // control panel open (tap)

  // Restore saved volume on mount. Only override the default when a value was
  // actually saved — otherwise a first-time visitor (no stored key) would get
  // Number(null) === 0 and start at silent.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return;
    const saved = Number(stored);
    if (Number.isFinite(saved) && saved >= 0 && saved <= 1) {
      setVolume(saved);
    }
  }, []);

  // Smoothly fade the audio element to the active target volume whenever the
  // user's volume or the ducked state changes; persist the user's choice.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(volume));

    const audio = audioRef.current;
    if (!audio) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const target = clamp(ducked ? volume * DUCK_FACTOR : volume);
    const from = clamp(audio.volume);
    const start = performance.now();

    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = clamp(from + (target - from) * t);
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        fadeRef.current = null;
      }
    };
    fadeRef.current = requestAnimationFrame(step);

    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    };
  }, [volume, ducked]);

  // Duck the music while any detail overlay is open (events from DetailModal).
  // A counter guards against overlapping open/close pairs.
  useEffect(() => {
    let openCount = 0;
    const onOpen = () => {
      openCount += 1;
      setDucked(true);
    };
    const onClose = () => {
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) setDucked(false);
    };
    window.addEventListener("overlay-open", onOpen);
    window.addEventListener("overlay-close", onClose);
    return () => {
      window.removeEventListener("overlay-open", onOpen);
      window.removeEventListener("overlay-close", onClose);
    };
  }, []);

  // While the panel is tapped open, close it when the user taps/clicks outside
  // (the primary way to dismiss it on touch, where there's no hover).
  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [expanded]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false)); // file missing or blocked — stay truthful
    }
  };

  const percent = Math.round(volume * 100);

  return (
    <div
      ref={rootRef}
      onMouseLeave={() => {
        // On hover-capable (desktop) devices, close once the cursor leaves the
        // controls. Guarded so touch's emulated mouse events don't auto-close.
        if (!window.matchMedia("(hover: hover)").matches) return;
        setExpanded(false);
        // Blur any focused control inside the player; otherwise a button that
        // kept focus after a click (e.g. Play) keeps the panel open via
        // :focus-within even after the cursor has left.
        const active = document.activeElement as HTMLElement | null;
        if (active && rootRef.current?.contains(active)) active.blur();
      }}
      className="group fixed bottom-[48px] left-4 z-50 flex items-center sm:left-[116px]"
    >
      <audio ref={audioRef} src="/reflections-reprise.mp3" loop preload="auto" />

      {/* Disc = toggle for the control panel. Spins while playing (status). */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Close music controls" : "Open music controls"}
        title="Music controls"
        className="text-shadow-soft inline-flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-haze backdrop-blur-md transition-all duration-300 ease-out hover:border-amber/40 hover:bg-white/[0.12] hover:text-amber hover:shadow-[0_0_30px_-6px_rgba(245,194,107,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <Disc3
          className={`h-[28px] w-[28px] ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      {/* Control panel: play/pause + volume slider. Opens on tap (expanded) or,
          on desktop, on hover/focus while collapsed. */}
      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${
          expanded
            ? "ml-2 w-44 opacity-100"
            : "w-0 opacity-0 group-hover:ml-2 group-hover:w-44 group-hover:opacity-100 group-focus-within:ml-2 group-focus-within:w-44 group-focus-within:opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause background music" : "Play background music"}
          title={playing ? "Pause music" : "Play music"}
          className="mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-haze backdrop-blur-md transition-colors duration-200 hover:border-amber/40 hover:text-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
        >
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label={`Music volume (${percent}%)`}
          title={`Volume: ${percent}%`}
          className="music-volume h-1.5 w-32 shrink-0 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, var(--color-amber) ${percent}%, rgba(255,255,255,0.2) ${percent}%)`,
          }}
        />
      </div>

      {/* Radio-style now-playing ticker under the button → links to the source. */}
      <a
        href={SONG_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${SONG} — listen on YouTube`}
        title={`${SONG} — listen on YouTube`}
        className="pointer-events-auto absolute left-[-4px] top-[60px] w-16 overflow-hidden text-[10px] uppercase tracking-[0.12em] text-haze/75 text-shadow-soft transition-colors duration-200 hover:text-amber"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)",
        }}
      >
        <span className="marquee-track">
          <span className="px-6">{SONG}</span>
          <span className="px-6" aria-hidden="true">
            {SONG}
          </span>
        </span>
      </a>
    </div>
  );
}
