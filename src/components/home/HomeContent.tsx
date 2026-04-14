import React from "react";
import Link from "next/link";
import Carousel from "@/components/home/Carousel";
import Steps from "@/components/home/Steps";
import GridHomeWindows from "@/components/home/GridHomeWindows";
import GridHomeWindowsCities from "@/components/home/GridHomeWindowsCities";
import GridHomeWindowsSpecialities from "@/components/home/GridHomeWindowsSpecialities";
import OffersPublic from "@/components/home/OffersPublic";
import ThreeColumnGrid from "@/components/Grids/ThreeColumnGrid";
import BrColors from "@/components/pieces/BrColors";

type HomeStepItem = {
  href: string;
  title: string;
  icon: "register" | "documents" | "apply";
};

type HomeContentProps = {
  className?: string;
  loginPromptText?: string;
  loginLinkText?: string;
  loginHref?: string;
  forceShowSteps?: boolean;
  stepsItems?: HomeStepItem[];
  provincesTitle?: string;
  specialitiesTitle?: string;
  offersTitle?: string;
  offersTrackingSource?: string;
};

export default function HomeContent({
  className = "flex min-h-screen flex-col items-center justify-center",
  loginPromptText = "¿Ya te registraste?",
  loginLinkText = "Ingresa aquí",
  loginHref = "/auth/login",
  forceShowSteps = false,
  stepsItems,
  provincesTitle = "Principales Provincias",
  specialitiesTitle = "Principales Especialidades",
  offersTitle = "Principales Ofertas Disponibles",
  offersTrackingSource = "home",
}: HomeContentProps) {
  return (
    <main className={className}>
      <Carousel />
      <p className='text-sm text-gray-600 md:mt-4 md:text-base'>
        {loginPromptText}{" "}
        <Link href={loginHref} className='font-bold text-(--main-arci) hover:underline'>
          {loginLinkText}
        </Link>
      </p>
      <Steps forceVisible={forceShowSteps} items={stepsItems} />
      <GridHomeWindows />
      <ThreeColumnGrid />
      <BrColors title={provincesTitle} />
      <GridHomeWindowsCities />
      <BrColors title={specialitiesTitle} />
      <GridHomeWindowsSpecialities />
      <OffersPublic trackingSource={offersTrackingSource} title={offersTitle} />
    </main>
  );
}