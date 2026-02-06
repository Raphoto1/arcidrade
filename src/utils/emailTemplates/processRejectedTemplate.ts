type ProcessRejectedTemplateParams = {
  greeting?: string;
};

export function getProcessRejectedTemplate({ greeting }: ProcessRejectedTemplateParams = {}) {
  const safeGreeting = greeting || "Hola";

  return `
  <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
    <div style="text-align: center; margin-bottom: 16px;">
      <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" style="max-width: 200px; width: 100%; height: auto;" />
    </div>
    <h2 style="color: #0f4c81;">${safeGreeting}</h2>
    <p>Gracias por aplicar. En esta ocasion, tu solicitud no avanzo en el proceso.</p>
    <p>Te invitamos a estar atento a nuevas ofertas, donde tu perfil puede ser una excelente opcion.</p>
    <p style="margin-top: 24px;">Si tienes alguna duda, puedes escribirnos a <a href="mailto:contacto@arcidrade.com">contacto@arcidrade.com</a>.</p>
    <p style="margin-top: 16px;">Equipo ARCIDRADE</p>
  </div>
  `;
}
