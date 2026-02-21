import React from 'react';
import { processQuillHTML } from '@/utils/quillProcessor';

/**
 * Componente para mostrar una vista previa de contenido HTML de Quill
 * Muestra el contenido con estilos básicos pero truncado para tarjetas
 * @param content - Contenido HTML de Quill
 * @param className - Clases CSS adicionales
 * @param maxHeight - Altura máxima antes de truncar (default 80px)
 */
export default function RichTextPreview({ 
  content, 
  className = '',
  maxHeight = '80px'
}: { 
  content?: string; 
  className?: string;
  maxHeight?: string;
}) {
  if (!content) {
    return <p className={`text-gray-500 ${className}`}>Sin descripción</p>;
  }

  const cleanedContent = processQuillHTML(content);

  return (
    <>
      <style jsx global>{`
        .preview-content {
          font-family: inherit;
          color: inherit;
        }
        .preview-content h1 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .preview-content h2 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0.4rem 0;
        }
        .preview-content h3 {
          font-size: 1rem;
          font-weight: bold;
          margin: 0.3rem 0;
        }
        .preview-content p {
          margin: 0.25rem 0;
          line-height: 1.4;
        }
        .preview-content strong {
          font-weight: bold;
        }
        .preview-content em {
          font-style: italic;
        }
        .preview-content u {
          text-decoration: underline;
        }
        .preview-content s {
          text-decoration: line-through;
        }
        .preview-content ol {
          list-style: none;
          margin: 0.25rem 0;
          padding: 0;
          counter-reset: item;
        }
        .preview-content ol li {
          margin-left: 1.5rem;
          margin: 0.1rem 0 0.1rem 1.5rem;
          list-style: none;
        }
        .preview-content ol li::before {
          content: counter(item) ". ";
          counter-increment: item;
          font-weight: normal;
          left: -1.5rem;
          position: relative;
        }
        .preview-content ul {
          list-style: none;
          margin: 0.25rem 0;
          padding: 0;
        }
        .preview-content ul li {
          margin-left: 1.5rem;
          margin: 0.1rem 0 0.1rem 1.5rem;
          list-style: none;
        }
        .preview-content ul li::before {
          content: "• ";
          left: -1.5rem;
          position: relative;
          font-weight: bold;
        }
        .preview-content a {
          color: var(--main-arci, #1f2937);
          text-decoration: underline;
          cursor: pointer;
        }
        .preview-content a:hover {
          opacity: 0.8;
        }
        .preview-content .ql-align-center {
          text-align: center;
        }
        .preview-content .ql-align-right {
          text-align: right;
        }
        .preview-content .ql-align-justify {
          text-align: justify;
        }
        .preview-content blockquote {
          border-left: 4px solid var(--main-arci, #1f2937);
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #666;
        }
      `}</style>
      <div
        className={`preview-content overflow-hidden ${className}`}
        style={{ maxHeight }}
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />
    </>
  );
}
