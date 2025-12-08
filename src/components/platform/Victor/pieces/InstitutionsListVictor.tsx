import React from "react";

import ProfesionalGridSearch from "../../institution/ProfesionalGridSearch";
export default function InstitutionsListVictor() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Instituciones Disponibles</h2>
      <ProfesionalGridSearch isFake={false} />
    </div>
  );
}
