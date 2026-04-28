import React, { ReactNode } from "react";

type SectionItem = {
  title: string;
  description: string;
};

type WebAdminSectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  accentClassName: string;
  preview: ReactNode;
  items: SectionItem[];
  extraContent?: ReactNode;
};

export default function WebAdminSectionCard({
  eyebrow,
  title,
  description,
  status,
  accentClassName,
  preview,
  items,
  extraContent,
}: WebAdminSectionCardProps) {
  return (
    <article className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className={`h-2 w-full ${accentClassName}`} />

      <div className='p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-gray-400'>{eyebrow}</p>
            <h2 className='mt-2 font-oswald text-2xl text-(--main-arci)'>{title}</h2>
          </div>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500'>
            {status}
          </span>
        </div>

        <p className='mt-3 text-sm leading-6 text-gray-600'>{description}</p>

        <div className='mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4'>
          {preview}
        </div>

        <div className='mt-5 space-y-3'>
          {items.map((item) => (
            <div key={item.title} className='rounded-2xl border border-gray-100 bg-white p-4'>
              <h3 className='font-semibold text-(--main-arci)'>{item.title}</h3>
              <p className='mt-1 text-sm leading-6 text-gray-600'>{item.description}</p>
            </div>
          ))}
        </div>

        {extraContent && <div className='mt-5'>{extraContent}</div>}
      </div>
    </article>
  );
}