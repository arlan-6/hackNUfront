import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/actions/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  const { id, name, role } = user;
  return NextResponse.json({ user: { id, name, role } });
}
