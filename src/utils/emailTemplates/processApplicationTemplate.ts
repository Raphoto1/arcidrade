type ProcessApplicationTemplateParams = {
  greeting?: string;
};

export function getProcessApplicationTemplate({ greeting }: ProcessApplicationTemplateParams = {}) {
  const safeGreeting = greeting || "Hola";

  return `
  <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
    <div style="text-align: center; margin-bottom: 16px;">
      <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" style="max-width: 200px; width: 100%; height: auto;" />
    </div>
    <h2 style="color: #0f4c81;">${safeGreeting}</h2>
    <p>Tu aplicacion fue recibida con exito.</p>
    <p>Te informaremos cuando seas incluido en la lista final de profesionales del proceso.</p>
    <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
      <h3 style="margin: 0 0 12px; color: #0f4c81;">Mejora tus posibilidades</h3>
      <p style="margin: 0;">Te recomendamos completar y actualizar tu perfil con mas informacion (experiencia, estudios, certificaciones y logros). Esto ayuda a que las instituciones tomen mejores decisiones.</p>
    </div>
    <p style="margin-top: 24px;">Si tienes alguna duda, puedes escribirnos a <a href="mailto:contacto@arcidrade.com">contacto@arcidrade.com</a>.</p>
    <p style="margin-top: 16px;">Equipo ARCIDRADE</p>
  </div>
  `;
}
