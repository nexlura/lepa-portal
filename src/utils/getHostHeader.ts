import { getTenantDomain } from './hostHeader';

/**
 * Get host header for API requests
 * Tries multiple sources and falls back to env variable
 */
export async function getHostHeaderForRequest(
  reqHeaders?: Headers | null
): Promise<string> {
  // Try from provided headers first (most reliable)
  if (reqHeaders) {
    const host = reqHeaders.get('host') || reqHeaders.get('x-forwarded-host');
    if (host) {
      const domain = getTenantDomain(host);
      if (domain) return domain;
    }
  }

  // Try from next/headers (server-side)
  try {
    const { headers } = await import('next/headers');
    const headerList = await headers().catch(() => null);
    if (headerList) {
      const host = headerList.get('host') || headerList.get('x-forwarded-host');
      if (host) {
        const domain = getTenantDomain(host);
        if (domain) return domain;
      }
    }
  } catch {
    // Not available in this context
  }

  // Final fallback to env variable
  return process.env.NEXT_PUBLIC_LEPA_HOST_HEADER || '';
}

