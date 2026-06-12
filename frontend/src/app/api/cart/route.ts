import { NextResponse } from 'next/server';
import { getCart } from '@/lib/api';

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json(cart);
  } catch {
    return NextResponse.json({ data: { items: [] }, meta: { total: 0 } });
  }
}
