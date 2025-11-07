'use server';

import { headers } from 'next/headers';

/**
 * Gets the current request origin (protocol + host)
 * Works only in server context (SSR or server actions)
 */
export async function getRequestHostAction(): Promise<string> {
  const headerList = await headers();
  const proto = headerList.get('x-forwarded-proto') || 'http';
  const host =
    headerList.get('x-forwarded-host') ||
    headerList.get('host') ||
    'localhost:3000';
  return `${proto}://${host}`;
}
