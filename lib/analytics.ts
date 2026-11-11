'use client';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', params);
    } else if (eventName === 'contact') {
      window.fbq('track', 'Contact', params);
    } else {
      window.fbq('trackCustom', eventName, params);
    }
  }

  // Microsoft Clarity custom event
  if (typeof window.clarity === 'function') {
    window.clarity('event', eventName);
  }
}

export function trackWhatsAppClick(source: string = 'floating_button') {
  trackEvent('whatsapp_click', {
    source,
    value: 1,
  });
}

export function trackPhoneClick(source: string = 'call_button') {
  trackEvent('phone_click', {
    source,
    value: 1,
  });
}

export function trackLeadSubmission(service?: string, sourcePage?: string) {
  trackEvent('generate_lead', {
    service: service || 'Not specified',
    source_page: sourcePage || window.location.pathname,
    value: 1,
    currency: 'INR',
  });
}

