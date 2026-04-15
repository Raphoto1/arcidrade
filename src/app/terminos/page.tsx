export default function Terminos() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-2 text-(--main-arci)">
        Términos y Condiciones
      </h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: abril de 2026</p>

      <div className="space-y-8 text-black">

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Aceptación de los términos</h2>
          <p>
            Al registrarte y utilizar la plataforma <strong>Arcidrade</strong>, aceptas quedar
            vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguno de
            ellos, no debes utilizar la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Descripción del servicio</h2>
          <p>
            Arcidrade es una plataforma digital orientada a profesionales de la salud y
            profesionales generales que facilita la gestión de perfiles, conexiones,
            procesos de búsqueda de talento y colaboración institucional. El acceso a
            determinadas funcionalidades puede requerir registro previo. 
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Registro y cuenta de usuario</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Debes proporcionar información veraz, completa y actualizada al momento
              del registro.
            </li>
            <li>
              Eres responsable de mantener la confidencialidad de tu contraseña y de
              todas las actividades realizadas bajo tu cuenta.
            </li>
            <li>
              Debes notificarnos de inmediato ante cualquier uso no autorizado de tu
              cuenta.
            </li>
            <li>
              Arcidrade se reserva el derecho de suspender o cancelar cuentas que
              incumplan estos términos.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Uso aceptable</h2>
          <p className="mb-3">Al utilizar la plataforma, te comprometes a no:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Publicar información falsa, engañosa o que infrinja derechos de terceros.</li>
            <li>Utilizar la plataforma con fines ilegales, fraudulentos o maliciosos.</li>
            <li>
              Intentar acceder sin autorización a sistemas, datos o cuentas de otros
              usuarios.
            </li>
            <li>Enviar comunicaciones no solicitadas (spam) a otros miembros.</li>
            <li>
              Reproducir, distribuir o explotar comercialmente contenidos de la
              plataforma sin autorización expresa.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Privacidad y tratamiento de datos</h2>
          <p>
            El tratamiento de tus datos personales se rige por nuestra{' '}
            <a
              href="/politica-cookies"
              className="text-(--main-arci) underline hover:text-(--soft-arci)"
            >
              Política de Cookies y Privacidad
            </a>
            . Al registrarte, consientes el tratamiento de tus datos conforme a dicha
            política y a la normativa vigente aplicable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Tratamiento de datos personales y currículum profesional</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-(--main-arci) pl-4 py-1">
              <h3 className="font-semibold text-lg mb-2">Conservación del currículum</h3>
              <p>
                Le informamos de que hemos recibido su currículum y procedemos a guardarlo
                aplicando las medidas de seguridad adecuadas en nuestra base de datos. Usted
                se compromete a mantener actualizado su currículum; si no remite comunicación
                expresa y escrita al respecto, entendemos que su currículum se encuentra
                actualizado. <strong>Sus datos serán conservados durante 1 año.</strong>
              </p>
            </div>

            <div className="border-l-4 border-(--main-arci) pl-4 py-1">
              <h3 className="font-semibold text-lg mb-2">Base legal y responsable del tratamiento</h3>
              <p>
                En cumplimiento de lo establecido en la normativa española y europea de
                Protección de Datos Personales (RGPD y LOPDGDD), le informamos de que ha
                suministrado sus datos explícitamente a <strong>Arcidrade</strong> (en
                adelante &ldquo;Arcidrade&rdquo;), como responsable del tratamiento, con la
                finalidad de gestionar su candidatura para actuales o futuras oportunidades
                profesionales. La base legal para el tratamiento es su{' '}
                <strong>consentimiento</strong>.
              </p>
            </div>

            <div className="border-l-4 border-(--main-arci) pl-4 py-1">
              <h3 className="font-semibold text-lg mb-2">Encargados del tratamiento y transferencias internacionales</h3>
              <p>
                Para la finalidad anteriormente indicada, empresas vinculadas a Arcidrade o
                terceros proveedores de servicios de consultoría de recursos humanos,
                comunicaciones electrónicas, otros servicios de seguridad y alojamiento
                pueden tratar sus datos por cuenta de Arcidrade como encargados del
                tratamiento para la gestión de dichos servicios, incluso en los casos en que
                los mismos se hallen fuera del Espacio Económico Europeo, siempre que
                legalmente garanticen el nivel adecuado de protección exigido por la
                normativa europea.
              </p>
            </div>

            <div className="border-l-4 border-(--main-arci) pl-4 py-1">
              <h3 className="font-semibold text-lg mb-2">Derechos del interesado</h3>
              <p className="mb-2">
                En cualquier momento puede <strong>retirar el consentimiento</strong>{' '}
                prestado y ejercer los derechos de{' '}
                <strong>
                  acceso, rectificación, supresión, portabilidad y limitación u oposición
                </strong>{' '}
                a su tratamiento dirigiéndose a Arcidrade enviando un correo electrónico a{' '}
                <a
                  href="mailto:contacto@arcidrade.com"
                  className="text-(--main-arci) underline hover:text-(--soft-arci)"
                >
                  contacto@arcidrade.com
                </a>
                .
              </p>
              <p className="text-sm text-gray-600 italic">
                En caso de ejercicio de los derechos de acceso y/o rectificación, será
                necesario que adjunte con la solicitud copia del DNI o documento
                identificativo sustitutorio.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Propiedad intelectual</h2>
          <p>
            Todo el contenido, diseño, logotipos y código de la plataforma son propiedad
            de Arcidrade o de sus licenciantes. Queda prohibida su reproducción o uso sin
            autorización escrita previa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Limitación de responsabilidad</h2>
          <p>
            Arcidrade no garantiza la disponibilidad ininterrumpida del servicio ni se
            responsabiliza por daños derivados del uso o imposibilidad de uso de la
            plataforma, en la medida en que lo permita la ley aplicable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Modificaciones</h2>
          <p>
            Arcidrade podrá actualizar estos Términos y Condiciones en cualquier momento.
            Los cambios sustanciales serán notificados a los usuarios registrados. El uso
            continuado de la plataforma tras la publicación de los cambios implica su
            aceptación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a
            través del formulario disponible en la plataforma o enviando un correo a{' '}
            <a
              href="mailto:contacto@arcidrade.com"
              className="text-(--main-arci) underline hover:text-(--soft-arci)"
            >
              contacto@arcidrade.com
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
