import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0, // disable router cache for dynamic pages
      static: 0, // disable router cache for static pages
    },
  },
};

export default nextConfig;
