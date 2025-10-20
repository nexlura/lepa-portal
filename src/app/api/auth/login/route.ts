import { NextResponse } from 'next/server';
import axios from 'axios';
import { invokeExternalAPIRoute } from '@/lib/connector';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.identifier || !body.password) {
      return NextResponse.json(
        { message: 'Identifier and password are required' },
        { status: 400 }
      );
    }

    // Make login request to external API
    const url = invokeExternalAPIRoute('auth/login');
    
    const response = await axios.post(url, {
      identifier: body.identifier,
      password: body.password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.message || 'Login failed';
      
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
