"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";

import { optionsTitleStatus, medicalOptions } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalSpeciality, useProfesionalSpecialities } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";

export default function ProfesionalSpecialityUpdateForm(props: any) {
  const { closeModal } = useModal();
  const { data, error, isLoading, mutate } = useProfesionalSpeciality(props.id);
    const { mutate:mutate2 } = useProfesionalSpecialities();

  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [titleCategorySelected, setTitleCategorySelected] = useState('');
  const [statusSelected, setStatusSelected] = useState('');
  const [studyCountry, setStudyCountry] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (data?.payload) {
      reset({
        title: data.payload.title,
        title_category: data.payload.title_category,
        titleStatus: data.payload.status,
        startDate: data.payload.start_date
          ? new Date(data.payload.start_date).toISOString().split("T")[0]
          : "",
        endDate: data.payload.end_date
          ? new Date(data.payload.end_date).toISOString().split("T")[0]
          : "",
        country: data.payload.country,
        titleInstitution: data.payload.institution,
      });

      setTitleCategorySelected(data.payload.title_category);
      setStatusSelected(data.payload.status);
      setStudyCountry(data.payload.country);
    }
  }, [data, reset]);

  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountryList(countryData);
  }, []);

  const handleTitleCategorySelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitleCategorySelected(e.target.value);
  };

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
  };

  const handleStudyCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudyCountry(e.target.value);
  };

  const path = `/api/platform/profesional/speciality/${props.id}`;

  const onSubmit = handleSubmit(async (formData) => {
    const response = await useHandleSubmitText(formData, path);
    if (response.ok) {
      mutate2();
      closeModal();
    }
  });

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar la especialidad.</p>;

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex justify-center items-center h-1/2 p-2 min-w-xl">
        <div className="flex flex-col justify-start h-full bg-gray-200 w-2/3 items-center rounded-sm p-4 md:justify-center">
          <h2 className="text-2xl text-start font-[var(--font-oswald)]">Especialidad</h2>
          <span className="text-sm text-gray-600 mb-2">ID: {data?.payload.id}</span>

          <form onSubmit={onSubmit} className="w-full grid gap-4 mt-4">
            <div>
              <label htmlFor="title" className="block font-semibold mb-1">Título Especialidad</label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Este campo es obligatorio" })}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label htmlFor="title_category" className="block font-semibold mb-1">Categoría más cercana</label>
              <select
                id="title_category"
                {...register("title_category", { required: true })}
                value={titleCategorySelected}
                onChange={handleTitleCategorySelected}
                className="select select-bordered w-full"
              >
                <option value="">Seleccione una especialidad</option>
                {medicalOptions.map((speciality: { name: string }, index: number) => (
                  <option key={index} value={speciality.name}>{speciality.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="titleStatus" className="block font-semibold mb-1">Estado del título</label>
              <select
                id="titleStatus"
                {...register("titleStatus")}
                value={statusSelected}
                onChange={handleStatusSelected}
                className="select select-bordered w-full"
              >
                <option value="">Seleccione un estado</option>
                {optionsTitleStatus.map((status, index) => (
                  <option key={index} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block font-semibold mb-1">Fecha de inicio</label>
                <input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block font-semibold mb-1">Fecha de finalización</label>
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block font-semibold mb-1">País de expedición</label>
              <select
                id="country"
                {...register("country")}
                value={studyCountry}
                onChange={handleStudyCountryChange}
                className="select select-bordered w-full"
              >
                <option value="">Seleccione un país</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.name}>{country.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="titleInstitution" className="block font-semibold mb-1">Institución otorgante</label>
              <input
                id="titleInstitution"
                type="text"
                {...register("titleInstitution", { required: "Este campo es obligatorio" })}
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button type="submit" className="btn bg-[var(--soft-arci)]">Confirmar Especialidad</button>
              <button type="button" className="btn bg-[var(--orange-arci)]" onClick={closeModal}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}