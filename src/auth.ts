import NextAuth from 'next-auth';
import { z } from 'zod';
import Credentials from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { User as NextAuthUser } from '@auth/core/types';

import { authConfig } from './auth.config';
import { postModel } from './lib/connector';
import { getRequestHost } from './utils/hostHeader';

declare module 'next-auth' {
  interface User {
    userId: string;
    role: string;
    accessToken?: string;
    refreshToken?: string;
    schoolName?: string;
    tenantId?: string;
  }

  interface Session {
    user: {
      userId: string;
      role: string;
      email?: string | null;
      name?: string | null;
      accessToken?: string;
      refreshToken?: string;
      schoolName?: string;
      tenantId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    schoolName?: string;
    tenantId?: string;
  }
}

type BackendAuthUser = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
};

type BackendAuthTenant = {
  id?: string;
  school_name?: string; // ✅ if your backend returns it
};

type APIAuthResponseData = {
  access_token: string;
  refresh_token: string;
  user: BackendAuthUser;
  tenant: BackendAuthTenant;
};

type APIAuthResponse = {
  success: boolean;
  data: APIAuthResponseData;
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, req): Promise<NextAuthUser | null> {
        const host = getRequestHost(req.headers.get('host'));

        const parsedCredentials = z
          .object({ email: z.string().min(8), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

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
          const resp = await postModel<APIAuthResponse>(
            '/auth/login',
            {
              identifier: parsed.data.identifier,
              password: parsed.data.password,
            },
            {
              headers: {
                'X-Lepa-Host-Header': host,
              },
            }
          );

          if (
            resp &&
            resp?.data &&
            'access_token' in resp.data &&
            typeof resp.data.access_token === 'string'
          ) {
            const user = resp.data.user;
            const tenant = resp.data.tenant;
            const role = user?.roles?.[0] || 'User';
            const name =
              `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() ||
              undefined;

            return {
              userId: user?.id,
              email: user?.email,
              name,
              role,
              accessToken: resp.data.access_token,
              refreshToken: resp.data.refresh_token,
              schoolName: tenant?.school_name || '',
              tenantId: tenant?.id || '',
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as NextAuthUser & {
          userId?: string;
          role?: string;
          accessToken?: string;
          refreshToken?: string;
          schoolName?: string;
          tenantId?: string;
        };
        if (u.userId) token.userId = u.userId;
        if (u.role) token.role = u.role;
        if (u.accessToken) token.accessToken = u.accessToken;
        if (u.refreshToken) token.refreshToken = u.refreshToken;
        if (u.schoolName) token.schoolName = u.schoolName;
        if (u.tenantId) token.tenantId = u.tenantId;
      }

      // Persist updates from client-side session.update()
      if (trigger === 'update' && session) {
        const s = session as import('next-auth').Session;
        if (s.user?.accessToken) token.accessToken = s.user.accessToken;
        if (s.user?.refreshToken) token.refreshToken = s.user.refreshToken;
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role ?? 'User';
        session.user.userId = token.userId ?? '';
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;

        //school name would be null for lepa admins
        if (token.schoolName) {
          session.user.schoolName = token.schoolName;
          session.user.tenantId = token.tenantId;
        }
      }
      return session;
    },
  },
});
