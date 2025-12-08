export default function HomeStructuredData() {
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://arcidrade.com/#webpage",
    "url": "https://arcidrade.com/",
    "name": "Arcidrade - Conecta Talento Sanitario con Instituciones de Salud",
    "description": "Plataforma líder que conecta profesionales de la salud con instituciones sanitarias. Encuentra oportunidades laborales en el sector sanitario o descubre el mejor talento médico.",
    "isPartOf": {
      "@id": "https://arcidrade.com/#website"
    },
    "about": {
      "@type": "Thing",
      "name": "Healthcare Professional Network",
      "description": "Connecting healthcare professionals with medical institutions"
    },
    "mainEntity": {
      "@type": "Service",
      "@id": "https://arcidrade.com/#service",
      "name": "Healthcare Professional Matching Platform",
      "description": "Digital platform connecting healthcare professionals with medical institutions",
      "provider": {
        "@type": "Organization",
        "name": "Arcidrade",
        "url": "https://arcidrade.com"
      },
      "areaServed": "Spain",
      "audience": {
        "@type": "Audience",
        "audienceType": ["Healthcare Professionals", "Medical Institutions"]
      }
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://arcidrade.com/"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
    </>
  );
}