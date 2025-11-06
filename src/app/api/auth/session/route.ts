import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestHost } from '@/utils/hostHeader';
import { postModel } from '@/lib/connector';

export async function GET() {
  const session = await auth();

  if (session?.user) {
    // ✅ Authenticated → redirect to dashboard
    return NextResponse.json(
      { message: 'request successfull' },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: 'user is unauthenticated' },
      { status: 401 }
    );
  }
}

type RefreshResponse = {
  data: {
    access_token: string;
    refresh_token?: string;
  };
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: 'user is unauthenticated' },
      { status: 401 }
    );
  }

  const host = getRequestHost(req.headers.get('host'));
  const refreshToken = session.user.refreshToken;

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'missing refresh token' },
      { status: 400 }
    );
  }

  const resp = await postModel<RefreshResponse>(
    '/auth/refresh',
    { refresh_token: refreshToken },
    {
      headers: {
        'X-Lepa-Host-Header': host,
      },
    }
  );

  console.log('refresh response', resp);

  if (!resp || (!resp.data.access_token && !resp.data.refresh_token)) {
    return NextResponse.json(
      { message: 'failed to refresh token' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token ?? refreshToken,
    },
    { status: 200 }
  );
}
