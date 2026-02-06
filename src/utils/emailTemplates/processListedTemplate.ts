type ProcessListedTemplateParams = {
  greeting?: string;
};

export function getProcessListedTemplate({ greeting }: ProcessListedTemplateParams = {}) {
  const safeGreeting = greeting || "Hola";

  return `
  <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
    <div style="text-align: center; margin-bottom: 16px;">
      <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" style="max-width: 200px; width: 100%; height: auto;" />
    </div>
    <h2 style="color: #0f4c81;">${safeGreeting}</h2>
    <p>Te informamos que fuiste incluido en un proceso de seleccion dentro de ARCIDRADE.</p>
    <p>Esto incrementa tus posibilidades de ser seleccionado. Te recomendamos estar pendiente de tu correo.</p>
    <p style="margin-top: 8px;">El tiempo promedio de respuesta definitiva puede variar entre 2 a 4 semanas.</p>
    <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
      <h3 style="margin: 0 0 12px; color: #0f4c81;">Que sigue ahora...</h3>
      <ol style="margin: 0; padding-left: 18px; line-height: 1.6;">
        <li>📌 Instituciones y ARCIDRADE revisaran tu perfil y experiencia.</li>
        <li>📧 Podrian contactarte por correo para solicitar informacion adicional.</li>
        <li>📲 Mantente atento a tu bandeja de entrada y responde a tiempo.</li>
      </ol>
    </div>
    <p style="margin-top: 24px;">Gracias por confiar en ARCIDRADE. Si conoces colegas que puedan beneficiarse, cuentales sobre nosotros y siguenos en <a href="https://www.linkedin.com/company/arcidrade-consulting-llc/?viewAsMember=true" target="_blank" rel="noreferrer">LinkedIn</a>.</p>
    <p style="margin-top: 24px;">Si tienes alguna duda, puedes escribirnos a <a href="mailto:contacto@arcidrade.com">contacto@arcidrade.com</a>.</p>
    <p style="margin-top: 16px;">Equipo ARCIDRADE</p>
  </div>
  `;
}
