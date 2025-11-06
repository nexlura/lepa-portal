import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (session?.user) {
    // ✅ Authenticated → redirect to dashboard
    return NextResponse.json(
      { message: 'request successfull' },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: 'user is unauthenticated' },
      { status: 401 }
    );
  }
}
