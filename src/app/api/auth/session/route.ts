import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    // Return session in the format NextAuth expects
    // If no session, return null (NextAuth handles this)
    // Always ensure we return valid JSON
    const response = session || null;
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    // Handle errors gracefully - return null session instead of error
    // This prevents JSON parse errors on the client
    console.warn('Error fetching session:', error?.message || error);
    
    // Always return valid JSON, even on error
    return NextResponse.json(null, { 
      status: 200, // Return 200 with null to prevent client errors
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
