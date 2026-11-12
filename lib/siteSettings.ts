import { db } from './db';
import {
  SiteContactSettings,
  SiteIntegrationSettings,
  DEFAULT_CONTACT,
} from './siteConfig';

export * from './siteConfig';

export async function getSiteContactSettings(): Promise<SiteContactSettings> {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: {
          in: [
            'contact_phone',
            'contact_whatsapp',
            'contact_email',
            'contact_email_secondary',
            'contact_address',
            'contact_hours',
            'contact_maps_url',
          ],
        },
      },
    });

    const map = new Map(settings.map((s) => [s.key, s.value]));

    return {
      phone: map.get('contact_phone') || DEFAULT_CONTACT.phone,
      whatsapp: map.get('contact_whatsapp') || DEFAULT_CONTACT.whatsapp,
      email: map.get('contact_email') || DEFAULT_CONTACT.email,
      secondaryEmail: map.get('contact_email_secondary') || DEFAULT_CONTACT.secondaryEmail,
      address: map.get('contact_address') || DEFAULT_CONTACT.address,
      hours: map.get('contact_hours') || DEFAULT_CONTACT.hours,
      mapsUrl: map.get('contact_maps_url') || DEFAULT_CONTACT.mapsUrl,
    };
  } catch (err) {
    console.warn('[SiteSettings] Failed to fetch contact settings from DB, using defaults:', err);
    return DEFAULT_CONTACT;
  }
}

export async function getSiteIntegrationSettings(): Promise<SiteIntegrationSettings> {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: {
          in: [
            'gsc_verification',
            'ga4_id',
            'gtm_id',
            'meta_pixel_id',
            'meta_capi_token',
            'clarity_id',
            'indexnow_key',
          ],
        },
      },
    });

    const map = new Map(settings.map((s) => [s.key, s.value]));

    return {
      gscVerification: map.get('gsc_verification') || process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
      ga4Id: map.get('ga4_id') || process.env.NEXT_PUBLIC_GA_ID || '',
      gtmId: map.get('gtm_id') || process.env.NEXT_PUBLIC_GTM_ID || '',
      metaPixelId: map.get('meta_pixel_id') || process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
      metaCapiToken: map.get('meta_capi_token') || process.env.META_CAPI_ACCESS_TOKEN || '',
      clarityId: map.get('clarity_id') || process.env.NEXT_PUBLIC_CLARITY_ID || '',
      indexnowKey: map.get('indexnow_key') || process.env.INDEXNOW_KEY || '',
    };
  } catch (err) {
    console.warn('[SiteSettings] Failed to fetch integration settings from DB, using env defaults:', err);
    return {
      gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
      ga4Id: process.env.NEXT_PUBLIC_GA_ID || '',
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
      metaCapiToken: process.env.META_CAPI_ACCESS_TOKEN || '',
      clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
      indexnowKey: process.env.INDEXNOW_KEY || '',
    };
  }
}
