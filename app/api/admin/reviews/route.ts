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
    const { id, status } = await req.json();

    if (!id || !['APPROVED', 'DRAFT'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid id or status (must be APPROVED or DRAFT)' },
        { status: 400 }
      );
    }

    const review = await db.review.update({
      where: { id },
      data: { status },
      include: { caseStudy: true },
    });

    // Revalidate public pages where reviews may appear
    revalidatePath('/');
    revalidatePath('/our-work');
    if (review.caseStudy?.slug) {
      revalidatePath(`/our-work/${review.caseStudy.slug}`);
    }

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

