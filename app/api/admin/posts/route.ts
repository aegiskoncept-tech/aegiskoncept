import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { submitToIndexNow } from '@/lib/indexnow';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const {
      id,
      title,
      slug,
      excerpt,
      bodyHtml,
      categoryId,
      focusKeyword,
      seoTitle,
      seoDesc,
      status = 'DRAFT',
      publishAt,
    } = json;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Word count calculation
    const words = (bodyHtml || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));

    let post;
    if (id) {
      post = await db.post.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt,
          bodyHtml: bodyHtml || '',
          bodyJson: json.bodyJson || null,
          categoryId: categoryId || null,
          focusKeyword: focusKeyword || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDesc || null,
          status,
          publishAt: publishAt ? new Date(publishAt) : (status === 'PUBLISHED' ? new Date() : null),
          readMinutes,
        },
      });
    } else {
      post = await db.post.create({
        data: {
          title,
          slug,
          excerpt: excerpt || '',
          bodyHtml: bodyHtml || '',
          bodyJson: json.bodyJson || null,
          categoryId: categoryId || null,
          focusKeyword: focusKeyword || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDesc || null,
          status,
          publishAt: publishAt ? new Date(publishAt) : (status === 'PUBLISHED' ? new Date() : null),
          readMinutes,
        },
      });
    }

    revalidatePath('/insights');
    revalidatePath(`/insights/${post.slug}`);
    revalidatePath('/insights/author/ritesh-kumar');

    if (post.status === 'PUBLISHED') {
      submitToIndexNow([`/insights/${post.slug}`]).catch(() => {});
    }

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const post = await db.post.delete({ where: { id } });
    revalidatePath('/insights');

    return NextResponse.json({ success: true, id: post.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

