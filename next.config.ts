import type { NextConfig } from "next";

// Extrae el store ID del token: vercel_blob_rw_{STORE_ID}_{SECRET}
const blobToken = process.env.BLOB_READ_WRITE_TOKEN ?? "";
const blobStoreId = blobToken.split("_")[3]?.toLowerCase() ?? "";
const blobHostname = blobStoreId
  ? `${blobStoreId}.public.blob.vercel-storage.com`
  : null;

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false, // Mantener verificación de tipos pero sin errores de lint
  },
  images: {
    remotePatterns: [
      new URL("https://images.pexels.com/photos/**"),
      new URL("https://img.daisyui.com/**"),
      ...(blobHostname ? [{ hostname: blobHostname }] : []),
      { hostname: "avatars.githubusercontent.com" }
    ],
  },
};

export default nextConfig;
