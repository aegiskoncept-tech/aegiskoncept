import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format');

  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (format === 'csv') {
    const headers = [
      'ID',
      'Date',
      'Name',
      'Phone',
      'Email',
      'Business',
      'Service',
      'Budget',
      'Status',
      'Message',
      'Source Page',
    ];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toISOString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.business || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      l.status,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.sourcePage || '/',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="aegiskoncept-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json(leads);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const updated = await db.lead.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

