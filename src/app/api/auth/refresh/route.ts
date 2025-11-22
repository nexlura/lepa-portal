import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { postModel, isErrorResponse } from '@/lib/connector';
import { getHostHeaderForRequest } from '@/utils/getHostHeader';

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

  const refreshToken = session.user.refreshToken;

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'missing refresh token' },
      { status: 400 }
    );
  }

  // Get host header using helper function
  const host = await getHostHeaderForRequest(req.headers);
  
  if (!host) {
    return NextResponse.json(
      { message: 'Host header is required' },
      { status: 400 }
    );
  }

  // Make refresh request using postModel with explicit headers
  const resp = await postModel<RefreshResponse>(
    '/auth/refresh',
    { refresh_token: refreshToken },
    {
      headers: {
        'X-Lepa-Host-Header': host,
      },
    }
  );

  // Check if response is an error
  if (isErrorResponse(resp)) {
    return NextResponse.json(
      { message: resp.message || 'failed to refresh token' },
      { status: resp.status || 500 }
    );
  }

  // Check if response has required data
  if (!resp || !resp.data || (!resp.data.access_token && !resp.data.refresh_token)) {
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
