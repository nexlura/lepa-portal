import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServerClient } from '@/app/lib/supabase/server';

const WaitlistSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  schoolLevel: z.string().min(1, 'School level is required'),
  adminFullName: z.string().min(2, 'Full name is required'),
  adminPhone: z
    .string()
    .min(7, 'Phone number is required')
    .regex(/^[+()\-\s0-9]{7,}$/i, 'Enter a valid phone number'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('waitlist')
    .insert({
      school_name: parsed.data.schoolName,
      school_level: parsed.data.schoolLevel,
      admin_name: parsed.data.adminFullName,
      admin_phone: parsed.data.adminPhone,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, entry: data });
}
