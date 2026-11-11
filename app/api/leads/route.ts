import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

const LeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  service: z.string().optional(),
  business: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

async function sendLeadEmailNotification(lead: any) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.LEAD_NOTIFY_EMAIL || 'hello@aegiskoncept.com';

  if (!user || !pass) {
    console.log('[LEAD NOTIFICATION] SMTP credentials not set, logging lead to console:', {
      to,
      leadId: lead.id,
      name: lead.name,
      contact: lead.phone || lead.email,
      service: lead.service,
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525', 10),
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: '"AegisKoncept Leads" <leads@aegiskoncept.com>',
      to,
      subject: `New Lead: ${lead.name} (${lead.service || 'General Enquiry'})`,
      text: `New lead received on ${lead.sourcePage || '/'}:\n
Name: ${lead.name}
Phone: ${lead.phone || 'N/A'}
Email: ${lead.email || 'N/A'}
Business: ${lead.business || 'N/A'}
Service: ${lead.service || 'N/A'}
Budget: ${lead.budget || 'N/A'}
Message: ${lead.message || 'N/A'}
Date: ${new Date().toLocaleString('en-IN')}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #DDD6CA; background: #FBF9F5;">
          <h2 style="color: #191919; margin-top: 0;">New Website Enquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Name:</b></td><td>${lead.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Phone:</b></td><td>${lead.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Email:</b></td><td>${lead.email || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Business:</b></td><td>${lead.business || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Service:</b></td><td>${lead.service || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Budget:</b></td><td>${lead.budget || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Source Page:</b></td><td>${lead.sourcePage || '/'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6A645D;"><b>Message:</b></td><td>${lead.message || 'N/A'}</td></tr>
          </table>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send lead email notification:', err);
  }
}

async function sendMetaCapiEvent(lead: any, clientIp?: string, userAgent?: string) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) return;

  try {
    const payload = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: `https://aegiskoncept.com${lead.sourcePage || '/'}`,
          user_data: {
            client_ip_address: clientIp || null,
            client_user_agent: userAgent || null,
          },
          custom_data: {
            content_name: lead.service || 'General',
            currency: 'INR',
            value: 1,
          },
        },
      ],
    };

    await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Meta CAPI event failed:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = LeadSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      email,
      service,
      business,
      budget,
      message,
      sourcePage,
      utmSource,
      utmMedium,
      utmCampaign,
    } = result.data;

    const lead = await db.lead.create({
      data: {
        name,
        phone: phone || (email ? 'Via Email' : 'Not provided'),
        email: email || null,
        service: service || null,
        business: business || null,
        budget: budget || null,
        message: message || null,
        sourcePage: sourcePage || '/',
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        status: 'NEW',
      },
    });

    // Fire asynchronous background tasks (email and Meta CAPI)
    sendLeadEmailNotification(lead).catch(() => {});
    const clientIp = req.headers.get('x-forwarded-for') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    sendMetaCapiEvent(lead, clientIp, userAgent).catch(() => {});

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: any) {
    console.error('Leads API error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
