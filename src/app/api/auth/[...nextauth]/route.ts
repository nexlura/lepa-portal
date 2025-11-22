import { handlers } from '@/auth';

// Use Node.js runtime instead of Edge Runtime to support axios
export const runtime = 'nodejs';

export const { GET, POST } = handlers;
