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
    
    // Get session for authentication
    const session = await auth();
    
    // Get host header from multiple sources (priority order):
    // 1. Explicitly passed from client via X-Lepa-Host-Header header
    // 2. From Origin header (browser origin)
    // 3. From Referer header (fallback)
    // 4. From host header (Next.js server host)
    const clientHostHeader = request.headers.get('X-Lepa-Host-Header');
    const originHeader = request.headers.get('Origin') || request.headers.get('Referer');
    const hostFromOrigin = originHeader ? getTenantDomain(new URL(originHeader).host) : null;
    const hostFromRequest = getTenantDomain(request.headers.get('host'));
    
    const hostHeader = clientHostHeader || hostFromOrigin || hostFromRequest;
    
    // Build the external API URL
    const url = invokeExternalAPIRoute(apiPath);
    
    // Prepare request config
    const config: AxiosRequestConfig = {
      method: method as any,
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
      try {
        const body = await request.json();
        config.data = body;
      } catch {
        // No body or invalid JSON, continue without body
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
    
    // Return response with original status
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || 'Request failed';
      
      return NextResponse.json(
        { message },
        { status: statusCode }
      );
    } else {
      return NextResponse.json(
        { message: 'An unexpected error occurred. Please try again later.' },
        { status: 500 }
      );
    }
  }
}

