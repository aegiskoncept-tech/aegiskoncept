import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');

  if (from) {
    const redirect = await db.redirect.findUnique({
      where: { from },
    });
    return NextResponse.json(redirect || null);
  }

  const all = await db.redirect.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { from, to, type = 301 } = json;

    if (!from || !to) {
      return NextResponse.json(
        { error: 'from and to are required' },
        { status: 400 }
      );
    }

    if (!from.startsWith('/') || !to.startsWith('/')) {
      return NextResponse.json(
        { error: 'Paths must start with /' },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json(
        { error: 'from and to cannot be identical' },
        { status: 400 }
      );
    }

    const redirect = await db.redirect.upsert({
      where: { from },
      update: { to, type },
      create: { from, to, type },
    });

    return NextResponse.json(redirect, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

