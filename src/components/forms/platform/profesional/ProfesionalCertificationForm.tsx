"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

import { optionsTitleStatus } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalSpecialities } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
import { medicalOptions } from "@/static/data/staticData";

export default function ProfesionalCertificationForm() {
  const { closeModal } = useModal();
  const { mutate } = useProfesionalSpecialities();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [titleCategorySelected, setTitleCategorySelected] = useState<string>("");
  const [statusSelected, setStatusSelected] = useState<string>("");
  const [countrySelected, setCountrySelected] = useState<string>("");

  const [countryList, setCountryList] = useState<ICountry[]>([]);

  const [studyCountry, setStudyCountry] = useState("");

  const handleTitleCategorySelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitleCategorySelected(e.target.value);
  };

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
  };

  const handleStudyCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("study country selected", e.target.value);
    const countryName = e.target.value;
    setStudyCountry(countryName);
  };

  const onSubmit = handleSubmit(async (data) => {
    const response = await useHandleSubmitText(data, "/api/platform/profesional/certification/");
    console.log("response form", response);
    if (response.ok) {
      mutate();
      closeModal();
    }
  });

  useEffect(() => {
    //set de cities
    const countryData = Country.getAllCountries();
    setCountryList(countryData);
  }, []);

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Certificado</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
            <div>
              <label htmlFor='title' className='block'>
                Título Certificado
              </label>
              <input type='text' {...register("title")} className='w-xs' />
            </div>
            <div>
              <label htmlFor='titleStatus' className='block'>
                Estado del titulo
              </label>
              <select
                {...register("titleStatus")}
                value={statusSelected}
                onChange={handleStatusSelected}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione Un Status</option>
                {optionsTitleStatus.map((status, index) => (
                  <option key={index} value={status.value as string}>
                    {status.label as string}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor='startDate' className='block'>
                Fecha de Inicio
              </label>
              <input type='date' {...register("startDate")} className='w-xs' />
            </div>
            <div>
              <label htmlFor='endDate' className='block'>
                Fecha de Finalización
              </label>
              <input type='date' {...register("endDate")} className='w-xs' />
            </div>
            <div>
              <label htmlFor='studyCountry' className='block'>
                País de expedición del título
              </label>
              <select
                id='country'
                {...register("country")}
                name='country'
                value={studyCountry}
                onChange={handleStudyCountryChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione Un Pais</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.name as string}>
                    {country.name as string}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor='titleInstitution' className='block'>
                Institucion que otorga el titulo
              </label>
              <input type='text' {...register("titleInstitution")} className='w-xs' />
            </div>
            <div>
              <label htmlFor='description' className='block'>
                Descripción
              </label>
              <textarea {...register("description")} className='w-xs textarea' />
            </div>
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Confirmar Especialidad
              </button>
            </div>
          </form>
          <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
            <button className='btn btn-wide bg-[var(--orange-arci)]' onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
