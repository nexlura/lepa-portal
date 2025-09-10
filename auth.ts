import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User as NextAuthUser } from '@auth/core/types';

declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      role: string;
      email?: string | null;
      name?: string | null;
    };
  }
}
// import type { User } from '@/app/lib/definitions';
import { postModel } from '@/app/lib/supabase/connector';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<NextAuthUser | null> {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          const result = await postModel('auth/login', {
            email,
            password,
          });

          if (result) {
            return {
              id: email, // NextAuth requires an `id`
              email,
              role: 'admin',
            };
          }
        } catch (error) {
          console.error('Authorize error:', error);
        }
        return null;
      },
    }),
  ],
});
