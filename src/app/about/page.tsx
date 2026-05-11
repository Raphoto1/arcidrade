import React from "react";
import AboutContent from "@/components/about/AboutContent";
import { generatePageMetadata } from "@/config/metadata";

// SEO optimizada para la página About
export const metadata = generatePageMetadata(
  "Acerca de Nosotros - Nuestra Misión en el Sector Sanitario",
  "Conoce la historia, misión y valores de Arcidrade. Descubre cómo estamos transformando la conexión entre profesionales de la salud e instituciones sanitarias en España.",
  [
    "misión arcidrade",
    "historia plataforma sanitaria",
    "valores empresa salud",
    "equipo arcidrade",
    "visión sanitaria",
    "innovación salud",
    "empresa tecnología médica",
    "startup salud España"
  ],
  undefined,
  "/about"
);

export default function page() {
  return <AboutContent />;
}
