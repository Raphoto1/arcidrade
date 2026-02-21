# Guía: Manejo de Descripciones con Quill Rich Text Editor

## Descripción General

Este proyecto utiliza **Quill 2.x** como editor de texto enriquecido para las descripciones de procesos. Se implementó un sistema de procesamiento personalizado para convertir el HTML generado por Quill a un formato estándar que se renderiza correctamente en toda la aplicación.

## Problema Original

Quill genera HTML con características específicas que causaban conflictos al renderizar:

### Estructura de Listas en Quill
Quill utiliza un único elemento `<ol>` (ordered list) para **todas** las listas (bullets y numeradas), diferenciándolas mediante el atributo `data-list`:

```html
<ol>
  <li data-list="bullet"><span class="ql-ui"></span>Item 1</li>
  <li data-list="bullet"><span class="ql-ui"></span>Item 2</li>
  <li data-list="ordered"><span class="ql-ui"></span>Item numerado 1</li>
  <li data-list="ordered"><span class="ql-ui"></span>Item numerado 2</li>
</ol>
```

**Consecuencias:**
- Todas las listas se renderizaban como numeradas (1, 2, 3...)
- Las viñetas no aparecían correctamente
- Clases CSS de Quill (`ql-*`) interferían con los estilos personalizados

## Solución Implementada

### 1. Función de Procesamiento: `quillProcessor.ts`

**Ubicación:** `src/utils/quillProcessor.ts`

Esta función convierte el HTML malformado de Quill a HTML estándar:

```typescript
import DOMPurify from 'isomorphic-dompurify';

export function processQuillHTML(html: string | null | undefined): string
```

**Características:**
- ✅ Remueve spans vacíos de Quill (`<span class="ql-ui">`)
- ✅ Detecta listas bullets vs. ordered
- ✅ Convierte listas bullet a `<ul>`
- ✅ Mantiene listas ordered como `<ol>`
- ✅ Separa listas bullet de ordered en sus propios contenedores
- ✅ Remueve atributos `data-list` y clases `ql-*`
- ✅ Limpia espacios en blanco extra

**Ejemplo de conversión:**

**Entrada (Quill):**
```html
<p><strong>test conn rich text</strong></p>
<ol>
  <li data-list="bullet"><span class="ql-ui"></span>uno</li>
  <li data-list="bullet"><span class="ql-ui"></span>dos</li>
  <li data-list="ordered"><span class="ql-ui"></span>test</li>
  <li data-list="ordered"><span class="ql-ui"></span>test2</li>
</ol>
```

**Salida (procesada):**
```html
<p><strong>test conn rich text</strong></p>
<ul>
  <li>uno</li>
  <li>dos</li>
</ul>
<ol>
  <li>test</li>
  <li>test2</li>
</ol>
```

### 2. Componentes de Display

#### RichTextDisplay
**Ubicación:** `src/components/ui/RichTextDisplay.tsx`

Componente para mostrar descripciones en vista completa (modales, páginas de detalle).

```tsx
import RichTextDisplay from '@/components/ui/RichTextDisplay';

<RichTextDisplay 
  content={processPack.description} 
  className='text-sm text-gray-700'
/>
```

**Características:**
- Renderiza HTML con estilos completos
- Soporta headings (h1-h6), párrafos, listas, blockquotes, código
- Pseudo-elementos CSS generan viñetas (•) y números automáticamente
- Responde a la cascada de estilos del contenedor padre

**Estilos aplicados:**
```css
.description-content ul li::before {
  content: "• ";
}

.description-content ol li::before {
  content: counter(item) ". ";
  counter-increment: item;
}
```

#### RichTextPreview
**Ubicación:** `src/components/ui/RichTextPreview.tsx`

Componente para mostrar descripciones truncadas en tarjetas.

```tsx
import RichTextPreview from '@/components/ui/RichTextPreview';

<RichTextPreview 
  content={processPack.description} 
  maxHeight='80px'
  className='text-sm line-clamp-2'
/>
```

**Props:**
- `content: string` - HTML procesado del Quill
- `maxHeight?: string` - Alto máximo antes de truncar (default: '80px')
- `className?: string` - Clases CSS adicionales

**Casos de uso:**
- Tarjetas de procesos (InstitutionProcessCard)
- Listados públicos (ProcessesGridSearchPublic)
- Vistas previas en listados

### 3. Editor: DescriptionRichText

**Ubicación:** `src/components/forms/DescriptionRichText.tsx`

Componente para editar descripciones con Quill.

```tsx
import DescriptionRichText from '@/components/forms/DescriptionRichText';

<DescriptionRichText 
  value={description}
  onChange={setDescription}
  label="Descripción del Proceso"
/>
```

**Cambios importantes:**
- Usa `quill.core.css` en lugar de `quill.snow.css` para evitar conflictos
- Estilos CSS personalizados para la barra de herramientas
- Maneja diálogos de lista diferenciando bullets vs. numeradas

## Flujo Completo

```
Usuario edita → Quill genera HTML → Se guarda en BD
                 (con data-list, clases ql-*)
                         ↓
Lectura de BD → processQuillHTML() → HTML limpio
                         ↓
RichTextDisplay/Preview → Pseudo-elementos CSS → Viñetas/Números
```

## Dependencias

```json
{
  "quill": "^2.x",
  "isomorphic-dompurify": "^latest"
}
```

Instalar con:
```bash
npm install quill isomorphic-dompurify
```

**Nota:** `isomorphic-dompurify` funciona tanto en servidor como en cliente (compatible con Next.js SSR).

## Implementación en Componentes Existentes

### Proceso
**Archivo:** `src/components/pieces/InstitutionProcessCard.tsx`

```tsx
<RichTextPreview 
  content={processPack.description} 
  maxHeight='80px'
  className='text-sm line-clamp-3'
/>
```

### Modal de Detalle
**Archivo:** `src/components/platform/pieces/UserDescription.tsx`

```tsx
<RichTextDisplay 
  content={props.description} 
  className='text-sm text-gray-700'
/>
```

## Formato Soportado en Quill

El editor soporta:

| Formato | HTML | Viñeta |
|---------|------|--------|
| **Texto en negrita** | `<strong>` | ✅ |
| *Texto en cursiva* | `<em>` | ✅ |
| <u>Texto subrayado</u> | `<u>` | ✅ |
| ~~Texto tachado~~ | `<s>` | ✅ |
| Headings (H1-H6) | `<h1>` a `<h6>` | ✅ |
| Listas sin numerar | `<ul><li>` | ✅ Viñetas |
| Listas numeradas | `<ol><li>` | ✅ Números |
| Links | `<a href="">` | ✅ |
| Blockquotes | `<blockquote>` | ✅ |
| Alineación (centro, derecha, justificado) | Clases `ql-align-*` | ✅ |

## Extensión: Agregar más formatos

Para soportar nuevos formatos (código, tablas, imágenes):

### 1. Configurar en DescriptionRichText
```typescript
modules: {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    // Agregar aquí nuevos módulos
    ['image'],  // Para imágenes
    ['code-block']  // Para bloques de código
  ]
}
```

### 2. Actualizar processQuillHTML (si es necesario)
Si el nuevo formato genera atributos especiales, agregar procesamiento:
```typescript
// Ejemplo para imágenes
result = result.replace(/<img[^>]*class="ql-[^"]*"/g, '<img');
```

### 3. Agregar estilos CSS en RichTextDisplay
```typescript
.description-content img {
  max-width: 100%;
  border-radius: 0.375rem;
  margin: 1rem 0;
}
```

## Troubleshooting

### Las viñetas no aparecen
**Causa:** El HTML aún contiene `data-list="bullet"` o clases `ql-*`
**Solución:** Verificar que `processQuillHTML()` se está llamando en ambos componentes

### Los números de listas están mal
**Causa:** El contador CSS no se reinicia
**Solución:** Asegurar que `counter-reset: item` está en el CSS de `<ol>`

### El contenido se ve con estilos incorrectos en cards
**Causa:** Las clases CSS truncan el contenido
**Solución:** Usar `RichTextPreview` que respeta el contenedor y `maxHeight`

## Referencias

- [Quill Documentation](https://quilljs.com/docs/quickstart)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [CSS Counters (MDN)](https://developer.mozilla.org/es/docs/Web/CSS/counter)
- [Pseudo-elementos ::before (MDN)](https://developer.mozilla.org/es/docs/Web/CSS/::before)

## Cambios Realizados (Historial)

| Fecha | Cambio | Archivo |
|-------|--------|---------|
| 2026-02-20 | Implementación sistema Quill con procesamiento HTML | `quillProcessor.ts`, `RichTextDisplay.tsx`, `RichTextPreview.tsx` |
| 2026-02-20 | Integración en tarjetas de procesos | `InstitutionProcessCard.tsx`, `InstitutionProcessCardPublic.tsx` |
| 2026-02-20 | Cambio de `quill.snow.css` a `quill.core.css` | `DescriptionRichText.tsx` |

