'use client'
import React from "react";
import { companyInfo } from "@/static/data/staticData";
import { CiLinkedin } from "react-icons/ci";
import ModalForFormsMailButton from "@/components/modals/ModalForFormsMailButton";
import Contact from "@/components/home/Contact";
export default function Footer() {
  return (
    <footer className='footer sm:footer-horizontal bg-[var(--orange-arci)] text-neutral-content items-center p-4 mt-5'>
      <aside className='grid-flow-col items-center'>
        <img src='/logos/LogoWhite.png' className='h-12' alt='Logo Arcidrade Blanco' />
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        
      </aside>
      
      <div className='flex flex-col items-center'>
        <p>{companyInfo.address}</p>
        <p>{companyInfo.phone1}</p>
        <p>{companyInfo.phone2}</p>
        <p>
          Representante:
          {companyInfo.representative}
        </p>
        <div>
        Designed and Developed by{' '}
        <a href='https://www.creativerafa.com' target='_blank' rel='noopener noreferrer' className='underline'>
          Creative Rafa
        </a>
      </div>
      </div>
      <nav className='grid-flow-col gap-4 md:place-self-center md:justify-self-end md:justify-center md:align-center md:items-center'>
        <ModalForFormsMailButton title='Contáctanos'>
          <Contact />
        </ModalForFormsMailButton>
        <a href='https://www.linkedin.com/company/arcidrade-consulting-llc/posts/?feedView=all' target='_blank' rel='noopener noreferrer'>
          <CiLinkedin size={32} />
        </a>
      </nav>
    </footer>
  );
}
