import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ["picsum.photos"],
  },
};

export default nextConfig;
