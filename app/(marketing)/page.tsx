// app/(marketing)/page.tsx

import Link from "next/link";
import { ImageIcon, Zap, Sparkles, Clock, ShieldCheck, Wand2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#2C2113]">
      {/* Top Bar */}
      <header className="border-b border-[#E0D2BD] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B5335] text-[#F5F1E8] shadow-md">
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#4A351E]">
              Cloudinary Showcase
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#735837] sm:flex">
            <a href="#features" className="hover:text-[#6B5335]">
              Features
            </a>
            <a href="#easy-wins" className="hover:text-[#6B5335]">
              Easy Wins
            </a>
            <a href="#workflow" className="hover:text-[#6B5335]">
              How it works
            </a>
            <a href="#faq" className="hover:text-[#6B5335]">
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
              className="rounded-full bg-[#6B5335] px-4 py-2 text-sm font-semibold text-[#F5F1E8] shadow-sm hover:bg-[#5A4329]"
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

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-[#3A2916] sm:text-5xl lg:text-6xl">
              Turn heavy media into
              <span className="text-[#A47A45]"> shareable magic</span>.
            </h1>

            <p className="max-w-xl text-balance text-sm leading-relaxed text-[#7A6750] sm:text-base">
              Upload once, auto-compress with Cloudinary, and share beautiful
              previews across your projects. No more manual exports, no more
              broken links—just smooth showcasing.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 rounded-full bg-[#6B5335] px-6 py-3 text-sm font-semibold text-[#FDF8ED] shadow-md hover:bg-[#5A4329]"
              >
                <Zap className="h-4 w-4" />
                Start showcasing in minutes
              </Link>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-[#6B5335] hover:underline"
              >
                View your dashboard →
              </Link>
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

          {/* Right / Mockup */}
          <div className="flex-1">
            <div className="mx-auto max-w-md rounded-3xl border border-[#E0D2BD] bg-[#F7F0E2] p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-[#2A2C30] px-4 py-3 text-xs text-[#F5F1E8]">
                <span className="font-semibold">Preview.mp4</span>
                <span className="rounded-full bg-[#44484F] px-3 py-1 text-[11px]">
                  62% smaller · HD
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-[#17181B]">
                <div className="aspect-video bg-gradient-to-tr from-[#3A2916] via-[#814C2A] to-[#CFA679]" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[11px] text-white">
                  <Clock className="h-3 w-3" />
                  Auto-generated preview
                </div>
              </div>
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
      <section id="features" className="border-b border-[#E0D2BD] bg-[#F5F1E8]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-2xl text-center lg:mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-[#3A2916] sm:text-3xl">
              Built for visual-heavy projects
            </h2>
            <p className="mt-3 text-sm text-[#7A6750] sm:text-base">
              From portfolios to SaaS dashboards, Cloudinary Showcase keeps your
              media fast, organized, and ready to share.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Wand2 className="h-5 w-5" />}
              title="Smart media transforms"
              description="Generate thumbnails, previews, and optimized versions of your media with Cloudinary presets—no manual editing."
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
      <section
        id="easy-wins"
        className="border-b border-[#E0D2BD] bg-gradient-to-r from-[#F5F1E8] via-[#F1E4D5] to-[#F5F1E8]"
      >
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
      <section id="workflow" className="border-b border-[#E0D2BD] bg-[#F5F1E8]">
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
                  "Sign in with Clerk and instantly access your secure media dashboard.",
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
      <section id="faq" className="bg-[#F5F1E8]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#3A2916] sm:text-3xl">
            Questions, answered simply
          </h2>
          <div className="mt-8 space-y-6">
            <FaqItem
              q="Do I need a Cloudinary account?"
              a="Yes. Cloudinary Showcase sits on top of your existing Cloudinary account, so your media always stays in your own cloud."
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
    </main>
  );
}

/* --- Small helper components --- */

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
    <div className="rounded-2xl border border-[#E0D2BD] bg-white/80 p-5 shadow-sm">
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
    <div className="rounded-2xl border border-[#E0D2BD] bg-white/90 p-5 shadow-sm">
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
