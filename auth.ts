import NextAuth from 'next-auth';
import { z } from 'zod';
import Credentials from 'next-auth/providers/credentials';

import { authConfig } from './auth.config';
import type { User as NextAuthUser } from '@auth/core/types';
import { postModel } from '@/app/lib/connector';

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
          const resp = await postModel('auth/login', {
            email,
            password,
          });

          console.log('resp', resp);

          if (resp) {
            return {
              id: email, // NextAuth requires an `id`
              email,
              name: 'Ms. Jane Doe',
              role: 'Admin',
            };
          }
        } catch (error) {
          console.error('Authorize error:', error);
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = (token as any).role ?? 'User';
      return session;
    },
  },
});
