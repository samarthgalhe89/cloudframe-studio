"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ImageIcon,
  Zap,
  Sparkles,
  Clock,
  ShieldCheck,
  Wand2,
  Play,
  Pause,
  Maximize2,
  X,
} from "lucide-react";

/**
 * Client-side landing page (entire file run as a client component).
 * - Autoplays the sample video (muted + loop) on mount.
 * - Provides a tasteful modal "full preview" that plays the sample in full.
 * - Subtle entrance animations using CSS (no external libs).
 * - Polished beige/brown color theme (your beige-brown palette).
 *
 * Drop your `sample-preview.mp4` in the public/ folder (you said it's already there).
 */

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // play the hero video on mount (muted autoplay)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // browsers allow autoplay if muted
    v.muted = true;
    v.loop = true;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // if autoplay blocked, keep it paused and show play button
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const openModal = async () => {
    setModalOpen(true);
    // ensure modal video plays
    setTimeout(() => {
      const mv = modalVideoRef.current;
      if (!mv) return;
      mv.currentTime = 0;
      mv.muted = false;
      mv.play().catch(() => {
        /* ignore */
      });
    }, 50);
  };

  const closeModal = () => {
    const mv = modalVideoRef.current;
    if (mv) {
      mv.pause();
      mv.currentTime = 0;
    }
    setModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#2C2113] antialiased">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E0D2BD] bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B5335] text-[#F5F1E8] shadow">
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#4A351E]">
              CloudFrame Studio
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#735837] sm:flex">
            <a href="#features" className="hover:text-[#6B5335] transition">
              Features
            </a>
            <a href="#easy-wins" className="hover:text-[#6B5335] transition">
              Easy Wins
            </a>
            <a href="#workflow" className="hover:text-[#6B5335] transition">
              How it works
            </a>
            <a href="#faq" className="hover:text-[#6B5335] transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-full border border-[#D4C4A8] px-4 py-2 text-sm font-semibold text-[#6B5335] hover:bg-[#F0E5D3] sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[#6B5335] px-4 py-2 text-sm font-semibold text-[#F5F1E8] shadow-sm hover:bg-[#5A4329] transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#E0D2BD] bg-gradient-to-b from-[#FDF8ED] to-[#F5F1E8]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:px-8 lg:py-20">
          {/* Left */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#E0D2BD] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6F47]">
              <Sparkles className="h-3 w-3" />
              Cloud-powered media hub
            </p>

            <h1 className="animate-hero-text text-4xl font-extrabold tracking-tight text-[#3A2916] sm:text-5xl lg:text-6xl">
              Turn heavy media into
              <span className="text-[#A47A45]"> shareable magic!</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-[#7A6750] sm:text-base">
              Upload once, auto-compress with CloudFrame Studio, and share beautiful
              previews across your projects. No more manual exports, no more
              broken links, just smooth showcasing.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 rounded-full bg-[#6B5335] px-6 py-3 text-sm font-semibold text-[#FDF8ED] shadow-md hover:bg-[#5A4329] transition"
              >
                <Zap className="h-4 w-4" />
                Start showcasing in minutes
              </Link>
              <button
                onClick={openModal}
                className="text-sm font-semibold text-[#6B5335] hover:underline"
              >
                Full sample preview →
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8B6F47] lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B5335]" />
                Secure Cloudinary storage
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B5335]" />
                Video + image previews
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B5335]" />
                Built for creators & devs
              </div>
            </div>
          </div>

          {/* Right / Live sample video */}
          <div className="flex-1">
            <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#E0D2BD] bg-[#F7F0E2] p-4 shadow-xl">
              {/* Header strip */}
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-[#2A2C30] px-4 py-3 text-xs text-[#F5F1E8]">
                <span className="font-semibold">sample-video</span>
                <span className="rounded-full bg-[#44484F] px-3 py-1 text-[11px]">
                  62% smaller · HD
                </span>
              </div>

              {/* Video area */}
              <div className="relative overflow-hidden rounded-2xl bg-black aspect-[16/9]">
                {/* actual video element (muted autoplay loop) */}
                <video
                  ref={videoRef}
                  src="/sample-preview.mp4"
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  // preload is set to metadata to reduce initial bandwidth while still allowing autoplay
                  preload="metadata"
                />

                {/* micro badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[11px] text-white">
                  <Clock className="h-3 w-3" />
                  Auto-generated preview
                </div>

                {/* overlay controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause preview" : "Play preview"}
                    className="flex items-center gap-2 rounded-full bg-[#F5F1E8]/80 px-3 py-1 text-sm font-medium text-[#3A2916] shadow-sm hover:scale-105 transition"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Play
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* size boxes */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#6B5335]">
                <div className="rounded-xl bg-[#FDF8ED] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A47A45]">
                    Original
                  </p>
                  <p className="mt-1 text-sm font-bold">3.81 MB</p>
                </div>

                <div className="rounded-xl bg-[#F1E4D0] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A47A45]">
                    Compressed
                  </p>
                  <p className="mt-1 text-sm font-bold">1.45 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 border-b border-[#E0D2BD] bg-[#F5F1E8]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-2xl text-center lg:mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-[#3A2916] sm:text-3xl">
              Built for visual-heavy projects
            </h2>
            <p className="mt-3 text-sm text-[#7A6750] sm:text-base">
              From portfolios to SaaS dashboards, CloudFrame Studio keeps your
              media fast, organized, and ready to share.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Wand2 className="h-5 w-5" />}
              title="Smart media transforms"
              description="Generate thumbnails, previews, and optimized versions of your media with Cloudinary presets, no manual editing."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Safe & secure by design"
              description="Media stays in trusted Cloudinary storage while your dashboard gives you a clean, organized view."
            />
            <FeatureCard
              icon={<Clock className="h-5 w-5" />}
              title="Time-saving workflow"
              description="Upload once, reuse everywhere. Share links, download compressed files, and forget about re-encoding."
            />
          </div>
        </div>
      </section>

      {/* Easy Wins */}
      <section id="easy-wins" className="scroll-mt-24 border-b border-[#E0D2BD] bg-gradient-to-r from-[#F5F1E8] via-[#F1E4D5] to-[#F5F1E8]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#3A2916] sm:text-3xl">
                Easy wins in your first 10 minutes
              </h2>
              <p className="mt-3 max-w-xl text-sm text-[#7A6750] sm:text-base">
                No complex setup. Just log in, upload, and immediately see the
                impact in your media workflow.
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47A45]">
              LOW EFFORT · HIGH IMPACT
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <EasyWinCard
              label="01"
              title="Upload a heavy video"
              body="Drag in a big MP4 and watch it get compressed automatically with clean HD previews."
            />
            <EasyWinCard
              label="02"
              title="Share a crisp preview"
              body="Copy a link or download a lightweight version that looks great on any screen."
            />
            <EasyWinCard
              label="03"
              title="Build your visual library"
              body="Organize your best clips and images in a dashboard designed to feel calm, not cluttered."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="workflow" className="scroll-mt-24 border-b border-[#E0D2D2] bg-[#F5F1E8]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-10 max-w-2xl text-center lg:mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-[#3A2916] sm:text-3xl">
              From upload to share in three steps
            </h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Connect & log in",
                description:
                  "Sign in securely and instantly access your media dashboard.",
              },
              {
                step: "2",
                title: "Upload media",
                description:
                  "Drop in videos or images. We handle compression, thumbnails, and previews.",
              },
              {
                step: "3",
                title: "Share or download",
                description:
                  "Use optimized links, or download compressed files for your projects.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="relative flex flex-col gap-3 rounded-2xl border border-[#E0D2BD] bg-white/70 p-5 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6B5335] text-sm font-bold text-[#FDF8ED]">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-[#3A2916]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#7A6750]">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-[#F5F1E8]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#3A2916] sm:text-3xl">
            Questions, answered simply
          </h2>
          <div className="mt-8 space-y-6">
            <FaqItem
              q="Do I need a Cloudinary account?"
              a="Yes. CloudFrame Studio sits on top of your existing Cloudinary account, so your media always stays in your own cloud."
            />
            <FaqItem
              q="What kind of media can I upload?"
              a="You can upload both images and videos. The app is especially tuned for heavy video files that need smart compression."
            />
            <FaqItem
              q="Is this suitable for non-developers?"
              a="Absolutely. If you can drag-and-drop a file, you can use the dashboard. Developers just get a few extra superpowers."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E0D2BD] bg-[#F1E4D5]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-[#7A6750] sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Cloudinary Showcase. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-[#6B5335]">
              Features
            </a>
            <a href="#workflow" className="hover:text-[#6B5335]">
              How it works
            </a>
            <Link href="/sign-up" className="font-semibold text-[#6B5335] hover:underline">
              Get started
            </Link>
          </div>
        </div>
      </footer>

      {/* Full-screen modal preview */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="relative mx-4 w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X BUTTON – always clickable */}
            <button
              onClick={closeModal}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-[10001] pointer-events-auto inline-flex items-center justify-center rounded-full bg-[#F5F1E8] p-2 shadow hover:bg-[#e8e0d3]"
            >
              <X />
            </button>

            {/* VIDEO AREA (ensures no overlap blocks clicks) */}
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black pointer-events-none">
              <video
                ref={modalVideoRef}
                src="/sample-preview.mp4"
                className="w-full h-full object-cover pointer-events-auto"
                controls
                autoPlay
                playsInline
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="text-sm text-[#6B5335]">Sample Preview — Full</div>
              <div className="text-xs text-[#7A6750]">HD · Auto-generated preview</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ----------------- small helper components ----------------- */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E0D2BD] bg-white/80 p-5 shadow-sm transform transition hover:-translate-y-1">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1E4D5] text-[#6B5335]">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[#3A2916]">{title}</h3>
      <p className="mt-2 text-sm text-[#7A6750]">{description}</p>
    </div>
  );
}

function EasyWinCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E0D2BD] bg-white/90 p-5 shadow-sm transform transition hover:shadow-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A47A45]">
        Step {label}
      </p>
      <h3 className="mt-2 text-base font-semibold text-[#3A2916]">{title}</h3>
      <p className="mt-2 text-sm text-[#7A6750]">{body}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-[#E0D2BD] bg-white/80 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#3A2916]">{q}</h3>
      <p className="mt-2 text-sm text-[#7A6750]">{a}</p>
    </div>
  );
}

/* ----------------- small CSS in JS for subtle animations ----------------- */
/* Add to your global CSS if you prefer, but Tailwind-friendly fallback here: */
const styleEl = (() => {
  if (typeof document === "undefined") return null;
  if (document.getElementById("landing-page-inline-styles")) return null;
  const el = document.createElement("style");
  el.id = "landing-page-inline-styles";
  el.innerHTML = `
    @keyframes heroSlideIn {
      0% { opacity: 0; transform: translateY(6px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-hero-text { animation: heroSlideIn 700ms cubic-bezier(.2,.9,.2,1) both; }
  `;
  document.head.appendChild(el);
  return el;
})();
