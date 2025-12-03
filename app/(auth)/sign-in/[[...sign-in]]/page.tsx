"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf5ec] to-[#f3e8d9]">
      
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
        className="p-8 rounded-3xl bg-[#fffdf8] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <SignIn
          appearance={{
            layout: {
              socialButtonsPlacement: "top",
              logoPlacement: "inside",
            },
            variables: {
              colorPrimary: "#6b4e2e",
              colorText: "#3b2b1a",
              fontSize: "16px",
              borderRadius: "14px",
            },
            elements: {
              card: "bg-[#fffdf8] shadow-none",
              headerTitle: "text-[#3b2b1a] font-bold text-2xl",
              headerSubtitle: "text-[#6b4e2e]",

              // Buttons
              formButtonPrimary:
                "bg-[#6b4e2e] text-white rounded-full py-3 text-[15px] hover:bg-[#7a5335] transition-all duration-300",
              socialButtons:
                "rounded-full bg-[#f7eee3] text-[#3b2b1a] hover:bg-[#eadfcc] transition-all duration-300",

              // Inputs
              formFieldInput:
                "rounded-xl bg-[#faf3e7] border-[#e7d8c6] text-[#3b2b1a] focus:ring-[#6b4e2e] focus:border-[#6b4e2e] transition-all",
              
              formFieldLabel: "text-[#6b4e2e] font-medium",
              footerActionText: "text-[#7a5335]",
              footerActionLink: "text-[#6b4e2e] font-semibold hover:underline",
              dividerLine: "bg-[#e9dccc]",
              dividerText: "text-[#6b4e2e]",
              identityPreview: "bg-[#f7eee3] text-[#3b2b1a]",
            },
          }}
        />
      </motion.div>

    </div>
  );
}
