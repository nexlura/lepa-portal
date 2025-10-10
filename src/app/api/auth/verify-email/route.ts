import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { invokeExternalAPIRoute } from '@/lib/connector';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const url = invokeExternalAPIRoute(`auth/verify-identifier/${email}`);

  //make login request to API server
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'schoolA.lepa.com',
      },
    });

    // Return data with original status
    return new Response(JSON.stringify(response.data), {
      status: response.status,
    });
  } catch (error) {
    // Handle Axios-specific errors
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        'An error occurred while verifying identifier.';

      return NextResponse.json({ message }, { status: statusCode });
    }

    // Handle network or unexpected errors
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
