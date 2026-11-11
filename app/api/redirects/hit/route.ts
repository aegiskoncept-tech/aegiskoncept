import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { from } = await req.json();
    if (from) {
      await db.redirect.updateMany({
        where: { from },
        data: { hits: { increment: 1 } },
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

