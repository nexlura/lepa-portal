'use server';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { postModel } from '@/lib/connector';

export async function logoutAction() {
  const session = await auth();

  if (!session?.user?.accessToken) {
    redirect('/auth/verify?phone=');
  }

  try {
    // Headers are automatically handled by the connector
    await postModel(
      `/auth/logout`,
      {
        access_token: session.user.accessToken,
      }
    );
  } catch (err) {
    console.error('Error logging out from backend:', err);
  }

  await signOut({ redirectTo: '/auth/verify?phone=' });
}
