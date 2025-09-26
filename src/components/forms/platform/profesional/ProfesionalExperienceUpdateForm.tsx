"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalExperience, useProfesionalExperiences } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";

export default function ProfesionalExperienceUpdateForm(props:any) {
  const { closeModal } = useModal();
  const { data, mutate } = useProfesionalExperience(props.id);
  const { mutate: mutate2 } = useProfesionalExperiences();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const [studyCountry, setStudyCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryList(countries);
  }, []);

  useEffect(() => {
    if (data) {
      reset({
        title: data.payload.title,
        institution: data.payload.institution,
        startDate: data.payload.start_date?.slice(0, 10),
        endDate: data.payload.end_date?.slice(0, 10) || "",
        country: data.payload.country,
        state: data.payload.state,
        city: data.payload.city,
        description: data.payload.description,
      });

      setStudyCountry(data.payload.country);
      setSelectedState(data.payload.state);

      const selectedCountry = Country.getAllCountries().find(c => c.name === data.payload.country);
      if (selectedCountry) {
        const states = State.getStatesOfCountry(selectedCountry.isoCode);
        setStateList(states);

        const selectedState = states.find(s => s.name === data.payload.state);
        if (selectedState) {
          const cities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
          setCityList(cities);
        }
      }
    }
  }, [data, reset]);

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

    const response = await useHandleSubmitText(payload, `/api/platform/profesional/experience/${props.id}`);
    if (response.ok) {
      mutate();
      mutate2();
      closeModal();
    }
  });

  return (
    <form onSubmit={onSubmit} className='form grid gap-4 p-4'>
      <h2 className='text-2xl font-bold'>Actualizar Experiencia</h2>

      <div>
        <label className='font-semibold'>Cargo</label>
        <input type='text' {...register("title", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
        {errors.title && <span className='text-xs text-red-500'>{String(errors.title.message)}</span>}
      </div>

      <div>
        <label className='font-semibold'>Institución</label>
        <input type='text' {...register("institution", { required: "Este campo es obligatorio" })} className='input input-bordered w-full' />
        {errors.institution && <span className='text-xs text-red-500'>{String(errors.institution.message)}</span>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='font-semibold'>Fecha de inicio</label>
          <input type='date' {...register("startDate")} className='input input-bordered w-full' />
        </div>
        <div>
          <label className='font-semibold'>Fecha de finalización</label>
          <input
            type='date'
            {...register("endDate", {
              validate: (value) => {
                if (!value) return true;
                const start = new Date(getValues("startDate"));
                const end = new Date(value);
                return end >= start || "La fecha de finalización no puede ser menor que la de inicio";
              },
            })}
            className='input input-bordered w-full'
          />
          {errors.endDate && <span className='text-xs text-red-500'>{String(errors.endDate.message)}</span>}
        </div>
      </div>

      <div>
        <label className='font-semibold'>País</label>
        <select {...register("country", { required: "Este campo es obligatorio" })} value={studyCountry} onChange={handleStudyCountryChange} className='select select-bordered w-full'>
          <option value=''>Seleccione un país</option>
          {countryList.map((c, i) => (
            <option key={i} value={c.name}>{c.name}</option>
          ))}
        </select>
        {errors.country && <span className='text-xs text-red-500'>{String(errors.country.message)}</span>}
      </div>

      <div>
        <label className='font-semibold'>Estado</label>
        <select {...register("state", { required: "Este campo es obligatorio" })} value={selectedState} onChange={handleStateChange} className='select select-bordered w-full'>
          <option value=''>Seleccione un estado</option>
          {stateList.map((s, i) => (
            <option key={i} value={s.name}>{s.name}</option>
          ))}
        </select>
        {errors.state && <span className='text-xs text-red-500'>{String(errors.state.message)}</span>}
      </div>

      <div>
        <label className='font-semibold'>Ciudad</label>
        <select {...register("city")} className='select select-bordered w-full'>
          <option value=''>Seleccione una ciudad</option>
          {cityList.map((c, i) => (
            <option key={i} value={c.name}>{c.name}</option>
          ))}
        </select>
        {errors.city && <span className='text-xs text-red-500'>{String(errors.city.message)}</span>}
      </div>

      <div>
        <label className='font-semibold'>Descripción</label>
        <textarea {...register("description")} className='textarea textarea-bordered w-full' />
      </div>

      <div className='flex justify-center gap-4 mt-6'>
        <button type='submit' className='btn bg-[var(--soft-arci)]'>Actualizar Experiencia</button>
        <button type='button' className='btn bg-[var(--orange-arci)]' onClick={closeModal}>Cancelar</button>
      </div>
    </form>
  );
}