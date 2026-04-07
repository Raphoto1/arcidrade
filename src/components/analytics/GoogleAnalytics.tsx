'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      setHasAnalyticsConsent(cookieConsent === 'all');
    };

    updateConsent();
    window.addEventListener('storage', updateConsent);
    window.addEventListener('cookie-consent-changed', updateConsent);

    return () => {
      window.removeEventListener('storage', updateConsent);
      window.removeEventListener('cookie-consent-changed', updateConsent);
    };
  }, []);

  if (!GA_TRACKING_ID || !hasAnalyticsConsent) {
    return null;
  }

  return <NextGoogleAnalytics gaId={GA_TRACKING_ID} />;
}

export default GoogleAnalytics;