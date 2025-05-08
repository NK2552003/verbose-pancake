import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  images: {
    domains: ["picsum.photos"], // Add the required domain
  },
};

export default nextConfig;
