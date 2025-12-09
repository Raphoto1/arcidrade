/**
 * Archivo central que exporta todas las plantillas de email
 * Facilita la importación desde sendMail.ts
 */

export { getInvitationTemplate } from './invitationTemplate';
export { getMassInvitationTemplate } from './massInvitationTemplate';
export { getWebsiteInvitationTemplate } from './websiteInvitationTemplate';
export { getResetPasswordTemplate } from './resetPasswordTemplate';
export { getContactTemplate, getContactAdminNotificationTemplate } from './contactTemplate';
export { getContactAdminTemplate } from './contactAdminTemplate';
export { getErrorLogTemplate } from './errorLogTemplate';
export { getPendingInvitationReminderTemplate } from './pendingInvitationReminderTemplate';
