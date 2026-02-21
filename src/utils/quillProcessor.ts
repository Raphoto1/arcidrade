import DOMPurify from 'isomorphic-dompurify';

/**
 * Procesa el HTML de Quill para convertir sus listas malformadas
 * a HTML estándar (ul/ol)
 */
export function processQuillHTML(html: string | null | undefined): string {
  if (!html) return '';

  let result = html;

  // 1. Remover los spans vacíos de Quill
  result = result.replace(/<span class="ql-ui"[^>]*><\/span>/g, '');

  // 2. Convertir el <ol> que contiene mezcla de bullet y ordered
  result = result.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_match, content) => {
    // Dividir por tipo de lista
    // Buscar el primer cambio de bullet a ordered
    const bulletPattern = /<li[^>]*data-list="bullet"[^>]*>/g;
    const orderedPattern = /<li[^>]*data-list="ordered"[^>]*>/g;
    
    const firstBullet = content.search(bulletPattern);
    const firstOrdered = content.search(orderedPattern);
    
    let output = '';
    
    // Caso 1: Solo bullets
    if (firstBullet >= 0 && firstOrdered < 0) {
      output = '<ul>' + 
        content
          .replace(/<li[^>]*data-list="bullet"[^>]*>/g, '<li>')
          .replace(/\s+data-list="[^"]*"/g, '')
          .replace(/\s+class="ql-[^"]*"/g, '') +
        '</ul>';
    }
    // Caso 2: Solo ordered
    else if (firstOrdered >= 0 && firstBullet < 0) {
      output = '<ol>' + 
        content
          .replace(/<li[^>]*data-list="ordered"[^>]*>/g, '<li>')
          .replace(/\s+data-list="[^"]*"/g, '')
          .replace(/\s+class="ql-[^"]*"/g, '') +
        '</ol>';
    }
    // Caso 3: Mezcla de ambos
    else if (firstBullet >= 0 && firstOrdered >= 0) {
      const beforeOrdered = firstOrdered > firstBullet;
      
      if (beforeOrdered) {
        // Bullets primero, luego ordered
        const bulletContent = content.substring(0, firstOrdered)
          .replace(/<li[^>]*data-list="bullet"[^>]*>/g, '<li>')
          .replace(/\s+data-list="[^"]*"/g, '')
          .replace(/\s+class="ql-[^"]*"/g, '');
        
        const orderedContent = content.substring(firstOrdered)
          .replace(/<li[^>]*data-list="ordered"[^>]*>/g, '<li>')
          .replace(/\s+data-list="[^"]*"/g, '')
          .replace(/\s+class="ql-[^"]*"/g, '');
        
        output = '<ul>' + bulletContent + '</ul><ol>' + orderedContent + '</ol>';
      } else {
        // Ordered primero, luego bullets
        const orderedContent = content.substring(0, firstBullet)
          .replace(/<li[^>]*data-list="ordered"[^>]*>/g, '<li>')
          .replace(/\s+data-list="[^"]*"/g, '')
          .replace(/\s+class="ql-[^"]*"/g, '');
        
        const bulletContent = content.substring(firstBullet)
          .replace(/<li[^>]*data-list="bullet"[^>]*>/g, '<li>')
          .replace(/\s+data-list="[^"]*"/g, '')
          .replace(/\s+class="ql-[^"]*"/g, '');
        
        output = '<ol>' + orderedContent + '</ol><ul>' + bulletContent + '</ul>';
      }
    }
    
    return output;
  });

  // 3. Remover clases vacías
  result = result.replace(/\s+class=""/g, '');
  
  // 4. Limpiar espacios extra
  result = result.replace(/>\s+</g, '><');

  return result;
}

