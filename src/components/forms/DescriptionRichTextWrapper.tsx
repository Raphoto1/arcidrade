'use client';

import dynamic from 'next/dynamic';

interface DescriptionRichTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
  required?: boolean;
}

const DescriptionRichText = dynamic(() => import('./DescriptionRichText'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500">
      Cargando editor...
    </div>
  ),
});

export default DescriptionRichText;
