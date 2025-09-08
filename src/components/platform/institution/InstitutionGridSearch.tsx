import React from "react";

import InstitutionCard from "../../pieces/InstitutionCard";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import { ImSearch } from "react-icons/im";

export default function InstitutionGridSearch() {
  return (
    <div className='grid justify-center'>
      <div className="grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4">
      <div className="barraDeBusqueda flex justify-center mb-4 items-center">
          <input type="text" placeholder="Buscar ofertas..." className="p-2 border border-gray-300 rounded-md mr-2" />
          <ImSearch size={30}/>
      </div>
        <div className='grid grid-cols-1 gap-4 p-4 bg-gray-200 rounded-md md:grid-cols-4 md:justify-center md:align-middle md:items-center'>
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
        </div>
      </div>
    </div>
  );
}
