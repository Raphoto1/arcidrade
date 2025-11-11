"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

import { useModal } from "@/context/ModalContext";
import { useCampaignData } from "@/hooks/useCampaign";

export default function CampaignDataForm() {
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const { data: campaignData, error, isLoading: dataLoading, mutate } = useCampaignData();

  // Verificar si hay datos existentes para determinar si es creación o actualización
  const existingData = campaignData?.payload;
  const isEditing = !!existingData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      company: "",
      role: "",
      country: "",
      state: "",
      city: "",
    },
  });

  // Efecto para cargar los datos existentes en el formulario
  useEffect(() => {
    if (existingData) {
      reset({
        name: existingData.name || "",
        last_name: existingData.last_name || "",
        company: existingData.company || "",
        role: existingData.role || "",
        country: existingData.country || "",
        state: existingData.state || "",
        city: existingData.city || "",
      });
      
      // Establecer país seleccionado si existe
      if (existingData.country) {
        setSelectedCountry(existingData.country);
      }
      
      // Establecer estado seleccionado si existe
      if (existingData.state) {
        setSelectedState(existingData.state);
      }
    }
  }, [existingData, reset]);

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  // Watch para detectar cambios en country y state
  const watchCountry = watch("country");
  const watchState = watch("state");

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (watchCountry) {
      const countryStates = State.getStatesOfCountry(watchCountry);
      setStates(countryStates);
      setCities([]); // Limpiar ciudades al cambiar país
      setSelectedCountry(watchCountry);
    }
  }, [watchCountry]);

  useEffect(() => {
    if (watchState && selectedCountry) {
      const stateCities = City.getCitiesOfState(selectedCountry, watchState);
      setCities(stateCities);
      setSelectedState(watchState);
    }
  }, [watchState, selectedCountry]);

  const onSubmit = async (formData: any) => {
    try {
      const dataToSend = {
        ...formData,
        user_id: session?.user?.id,
      };

      // Determinar método y URL según si es edición o creación
      const method = isEditing ? "PUT" : "POST";
      const url = "/api/platform/campaign";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? 'actualizar' : 'guardar'} los datos`);
      }

      const result = await response.json();
      
      // Invalidar cache para refrescar los datos
      mutate();
      
      closeModal();
    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'enviar'} formulario:`, error);
      // Aquí podrías agregar una notificación de error
    }
  };

  return (
    <div className="flex flex-col justify-center align-middle items-center max-w-2xl mx-auto p-6">
      <h1 className="text-2xl fontArci text-center pb-5 text-[var(--main-arci)]">
        {isEditing ? 'Actualizar Datos - Campaign' : 'Datos Básicos - Campaign'}
      </h1>

      {dataLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-2">Cargando datos...</span>
        </div>
      ) : (

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Información Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              {...register("name", { 
                required: "El nombre es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" }
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              {...register("last_name")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu apellido (opcional)"
            />
          </div>
        </div>

        {/* Información Profesional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa/Organización
            </label>
            <input
              type="text"
              {...register("company")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de la empresa (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo/Rol
            </label>
            <input
              type="text"
              {...register("role")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu cargo (opcional)"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <select
              {...register("country")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar país (opcional)</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado/Provincia
            </label>
            <select
              {...register("state")}
              disabled={!selectedCountry}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar estado (opcional)</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <select
              {...register("city")}
              disabled={!selectedState}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar ciudad (opcional)</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="btn btn-outline flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white flex-1 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                {isEditing ? 'Actualizando...' : 'Guardando...'}
              </div>
            ) : (
              isEditing ? 'Actualizar Datos' : 'Guardar Datos'
            )}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
