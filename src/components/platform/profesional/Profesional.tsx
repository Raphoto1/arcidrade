import React from "react";

import HeroHeader from "../pieces/HeroHeader";
import ManageGrid from "./ManageGrid";
import MyAplications from "./MyAplications";
import Offers from "./Offers";
import { useProfesional } from "@/hooks/usePlatPro";
import ProfesionalGridSearch from "@/components/platform/institution/ProfesionalGridSearch";
import ListedProcess from "./ListedProcess";
export default function Profesional() {
  return (
    <div className=''>
      <HeroHeader />
      <ManageGrid />
      <MyAplications />
      <ListedProcess />
      <Offers />
      <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
        <h2 className='text-2xl fontArci text-center'>Instituciones Disponibles</h2>
        <ProfesionalGridSearch isFake={true} />
      </div>
    </div>
  );
}
