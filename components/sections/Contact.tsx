"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, Check, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { profile } from "@/lib/content";

/**
 * Contact form wired for Formspree.
 *
 * SETUP (one-time, ~2 min — needs access to the inbox, so only you can do it):
 * 1. Sign up at https://formspree.io using nafissi.amir@gmail.com (this is the
 *    address submissions get delivered to).
 * 2. Create a new form, then copy its endpoint (looks like
 *    https://formspree.io/f/abcdwxyz).
 * 3. Paste that endpoint into FORM_ENDPOINT below (or set the Vercel env var
 *    NEXT_PUBLIC_FORMSPREE_ENDPOINT to it) and redeploy.
 * No backend or API key is required — Formspree handles delivery, sets the
 * subject from the hidden `_subject` field, and replies go to the sender's
 * email (the `email` field).
 */
const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ??
  "https://formspree.io/f/meebqwnw";

// Subject line on the delivered email, so it's clearly from the site.
const FORM_SUBJECT = "New message from your portfolio (nafissi.vercel.app)";

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
    "w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm font-normal text-haze placeholder:text-haze-dim/70 outline-none transition-colors duration-200 focus:border-mint/50 focus:bg-white/[0.11]";

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
        <div className="mb-5 flex items-center justify-center gap-3 text-xs font-medium tracking-spaced uppercase text-mint">
          <span className="h-px w-8 bg-mint/60" />
          <span className="text-shadow-soft">04 — Contact</span>
        </div>

        <h2 className="font-display text-2xl font-normal text-haze sm:text-3xl text-shadow-soft">
          Let&apos;s talk
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm font-normal text-haze text-shadow-soft">
          Have something in mind, or just want to say hello? Send a message.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
          {/* Sets the delivered email's subject so it's identifiable. */}
          <input type="hidden" name="_subject" value={FORM_SUBJECT} />
          {/* Honeypot: bots fill this hidden field; Formspree drops those. */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
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
          <SocialLink
            href={profile.resume}
            label="Open resume (PDF)"
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
          />
        </div>

        {/* Copyright notice, just below the social/resume buttons. */}
        <p className="mt-10 text-sm font-medium text-white text-shadow-soft">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
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
      title={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-haze transition-all duration-200 [&_svg]:drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:border-mint/40 hover:text-mint hover:shadow-[0_0_22px_-6px_rgba(167,215,197,0.5)]"
    >
      {icon}
    </a>
  );
}
