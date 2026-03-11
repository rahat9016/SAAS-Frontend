import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  allowedDevOrigins: ["localhost"],
};

export default nextConfig;
