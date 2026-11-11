import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const { key, value } = json;

    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await db.setting.upsert({
      where: { key },
      update: { value: valueStr },
      create: { key, value: valueStr },
    });

    revalidatePath('/');

    return NextResponse.json({ success: true, setting });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

