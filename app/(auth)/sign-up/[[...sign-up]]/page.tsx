"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Check, X, ArrowLeft, AlertTriangle } from "lucide-react";
import { validatePassword, getPasswordStrength } from "@/lib/password-validation";
import AuthSplitScreen from "@/components/AuthSplitScreen";
import Logo from "@/components/Logo";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  // Detect if running in WebView
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    const isInAppBrowser = (
      ua.includes('FBAN') || ua.includes('FBAV') ||
      ua.includes('Instagram') ||
      ua.includes('Twitter') ||
      ua.includes('Line/') ||
      ua.includes('wv')
    );
    setIsWebView(isInAppBrowser);
  }, []);

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
    <AuthSplitScreen mode="signup">
      <div className="w-full">
        {/* Mobile-only Logo */}
        <div className="flex justify-center mb-6 lg:hidden">
          <Logo size={48} />
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-[#1C1917] mb-2">
            Create account
          </h1>
          <p className="text-[#78716C] text-sm">
            Start showcasing your media in minutes.
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

        {/* WebView Warning */}
        {isWebView && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Google Sign-in Not Available</p>
                <p className="text-xs">
                  You're using an in-app browser. To sign in with Google, please open this page in your phone's browser (Chrome, Safari, Firefox).
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7E5E4] text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all outline-none"
                placeholder="name@gamil.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7E5E4] text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all outline-none"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#78716C] transition"
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
                  <span className="text-xs text-[#78716C]">Password strength:</span>
                  <span className={`text-xs font-semibold capitalize ${strengthColors[passwordStrength]}`}>
                    {passwordStrength}
                  </span>
                </div>
                <div className="h-1.5 bg-[#E7E5E4] rounded-full overflow-hidden">
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
            className="w-full bg-[#1C1917] hover:bg-[#000000] text-white rounded-xl py-3 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E7E5E4]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="px-4 bg-[#FFFBF5] text-[#A8A29E]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/home' })}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-[#E7E5E4] bg-white hover:bg-[#FAFAFA] hover:border-[#D6D3D1] transition-all text-[#1C1917] font-semibold text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 pb-4 text-center text-sm text-[#78716C]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#F97316] font-bold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthSplitScreen>
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
