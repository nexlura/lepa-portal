import NextAuth from 'next-auth';
import { z } from 'zod';
import Credentials from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { User as NextAuthUser } from '@auth/core/types';

import { postModel } from '@/lib/connector';
import { authConfig } from './auth.config';

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

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<NextAuthUser | null> {
        const parsedCredentials = z
          .object({ email: z.string().min(8), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          const resp = await postModel('auth/login', {
            identifier: email,
            password,
          });

          console.log('resp', resp, email);

          if (resp.data) {
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
    ...(authConfig.callbacks ?? {}),
    async jwt({ token, user }) {
      if (user) token.role = (user as NextAuthUser & { role: string }).role;
      return token as JWT;
    },
    async session({ session, token }) {
      if (token) session.user.role = (token as JWT).role ?? 'User';
      return session;
    },
  },
});
