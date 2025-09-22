"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

import { optionsTitleStatus } from "@/static/data/staticData";
import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesional } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";

interface IProfesional {
  name: string;
  last_name: string | null;
  birth_date: Date | null;
  email: string;
  phone: string | null;
  country: string;
  state: string;
  city: string;
  title: string;
  studyCountry: string;
  titleInstitution: string;
  titleStatus: string;
}

interface IFormData {
  name: string;
  last_name: string | null;
  birth_date: Date | null;
  email: string;
  phone: string | null;
  country: string;
  state: string;
  city: string;
  title: string;
  studyCountry: string;
  titleInstitution: string;
  titleStatus: string;
}

export default function ProfesionalProfileHookForm() {
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const { data, error, isLoading } = useProfesional();

  const fecha = new Date(data?.payload[0].birth_date);
  const fechaFormateada2 = fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.payload[0].name,
      last_name: data?.payload[0].last_name,
      birthDate: data?.payload[0].birth_date,
      email: session?.user.email,
      phone: data?.payload[0].phone,
      country: data?.payload[0].country,
      state: data?.payload[0].state,
      city: data?.payload[0].city,
      title: data?.payload[1].title,
      studyCountry: data?.payload[1].country,
      titleInstitution: data?.payload[1].institution,
      titleStatus: data?.payload[1].status,
    },
  });

  const [email, setEmail] = useState(session?.user.email);
  const [statusSelected, setStatusSelected] = useState<string>(`${data?.payload[1].status}`);
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("seleccione un Pais");
  const [citySelected, setCitySelected] = useState<string>("Seleccione un Estado");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);
  const [studyCountry, setStudyCountry] = useState("");

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountrySelected(e.target.value);
    console.log(e.target.value);
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
    console.log("study country selected", e.target.value);
    const countryName = e.target.value;
    setStudyCountry(countryName);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const response = await useHandleSubmitText(data, "/api/platform/profesional");
    console.log(response);
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
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Datos Personales</h2>
          <form onSubmit={onSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
            <div className='block'>
              <label htmlFor='name' className='block'>
                Nombre/s
              </label>
              <input type='text' className='w-xs' {...register("name", { required: true })} />
            </div>
            {errors.name && <span>Nombre es Requerido</span>}
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
              {data?.payload[0].birth_date ? <span>Fecha Registrada: {fechaFormateada2}</span> : null}

              <input type='date' {...register("birthDate")} className='w-xs' />
            </div>
            <div>
              <label htmlFor='email' className='block'>
                Email
              </label>
              <input type='email' {...register("email")} className='w-xs' disabled />
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
                defaultValue={0}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione Un Estado</option>
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
                <option value=''>Seleccione Una Ciudad</option>
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
            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Confirmar datos personales
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
