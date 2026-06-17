"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";

const STORAGE_KEY = "music-volume";
const DEFAULT_VOLUME = 0.5;
// While an overlay is open the music ducks to this fraction of the user's volume.
const DUCK_FACTOR = 0.06;
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

  // Restore saved volume on mount.
  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
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

    const target = ducked ? volume * DUCK_FACTOR : volume;
    const from = audio.volume;
    const start = performance.now();

    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * t;
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
    <div className="group fixed bottom-[48px] left-[116px] z-50 flex items-center">
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
          className={`h-[22px] w-[22px] ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
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
    </div>
  );
}
