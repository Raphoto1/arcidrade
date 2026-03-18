import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCookieConsent, hasCookieConsent, resetCookieConsent } from '@/utils/cookieConsent';

describe('getCookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna null cuando no hay consentimiento guardado', () => {
    expect(getCookieConsent()).toBeNull();
  });

  it('retorna "all" cuando el usuario aceptó todo', () => {
    localStorage.setItem('cookieConsent', 'all');
    expect(getCookieConsent()).toBe('all');
  });

  it('retorna "essential" cuando el usuario solo aceptó las esenciales', () => {
    localStorage.setItem('cookieConsent', 'essential');
    expect(getCookieConsent()).toBe('essential');
  });

  it('retorna "rejected" cuando el usuario rechazó las cookies', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    expect(getCookieConsent()).toBe('rejected');
  });
});

describe('hasCookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna false cuando no hay consentimiento guardado', () => {
    expect(hasCookieConsent('essential')).toBe(false);
    expect(hasCookieConsent('analytics')).toBe(false);
    expect(hasCookieConsent('personalization')).toBe(false);
  });

  it('las cookies esenciales siempre están permitidas cuando hay consentimiento', () => {
    localStorage.setItem('cookieConsent', 'essential');
    expect(hasCookieConsent('essential')).toBe(true);
  });

  it('permite todas las cookies cuando el consentimiento es "all"', () => {
    localStorage.setItem('cookieConsent', 'all');
    expect(hasCookieConsent('essential')).toBe(true);
    expect(hasCookieConsent('analytics')).toBe(true);
    expect(hasCookieConsent('personalization')).toBe(true);
  });

  it('deniega analytics y personalization cuando el consentimiento es "essential"', () => {
    localStorage.setItem('cookieConsent', 'essential');
    expect(hasCookieConsent('analytics')).toBe(false);
    expect(hasCookieConsent('personalization')).toBe(false);
  });

  it('deniega analytics y personalization cuando el consentimiento es "rejected"', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    expect(hasCookieConsent('analytics')).toBe(false);
    expect(hasCookieConsent('personalization')).toBe(false);
  });

  it('las cookies esenciales siguen estando permitidas cuando el consentimiento es "rejected"', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    expect(hasCookieConsent('essential')).toBe(true);
  });
});

describe('resetCookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('elimina el consentimiento de localStorage', () => {
    localStorage.setItem('cookieConsent', 'all');
    resetCookieConsent();
    expect(localStorage.getItem('cookieConsent')).toBeNull();
  });

  it('no lanza error cuando no hay consentimiento guardado', () => {
    expect(() => resetCookieConsent()).not.toThrow();
  });
});
