"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalExperiences } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
import { mutate as globalMutate } from "swr";

export default function ProfesionalExperienceForm() {
  const { closeModal } = useModal();
  const { mutate } = useProfesionalExperiences();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [isCurrentlyActive, setIsCurrentlyActive] = useState(false);
  const [studyCountry, setStudyCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);

  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountryList(countryData);
  }, []);

  const handleStudyCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setStudyCountry(countryName);

    const selectedCountry = countryList.find(c => c.name === countryName);
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.isoCode);
      setStateList(states);
      setSelectedState("");
      setCityList([]);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setSelectedState(stateName);

    const selectedCountry = countryList.find(c => c.name === studyCountry);
    const selectedStateObj = stateList.find(s => s.name === stateName);

    if (selectedCountry && selectedStateObj) {
      const cities = City.getCitiesOfState(selectedCountry.isoCode, selectedStateObj.isoCode);
      setCityList(cities);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      ...formData,
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
    };

    const response = await useHandleSubmitText(payload, "/api/platform/profesional/experience/");
    if (response.ok) {
      mutate();
      globalMutate("/api/platform/profesional/complete");
      closeModal();
    }
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)]'>Experiencia</h2>

          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4'>
            {/* Cargo */}
            <div>
              <label htmlFor='title' className='block font-semibold mb-1'>Cargo</label>
              <input type='text' {...register("title", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
              {errors.title?.message && <span className='text-xs text-red-500'>{String(errors.title.message)}</span>}
            </div>

            {/* Institución */}
            <div>
              <label htmlFor='institution' className='block font-semibold mb-1'>Institución</label>
              <input type='text' {...register("institution", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
              {errors.titleInstitution?.message && <span className='text-xs text-red-500'>{String(errors.titleInstitution.message)}</span>}
            </div>

            {/* Fechas */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='startDate' className='block font-semibold mb-1'>Fecha de inicio</label>
                <input type='date' {...register("startDate", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
                {errors.startDate?.message && <span className='text-xs text-red-500'>{String(errors.startDate.message)}</span>}
              </div>
              <div>
                <label htmlFor='endDate' className='block font-semibold mb-1'>Fecha de finalización</label>
                <input
                  type='date'
                  {...register("endDate", {
                    validate: (value) => {
                      if (!value || isCurrentlyActive) return true;
                      const start = new Date(getValues("startDate"));
                      const end = new Date(value);
                      return end >= start || "La fecha de finalización no puede ser menor que la de inicio";
                    },
                  })}
                  disabled={isCurrentlyActive}
                  className='input input-bordered w-full disabled:opacity-40'
                />
                <label className='flex items-center gap-2 mt-2 cursor-pointer select-none'>
                  <div
                    onClick={() => setIsCurrentlyActive(!isCurrentlyActive)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                      isCurrentlyActive ? 'bg-[var(--soft-arci)]' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      isCurrentlyActive ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </div>
                  <span className='text-sm font-medium'>Actualmente activo</span>
                </label>
                {errors.endDate?.message && <span className='text-xs text-red-500'>{String(errors.endDate.message)}</span>}
              </div>
            </div>

            {/* País */}
            <div>
              <label htmlFor='country' className='block font-semibold mb-1'>País de Experiencia</label>
              <select
                id='country'
                {...register("country", { required: "Este campo es obligatorio" })}
                value={studyCountry}
                onChange={handleStudyCountryChange}
                className='select select-bordered w-full'>
                <option value=''>Seleccione un país</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.name}>{country.name}</option>
                ))}
              </select>
              {errors.country?.message && <span className='text-xs text-red-500'>{String(errors.country.message)}</span>}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor='state' className='block font-semibold mb-1'>Estado <span className='text-gray-400 font-normal text-sm'>(Opcional)</span></label>
              <select
                id='state'
                {...register("state")}
                value={selectedState}
                onChange={handleStateChange}
                className='select select-bordered w-full'>
                <option value=''>Seleccione un estado</option>
                {stateList.map((state, index) => (
                  <option key={index} value={state.name}>{state.name}</option>
                ))}
              </select>
              {errors.state?.message && <span className='text-xs text-red-500'>{String(errors.state.message)}</span>}
            </div>

            {/* Ciudad */}
            <div>
              <label htmlFor='city' className='block font-semibold mb-1'>Ciudad <span className='text-gray-400 font-normal text-sm'>(Opcional)</span></label>
              <select
                id='city'
                {...register("city")}
                className='select select-bordered w-full'>
                <option value=''>Seleccione una ciudad</option>
                {cityList.map((city, index) => (
                  <option key={index} value={city.name}>{city.name}</option>
                ))}
              </select>
              {errors.city?.message && <span className='text-xs text-red-500'>{String(errors.city.message)}</span>}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor='description' className='block font-semibold mb-1'>Descripción del Cargo</label>
              <textarea {...register("description")} className='textarea textarea-bordered w-full' />
            </div>

            {/* Botones */}
            <div className='flex justify-center gap-4 mt-6'>
              <button type='submit' className='btn bg-[var(--soft-arci)]'>Confirmar Experiencia</button>
              <button type='button' className='btn bg-[var(--orange-arci)]' onClick={closeModal}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
