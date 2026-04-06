"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, ClipboardEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import AuthSplitScreen from "@/components/AuthSplitScreen";
import Logo from "@/components/Logo";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const password = searchParams.get("p") || ""; // Passed temporarily for auto-login

    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Mask email for display: s***h@gmail.com
    const maskEmail = (email: string) => {
        if (!email) return "";
        const [localPart, domain] = email.split("@");
        if (localPart.length <= 2) return `${localPart[0]}***@${domain}`;
        return `${localPart[0]}${"*".repeat(Math.min(localPart.length - 2, 4))}${localPart[localPart.length - 1]}@${domain}`;
    };

    const handleChange = (index: number, value: string) => {
        // Only accept digits
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits filled
        if (value && index === 5 && newCode.every((d) => d !== "")) {
            handleVerify(newCode.join(""));
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newCode = [...code];
            newCode[index - 1] = "";
            setCode(newCode);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pastedData.length === 0) return;

        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = pastedData[i] || "";
        }
        setCode(newCode);
        setError("");

        // Focus the next empty input or the last one
        const nextEmpty = newCode.findIndex((d) => d === "");
        inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

        // Auto-submit if all filled
        if (newCode.every((d) => d !== "")) {
            handleVerify(newCode.join(""));
        }
    };

    const handleVerify = async (otpCode?: string) => {
        const codeString = otpCode || code.join("");
        if (codeString.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: codeString }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Verification failed");
                // Clear code on error
                setCode(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
                setIsVerifying(false);
                return;
            }

            setSuccess(true);

            // Auto sign-in if we have the password
            if (password) {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.ok) {
                    setTimeout(() => {
                        router.push("/home");
                        router.refresh();
                    }, 1500);
                    return;
                }
            }

            // Fallback — redirect to sign-in
            setTimeout(() => {
                router.push("/sign-in");
            }, 2000);
        } catch {
            setError("An error occurred. Please try again.");
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || isResending) return;

        setIsResending(true);
        setError("");

        try {
            const res = await fetch("/api/auth/resend-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to resend code");
            } else {
                setResendCooldown(60);
                // Clear existing code
                setCode(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        } catch {
            setError("Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleVerify();
    };

    // Success state
    if (success) {
        return (
            <AuthSplitScreen mode="signin">
                <div className="w-full flex flex-col items-center justify-center py-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="mb-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-[#1C1917] mb-2"
                    >
                        Email Verified!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[#78716C] text-sm"
                    >
                        Redirecting you to your workspace...
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4"
                    >
                        <Loader2 className="w-5 h-5 animate-spin text-[#F97316]" />
                    </motion.div>
                </div>
            </AuthSplitScreen>
        );
    }

    return (
        <AuthSplitScreen mode="signin">
            <div className="w-full">
                {/* Mobile-only Logo */}
                <div className="flex justify-center mb-6 lg:hidden">
                    <Logo size={48} />
                </div>

                {/* Back to Sign Up */}
                <button
                    onClick={() => router.push("/sign-up")}
                    className="flex items-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] transition mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign up
                </button>

                {/* Email Icon */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] flex items-center justify-center"
                    >
                        <Mail className="w-8 h-8 text-[#F97316]" />
                    </motion.div>
                </div>

                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] mb-2">
                        Check your email
                    </h1>
                    <p className="text-[#78716C] text-sm">
                        We sent a 6-digit code to{" "}
                        <span className="font-semibold text-[#1C1917]">
                            {maskEmail(email)}
                        </span>
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* OTP Input */}
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                        {code.map((digit, index) => (
                            <motion.input
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                                    ${digit
                                        ? "border-[#F97316] bg-[#FFF7ED] text-[#1C1917]"
                                        : "border-[#E7E5E4] bg-white text-[#1C1917]"
                                    }
                                    focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10
                                `}
                                aria-label={`Digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={isVerifying || code.some((d) => d === "")}
                        className="w-full bg-[#1C1917] hover:bg-[#000000] text-white rounded-xl py-3 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify Email"
                        )}
                    </button>
                </form>

                {/* Resend Code */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-[#78716C] mb-2">
                        Didn&apos;t receive the code?
                    </p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] disabled:text-[#A8A29E] disabled:cursor-not-allowed transition"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : resendCooldown > 0 ? (
                            `Resend in ${resendCooldown}s`
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4" />
                                Resend Code
                            </>
                        )}
                    </button>
                </div>

                {/* Expiry notice */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#A8A29E]">
                        Code expires in 10 minutes
                    </p>
                </div>
            </div>
        </AuthSplitScreen>
    );
}
