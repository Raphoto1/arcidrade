'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Verificar si ya aceptó las cookies
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all')
    setShowBanner(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential')
    setShowBanner(false)
  }

  const rejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full pointer-events-auto border-2 border-[var(--main-arci)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 text-3xl">🍪</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Usamos cookies
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Utilizamos cookies esenciales para que la plataforma funcione correctamente 
                (inicio de sesión, seguridad). También podemos usar cookies opcionales para 
                mejorar tu experiencia.
              </p>
            </div>
          </div>

          {/* Detalles expandibles */}
          {showDetails && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                  🔒 Cookies Esenciales (Obligatorias)
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Necesarias para el funcionamiento básico: inicio de sesión, seguridad, 
                  preferencias de idioma. No se pueden desactivar.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                  📊 Cookies de Análisis (Opcionales)
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Nos ayudan a entender cómo usas la plataforma para mejorarla. 
                  Información anónima sobre navegación y uso.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                  🎯 Cookies de Personalización (Opcionales)
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Recuerdan tus preferencias y configuraciones para una mejor experiencia.
                </p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2.5 bg-[var(--main-arci)] hover:bg-[var(--soft-arci)] text-white font-semibold rounded-lg transition-colors"
            >
              Aceptar todas
            </button>
            <button
              onClick={acceptEssential}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors"
            >
              Solo esenciales
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              Rechazar todas
            </button>
          </div>

          {/* Toggle detalles */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-[var(--main-arci)] hover:text-[var(--soft-arci)] font-medium transition-colors"
          >
            {showDetails ? '▼ Ocultar detalles' : '▶ Ver detalles de cookies'}
          </button>

          {/* Link a política */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Para más información, consulta nuestra{' '}
              <a 
                href="/politica-cookies" 
                className="text-[var(--main-arci)] hover:text-[var(--soft-arci)] underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Cookies
              </a>
              {' '}y{' '}
              <a 
                href="/politica-privacidad" 
                className="text-[var(--main-arci)] hover:text-[var(--soft-arci)] underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
