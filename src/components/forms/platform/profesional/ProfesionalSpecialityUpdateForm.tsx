"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";

import { optionsTitleStatus, medicalOptions, nurseOptions, pharmacistOptions } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalSpeciality, useProfesionalSpecialities } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
import { useHandleCategoryName } from "@/hooks/useUtils";

export default function ProfesionalSpecialityUpdateForm(props: any) {
  const { closeModal } = useModal();
  const { data, error, isLoading, mutate } = useProfesionalSpeciality(props.id);
  const { mutate: mutate2 } = useProfesionalSpecialities();
  
  // Obtener subArea desde los datos cargados
  const subArea = data?.payload?.sub_area;

  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [titleCategorySelected, setTitleCategorySelected] = useState('');
  const [statusSelected, setStatusSelected] = useState('');
  const [studyCountry, setStudyCountry] = useState('');
  const [selectedSubArea, setSelectedSubArea] = useState(subArea || ""); // Estado para manejar subArea seleccionado
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de carga

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
      // Actualizar selectedSubArea con los datos cargados
      setSelectedSubArea(data.payload.sub_area || "");
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

  const path = `/api/platform/profesional/speciality/${props.id}`;

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true); // Activar loader
    try {
      const payload = {
        ...formData,
        // Incluir subArea si fue seleccionado o si ya existía
        ...(selectedSubArea && { sub_area: selectedSubArea }),
      };

      console.log('Payload enviado:', payload);

      const response = await useHandleSubmitText(payload, path);
      if (response.ok) {
        mutate2();
        closeModal();
      }
    } catch (error) {
      console.error("Error al actualizar especialidad:", error);
    } finally {
      setIsSubmitting(false); // Desactivar loader
    }
  });

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar la especialidad.</p>;

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex justify-center items-center h-1/2 p-2 min-w-xl">
        <div className="flex flex-col justify-start h-full bg-gray-200 w-2/3 items-center rounded-sm p-4 md:justify-center">
          <h2 className="text-2xl text-start font-[var(--font-oswald)]">Actualizar Especialidad</h2>
          
          {/* Mostrar categoría si existe o selector si es null */}
          {subArea ? (
            <div className="w-full mb-4 bg-gray-50 p-3 rounded-md border">
              <p className="text-sm text-gray-600">Categoría de Profesión:</p>
              <p className="font-semibold text-[var(--main-arci)] text-lg">{useHandleCategoryName(subArea)}</p>
            </div>
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
              
              <label htmlFor="subArea" className="block font-semibold mb-1 text-red-600">* Seleccione su Categoría de Profesión</label>
              <select
                {...register("subArea", { required: "Debe seleccionar una categoría de profesión" })}
                value={selectedSubArea}
                onChange={handleSubAreaChange}
                className="select select-bordered w-full"
                disabled={isSubmitting}
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

          <form onSubmit={onSubmit} className="w-full grid gap-4 mt-4">
            <div>
              <label htmlFor="title" className="block font-semibold mb-1">Título Especialidad</label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Este campo es obligatorio" })}
                className="input input-bordered w-full"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="title_category" className="block font-semibold mb-1">Categoría más cercana</label>
              <select
                id="title_category"
                {...register("title_category", { 
                  required: true,
                  onChange: (e) => setTitleCategorySelected(e.target.value)
                })}
                className="select select-bordered w-full"
                disabled={(!selectedSubArea && !subArea) || isSubmitting}
              >
                <option value="">
                  {!selectedSubArea && !subArea 
                    ? "Primero seleccione una categoría de profesión" 
                    : "Seleccione una especialidad"
                  }
                </option>
                {getSpecialityOptions().map((speciality: { name: string }, index: number) => (
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block font-semibold mb-1">Fecha de finalización</label>
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button 
                type="submit" 
                className="btn bg-[var(--main-arci)] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Actualizando...
                  </>
                ) : (
                  "Confirmar Especialidad"
                )}
              </button>
              <button 
                type="button" 
                className="btn bg-[var(--orange-arci)] text-white" 
                onClick={closeModal}
                disabled={isSubmitting}
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
