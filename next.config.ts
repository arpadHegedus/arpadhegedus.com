import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { inlineCss: true },
  // allow dev access via the WSL2 IP since localhost forwarding is unreliable here
  allowedDevOrigins: ["172.28.129.220"],
};

export default nextConfig;
