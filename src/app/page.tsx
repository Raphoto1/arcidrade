//app imports
import Image from "next/image";
import Link from "next/link";
//project imports
import Carrousel from "@/components/home/Carousel";
import Steps from "@/components/home/Steps";
import GridHomeWindows from "@/components/home/GridHomeWindows";
import GridHomeWindowsCities from "@/components/home/GridHomeWindowsCities";
import GridHomeWindowsSpecialities from "@/components/home/GridHomeWindowsSpecialities";
import BrColors from "@/components/pieces/BrColors";
import ThreeColumnGrid from "@/components/Grids/ThreeColumnGrid";
import InstitutionGridSearch from "@/components/platform/institution/InstitutionGridSearch";
import ProfesionalGridSearch from "@/components/platform/institution/ProfesionalGridSearch";
import { generatePageMetadata } from "@/config/metadata";
import HomeStructuredData from "@/components/seo/HomeStructuredData";
import OffersPublic from "@/components/home/OffersPublic";

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
    <main className='flex flex-col items-center gap- min-h-screen justify-center'>
      <HomeStructuredData />
      <Carrousel />
      <p className='text-sm md:text-base text-gray-600'>
        ¿Ya te registraste?{" "}
        <Link href='/auth/login' className='text-[var(--main-arci)] font-semibold hover:underline'>
          Ingresa aquí
        </Link>
      </p>
      <Steps />
      <GridHomeWindows />
      <ThreeColumnGrid />
      <BrColors title={"Principales Provincias"} />
      <GridHomeWindowsCities />
      <BrColors title={"Principales Especialidades"} />
      <GridHomeWindowsSpecialities />
      <OffersPublic />
    </main>
  );
}
