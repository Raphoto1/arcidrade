"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";

import { optionsTitleStatus, medicalOptions } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalSpecialities } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";

export default function ProfesionalSpecialityForm() {
  const { closeModal } = useModal();
  const { mutate } = useProfesionalSpecialities();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [titleCategorySelected, setTitleCategorySelected] = useState("");
  const [statusSelected, setStatusSelected] = useState("");
  const [studyCountry, setStudyCountry] = useState("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);

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

  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      ...formData,
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
    };

    const response = await useHandleSubmitText(payload, "/api/platform/profesional/speciality/");
    if (response.ok) {
      mutate();
      closeModal();
    }
  });

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl">
        <div className="flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center">
          <h2 className="text-2xl text-start font-[var(--font-oswald)]">Especialidad</h2>

          <form onSubmit={onSubmit} className="form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4">
            <div>
              <label htmlFor="title" className="block font-semibold mb-1">Título Especialidad</label>
              <input
                type="text"
                {...register("title", { required: "Este campo es obligatorio" })}
                className="input input-bordered w-full"
              />
              {errors.title?.message && (
                <span className="text-xs text-red-500">{String(errors.title.message)}</span>
              )}
            </div>

            <div>
              <label htmlFor="title_category" className="block font-semibold mb-1">Categoría más cercana</label>
              <select
                {...register("title_category", { required: "Este campo es obligatorio" })}
                value={titleCategorySelected}
                onChange={handleTitleCategorySelected}
                className="select select-bordered w-full"
              >
                <option value="">Seleccione una especialidad</option>
                {medicalOptions.map((speciality: any, index: number) => (
                  <option key={index} value={speciality.name}>{speciality.name}</option>
                ))}
              </select>
              {errors.title_category?.message && (
                <span className="text-xs text-red-500">{String(errors.title_category.message)}</span>
              )}
            </div>

            <div>
              <label htmlFor="titleStatus" className="block font-semibold mb-1">Estado del título</label>
              <select
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
                  type="date"
                  {...register("startDate")}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block font-semibold mb-1">Fecha de finalización</label>
                <input
                  type="date"
                  {...register("endDate", {
                    validate: (value) => {
                      if (!value) return true;
                      const start = new Date(getValues("startDate"));
                      const end = new Date(value);
                      return end >= start || "La fecha de finalización no puede ser menor que la de inicio";
                    },
                  })}
                  className="input input-bordered w-full"
                />
                {errors.endDate?.message && (
                  <span className="text-xs text-red-500">{String(errors.endDate.message)}</span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block font-semibold mb-1">País de expedición</label>
              <select
                id="country"
                {...register("country", { required: "Este campo es obligatorio" })}
                value={studyCountry}
                onChange={handleStudyCountryChange}
                className="select select-bordered w-full"
              >
                <option value="">Seleccione un país</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.name}>{country.name}</option>
                ))}
              </select>
              {errors.country?.message && (
                <span className="text-xs text-red-500">{String(errors.country.message)}</span>
              )}
            </div>

            <div>
              <label htmlFor="titleInstitution" className="block font-semibold mb-1">Institución otorgante</label>
              <input
                type="text"
                {...register("titleInstitution", { required: "Este campo es obligatorio" })}
                className="input input-bordered w-full"
              />
              {errors.titleInstitution?.message && (
                <span className="text-xs text-red-500">{String(errors.titleInstitution.message)}</span>
              )}
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