export const getCookieConsent = (): 'all' | 'essential' | 'rejected' | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cookieConsent') as 'all' | 'essential' | 'rejected' | null
}

export const hasCookieConsent = (type: 'essential' | 'analytics' | 'personalization'): boolean => {
  const consent = getCookieConsent()
  
  if (!consent) return false
  if (type === 'essential') return true // Siempre permitidas
  if (consent === 'all') return true
  if (consent === 'rejected') return false
  if (consent === 'essential') return false
  
  return false
}

export const resetCookieConsent = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cookieConsent')
  }
}
