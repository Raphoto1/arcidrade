"use client";
import React, { useRef } from "react";

import BrColors from "../pieces/BrColors";
import Contact from "@/components/home/Contact";
import ModalForFormsMailButton from "@/components/modals/ModalForFormsMailButton";
import ModalForForms from "../modals/ModalForForms";

export default function ServiceDescription(props: {
  title: string;
  mainImage?: string;
  longText?: string;
  ExtraText?: string;
  link?: string;
  contact?: boolean;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const hasAction = props.link || props.contact;

  return (
    <div>
      <BrColors title={props.title} />

      {/* Hero image */}
      <div className='w-full relative h-48 md:h-96 overflow-hidden'>
        <img src={props.mainImage} className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-linear-to-r from-black/60 to-transparent' />
        {props.ExtraText && (
          <h2 className='absolute bottom-6 left-6 md:left-16 md:bottom-10 z-10 text-xl md:text-4xl text-white font-oswald font-bold max-w-[65%] leading-snug drop-shadow-lg'>
            {props.ExtraText}
          </h2>
        )}
      </div>

      {/* Body */}
      <div className={`px-6 md:px-16 py-8 font-roboto-condensed ${hasAction ? 'flex flex-col md:flex-row gap-8 items-center' : ''}`}>
        <div className='flex-1 flex gap-4 items-stretch'>
          <div className='w-1 shrink-0 rounded-full' style={{ backgroundColor: 'var(--main-arci)' }} />
          <p className='text-justify text-lg md:text-xl leading-relaxed text-gray-700'>
            {props.longText}
          </p>
        </div>
        {hasAction && (
          <div className='flex flex-col gap-3 md:w-48 shrink-0 justify-center'>
            {props.link && (
              <a href={props.link} target='_blank' rel='noopener noreferrer' className='btn h-auto py-3 min-w-full text-white text-center' style={{ backgroundColor: 'var(--main-arci)' }}>
                Más Información
              </a>
            )}
            {props.contact && (
              <ModalForForms title='Contáctenos'>
                <Contact defaultSubject='c-ortss' />
              </ModalForForms>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
