import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth().catch((error) => {
      // Catch any errors from auth() and return null
      // Don't log in production to avoid noise
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error in auth() call:', error?.message || error);
      }
      return null;
    });
    
    // Return session in the format NextAuth expects
    // If no session, return null (NextAuth handles this)
    // Always ensure we return valid JSON - NextAuth expects null or a session object
    const response = session || null;
    
    // Ensure we always return valid JSON with explicit null
    // This prevents empty response bodies that cause JSON.parse errors
    const jsonResponse = JSON.stringify(response);
    
    return new NextResponse(jsonResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(jsonResponse, 'utf8').toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    // Handle errors gracefully - return null session instead of error
    // This prevents JSON parse errors on the client
    // Don't log in production to avoid noise
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error fetching session:', error?.message || error);
    }
    
    // Always return valid JSON, even on error
    // Return null explicitly as JSON string to ensure valid JSON
    const jsonResponse = JSON.stringify(null);
    
    return new NextResponse(jsonResponse, { 
      status: 200, // Return 200 with null to prevent client errors
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(jsonResponse, 'utf8').toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
