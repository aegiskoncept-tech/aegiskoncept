import { NextRequest, NextResponse } from 'next/server';
import { submitToIndexNow, INDEXNOW_KEY } from '@/lib/indexnow';

export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: `/${INDEXNOW_KEY}.txt`,
    endpoint: 'https://api.indexnow.org/indexnow',
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const urls = Array.isArray(json.urls) ? json.urls : json.url ? [json.url] : [];

    if (urls.length === 0) {
      return NextResponse.json(
        { error: 'No URLs specified' },
        { status: 400 }
      );
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

