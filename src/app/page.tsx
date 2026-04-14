import HomeContent from "@/components/home/HomeContent";
import { generatePageMetadata } from "@/config/metadata";
import HomeStructuredData from "@/components/seo/HomeStructuredData";

// SEO optimizada para la página principal
export const metadata = generatePageMetadata(
  "Conecta Talento Sanitario con Instituciones de Salud",
  "Arcidrade es la plataforma líder que conecta profesionales de la salud con instituciones sanitarias. Encuentra oportunidades laborales en el sector sanitario o descubre el mejor talento médico para tu institución.",
  [
    "empleo sanitario",
    "trabajos medicina",
    "oportunidades salud",
    "contratación médica",
    "red profesional sanitaria",
    "bolsa de empleo médico",
    "profesionales sanitarios",
    "instituciones salud",
    "trabajo enfermería",
    "carreras medicina",
  ],
  undefined,
  "/"
);

export default function Home() {
  return (
    <>
      <HomeStructuredData />
      <HomeContent className='flex min-h-screen flex-col items-center justify-center' offersTrackingSource='home' />
    </>
  );
}
