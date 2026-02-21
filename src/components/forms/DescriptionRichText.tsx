'use client';

import { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

interface DescriptionRichTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
  required?: boolean;
}

export default function DescriptionRichText({
  value,
  onChange,
  placeholder = 'Escribe la descripción aquí...',
  label = 'Descripción',
  minHeight = '150px',
  required = false
}: DescriptionRichTextProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHeight, setCurrentHeight] = useState(minHeight);

  useEffect(() => {
    // Evitar inicialización en server
    if (typeof window === 'undefined') return;

    const initQuill = async () => {
      // Verificar que no se haya inicializado ya
      if (quillRef.current || !editorRef.current) return;

      try {
        const { default: Quill } = await import('quill');

        // Crear un nuevo contenedor limpio para Quill
        const container = document.createElement('div');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
          editorRef.current.appendChild(container);
        }

        // Inicializar Quill
        quillRef.current = new Quill(container, {
          theme: 'snow',
          placeholder,
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['link'],
              ['clean']
            ]
          }
        });

        // Establecer contenido inicial
        if (value) {
          quillRef.current.root.innerHTML = value;
        }

        // Escuchar cambios
        quillRef.current.on('text-change', () => {
          if (!isUpdatingRef.current && quillRef.current) {
            const html = quillRef.current.root.innerHTML;
            const isEmpty = html === '<p><br></p>' || html === '' || html === '<p></p>';
            onChange(isEmpty ? '' : html);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Quill:', error);
        setIsLoading(false);
      }
    };

    initQuill();

    // Cleanup
    return () => {
      if (quillRef.current) {
        try {
          quillRef.current.off('text-change');
          quillRef.current = null;
        } catch (error) {
          console.error('Error cleaning up Quill:', error);
        }
      }
      
      // Limpiar el contenedor
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    };
  }, []);

  // Actualizar contenido si cambia externamente
  useEffect(() => {
    if (quillRef.current) {
      const currentHTML = quillRef.current.root.innerHTML;
      const currentIsEmpty = currentHTML === '<p><br></p>' || currentHTML === '' || currentHTML === '<p></p>';
      const newIsEmpty = !value || value === '';
      
      // Solo actualizar si hay un cambio real
      if (!currentIsEmpty && newIsEmpty) {
        // Limpiar el editor
        isUpdatingRef.current = true;
        quillRef.current.setText('');
        isUpdatingRef.current = false;
      } else if (value && value !== currentHTML) {
        // Actualizar con nuevo contenido
        isUpdatingRef.current = true;
        quillRef.current.root.innerHTML = value;
        isUpdatingRef.current = false;
      }
    }
  }, [value]);

  const increaseHeight = () => {
    const currentHeightPx = parseInt(currentHeight);
    const newHeight = currentHeightPx + 50;
    setCurrentHeight(`${newHeight}px`);
  };

  const decreaseHeight = () => {
    const currentHeightPx = parseInt(currentHeight);
    if (currentHeightPx > 150) {
      const newHeight = Math.max(150, currentHeightPx - 50);
      setCurrentHeight(`${newHeight}px`);
    }
  };

  return (
    <div className="description-rich-text w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="block font-semibold mb-1 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={decreaseHeight}
            className="btn btn-xs btn-outline"
            title="Reducir tamaño"
          >
            ↓ Reducir
          </button>
          <button
            type="button"
            onClick={increaseHeight}
            className="btn btn-xs btn-outline"
            title="Aumentar tamaño"
          >
            ↑ Ampliar
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="w-full h-[200px] bg-gray-100 rounded-md animate-pulse" />
      )}
      <div 
        ref={editorRef} 
        style={{ minHeight: currentHeight, display: isLoading ? 'none' : 'block' }}
        className="w-full rounded-md resize-y overflow-auto"
      />
      <style jsx global>{`
        .description-rich-text .ql-toolbar {
          border: 1px solid #e5e7eb !important;
          border-radius: 0.375rem 0.375rem 0 0 !important;
          background-color: #f9fafb !important;
          padding: 8px !important;
        }

        .description-rich-text .ql-container {
          border: 1px solid #e5e7eb !important;
          border-top: none !important;
          border-radius: 0 0 0.375rem 0.375rem !important;
          font-family: inherit !important;
          background-color: #ffffff !important;
        }

        .description-rich-text .ql-editor {
          min-height: ${minHeight} !important;
          padding: 12px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          background-color: #ffffff !important;
        }

        .description-rich-text .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
          left: 12px !important;
        }

        .description-rich-text .ql-snow .ql-fill,
        .description-rich-text .ql-snow .ql-stroke.ql-fill {
          fill: var(--main-arci, #0066cc) !important;
        }

        .description-rich-text .ql-snow.ql-toolbar button:hover,
        .description-rich-text .ql-snow .ql-toolbar button:hover,
        .description-rich-text .ql-snow.ql-toolbar button.ql-active,
        .description-rich-text .ql-snow .ql-toolbar button.ql-active,
        .description-rich-text .ql-snow.ql-toolbar .ql-picker-label:hover,
        .description-rich-text .ql-snow .ql-toolbar .ql-picker-label:hover,
        .description-rich-text .ql-snow.ql-toolbar .ql-picker-item:hover,
        .description-rich-text .ql-snow .ql-toolbar .ql-picker-item:hover,
        .description-rich-text .ql-snow.ql-toolbar .ql-picker-label.ql-active,
        .description-rich-text .ql-snow .ql-toolbar .ql-picker-label.ql-active,
        .description-rich-text .ql-snow.ql-toolbar .ql-picker-item.ql-selected {
          color: var(--main-arci, #0066cc) !important;
        }

        /* Estilos de listas */
        .description-rich-text .ql-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
        }

        .description-rich-text .ql-editor ol li {
          list-style-type: decimal !important;
        }

        .description-rich-text .ql-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
        }

        .description-rich-text .ql-editor ul li {
          list-style-type: disc !important;
        }

        /* Headers */
        .description-rich-text .ql-editor h1 {
          font-size: 2em !important;
          margin: 0.67em 0 !important;
        }

        .description-rich-text .ql-editor h2 {
          font-size: 1.5em !important;
          margin: 0.75em 0 !important;
        }

        .description-rich-text .ql-editor h3 {
          font-size: 1.17em !important;
          margin: 0.83em 0 !important;
        }

        /* Párrafos */
        .description-rich-text .ql-editor p {
          margin: 0.5em 0 !important;
        }

        /* Emphasis */
        .description-rich-text .ql-editor strong {
          font-weight: bold !important;
        }

        .description-rich-text .ql-editor em {
          font-style: italic !important;
        }

        .description-rich-text .ql-editor u {
          text-decoration: underline !important;
        }

        .description-rich-text .ql-editor s {
          text-decoration: line-through !important;
        }

        /* Permitir redimensionamiento vertical */
        .description-rich-text {
          resize: vertical;
          overflow: hidden;
        }

        .description-rich-text [style*="minHeight"] {
          resize: vertical;
          overflow: auto;
          display: flex;
          flex-direction: column;
        }

        /* Mejora visual del resize handle */
        .description-rich-text:hover {
          border-color: var(--main-arci, #0066cc) !important;
        }
      `}</style>
    </div>
  );
}

