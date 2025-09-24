import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://images.pexels.com/photos/**"),
      new URL("https://img.daisyui.com/**"),
      new URL("https://my-store-id.public.blob.vercel-storage.com/**"),
      { hostname: "*.public.blob.vercel-storage.com" },
      { hostname: "avatars.githubusercontent.com" }
    ],
  },
};

export default nextConfig;
