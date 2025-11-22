import { NextRequest, NextResponse } from 'next/server';
import { getModel, isErrorResponse } from '@/lib/connector';
import { getHostHeaderForRequest } from '@/utils/getHostHeader';

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { message: 'Identifier is required' },
        { status: 400 }
      );
    }

    // Get host header using helper function
    const hostHeader = await getHostHeaderForRequest(req.headers);
    
    if (!hostHeader) {
      return NextResponse.json(
        { message: 'Host header is required' },
        { status: 400 }
      );
    }
    
    // Make verify request using getModel with explicit headers
    const resp = await getModel(
      `/auth/verify-identifier/${identifier}`,
      {
        headers: {
          'X-Lepa-Host-Header': hostHeader,
        },
      }
    );

    // Check if response is an error
    if (isErrorResponse(resp)) {
      return NextResponse.json(
        { message: resp.message || 'An error occurred while verifying identifier.' },
        { status: resp.status || 500 }
      );
    }

    // Return data with success status
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error('Verify route error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
