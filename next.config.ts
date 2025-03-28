import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  images: {
    domains: ["via.placeholder.com"], // Add the required domain
  },
};

export default nextConfig;
