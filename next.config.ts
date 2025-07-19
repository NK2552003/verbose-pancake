import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ["picsum.photos"],
  },
};

export default nextConfig;
