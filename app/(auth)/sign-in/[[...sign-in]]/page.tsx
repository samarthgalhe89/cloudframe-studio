"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import AuthSplitScreen from "@/components/AuthSplitScreen";
import Logo from "@/components/Logo";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/home");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitScreen mode="signin">
      <div className="w-full">
        {/* Mobile-only Logo and Back */}
        <div className="flex flex-col gap-6 mb-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6b4e2e] hover:text-[#3b2b1a] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          <div className="flex justify-center">
            <Logo size={48} />
          </div>
        </div>




        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1C1917] mb-2">
            Welcome back
          </h1>
          <p className="text-[#78716C] text-sm">
            Enter your details to access your workspace.
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
                placeholder="name@gmail.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#1C1917]">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-[#F97316] hover:text-[#EC4899] transition">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7E5E4] text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all outline-none"
                placeholder="Enter your password"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1C1917] hover:bg-[#000000] text-white rounded-xl py-3 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E7E5E4]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="px-4 bg-[#FFFBF5] text-[#A8A29E]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
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
        <div className="mt-8 text-center text-sm text-[#78716C]">
          New to Frameo?{" "}
          <Link
            href="/sign-up"
            className="text-[#F97316] font-bold hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthSplitScreen>
  );
}
