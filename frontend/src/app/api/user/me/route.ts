import { NextResponse } from 'next/server';
import { getMe } from '@/lib/api';

export async function GET() {
  try {
    const user = await getMe();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ data: null }, { status: 401 });
  }
}
