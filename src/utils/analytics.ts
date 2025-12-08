// Google Analytics utilities for tracking events and conversions
// Using @next/third-parties for proper Next.js integration

import { sendGAEvent } from '@next/third-parties/google';

export const GA_TRACKING_ID = 'G-Y3N9J0K5L3';

// Track events using Next.js third-parties
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  sendGAEvent({
    event: action,
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track conversions (for important actions)
export const trackConversion = (eventName: string, parameters?: Record<string, any>) => {
  sendGAEvent({
    event: eventName,
    ...parameters,
  });
};

// Specific tracking functions for your platform
export const trackUserRegistration = () => {
  sendGAEvent({
    event: 'sign_up',
    method: 'invitation',
  });
};

export const trackUserLogin = () => {
  sendGAEvent({
    event: 'login',
    method: 'credentials',
  });
};

export const trackInvitationSent = (userType: string) => {
  sendGAEvent({
    event: 'invitation_sent',
    event_category: 'user_management',
    event_label: userType,
  });
};

export const trackPasswordReset = () => {
  sendGAEvent({
    event: 'password_reset',
    event_category: 'authentication',
    event_label: 'forgot_password',
  });
};

export const trackProcessCreated = (processType: string) => {
  sendGAEvent({
    event: 'process_created',
    event_category: 'platform_activity',
    event_label: processType,
  });
};

export const trackContactFormSubmit = (formType: string) => {
  sendGAEvent({
    event: 'contact_form_submit',
    event_category: 'engagement',
    event_label: formType,
  });
};

// Track page views (optional, as Next.js handles this automatically)
export const trackPageView = (url: string) => {
  sendGAEvent({
    event: 'page_view',
    page_path: url,
  });
};

export default {
  trackPageView,
  trackEvent,
  trackConversion,
  trackUserRegistration,
  trackUserLogin,
  trackInvitationSent,
  trackPasswordReset,
  trackProcessCreated,
  trackContactFormSubmit,
};