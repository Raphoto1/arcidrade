"use client";

import React from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io";
import { siteConfig } from "@/config/metadata";

interface ShareArticleButtonsProps {
  slug: string;
  title: string;
}

export default function ShareArticleButtons({ slug, title }: ShareArticleButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const [baseUrl, setBaseUrl] = React.useState(siteConfig.url);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const normalizedPath = slug.startsWith("/")
    ? slug
    : slug.includes("/")
      ? `/${slug}`
      : `/news/${slug}`;
  const articleUrl = `${baseUrl}${normalizedPath}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("No se pudo copiar el enlace:", error);
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <button type='button' className='btn btn-sm bg-(--main-arci) text-white border-none hover:bg-(--soft-arci)' onClick={handleCopyLink}>
        <FiCopy className='text-sm' />
        {copied ? "Copiado" : "Copiar link"}
      </button>
      <a
        href={socialLinks.whatsapp}
        target='_blank'
        rel='noreferrer'
        className='btn btn-sm bg-green-600 text-white border-none hover:bg-green-700'
        aria-label='Compartir en WhatsApp'
      >
        <IoLogoWhatsapp className='text-base' />
        WhatsApp
      </a>
      <a
        href={socialLinks.twitter}
        target='_blank'
        rel='noreferrer'
        className='btn btn-sm bg-black text-white border-none hover:opacity-90'
        aria-label='Compartir en X'
      >
        <FaXTwitter className='text-base' />
        X
      </a>
      <a
        href={socialLinks.linkedIn}
        target='_blank'
        rel='noreferrer'
        className='btn btn-sm bg-blue-700 text-white border-none hover:bg-blue-800'
        aria-label='Compartir en LinkedIn'
      >
        <FaLinkedinIn className='text-base' />
        LinkedIn
      </a>
    </div>
  );
}
