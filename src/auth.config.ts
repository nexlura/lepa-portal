import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // session valid for 1 hour total
    updateAge: 15 * 60, // refresh session every 15 mins of activity
  },

  jwt: {
    maxAge: 60 * 60, // also 1 hour
  },
  pages: {
    signIn: '/',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
