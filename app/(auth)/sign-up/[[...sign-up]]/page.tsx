"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Check, X, ArrowLeft } from "lucide-react";
import { validatePassword, getPasswordStrength } from "@/lib/password-validation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordValidation = validatePassword(password);
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const strengthColors = {
    weak: "text-red-600",
    medium: "text-yellow-600",
    strong: "text-green-600",
  };

  const strengthBgColors = {
    weak: "bg-red-100",
    medium: "bg-yellow-100",
    strong: "bg-green-100",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (!passwordValidation.isValid) {
      setError("Please meet all password requirements");
      return;
    }

    setIsLoading(true);

    try {
      // Call signup API
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/home");
        router.refresh();
      } else {
        setError("Account created but failed to sign in. Please try signing in manually.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf5ec] to-[#f3e8d9] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-3xl bg-[#fffdf8] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6b4e2e] hover:text-[#3b2b1a] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3b2b1a] mb-2">
              Create your account
            </h1>
            <p className="text-[#6b4e2e] text-sm">
              Start showcasing your media in minutes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#6b4e2e] mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b4e2e]/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#faf3e7] border border-[#e7d8c6] text-[#3b2b1a] placeholder:text-[#6b4e2e]/40 focus:ring-2 focus:ring-[#6b4e2e] focus:border-[#6b4e2e] transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#6b4e2e] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b4e2e]/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#faf3e7] border border-[#e7d8c6] text-[#3b2b1a] placeholder:text-[#6b4e2e]/40 focus:ring-2 focus:ring-[#6b4e2e] focus:border-[#6b4e2e] transition-all outline-none"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b4e2e]/50 hover:text-[#6b4e2e] transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && passwordStrength && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6b4e2e]">Password strength:</span>
                    <span className={`text-xs font-semibold capitalize ${strengthColors[passwordStrength]}`}>
                      {passwordStrength}
                    </span>
                  </div>
                  <div className="h-2 bg-[#e7d8c6] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          passwordStrength === "weak"
                            ? "33%"
                            : passwordStrength === "medium"
                              ? "66%"
                              : "100%",
                      }}
                      className={`h-full transition-all ${passwordStrength === "weak"
                        ? "bg-red-500"
                        : passwordStrength === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        }`}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements Checklist */}
              {password && (
                <div className="mt-4 space-y-2">
                  <PasswordRequirement
                    met={passwordValidation.checks.minLength}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordValidation.checks.hasUppercase}
                    text="One uppercase letter"
                  />
                  <PasswordRequirement
                    met={passwordValidation.checks.hasSpecialChar}
                    text="One special character"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid}
              className="w-full bg-[#6b4e2e] text-white rounded-full py-3 text-[15px] font-semibold hover:bg-[#7a5335] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#7a5335]">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[#6b4e2e] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-[#6b4e2e]/30 flex-shrink-0" />
      )}
      <span className={`text-xs ${met ? "text-green-600" : "text-[#6b4e2e]/60"}`}>
        {text}
      </span>
    </div>
  );
}
