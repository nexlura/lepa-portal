'use server';

import { revalidatePath } from 'next/cache';

/**
 * Fetch updated data for a given page
 * Works only for server pages (SSR)
 */
const revalidatePage = (path: string) => {
  revalidatePath(path);
};

export default revalidatePage;
