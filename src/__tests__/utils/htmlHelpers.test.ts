import { describe, it, expect } from 'vitest';
import { stripHtml, getHtmlPreview, sanitizeAndStyleHtml } from '@/utils/htmlHelpers';

describe('stripHtml', () => {
  it('retorna cadena vacía para null', () => {
    expect(stripHtml(null)).toBe('');
  });

  it('retorna cadena vacía para undefined', () => {
    expect(stripHtml(undefined)).toBe('');
  });

  it('retorna cadena vacía para cadena vacía', () => {
    expect(stripHtml('')).toBe('');
  });

  it('elimina tags HTML simples', () => {
    expect(stripHtml('<p>Hola mundo</p>')).toBe('Hola mundo');
  });

  it('elimina múltiples tags anidados', () => {
    expect(stripHtml('<div><p><strong>Texto</strong> normal</p></div>')).toBe('Texto normal');
  });

  it('decodifica entidad &nbsp;', () => {
    const result = stripHtml('<p>Hola&nbsp;mundo</p>');
    expect(result).toBe('Hola mundo');
  });

  it('decodifica entidad &lt;', () => {
    expect(stripHtml('código: &lt;script&gt;')).toBe('código: <script>');
  });

  it('decodifica entidad &amp;', () => {
    expect(stripHtml('ley &amp; orden')).toBe('ley & orden');
  });

  it('decodifica entidad &quot;', () => {
    expect(stripHtml('dice &quot;hola&quot;')).toBe('dice "hola"');
  });

  it('decodifica entidad &#39;', () => {
    expect(stripHtml("it&#39;s fine")).toBe("it's fine");
  });

  it('colapsa múltiples espacios en uno', () => {
    expect(stripHtml('<p>texto   con   espacios</p>')).toBe('texto con espacios');
  });

  it('elimina espacios al inicio y al final', () => {
    expect(stripHtml('  <p>  texto  </p>  ')).toBe('texto');
  });

  it('procesa texto sin tags sin modificarlo', () => {
    expect(stripHtml('solo texto plano')).toBe('solo texto plano');
  });
});

describe('getHtmlPreview', () => {
  it('retorna cadena vacía para null', () => {
    expect(getHtmlPreview(null)).toBe('');
  });

  it('retorna cadena vacía para undefined', () => {
    expect(getHtmlPreview(undefined)).toBe('');
  });

  it('retorna texto completo si es menor al límite por defecto (150)', () => {
    const html = '<p>Texto corto</p>';
    expect(getHtmlPreview(html)).toBe('Texto corto');
  });

  it('trunca texto largo al límite por defecto y agrega "..."', () => {
    const longText = 'a'.repeat(200);
    const html = `<p>${longText}</p>`;
    const result = getHtmlPreview(html);
    expect(result).toHaveLength(153); // 150 chars + "..."
    expect(result.endsWith('...')).toBe(true);
  });

  it('respeta un límite personalizado', () => {
    const html = '<p>Este texto tiene más de veinte caracteres en total</p>';
    const result = getHtmlPreview(html, 20);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(23); // 20 + "..."
  });

  it('no trunca si el texto tiene exactamente el límite', () => {
    const text = 'a'.repeat(150);
    const result = getHtmlPreview(`<p>${text}</p>`, 150);
    expect(result).toBe(text);
    expect(result.endsWith('...')).toBe(false);
  });
});

describe('sanitizeAndStyleHtml', () => {
  it('retorna cadena vacía para null', () => {
    expect(sanitizeAndStyleHtml(null)).toBe('');
  });

  it('retorna cadena vacía para undefined', () => {
    expect(sanitizeAndStyleHtml(undefined)).toBe('');
  });

  it('retorna el HTML intacto para entradas válidas', () => {
    const html = '<p>Contenido <strong>importante</strong></p>';
    expect(sanitizeAndStyleHtml(html)).toBe(html);
  });

  it('retorna cadena vacía para cadena vacía', () => {
    expect(sanitizeAndStyleHtml('')).toBe('');
  });
});
