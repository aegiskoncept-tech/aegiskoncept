'use client';

import React from 'react';
import Script from 'next/script';

export default function AnalyticsScripts({
  gaId,
  gtmId,
  metaPixelId,
  clarityId,
}: {
  gaId?: string;
  gtmId?: string;
  metaPixelId?: string;
  clarityId?: string;
}) {
  const finalGaId = gaId || process.env.NEXT_PUBLIC_GA_ID;
  const finalGtmId = gtmId || process.env.NEXT_PUBLIC_GTM_ID;
  const finalMetaPixelId = metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const finalClarityId = clarityId || process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {/* 1. Google Tag Manager */}
      {finalGtmId && (
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${finalGtmId}');
          `}
        </Script>
      )}

      {/* 2. Google Analytics 4 (gtag.js) */}
      {finalGaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${finalGaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-script" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${finalGaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* 3. Meta Pixel */}
      {finalMetaPixelId && (
        <Script id="meta-pixel-script" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${finalMetaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* 4. Microsoft Clarity */}
      {finalClarityId && (
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${finalClarityId}");
          `}
        </Script>
      )}
    </>
  );
}

