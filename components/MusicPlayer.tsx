"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";

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
 * Starts paused/silent (autoplay-safe). The disc spins while playing; a volume
 * slider expands on hover/focus. Volume persists; play state never auto-resumes.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME); // the user's chosen volume
  const [ducked, setDucked] = useState(false); // true while an overlay is open

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
    <div className="group fixed bottom-[48px] left-4 z-50 flex items-center sm:left-[116px]">
      <audio ref={audioRef} src="/reflections-reprise.mp3" loop preload="auto" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Pause music" : "Play music"}
        className="text-shadow-soft inline-flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-haze backdrop-blur-md transition-all duration-300 ease-out hover:border-amber/40 hover:bg-white/[0.12] hover:text-amber hover:shadow-[0_0_30px_-6px_rgba(245,194,107,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <Disc3
          className={`h-[28px] w-[28px] ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      {/* Volume slider — expands on hover/focus-within. */}
      <div className="ml-0 flex w-0 items-center overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:w-32 group-hover:opacity-100 group-focus-within:ml-2 group-focus-within:w-32 group-focus-within:opacity-100">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label={`Music volume (${percent}%)`}
          title={`Volume: ${percent}%`}
          className="music-volume h-1.5 w-32 cursor-pointer appearance-none rounded-full"
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
