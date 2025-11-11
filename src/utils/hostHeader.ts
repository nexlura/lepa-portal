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

export const getRequestHost = (host?: string | null): string => {
  // host could include port, e.g., "localhost:3000"
  const hostname = host?.split(':')[0] || '';

  // If running on localhost, use env fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.LEPA_HOST_HEADER || 'schoolA.lepa.com';
  }

  // Otherwise, return the real host
  return hostname;
};
