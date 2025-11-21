import React from "react";
import ProcessesGridSearchPublic from "../pieces/ProcessesGridSearchPublic";

export default function OffersPublic() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Principales Ofertas Disponibles</h2>
      <ProcessesGridSearchPublic isFake={true} applyButton={false} />
    </div>
  );
}
