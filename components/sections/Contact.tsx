"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { profile } from "@/lib/content";

/**
 * Contact form wired for Formspree.
 *
 * SETUP:
 * 1. Create a free form at https://formspree.io and copy its endpoint
 *    (looks like https://formspree.io/f/abcdwxyz).
 * 2. Replace FORM_ENDPOINT below with that URL.
 * 3. Submit the form once and confirm the verification email from Formspree.
 * No backend or API key is required — Formspree handles delivery.
 */
const FORM_ENDPOINT = "https://formspree.io/f/your_form_id"; // TODO: replace with your Formspree endpoint

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-light text-haze placeholder:text-haze-dim/50 outline-none transition-colors duration-200 focus:border-mint/50 focus:bg-white/[0.06]";

  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-5 flex items-center justify-center gap-3 text-xs font-normal tracking-spaced uppercase text-mint">
          <span className="h-px w-8 bg-mint/60" />
          <span className="text-shadow-soft">04 — Contact</span>
        </div>

        <h2 className="font-display text-2xl font-light text-haze sm:text-3xl text-shadow-soft">
          Let&apos;s talk
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm font-light text-haze text-shadow-soft">
          Have something in mind, or just want to say hello? Send a message.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Message"
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-mint/40 bg-mint/10 px-4 py-3 text-sm font-normal text-mint transition-all duration-200 hover:bg-mint/20 hover:shadow-[0_0_24px_-6px_rgba(167,215,197,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {status === "success" && (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
            {status === "idle" || status === "error" ? (
              <Send className="h-4 w-4" aria-hidden="true" />
            ) : null}
            {status === "submitting"
              ? "Sending…"
              : status === "success"
                ? "Message sent"
                : "Send message"}
          </button>

          <p aria-live="polite" className="min-h-5 text-center text-xs font-light">
            {status === "success" && (
              <span className="text-mint">Thanks — I&apos;ll be in touch soon.</span>
            )}
            {status === "error" && (
              <span className="text-amber">
                Something went wrong. Try again or email me directly.
              </span>
            )}
          </p>
        </form>

        <div className="mt-8 flex items-center justify-center gap-3">
          <SocialLink
            href={profile.github}
            label="GitHub profile"
            icon={<GithubIcon className="h-5 w-5" />}
          />
          <SocialLink
            href={profile.linkedin}
            label="LinkedIn profile"
            icon={<LinkedinIcon className="h-5 w-5" />}
          />
          <SocialLink
            href={`mailto:${profile.email}`}
            label="Send an email"
            icon={<Mail className="h-5 w-5" aria-hidden="true" />}
            external={false}
          />
        </div>
      </motion.div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  icon,
  external = true,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-haze-dim transition-all duration-200 hover:border-mint/40 hover:text-mint hover:shadow-[0_0_22px_-6px_rgba(167,215,197,0.5)]"
    >
      {icon}
    </a>
  );
}
