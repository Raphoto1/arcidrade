// Google Analytics utilities for tracking events and conversions
// Using @next/third-parties for proper Next.js integration

import { sendGAEvent } from '@next/third-parties/google';

export const GA_TRACKING_ID = 'G-Y3N9J0K5L3';

type ProcessAnalyticsPayload = {
  processId?: number | string | null;
  position?: string | null;
  institutionName?: string | null;
  area?: string | null;
  mainSpeciality?: string | null;
  source?: string | null;
};

const sanitizeString = (value?: string | number | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const sanitizedValue = String(value).trim();
  return sanitizedValue || undefined;
};

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

export const trackPublicOfferClick = ({
  processId,
  position,
  institutionName,
  area,
  mainSpeciality,
  source,
}: ProcessAnalyticsPayload) => {
  sendGAEvent({
    event: 'public_offer_click',
    event_category: 'engagement',
    event_label: sanitizeString(position) || sanitizeString(processId) || 'unknown_offer',
    process_id: sanitizeString(processId),
    process_position: sanitizeString(position),
    institution_name: sanitizeString(institutionName),
    process_area: sanitizeString(area),
    main_speciality: sanitizeString(mainSpeciality),
    source: sanitizeString(source) || 'public_offers',
  });
};

export const trackProfessionalProcessApplication = ({
  processId,
  position,
  institutionName,
  area,
  mainSpeciality,
  source,
}: ProcessAnalyticsPayload) => {
  sendGAEvent({
    event: 'professional_process_application',
    event_category: 'conversion',
    event_label: sanitizeString(position) || sanitizeString(processId) || 'unknown_process',
    process_id: sanitizeString(processId),
    process_position: sanitizeString(position),
    institution_name: sanitizeString(institutionName),
    process_area: sanitizeString(area),
    main_speciality: sanitizeString(mainSpeciality),
    source: sanitizeString(source) || 'professional_platform',
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
  trackPublicOfferClick,
  trackProfessionalProcessApplication,
};