// Google Analytics utilities for tracking events and conversions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-Y3N9J0K5L3';

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track conversions (for important actions)
export const trackConversion = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      ...parameters,
    });
  }
};

// Specific tracking functions for your platform
export const trackUserRegistration = () => {
  trackConversion('sign_up', {
    method: 'invitation',
  });
};

export const trackUserLogin = () => {
  trackConversion('login', {
    method: 'credentials',
  });
};

export const trackInvitationSent = (userType: string) => {
  trackEvent('invitation_sent', 'user_management', userType);
};

export const trackPasswordReset = () => {
  trackEvent('password_reset', 'authentication', 'forgot_password');
};

export const trackProcessCreated = (processType: string) => {
  trackEvent('process_created', 'platform_activity', processType);
};

export const trackContactFormSubmit = (formType: string) => {
  trackEvent('contact_form_submit', 'engagement', formType);
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