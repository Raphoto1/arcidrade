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
    <div className="w-full">
      <div className="block font-semibold mb-1 text-sm">Descripción del Cargo</div>
      <div className="w-full h-50 bg-gray-100 rounded-md animate-pulse" />
    </div>
  ),
});

export default DescriptionRichText;
