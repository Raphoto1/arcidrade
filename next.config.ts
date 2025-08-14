import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://images.pexels.com/photos/**'), new URL('https://img.daisyui.com/**')],
  },

};

export default nextConfig;
