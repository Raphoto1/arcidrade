'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

const GA_TRACKING_ID = 'G-Y3N9J0K5L3';

export function GoogleAnalytics() {
  return <NextGoogleAnalytics gaId={GA_TRACKING_ID} />;
}

export default GoogleAnalytics;