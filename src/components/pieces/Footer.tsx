'use client'
import React from "react";
import { companyInfo } from "@/static/data/staticData";
import { CiLinkedin } from "react-icons/ci";
import ModalForFormsMailButton from "@/components/modals/ModalForFormsMailButton";
import Contact from "@/components/home/Contact";

export default function Footer() {
  return (
    <footer className='bg-(--orange-arci) text-neutral-content p-6 md:p-8 mt-5'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
        {/* Left - Logo and Copyright */}
        <div className='flex flex-col items-center md:items-start gap-2'>
          <img src='/logos/LogoWhite.png' className='h-12' alt='Logo Arcidrade Blanco' />
          <p className='text-sm'>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </div>

        {/* Center - Contact Info */}
        <div className='flex flex-col items-center gap-1'>
          <p className='text-sm'>{companyInfo.address}</p>
          <p className='text-sm'>{companyInfo.phone1}</p>
          <p className='text-sm'>{companyInfo.phone2}</p>
          <p className='text-sm'>Representante: {companyInfo.representative}</p>
        </div>

        {/* Right - Buttons and Credit */}
        <div className='flex flex-col items-center gap-3 h-36 md:h-auto'>
          <div className='flex gap-4 justify-center items-center'>
            <ModalForFormsMailButton title='Contáctanos'>
              <Contact />
            </ModalForFormsMailButton>
            <a href='https://www.linkedin.com/company/arcidrade-consulting-llc/posts/?feedView=all' target='_blank' rel='noopener noreferrer'>
              <CiLinkedin size={32} />
            </a>
          </div>
          <div className='text-xs text-center'>
            Designed and Developed by{' '}
            <a href='https://www.creativerafa.com' target='_blank' rel='noopener noreferrer' className='underline'>
              Creative Rafa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
