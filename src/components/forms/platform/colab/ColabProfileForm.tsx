"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { mutate as globalMutate } from "swr";

import { useHandleSubmitText } from "@/hooks/useFetch";
import { useColab } from "@/hooks/useColab";
import { useModal } from "@/context/ModalContext";

export default function ColabProfileForm() {
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useColab();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      role: "",
      description: "",
      country: "",
      state: "",
      city: "",
    },
  });

  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("");
  const [citySelected, setCitySelected] = useState<string>("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Cargar lista de países al inicio
  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryList(countries);
  }, []);

  // Cargar datos básicos que no dependen de listas externas
  useEffect(() => {
    if (data?.payload) {
      const colabData = data.payload;

      // Actualizar campos básicos inmediatamente
      reset({
        name: colabData.name || "",
        last_name: colabData.last_name || "",
        role: colabData.role || "",
        description: colabData.description || "",
        country: colabData.country || "",
        state: colabData.state || "",
        city: colabData.city || "",
      });
    }
  }, [data, session, reset]);

  // Cargar datos geográficos cuando los países estén disponibles
  useEffect(() => {
    if (data?.payload && countryList.length > 0) {
      const colabData = data.payload;

      if (colabData.country) {
        setCountrySelected(colabData.country);

        // Cargar estados del país seleccionado
        const states = State.getStatesOfCountry(colabData.country);
        setStateList(states);

        if (colabData.state && states.length > 0) {
          setStateSelected(colabData.state);

          // Cargar ciudades del estado seleccionado
          const cities = City.getCitiesOfState(colabData.country, colabData.state);
          setCityList(cities);

          if (colabData.city) {
            setCitySelected(colabData.city);
          }
        }
      }
    }
  }, [data, countryList]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountrySelected(e.target.value);

    const states = State.getStatesOfCountry(e.target.value);
    setStateList(states);
    setStateSelected("");
    setCitySelected("");
    setCityList([]);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setStateSelected(stateCode);

    const cities = City.getCitiesOfState(countrySelected, stateCode);
    setCityList(cities);
    setCitySelected("");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setCitySelected(cityName);
  };

  const onSubmit = handleSubmit(async (formData) => {
    console.log('[ColabProfileForm] Iniciando envío del formulario');
    console.log('[ColabProfileForm] Datos a enviar:', formData);

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log('[ColabProfileForm] Llamando a la API...');
      const response = await useHandleSubmitText(formData, "/api/platform/colab");
      console.log('[ColabProfileForm] Respuesta recibida - Status:', response.status);

      if (response.ok) {
        console.log('[ColabProfileForm] ✓ Guardado exitoso');

        // Invalidar caches relacionados
        await Promise.all([
          mutate(), // Cache local del useColab
          globalMutate("/api/platform/colab"), // Cache global del endpoint
        ]);

        setSubmitSuccess(true);

        // Cerrar modal después de un breve delay
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('[ColabProfileForm] ✗ Error del servidor:', errorData);
        setSubmitError(errorData.error || "Error al guardar los datos");
      }
    } catch (error: any) {
      console.error('[ColabProfileForm] ✗ Error en el proceso:', error);
      setSubmitError("Error de conexión. Por favor intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <div className='flex w-full justify-center items-center'>
        <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
          <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
            <div className='flex justify-center items-center p-8'>
              <div className='loading loading-spinner loading-lg'></div>
              <span className='ml-2'>Cargando datos...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center relative'>
          {/* Indicador de carga sutil en la parte superior */}
          {isSubmitting && (
            <div className='absolute top-0 left-0 right-0 bg-blue-500 h-1 animate-pulse rounded-t-sm z-10'>
              <div className='h-full bg-blue-600 animate-ping'></div>
            </div>
          )}

          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Datos del Colaborador</h2>
          
          {/* Mensaje de éxito */}
          {submitSuccess && (
            <div className='w-full bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center gap-2'>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className='text-green-700 font-medium'>¡Datos guardados exitosamente!</span>
            </div>
          )}
          
          {/* Mensaje de error */}
          {submitError && (
            <div className='w-full bg-red-50 border border-red-200 rounded-md p-3 mb-4'>
              <div className='flex items-start gap-2'>
                <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className='flex-1'>
                  <p className='text-red-700 font-medium'>Error al guardar</p>
                  <p className='text-red-600 text-sm mt-1'>{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className='text-red-400 hover:text-red-600 shrink-0'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Mensaje de estado si se está enviando */}
          {isSubmitting && (
            <div className='w-full bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-center gap-2'>
              <span className='loading loading-spinner loading-sm text-blue-600'></span>
              <span className='text-blue-700 font-medium'>Guardando datos del colaborador...</span>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className={`form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full ${isSubmitting ? "opacity-75 pointer-events-none" : ""}`}>
            
            {/* Nombre */}
            <div className='block'>
              <label htmlFor='name' className='block'>
                Nombre/s *
              </label>
              <input 
                type='text' 
                className='w-xs' 
                {...register("name", { required: true })} 
              />
            </div>
            {errors.name && <span className='text-red-500 text-sm'>Nombre es Requerido</span>}

            {/* Apellido */}
            <div>
              <label htmlFor='last_name' className='block'>
                Apellido/s
              </label>
              <input type='text' {...register("last_name")} className='w-xs' />
            </div>

            {/* Rol/Cargo */}
            <div>
              <label htmlFor='role' className='block'>
                Rol/Cargo
              </label>
              <input 
                type='text' 
                {...register("role")} 
                className='w-xs' 
                placeholder='ej: Coordinador, Asistente, etc.' 
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor='description' className='block'>
                Descripción
              </label>
              <textarea
                {...register("description")}
                className='textarea textarea-bordered w-full'
                rows={3}
                placeholder='Breve descripción sobre tu trabajo...'
              />
            </div>

            {/* País */}
            <div>
              <label htmlFor='country' className='block'>
                País
              </label>
              <select
                id='country'
                {...register("country")}
                value={countrySelected}
                onChange={handleCountryChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione Un País</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.isoCode as string}>
                    {country.name as string}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado/Provincia */}
            <div>
              <label htmlFor='state' className='block'>
                Estado/Provincia
              </label>
              <select
                id='state'
                {...register("state")}
                value={stateSelected}
                onChange={handleStateChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>{countrySelected ? "Seleccione Un Estado" : "Primero seleccione un País"}</option>
                {stateList.map((state, index) => (
                  <option key={index} value={state.isoCode as string}>
                    {state.name as string}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudad */}
            <div>
              <label htmlFor='city' className='block'>
                Ciudad
              </label>
              <select
                id='city'
                {...register("city")}
                value={citySelected}
                onChange={handleCityChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>{stateSelected ? "Seleccione Una Ciudad" : "Primero seleccione un Estado"}</option>
                {cityList.map((city, index) => (
                  <option key={index} value={city.name as string}>
                    {city.name as string}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Submit */}
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-(--soft-arci)' type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className='loading loading-spinner loading-sm'></span>
                    Guardando...
                  </>
                ) : (
                  "Confirmar datos del colaborador"
                )}
              </button>
            </div>
          </form>
          
          {/* Botón Cancelar */}
          <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
            <button className='btn btn-wide bg-(--orange-arci)' onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
