import type { Metadata } from "next";

// Configuración base para SEO
export const siteConfig = {
  name: "Arcidrade",
  description: "Plataforma digital que conecta instituciones sanitarias con profesionales de la salud de manera eficiente y segura",
  url: "https://arcidrade.com",
  ogImage: "/logos/arcidrade-og.png",
  keywords: [
    "profesionales salud",
    "instituciones sanitarias",
    "plataforma médica",
    "conexión sanitaria",
    "profesionales médicos",
    "empleo salud",
    "trabajo sanitario",
    "red profesional salud",
    "oportunidades médicas",
    "talento sanitario"
  ],
  authors: [
    {
      name: "Arcidrade Team",
      url: "https://arcidrade.com"
    }
  ],
  creator: "Arcidrade",
  publisher: "Arcidrade",
};

// Metadata base para toda la aplicación
export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@arcidrade",
    site: "@arcidrade",
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'es-ES': '/es',
      'es': '/',
    },
  },
  category: 'technology',
  classification: 'Healthcare Technology Platform',
  applicationName: 'Arcidrade',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// Función helper para generar metadata específica de página
export function generatePageMetadata(
  title: string,
  description?: string,
  keywords?: string[],
  image?: string,
  path?: string
): Metadata {
  const pageUrl = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const pageImage = image || siteConfig.ogImage;
  const pageDescription = description || siteConfig.description;
  const pageKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords;

  return {
    title,
    description: pageDescription,
    keywords: pageKeywords,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

// Datos estructurados para la organización
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "logo": `${siteConfig.url}/logos/arcidrade-logo.png`,
  "foundingDate": "2024",
  "sameAs": [
    "https://linkedin.com/company/arcidrade",
    "https://twitter.com/arcidrade"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+34-XXX-XXX-XXX",
    "contactType": "customer support",
    "availableLanguage": ["Spanish", "English"]
  }
};

// Datos estructurados para el sitio web
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};