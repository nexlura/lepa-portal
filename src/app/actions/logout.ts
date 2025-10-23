'use server';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth'; // if you exported it from your NextAuth setup
import { postModel } from '@/lib/connector';
import { getRequestHost, useHostHeader } from '@/utils/hostHeader';
// import { signOut } from 'next-auth/react'; // optional for client-side redirection

export async function logoutAction(host: string) {
  const session = await auth();

  if (!session?.user?.accessToken || !session?.user?.refreshToken) {
    redirect('/auth/verify?phone=');
  }

  const effectiveHost = getRequestHost(host);

  try {
    await postModel(
      `/auth/logout`,
      {
        access_token: session.user.accessToken,
        refresh_token: session.user.refreshToken,
      },
      {
        headers: {
          'X-Lepa-Host-Header': effectiveHost,
        },
      }
    );
  } catch (err) {
    console.error('Error logging out from backend:', err);
  }

  await signOut({ redirectTo: '/auth/verify?phone=' });
}
