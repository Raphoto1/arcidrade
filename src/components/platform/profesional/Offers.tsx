import React from "react";
import ProcessesGridSearch from "../pieces/ProcessesGridSearch";

type OffersProps = {
  lockedSubArea?: string;
};

export default function Offers({ lockedSubArea }: OffersProps) {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Ofertas Disponibles</h2>
      {!lockedSubArea ? (
        <div className='alert alert-warning shadow-sm'>
          <span>Por favor complete la categoria de profesion para poder revisar las ofertas.</span>
        </div>
      ) : (
        <ProcessesGridSearch isFake={true} applyButton={true} lockSubArea={true} lockedSubArea={lockedSubArea} />
      )}
    </div>
  );
}
