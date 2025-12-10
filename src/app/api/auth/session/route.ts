import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    // Return session in the format NextAuth expects
    // If no session, return null (NextAuth handles this)
    return NextResponse.json(session || null);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
