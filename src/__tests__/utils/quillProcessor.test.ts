import { describe, it, expect } from 'vitest';
import { processQuillHTML } from '@/utils/quillProcessor';

describe('processQuillHTML', () => {
  it('retorna cadena vacía para null', () => {
    expect(processQuillHTML(null)).toBe('');
  });

  it('retorna cadena vacía para undefined', () => {
    expect(processQuillHTML(undefined)).toBe('');
  });

  it('retorna cadena vacía para cadena vacía', () => {
    expect(processQuillHTML('')).toBe('');
  });

  it('elimina spans vacíos de Quill (ql-ui)', () => {
    const input = '<p><span class="ql-ui" contenteditable="false"></span>Texto</p>';
    const result = processQuillHTML(input);
    expect(result).not.toContain('ql-ui');
    expect(result).toContain('Texto');
  });

  it('convierte lista de bullets a <ul>', () => {
    const input = `<ol><li data-list="bullet">Item 1</li><li data-list="bullet">Item 2</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('</ul>');
    expect(result).not.toContain('<ol>');
  });

  it('convierte lista ordenada a <ol>', () => {
    const input = `<ol><li data-list="ordered">Primero</li><li data-list="ordered">Segundo</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).toContain('<ol>');
    expect(result).toContain('</ol>');
    expect(result).not.toContain('<ul>');
  });

  it('convierte lista mixta: bullets primero luego ordered', () => {
    const input = `<ol><li data-list="bullet">Bullet</li><li data-list="ordered">Ordered</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('<ol>');
    // El ul debe aparecer antes que el ol
    expect(result.indexOf('<ul>')).toBeLessThan(result.indexOf('<ol>'));
  });

  it('convierte lista mixta: ordered primero luego bullets', () => {
    const input = `<ol><li data-list="ordered">Ordered</li><li data-list="bullet">Bullet</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('<ol>');
    // El ol debe aparecer antes que el ul
    expect(result.indexOf('<ol>')).toBeLessThan(result.indexOf('<ul>'));
  });

  it('elimina atributos data-list de los <li>', () => {
    const input = `<ol><li data-list="bullet">Item</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).not.toContain('data-list');
  });

  it('elimina clases ql- de los elementos', () => {
    const input = `<ol><li class="ql-indent-1" data-list="bullet">Item</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).not.toContain('ql-indent');
  });

  it('elimina clases vacías resultantes', () => {
    const input = `<ol><li class="" data-list="bullet">Item</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).not.toContain('class=""');
  });

  it('preserva párrafos normales sin modificar', () => {
    const input = '<p>Párrafo normal sin listas</p>';
    const result = processQuillHTML(input);
    expect(result).toContain('<p>Párrafo normal sin listas</p>');
  });

  it('preserva el contenido de texto de los items', () => {
    const input = `<ol><li data-list="bullet">Contenido importante</li></ol>`;
    const result = processQuillHTML(input);
    expect(result).toContain('Contenido importante');
  });
});
