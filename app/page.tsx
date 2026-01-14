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
  Crop,
  Share2,
  Upload,
  X,
  FileVideo
} from "lucide-react";

/**
 * Client-side landing page (entire file run as a client component).
 * - Autoplays the sample video (muted + loop) on mount.
 * - Provides a modal "full preview" that plays the sample in full.
 * - Sunset Creator Theme (Warm White, Orange, Pink).
 */

import Logo from "@/components/Logo";

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // play the hero video on mount (muted autoplay)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
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
    setTimeout(() => {
      const mv = modalVideoRef.current;
      if (!mv) return;
      mv.currentTime = 0;
      mv.muted = false;
      mv.play().catch(() => { });
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
    <main className="min-h-screen bg-[#FFFBF5] text-[#1C1917] antialiased">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#FED7AA] bg-[#FFFBF5]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-xl font-bold tracking-tight text-[#1C1917]">
              Cloudframe Studio
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#78716C] sm:flex">
            <a href="#features" className="hover:text-[#F97316] transition">Features</a>
            <a href="#easy-wins" className="hover:text-[#F97316] transition">Quick Wins</a>
            <a href="#workflow" className="hover:text-[#F97316] transition">How it works</a>
            <a href="#faq" className="hover:text-[#F97316] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-full border border-[#FED7AA] px-4 py-2 text-sm font-semibold text-[#78716C] hover:bg-[#FED7AA]/20 sm:inline-block transition"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-[#FB923C] hover:to-[#F472B6] transition transform hover:-translate-y-0.5"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#FED7AA] bg-[#FFFBF5]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 lg:py-14">
          {/* Left */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FED7AA] bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F97316]">
              <Sparkles className="h-3 w-3" />
              AI-Powered Media Hub
            </p>

            <h1 className="animate-hero-text text-4xl font-extrabold tracking-tight text-[#1C1917] sm:text-5xl lg:text-6xl">
              Turn heavy media into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#EC4899]"> social magic!</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-[#78716C] sm:text-base mx-auto lg:mx-0">
              Upload once, let AI crop your videos for every platform, compress without losing quality, and share beautiful previews instantly.
              The ultimate toolkit for modern creators.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/30 hover:from-[#FB923C] hover:to-[#F472B6] transition transform hover:-translate-y-1"
              >
                <Zap className="h-4 w-4" />
                Start Creating Free
              </Link>
              <button
                onClick={openModal}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#78716C] hover:text-[#F97316] transition"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#78716C] lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Video Compression
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                AI Smart Crop
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />
                Instant Social Share
              </div>
            </div>
          </div>

          {/* Right / Live sample video */}
          <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
            <div className="mx-auto w-full rounded-3xl border-2 border-[#FED7AA] bg-white p-3 shadow-2xl shadow-orange-500/10 rotate-1 hover:rotate-0 transition duration-500">
              {/* Header strip */}
              <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="font-medium opacity-70">AI_Processing...</span>
              </div>

              {/* Video area */}
              <div className="relative overflow-hidden rounded-xl bg-black aspect-[16/9] group">
                <video
                  ref={videoRef}
                  src="/sample-preview.mp4"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />

                {/* Overlay Badge */}
                <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#F97316]" />
                  AI Cropped
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-lg p-2.5 border border-orange-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#F97316] tracking-wider">Before</div>
                  <div className="font-bold text-[#1C1917]">45.2 MB</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2.5 border border-green-100 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-500/5"></div>
                  <div className="text-[10px] uppercase font-bold text-green-600 tracking-wider relative z-10">After</div>
                  <div className="font-bold text-[#1C1917] relative z-10">4.8 MB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 border-b border-[#FED7AA] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl text-center mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl">
              Complete Toolkit for Creators
            </h2>
            <p className="mt-3 text-sm text-[#78716C] sm:text-base">
              Everything you need to manage, optimize, and share your visual content in one beautiful dashboard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Crop className="h-6 w-6 text-white" />}
              gradient="from-[#F97316] to-[#EC4899]"
              title="AI Smart Cropping"
              description="Automatically detect subjects and resize videos for Reels, and Shorts instantly."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-white" />}
              gradient="from-[#8B5CF6] to-[#EC4899]"
              title="Ultra Compression"
              description="Reduce file sizes by up to 90% without losing visual quality. Save bandwidth, load faster."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6 text-white" />}
              gradient="from-[#10B981] to-[#3B82F6]"
              title="Instant Social Share"
              description="One-click formatting and sharing to all your favorite platforms. No more manual resizing."
            />
          </div>
        </div>
      </section>

      {/* Easy Wins */}
      <section id="easy-wins" className="scroll-mt-24 border-b border-[#FED7AA] bg-[#FFFBF5]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl">
                Go Viral in 3 Steps
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#78716C] sm:text-base">
                Streamline your content workflow today.
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F97316]">
              FAST · EASY · POWERFUL
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <EasyWinCard
              label="01"
              icon={<Upload className="w-5 h-5" />}
              title="Upload Raw Video"
              body="Drag & drop your high-quality footage. We handle the heavy lifting."
            />
            <EasyWinCard
              label="02"
              icon={<Sparkles className="w-5 h-5" />}
              title="AI Magic Happens"
              body="Our AI crops to 9:16, compresses the file, and generates thumbnails."
            />
            <EasyWinCard
              label="03"
              icon={<Share2 className="w-5 h-5" />}
              title="Ready to Post"
              body="Download your assets perfectly formatted for IG and YouTube."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl mb-8">
            Common Questions
          </h2>
          <div className="space-y-4">
            <FaqItem
              q="How does the AI Cropping work?"
              a="We use advanced machine learning to detect the main subject in your video and keep them centered & in frame, even when converting to vertical formats."
            />
            <FaqItem
              q="Is there a file size limit?"
              a="Currently, you can upload videos up to 100MB on the free plan. We optimize huge files effectively!"
            />
            <FaqItem
              q="Can I use this for images too?"
              a="Yes! Cloudframe Studio is a full media hub. You can upload, optimize, and format images for Instagram, Twitter, and more."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#FED7AA] bg-[#FFFBF5]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-[#78716C] sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-semibold text-[#1C1917]">Cloudframe Studio</span>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#F97316] transition">Privacy</a>
            <a href="#" className="hover:text-[#F97316] transition">Terms</a>
            <a href="#" className="hover:text-[#F97316] transition">Twitter</a>
          </div>
        </div>
      </footer>

      {/* Full-screen modal preview */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="relative mx-4 w-full max-w-5xl rounded-2xl bg-[#1C1917] p-1 shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Close preview"
              className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <video
                ref={modalVideoRef}
                src="/sample-preview.mp4"
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ----------------- Helper Components ----------------- */

function FeatureCard({
  icon,
  gradient,
  title,
  description,
}: {
  icon: React.ReactNode;
  gradient: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#FED7AA] bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#1C1917]">{title}</h3>
      <p className="mt-2 text-sm text-[#78716C] leading-relaxed">{description}</p>
    </div>
  );
}

function EasyWinCard({
  label,
  icon,
  title,
  body,
}: {
  label: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="relative rounded-2xl border border-[#FED7AA] bg-white p-6 shadow-sm transition-all hover:border-[#F97316] hover:shadow-lg">
      <div className="absolute top-6 right-6 text-xs font-bold text-[#FED7AA]/50 text-[40px] leading-none select-none">
        {label}
      </div>
      <div className="mb-4 inline-flex items-center justify-center p-2 rounded-lg bg-orange-50 text-[#F97316]">
        {icon}
      </div>
      <h3 className="text-base font-bold text-[#1C1917] relative z-10">{title}</h3>
      <p className="mt-2 text-sm text-[#78716C] relative z-10">{body}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-[#FED7AA]/50 bg-[#FFFBF5] p-5 transition hover:bg-white hover:border-[#F97316]/50">
      <h3 className="text-sm font-bold text-[#1C1917]">{q}</h3>
      <p className="mt-2 text-sm text-[#78716C]">{a}</p>
    </div>
  );
}

/* Local Styles for Animations */
const styleEl = (() => {
  if (typeof document === "undefined") return null;
  if (document.getElementById("landing-page-inline-styles")) return null;
  const el = document.createElement("style");
  el.id = "landing-page-inline-styles";
  el.innerHTML = `
    @keyframes heroSlideIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-hero-text { animation: heroSlideIn 800ms cubic-bezier(.2,.9,.2,1) both; }
  `;
  document.head.appendChild(el);
  return el;
})();
