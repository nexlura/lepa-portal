/**
 * Client-side utility to get the host header for API requests
 * This should only be used in client-side code (React components, hooks, etc.)
 */

export const getClientHostHeader = (): string => {
  if (typeof window === 'undefined') {
    throw new Error('getClientHostHeader can only be used on the client side');
  }

  return window.location.origin;
};

/**
 * Hook to get the host header in React components
 */
export const useHostHeader = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.origin;
};

/**
 * utility to get tenant domain from host header
 */
export const getTenantDomain = (host?: string | null): string => {
  // If no host provided, use env fallback
  if (!host) {
    return process.env.NEXT_PUBLIC_LEPA_HOST_HEADER || '';
  }

  // Remove protocol if included
  let cleaned = host.replace(/^https?:\/\//, '');

  // Remove trailing slash if present
  cleaned = cleaned.replace(/\/$/, '');

  // Extract hostname (remove port)
  const hostname = cleaned.split(':')[0];

  // If running on localhost, use env fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1' || !hostname) {
    return process.env.NEXT_PUBLIC_LEPA_HOST_HEADER || '';
  }

  return hostname;
};
