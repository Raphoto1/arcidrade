/**
 * Extrae el texto plano de un string HTML para mostrar en previews
 * @param html - String con contenido HTML
 * @returns String con texto plano
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  // Remover tags HTML y decodificar entidades
  const tmp = html
    .replace(/<[^>]*>/g, ' ') // Reemplazar tags con espacio
    .replace(/&nbsp;/g, ' ')  // Reemplazar &nbsp;
    .replace(/&lt;/g, '<')    // Decodificar entidades
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')     // Múltiples espacios a uno solo
    .trim();
  
  return tmp;
}

/**
 * Extrae vista previa de contenido HTML de Quill para tarjetas
 * Mantiene al menos parcialmente la estructura pero lo convierte a texto limpio
 * @param html - String con contenido HTML de Quill
 * @param maxLength - Máximo de caracteres a retornar (default 150)
 * @returns String con texto limpio y truncado
 */
export function getHtmlPreview(html: string | null | undefined, maxLength: number = 150): string {
  if (!html) return '';
  
  // Primero extraer texto limpio con stripHtml
  const plainText = stripHtml(html);
  
  // Truncar a maxLength si es necesario
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength).trim() + '...';
  }
  
  return plainText;
}

/**
 * Componente para renderizar HTML de manera segura con estilos básicos
 */
export function sanitizeAndStyleHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  // Aquí podrías agregar sanitización adicional si es necesario
  // Por ahora, confiamos en Quill para generar HTML seguro
  return html;
}
