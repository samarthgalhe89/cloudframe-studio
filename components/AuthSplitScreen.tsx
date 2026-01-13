"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

interface AuthSplitScreenProps {
    children: React.ReactNode;
    mode: "signin" | "signup";
}

// Animation configurations
const transition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
};

const contentVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.3, duration: 0.5, ease: "easeOut" }
    }
};

export default function AuthSplitScreen({ children, mode }: AuthSplitScreenProps) {
    const isSignIn = mode === "signin";
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#FFFBF5]">
            {/* 
        Container Logic:
        We have two absolute panels each taking 50% width on Desktop.
        - Brand Panel (Color): Desktop Only.
        - Form Panel (White): 
            - Mobile: Full width, stuck at x:0.
            - Desktop: Slides Left/Right based on mode.
      */}

            {/* Fixed Back Button (Universal) */}
            <div className="absolute top-8 right-8 z-50">
                <Link
                    href="/"
                    className={`text-sm font-bold transition-colors duration-500
            ${isSignIn
                            ? "text-[#1C1917] hover:text-[#F97316]"
                            : "text-[#1C1917] hover:text-[#F97316] lg:text-white/90 lg:hover:text-white"
                        }
          `}
                >
                    Back to home page
                </Link>
            </div>

            {/* Form Panel Container - White Background */}
            <motion.div
                className="absolute top-0 left-0 h-full w-full lg:w-1/2 bg-[#FFFBF5] z-0 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24"
                initial={{ x: isMobile ? "0%" : (isSignIn ? "0%" : "100%") }}
                animate={{ x: isMobile ? "0%" : (isSignIn ? "100%" : "0%") }}
                transition={transition}
            >
                <motion.div
                    key={mode} // Re-animate content on mode change
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-sm space-y-8"
                >
                    {/* Mobile Back Link - Removed in favor of the Universal Top-Right button to reduce clutter */}
                    {children}
                </motion.div>
            </motion.div>

            {/* Brand Panel Container - Colored Background */}
            <motion.div
                className={`hidden lg:flex absolute top-0 left-0 h-full w-1/2 flex-col justify-between p-12 z-10 text-white overflow-hidden
          ${isSignIn ? "bg-gradient-to-br from-[#1C1917] to-[#433022]" : "bg-gradient-to-bl from-[#1C1917] to-[#433022]"}
        `}
                initial={{ x: isSignIn ? "100%" : "0%" }} // Simulating coming from the other side
                animate={{ x: isSignIn ? "0%" : "100%" }} // Sign In -> Left Side. Sign Up -> Right Side.
                transition={transition}
            >
                <BrandContent isSignIn={isSignIn} />
            </motion.div>
        </div>
    );
}

function BrandContent({ isSignIn }: { isSignIn: boolean }) {
    return (
        <>
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

            {/* Decorative blobs - Static Mix */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl mix-blend-screen"></div>
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl mix-blend-screen"></div>
            <div className="absolute -bottom-12 left-20 w-64 h-64 bg-yellow-600/20 rounded-full blur-3xl mix-blend-screen"></div>

            <motion.div
                key={`brand-logo-${isSignIn}`}
                variants={contentVariants} initial="hidden" animate="visible"
                className="relative z-10 flex items-center gap-3"
            >
                <Logo size={48} />
                <span className="text-2xl font-bold tracking-tight">Cloudframe Studio</span>
            </motion.div>

            <motion.div
                key={`brand-text-${isSignIn}`}
                variants={contentVariants} initial="hidden" animate="visible"
                className="relative z-10 max-w-lg"
            >
                <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
                    {isSignIn
                        ? "Welcome back to your creative studio."
                        : "Start your creative journey today."}
                </h2>
                <p className="text-lg text-white/70 leading-relaxed text-balance">
                    {isSignIn
                        ? "Access your specialized tools for video compression, AI cropping, and social formatting."
                        : "AI-powered framing for modern content creators."}
                </p>
            </motion.div>

            <motion.div
                key={`brand-footer-${isSignIn}`}
                variants={contentVariants} initial="hidden" animate="visible"
                className="relative z-10 text-xs text-white/30 font-mono"
            >
                © 2026 Cloudframe Studio Inc.
            </motion.div>
        </>
    );
}
