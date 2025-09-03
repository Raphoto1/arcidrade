import React from "react";

import InstitutionCard from "../../pieces/InstitutionCard";

export default function Grid() {
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-1 gap-4 p-4 bg-gray-200 rounded-md md:grid-cols-4 md:justify-center md:align-middle md:items-center'>
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
      </div>
    </div>
  );
}
