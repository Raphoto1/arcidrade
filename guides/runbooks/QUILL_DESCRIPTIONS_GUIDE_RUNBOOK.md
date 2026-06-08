# Runbook Corto - QUILL_DESCRIPTIONS_GUIDE

Guia extensa: [QUILL_DESCRIPTIONS_GUIDE.md](../QUILL_DESCRIPTIONS_GUIDE.md)

## Objetivo
Asegurar render correcto de descripciones creadas con Quill.

## Pasos rapidos
1. Edita con DescriptionRichText.
2. Procesa HTML con processQuillHTML antes de render.
3. Usa RichTextDisplay para vista completa.
4. Usa RichTextPreview para tarjetas/listas.
5. Verifica listas bullet/ordered en UI.
6. Si falla, inspecciona HTML y clases ql-* remanentes.

## Escalamiento
Si hay regresion de formato, revisar utilidades en src/utils/quillProcessor.ts y tests asociados.
