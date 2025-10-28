'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const GA_TRACKING_ID = 'G-Y3N9J0K5L3';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

export default GoogleAnalytics;