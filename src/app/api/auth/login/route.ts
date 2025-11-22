import { NextRequest, NextResponse } from 'next/server';
import { postModel, isErrorResponse } from '@/lib/connector';
import { getHostHeaderForRequest } from '@/utils/getHostHeader';

type BackendUser = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
};

type BackendTenant = {
  id?: string;
  school_name?: string;
};

type LoginResponse = {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: BackendUser;
    tenant: BackendTenant;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.identifier || !body.password) {
      return NextResponse.json(
        { message: 'Identifier and password are required' },
        { status: 400 }
      );
    }

    // Get host header using helper function
    const host = await getHostHeaderForRequest(request.headers);
    
    if (!host) {
      return NextResponse.json(
        { message: 'Host header is required' },
        { status: 400 }
      );
    }
    
    // Make login request using postModel with explicit headers
    const resp = await postModel<LoginResponse>(
      '/auth/login',
      {
        identifier: body.identifier,
        password: body.password,
      },
      {
        headers: {
          'X-Lepa-Host-Header': host,
        },
      }
    );

    // Check if response is an error
    if (isErrorResponse(resp)) {
      return NextResponse.json(
        { message: resp.message || 'Login failed' },
        { status: resp.status || 500 }
      );
    }

    // Check if response has required data
    if (!resp || !resp.data) {
      return NextResponse.json(
        { message: 'Login failed - invalid response' },
        { status: 500 }
      );
    }

    return NextResponse.json(resp.data, { status: 200 });
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
