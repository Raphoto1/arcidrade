'use client'

export default function PoliticaCookies() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-6 text-[var(--main-arci)]">
        Política de Cookies
      </h1>
      
      <div className="space-y-6 text-black">
        <section>
          <h2 className="text-2xl font-semibold mb-3">¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
            cuando visitas un sitio web. Se utilizan para que el sitio web funcione de 
            manera más eficiente y para proporcionar información a los propietarios del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">¿Qué cookies utilizamos?</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-[var(--main-arci)] pl-4">
              <h3 className="font-semibold text-lg mb-2">Cookies Esenciales</h3>
              <p className="mb-2">
                Estas cookies son necesarias para el funcionamiento básico de la plataforma:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>next-auth.session-token</strong>: Gestiona tu sesión de usuario</li>
                <li><strong>next-auth.csrf-token</strong>: Protección contra ataques CSRF</li>
                <li><strong>cookieConsent</strong>: Almacena tus preferencias de cookies</li>
              </ul>
              <p className="mt-2 text-sm italic">
                Duración: Sesión o hasta 30 días según el tipo
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Cookies de Análisis (Opcionales)</h3>
              <p className="mb-2">
                Nos ayudan a entender cómo interactúas con la plataforma:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Funcionalidades más utilizadas</li>
                <li>Errores y problemas técnicos</li>
              </ul>
              <p className="mt-2 text-sm italic">
                Duración: Hasta 2 años
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Cookies de Personalización (Opcionales)</h3>
              <p className="mb-2">
                Mejoran tu experiencia recordando tus preferencias:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Configuración de idioma</li>
                <li>Preferencias de visualización</li>
                <li>Filtros guardados</li>
              </ul>
              <p className="mt-2 text-sm italic">
                Duración: Hasta 1 año
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Gestionar tus preferencias</h2>
          <p className="mb-3">
            Puedes cambiar tus preferencias de cookies en cualquier momento:
          </p>
          <button 
            onClick={() => {
              localStorage.removeItem('cookieConsent')
              window.location.reload()
            }}
            className="px-6 py-3 bg-[var(--main-arci)] hover:bg-[var(--soft-arci)] text-white font-semibold rounded-lg transition-colors"
          >
            Actualizar preferencias de cookies
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Cookies de terceros</h2>
          <p>
            Esta plataforma puede utilizar servicios de terceros que establecen sus propias cookies:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li><strong>Cloudflare</strong>: Seguridad y rendimiento del sitio</li>
            <li><strong>Servicios de email</strong>: Para el envío de notificaciones</li>
          </ul>
          <p className="mt-2">
            Estos servicios tienen sus propias políticas de privacidad y cookies sobre las 
            cuales ARCIDRADE no tiene control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contacto</h2>
          <p>
            Si tienes preguntas sobre nuestra política de cookies, contáctanos en:{' '}
            <a 
              href="mailto:contacto@arcidrade.com" 
              className="text-[var(--main-arci)] hover:text-[var(--soft-arci)] font-semibold"
            >
              contacto@arcidrade.com
            </a>
          </p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
          </p>
        </section>
      </div>
    </div>
  )
}
