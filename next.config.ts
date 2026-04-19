import type { NextConfig } from 'next';

const trimTrailingSlash = (s: string) => s.replace(/\/$/, '');

// Same-origin path → real API. Browser never calls the API origin directly, so no CORS.
// Uses NEXT_PUBLIC_API_URL (build-time) or LEPA_API_ORIGIN if you want a server-only URL in CI.
const backendOrigin = trimTrailingSlash(
  process.env.LEPA_API_ORIGIN ?? process.env.NEXT_PUBLIC_API_URL ?? ''
);

// Vercel expects the default serverless output. `standalone` is for Docker/self-host.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),

  async rewrites() {
    if (!backendOrigin) return [];
    return [
      {
        source: '/lepa-api/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
