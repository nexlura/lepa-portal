import type { NextConfig } from 'next';

// Vercel expects the default serverless output. `standalone` is for Docker/self-host.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
};

export default nextConfig;
