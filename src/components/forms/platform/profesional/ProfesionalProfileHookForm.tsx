"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { mutate as globalMutate } from "swr";

import { optionsTitleStatus } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesional } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";

// Opciones para sub_area (deben coincidir con el enum Sub_area en Prisma)
const subAreaOptions = [
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Enfermero/a" },
  { value: "pharmacist", label: "Farmacéutico/a" }
];

export default function ProfesionalProfileHookForm() {
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useProfesional();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      birthDate: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      sub_area: "",
      title: "",
      studyCountry: "",
      titleInstitution: "",
      titleStatus: "",
    },
  });

  const [email, setEmail] = useState(session?.user.email);
  const [statusSelected, setStatusSelected] = useState<string>(``);
  const [subAreaSelected, setSubAreaSelected] = useState<string>("");
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("");
  const [citySelected, setCitySelected] = useState<string>("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);
  const [studyCountry, setStudyCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Cargar datos básicos que no dependen de listas externas
  useEffect(() => {
    if (data?.payload && data.payload[0]) {
      const userData = data.payload[0];
      const mainStudy = data.payload[1];

      // Formatear fecha si existe
      let formattedBirthDate = "";
      if (userData.birth_date) {
        const fecha = new Date(userData.birth_date);
        formattedBirthDate = fecha.toISOString().split("T")[0];
      }

      // Actualizar campos básicos inmediatamente
      reset({
        name: userData.name || "",
        last_name: userData.last_name || "",
        birthDate: formattedBirthDate,
        email: session?.user.email || "",
        phone: userData.phone || "",
        country: userData.country || "",
        state: userData.state || "",
        city: userData.city || "",
        sub_area: mainStudy?.sub_area || "",
        title: mainStudy?.title || "",
        studyCountry: mainStudy?.country || "",
        titleInstitution: mainStudy?.institution || "",
        titleStatus: mainStudy?.status || "",
      });

      // Actualizar estados que no dependen de listas externas
      setEmail(session?.user.email || "");
      setStatusSelected(mainStudy?.status || "");
      setSubAreaSelected(mainStudy?.sub_area || "");
      setStudyCountry(mainStudy?.country || "");
    }
  }, [data, session, reset]);

  // Cargar datos geográficos cuando los países estén disponibles
  useEffect(() => {
    if (data?.payload && data.payload[0] && countryList.length > 0) {
      const userData = data.payload[0];

      // Manejar país, estado y ciudad con datos reales
      if (userData.country) {
        setCountrySelected(userData.country);

        // Cargar estados del país seleccionado
        const states = State.getStatesOfCountry(userData.country);
        setStateList(states);

        if (userData.state && states.length > 0) {
          setStateSelected(userData.state);

          // Cargar ciudades del estado seleccionado
          const cities = City.getCitiesOfState(userData.country, userData.state);
          setCityList(cities);

          if (userData.city) {
            setCitySelected(userData.city);
          }
        }
      }
    }
  }, [data, countryList]);

  // Función para formatear fecha para mostrar
  const getFormattedDate = () => {
    if (data?.payload && data.payload[0]?.birth_date) {
      const fecha = new Date(data.payload[0].birth_date);
      return fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
    }
    return "";
  };

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
  };

  const handleSubAreaSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubAreaSelected(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountrySelected(e.target.value);

    const states = State.getStatesOfCountry(e.target.value);
    setStateList(states);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const states = State.getStatesOfCountry(countrySelected);
    setStateSelected(stateCode);
    const selectedState = states.find((state) => state.isoCode === stateCode);
    if (selectedState) {
      const cities = City.getCitiesOfState(countrySelected, selectedState.isoCode);
      setCityList(cities);
    } else {
      setCityList([]);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setCitySelected(cityName);
  };

  const handleStudyCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setStudyCountry(countryName);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const response = await useHandleSubmitText(data, "/api/platform/profesional");

      if (response.ok) {
        // Invalidar múltiples caches relacionados con el profesional
        await Promise.all([
          mutate(), // Cache local del useProfesional
          globalMutate("/api/platform/profesional/"), // Cache global del endpoint principal
          globalMutate("/api/platform/profesional/complete"), // Cache del perfil completo si existe
        ]);
        
        closeModal();
      } else {
        // Manejar error si es necesario
        console.error("Error al enviar datos");
      }
    } catch (error) {
      console.error("Error en el envío:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    //set de cities
    const countryData = Country.getAllCountries();
    setCountryList(countryData);
  }, []);

  // Mostrar loading mientras cargan los datos
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

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <div className='flex w-full justify-center items-center'>
        <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
          <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
            <div className='alert alert-error'>
              <p>Error al cargar los datos del profesional</p>
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

          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Datos Personales</h2>
          {/* Mensaje de estado si se está enviando */}
          {isSubmitting && (
            <div className='w-full bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-center gap-2'>
              <span className='loading loading-spinner loading-sm text-blue-600'></span>
              <span className='text-blue-700 font-medium'>Guardando datos personales...</span>
            </div>
          )}
          <form
            onSubmit={onSubmit}
            className={`form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full ${isSubmitting ? "opacity-75 pointer-events-none" : ""}`}>
            
            {/* Campos Obligatorios */}
            <div>
              <label htmlFor='sub_area' className='block'>
                Categoria de Profesión *
              </label>
              <select
                id='sub_area'
                {...register("sub_area", { required: true })}
                value={subAreaSelected}
                onChange={handleSubAreaSelected}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione una categoría</option>
                {subAreaOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.sub_area && <span className='text-red-500 text-sm'>Categoria de Profesión es requerida</span>}
            
            <div className='block'>
              <label htmlFor='name' className='block'>
                Nombre/s *
              </label>
              <input type='text' className='w-xs' {...register("name", { required: true })} />
            </div>
            {errors.name && <span className='text-red-500 text-sm'>Nombre es Requerido</span>}

            {/* Botón para mostrar campos opcionales */}
            <div className='mt-6 border-t pt-4'>
              <button
                type='button'
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className='flex items-center justify-between w-full text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors'
              >
                <span>Datos adicionales opcionales</span>
                <span className={`transform transition-transform ${showOptionalFields ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
            </div>

            {/* Campos opcionales colapsables */}
            {showOptionalFields && (
              <div className='mt-4 space-y-4 border-l-2 border-gray-200 pl-4'>
                <div>
                  <label htmlFor='last_name' className='block'>
                    Apellido/s
                  </label>
                  <input type='text' {...register("last_name")} className='w-xs' />
                </div>
                <div>
                  <label htmlFor='birthDate' className='block'>
                    Fecha de nacimiento
                  </label>
                  {data?.payload && data.payload[0]?.birth_date ? <span>Fecha Registrada: {getFormattedDate()}</span> : null}
                  <input type='date' {...register("birthDate")} className='w-xs' />
                </div>
                <div>
                  <label htmlFor='email' className='block'>
                    Email
                  </label>
                  <input type='email' {...register("email")} className='w-xs' disabled value={email} />
                </div>
                <div>
                  <label htmlFor='phone' className='block'>
                    Telefono o celular de contacto
                  </label>
                  <input type='text' {...register("phone")} className='w-xs' />
                </div>
                <div>
                  <label htmlFor='country' className='block'>
                    Pais de Nacionalidad
                  </label>
                  <select
                    id='country'
                    {...register("country")}
                    value={countrySelected}
                    onChange={handleCountryChange}
                    className='select select-bordered w-full max-w-xs mb-2 input'>
                    <option value=''>Seleccione Un Pais</option>
                    {countryList.map((country, index) => (
                      <option key={index} value={country.isoCode as string}>
                        {country.name as string}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor='state' className='block'>
                    Estado de Nacionalidad
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
                <div>
                  <label htmlFor='city' className='block'>
                    Ciudad de Nacionalidad
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
                <div>
                  <label htmlFor='title' className='block'>
                    Estudio Principal
                  </label>
                  <input type='text' {...register("title")} className='w-xs' />
                </div>
                <div>
                  <label htmlFor='studyCountry' className='block'>
                    Pais del estudio Principal
                  </label>
                  <select
                    id='studyCountry'
                    {...register("studyCountry")}
                    name='studyCountry'
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
              </div>
            )}
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className='loading loading-spinner loading-sm'></span>
                    Guardando...
                  </>
                ) : (
                  "Confirmar datos personales"
                )}
              </button>
            </div>
          </form>
          <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
            <button className='btn btn-wide bg-[var(--orange-arci)]' onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
