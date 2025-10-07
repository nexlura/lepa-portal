import NextAuth from 'next-auth';
import { z } from 'zod';
import Credentials from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { User as NextAuthUser } from '@auth/core/types';

import { authConfig } from './auth.config';
import { postModel } from './lib/connector';

declare module 'next-auth' {
  interface User {
    role: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      role: string;
      email?: string | null;
      name?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

type BackendAuthUser = {
  email?: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
};

type APIAuthResponseData = {
  access_token: string;
  refresh_token: string;
  user: BackendAuthUser;
};

type APIAuthResponse = {
  success: boolean;
  data: APIAuthResponseData;
};

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

        // Accept either email or phone + password from the form
        const raw = (credentials ?? {}) as Record<string, unknown>;
        const identifier =
          typeof raw.email === 'string' && raw.email.length > 0
            ? raw.email
            : typeof raw.phone === 'string' && raw.phone.length > 0
            ? raw.phone
            : '';
        const password = typeof raw.password === 'string' ? raw.password : '';

        const parsed = z
          .object({
            identifier: z.string().min(3),
            password: z.string().min(6),
          })
          .safeParse({ identifier, password });
        if (!parsed.success) return null;

        try {
          const resp = await postModel<APIAuthResponse | string>(
            '/auth/login',
            {
              identifier: parsed.data.identifier,
              password: parsed.data.password,
            }
          );

          if (
            resp &&
            typeof resp !== 'string' &&
            resp.data &&
            'access_token' in resp.data &&
            typeof resp.data.access_token === 'string'
          ) {
            const role = resp.data.user?.roles?.[0] || 'User';
            const name =
              `${resp.data.user?.first_name ?? ''} ${
                resp.data.user?.last_name ?? ''
              }`.trim() || undefined;

            return {
              id: resp.data.user?.email,
              email: resp.data.user?.email,
              name,
              role,
              accessToken: resp.data.access_token,
              refreshToken: resp.data.refresh_token,
            } satisfies NextAuthUser & {
              role: string;
              accessToken?: string;
              refreshToken?: string;
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
      if (user) {
        const u = user as NextAuthUser & {
          role?: string;
          accessToken?: string;
          refreshToken?: string;
        };
        if (u.role) token.role = u.role;
        if (u.accessToken) token.accessToken = u.accessToken;
        if (u.refreshToken) token.refreshToken = u.refreshToken;
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = (token as JWT).role ?? 'User';
        const at = (token as JWT).accessToken;
        const rt = (token as JWT).refreshToken;
        if (at) session.user.accessToken = at;
        if (rt) session.user.refreshToken = rt;
      }
      return session;
    },
  },
});
