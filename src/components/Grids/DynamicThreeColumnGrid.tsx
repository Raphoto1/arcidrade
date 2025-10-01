//imports app
import React from "react";
//imports project

import InstitutionCard from "../pieces/InstitutionCard";
import ProfesionalCard from "../pieces/ProfesionalCard";
//project imports

export default function ThreeColumnGrid({ children }: any) {
  return (
    <div className='threeColumnGrid flex justify-center flex-col items-center gap-4 md:grid md:grid-cols-3 md:max-w-full md:justify-center'>{children}</div>
  );
}
