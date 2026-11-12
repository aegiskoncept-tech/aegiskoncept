export interface SiteContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  secondaryEmail?: string;
  address: string;
  hours: string;
  mapsUrl?: string;
}

export interface SiteIntegrationSettings {
  gscVerification?: string;
  ga4Id?: string;
  gtmId?: string;
  metaPixelId?: string;
  metaCapiToken?: string;
  clarityId?: string;
  indexnowKey?: string;
}

export const DEFAULT_CONTACT: SiteContactSettings = {
  phone: '+91 73034 68073',
  whatsapp: '917303468073',
  email: 'hello@aegiskoncept.com',
  secondaryEmail: 'contact@aegiskoncept.com',
  address: 'Sector 7, Ramphal Chowk, Dwarka, New Delhi 110075',
  hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
  mapsUrl: 'https://maps.google.com/?q=Ramphal+Chowk+Sector+7+Dwarka+Delhi',
};

