import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-cd7d61ba8bcc4070b2ac58936fc25db5.r2.dev",
      },
    ],
  },
};

export default nextConfig;
