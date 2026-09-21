import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // allow dev access via the WSL2 IP since localhost forwarding is unreliable here
  allowedDevOrigins: ["172.28.129.220"],
};

export default nextConfig;
