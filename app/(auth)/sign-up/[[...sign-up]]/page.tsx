"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1114]">
      <div className="p-6 rounded-2xl shadow-xl">
        <SignUp 
          appearance={{
            elements: {
              card: "shadow-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
