import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes a plain HTML/CSS/JS site to out/, hostable anywhere.
  output: "export",
  trailingSlash: true,
  // The sizes next/image may request; scripts/generate-images.mjs makes one file for each.
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    imageSizes: [206],
    deviceSizes: [384, 512, 640, 828, 1080, 1440],
  },
  experimental: { inlineCss: true },
  // allow dev access via the WSL2 IP since localhost forwarding is unreliable here
  allowedDevOrigins: ["172.28.129.220"],
};

export default nextConfig;
