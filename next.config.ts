 import type { NextConfig } from "next";

 const nextConfig: NextConfig = {
   // Disable built-in image optimization to avoid heavy memory usage in dev
   images: {
     unoptimized: true,
   },
 };

 export default nextConfig;
