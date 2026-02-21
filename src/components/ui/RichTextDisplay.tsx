import React from 'react';
import { processQuillHTML } from '@/utils/quillProcessor';

interface RichTextDisplayProps {
  content: string | null | undefined;
  className?: string;
}

/**
 * Componente para mostrar contenido HTML de Quill con formato correcto
 */
export default function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  if (!content) return null;

  const cleanedContent = processQuillHTML(content);

  return (
    <>
      <style jsx global>{`
        .description-content {
          font-family: inherit;
          color: inherit;
        }
        .description-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0;
          color: var(--main-arci);
        }
        .description-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.875rem 0;
          color: var(--main-arci);
        }
        .description-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.75rem 0;
          color: var(--main-arci);
        }
        .description-content p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        .description-content strong {
          font-weight: 700;
        }
        .description-content em {
          font-style: italic;
        }
        .description-content u {
          text-decoration: underline;
        }
        .description-content s {
          text-decoration: line-through;
        }
        .description-content ol {
          list-style: none;
          margin: 0.5rem 0;
          padding: 0;
          counter-reset: item;
        }
        .description-content ol li {
          margin: 0.25rem 0 0.25rem 2rem;
          list-style: none;
        }
        .description-content ol li::before {
          content: counter(item) ". ";
          counter-increment: item;
          font-weight: normal;
          left: -2rem;
          position: relative;
        }
        .description-content ul {
          list-style: none;
          margin: 0.5rem 0;
          padding: 0;
        }
        .description-content ul li {
          margin: 0.25rem 0 0.25rem 2rem;
          list-style: none;
        }
        .description-content ul li::before {
          content: "• ";
          left: -2rem;
          position: relative;
          font-weight: bold;
        }
        .description-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .description-content a:hover {
          color: #1d4ed8;
        }
        .description-content .ql-align-center {
          text-align: center;
        }
        .description-content .ql-align-right {
          text-align: right;
        }
        .description-content .ql-align-justify {
          text-align: justify;
        }
        .description-content blockquote {
          border-left: 4px solid var(--main-arci);
          padding-left: 1rem;
          margin: 1rem 0;
          color: #666;
          font-style: italic;
        }
        .description-content code {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .description-content pre {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .description-content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }
        .description-content img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }
        .description-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1rem 0;
        }
      `}</style>
      <div 
        className={`description-content ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />
    </>
  );
}
