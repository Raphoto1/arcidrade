import React from "react";

import InstitutionCard from "../../pieces/InstitutionCard";
import { ImSearch } from "react-icons/im";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import EmptyCard from "@/components/pieces/EmptyCard";

import Grid from "./Grid";

export default function GridSearch() {
  //permitir busqueda libre en caso de no recibir props
  //si recibe props, filtrar por especialidad principal y extra
  //si recibe props de especialidad extra, filtrar por esa especialidad extra
  //FILTRAR SI SON FAKE O REAL USERS
  return (
    <div className='grid justify-center'>
      <div className='grid grid-cols-1 bg-gray-200 rounded-md md:justify-center md:align-middle md:items-center pt-4'>
        <div className='barraDeBusqueda flex justify-center mb-4 items-center'>
          <input type='text' placeholder='Buscar ofertas...' className='p-2 border border-gray-300 rounded-md mr-2' />
          <ImSearch size={30} />
        </div>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
          <EmptyCard />
        </Grid>
      </div>
    </div>
  );
}
