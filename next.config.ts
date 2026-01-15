import type { NextConfig } from 'next'
import type { RemotePattern } from 'next/dist/shared/lib/image-config'

// Get the env variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL
if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

// Parse the URL
const parsedUrl = new URL(apiUrl)
const rawProtocol = parsedUrl.protocol.replace(':', '')

// Ensure protocol is strictly "http" or "https"
const protocol: 'http' | 'https' = rawProtocol === 'http' ? 'http' : 'https'
const hostname = parsedUrl.hostname

// RemotePattern correctly typed
const remotePattern: RemotePattern = {
  protocol,
  hostname,
  pathname: '/**',
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  images: {
    remotePatterns: [remotePattern],
  },
}

export default nextConfig
