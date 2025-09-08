import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://images.pexels.com/photos/**"),
      new URL("https://img.daisyui.com/**"),
      new URL("https://my-store-id.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
