import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  experimental: { optimizePackageImports: ["lucide-react"] },
};

export default nextConfig;
