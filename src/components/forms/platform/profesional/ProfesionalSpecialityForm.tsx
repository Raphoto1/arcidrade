"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";

import { optionsTitleStatus, medicalOptions, nurseOptions, pharmacistOptions } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalSpecialities } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
import { useHandleCategoryName } from "@/hooks/useUtils";

export default function ProfesionalSpecialityForm({ subArea }: { subArea: any }) {
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
  const [selectedSubArea, setSelectedSubArea] = useState(subArea || ""); // Estado para manejar subArea seleccionado
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [isHomologated, setIsHomologated] = useState(false);

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

  const handleSubAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubArea(e.target.value);
    setTitleCategorySelected(""); // Reset especialidad cuando cambia la categoría
  };

  // Función para obtener las opciones según el subArea
  const getSpecialityOptions = () => {
    const currentSubArea = selectedSubArea || subArea;
    
    switch (currentSubArea) {
      case 'doctor':
        return medicalOptions;
      case 'nurse':
        return nurseOptions;
      case 'pharmacist':
        return pharmacistOptions;
      default:
        return []; // No mostrar opciones si no hay categoría seleccionada
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true); // Activar loader
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || "",
        endDate: formData.endDate || "",
        // Incluir subArea: desde props si existe, o desde selección si no
        subArea: subArea || selectedSubArea,
        isHomologated,
      };

      const response = await useHandleSubmitText(payload, "/api/platform/profesional/speciality/");
      if (response.ok) {
        mutate();
        closeModal();
      }
    } catch (error) {
      console.error("Error al enviar especialidad:", error);
    } finally {
      setIsLoading(false); // Desactivar loader
    }
  });

  return (
    <div className="flex w-full justify-center items-center">

      <div className="flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl">
        <div className="flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center">
          <h2 className="text-2xl text-start font-(--font-oswald)">Especialidad</h2>
          
          {/* Mostrar categoría si existe o selector si es null */}
          {subArea ? (
            <p>Categoría de Profesión: <span className="font-semibold text-(--main-arci)">{useHandleCategoryName(subArea)}</span></p>
          ) : (
            <div className="w-full mb-4">
              {/* Mensaje motivacional para actualizar perfil */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Para mejorar tu experiencia al agregar especialidades</strong>, actualiza en tus datos personales la categoría de tu profesión.
                    </p>
                  </div>
                </div>
              </div>
              
              <label htmlFor="subArea" className="block font-semibold mb-1">Seleccione su Categoría de Profesión</label>
              <select
                {...register("subArea", { required: "Debe seleccionar una categoría de profesión" })}
                value={selectedSubArea}
                onChange={handleSubAreaChange}
                className="select select-bordered w-full"
                disabled={isLoading}
              >
                <option value="">Seleccione una categoría</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Enfermero/a</option>
                <option value="pharmacist">Farmacéutico/a</option>
              </select>
              {errors.subArea?.message && (
                <span className="text-xs text-red-500">{String(errors.subArea.message)}</span>
              )}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="form justify-center align-middle pl-2 min-w-full grid gap-4 mt-4">
            <div>
              <label htmlFor="title" className="block font-semibold mb-1">Título Especialidad</label>
              <input
                type="text"
                {...register("title", { required: "Este campo es obligatorio" })}
                className="input input-bordered w-full"
                disabled={isLoading}
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
                disabled={(!selectedSubArea && !subArea) || isLoading}
              >
                <option value="">
                  {!selectedSubArea && !subArea 
                    ? "Primero seleccione una categoría de profesión" 
                    : "Seleccione una especialidad"
                  }
                </option>
                {getSpecialityOptions().map((speciality: any, index: number) => (
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
                disabled={isLoading}
              >
                <option value="">Seleccione un estado</option>
                {optionsTitleStatus.map((status, index) => (
                  <option key={index} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='flex items-center justify-between max-w-xs rounded-md border border-gray-300 px-3 py-2'>
                <span className='text-sm font-medium'>Título Homologado UE</span>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-500'>No</span>
                  <input type='checkbox' className='toggle toggle-success toggle-lg' checked={isHomologated} onChange={(e) => setIsHomologated(e.target.checked)} />
                  <span className='text-xs text-green-700 font-semibold'>Sí</span>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block font-semibold mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="input input-bordered w-full"
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              {errors.titleInstitution?.message && (
                <span className="text-xs text-red-500">{String(errors.titleInstitution.message)}</span>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button 
                type="submit" 
                className="btn bg-(--main-arci) text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </>
                ) : (
                  "Confirmar Especialidad"
                )}
              </button>
              <button 
                type="button" 
                className="btn bg-(--orange-arci) text-white"
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
