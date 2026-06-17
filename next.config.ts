import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray package-lock.json in the
  // user's home directory otherwise makes Next infer the wrong root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Hide the Next.js dev indicator badge (bottom-left in dev mode).
  devIndicators: false,
};

export default nextConfig;
