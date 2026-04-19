import path from 'path';
import { fileURLToPath } from 'url';

import type { NextConfig } from 'next';

// Turbopack walks up for lockfiles; parent monorepo folders can steal the root.
// Pin the app root so `next dev --turbopack` matches this project.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
