import React from "react";

interface ProcessAccordionHeaderProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
}

export default function ProcessAccordionHeader({
  title,
  count,
  isExpanded,
  onToggle,
  action,
}: ProcessAccordionHeaderProps) {
  const chevron = (
    <svg
      className={`w-5 h-5 fill-current transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-90" : ""}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
    >
      <path d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' />
    </svg>
  );

  return (
    <div
      className={`flex flex-col items-center md:flex-row md:items-center bg-gray-300 p-2 cursor-pointer hover:bg-gray-400 transition-colors ${isExpanded ? "rounded-t-md" : "rounded-md"}`}
      onClick={onToggle}
    >
      {/* Left chevron — desktop only */}
      <span className='hidden md:flex items-center'>{chevron}</span>

      {/* Title — centered on both mobile and desktop */}
      <div className='flex items-center justify-center gap-2 w-full md:flex-1'>
        {/* Chevron — mobile only */}
        <span className='md:hidden'>{chevron}</span>
        <h2 className='text-2xl fontArci text-center'>
          {title} ({count})
        </h2>
      </div>

      {/* Right side: action + right chevron (desktop) */}
      <div className='mt-2 flex items-center justify-center gap-2 w-full md:mt-0 md:w-auto md:justify-end' onClick={(e) => e.stopPropagation()}>
        {action}
        <span className='hidden md:flex items-center -scale-x-100' onClick={onToggle}>{chevron}</span>
      </div>
    </div>
  );
}
