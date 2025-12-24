import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig } from 'axios';
import { invokeExternalAPIRoute } from '@/lib/connector';
import { getTenantDomain } from '@/utils/hostHeader';
import { auth } from '@/auth';

/**
 * Generic API proxy route that handles all HTTP methods
 * This route proxies requests from client-side to the external API
 * to avoid CORS issues while maintaining the same interface
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'POST');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  try {
    const { path } = await params;
    const apiPath = path.join('/');

    // Get session for authentication with error handling
    let session = null;
    try {
      session = await auth();
    } catch (authError: any) {
      // Handle JWT session errors gracefully
      // This can happen when session token is invalid/expired
      if (authError?.name === 'JWTSessionError' || authError?.message?.includes('JWT')) {
        // Session is invalid, continue without auth token
        // The API will handle unauthorized requests appropriately
        if (process.env.NODE_ENV === 'development') {
          console.warn('JWT session error in proxy route (continuing without auth):', authError.message);
        }
      } else {
        // Log other auth errors
        console.warn('Error fetching session in proxy route:', authError);
      }
      // Continue without session - request will be unauthenticated
    }

    // Get host header from multiple sources (priority order):
    // 1. Explicitly passed from client via X-Lepa-Host-Header header
    // 2. From Origin header (browser origin)
    // 3. From Referer header (fallback)
    // 4. From host header (Next.js server host)
    const clientHostHeader = request.headers.get('X-Lepa-Host-Header');
    const originHeader =
      request.headers.get('Origin') || request.headers.get('Referer');
    const hostFromOrigin = originHeader
      ? getTenantDomain(new URL(originHeader).host)
      : null;
    const hostFromRequest = getTenantDomain(request.headers.get('host'));

    const hostHeader = clientHostHeader || hostFromOrigin || hostFromRequest;

    // Build the external API URL
    const url = invokeExternalAPIRoute(apiPath);

    // Prepare request config
    const config: AxiosRequestConfig = {
      method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-Lepa-Host-Header': hostHeader,
      },
    };

    // Add Authorization header if session exists
    // Client can pass Authorization header, but we prefer session token for security
    const clientAuthHeader = request.headers.get('Authorization');
    if (clientAuthHeader) {
      config.headers!['Authorization'] = clientAuthHeader;
    } else if (session?.user?.accessToken) {
      config.headers!['Authorization'] = `Bearer ${session.user.accessToken}`;
    }

    // Add request body for POST, PATCH
    if (['POST', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('Content-Type') || '';

      // Check if it's FormData (multipart/form-data)
      if (contentType.includes('multipart/form-data')) {
        try {
          const formData = await request.formData();
          // Convert FormData to a format axios can handle
          // Axios will automatically set the correct Content-Type with boundary
          config.data = formData;
          // Remove Content-Type header to let axios set it with boundary
          delete config.headers!['Content-Type'];
        } catch {
          // No body or invalid FormData, continue without body
        }
      } else {
        // Handle JSON body
        try {
          const body = await request.json();
          config.data = body;
        } catch {
          // No body or invalid JSON, continue without body
        }
      }
    }

    // Add query parameters
    const searchParams = request.nextUrl.searchParams;
    if (searchParams.toString()) {
      config.params = Object.fromEntries(searchParams.entries());
    }

    // Make request to external API
    const response = await axios.request(config);

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Handle empty responses
    if (!response.data) {
      return new NextResponse(null, { status: response.status });
    }

    // Return response with original status
    // Ensure response.data is valid JSON-serializable
    try {
      return NextResponse.json(response.data, { status: response.status });
    } catch (jsonError) {
      // If response.data can't be serialized, return error
      console.error('Failed to serialize response data:', jsonError);
      return NextResponse.json(
        { message: 'Invalid response format from API' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || 'Request failed';

      return NextResponse.json({ message }, { status: statusCode });
    } else {
      return NextResponse.json(
        { message: 'An unexpected error occurred. Please try again later.' },
        { status: 500 }
      );
    }
  }
}
