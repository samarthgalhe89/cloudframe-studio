import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // 🔥 Force correct workspace root
  },
};

export default nextConfig;
