import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

import { useHandleSubmitText } from "@/hooks/useFetch";
import { useModal } from "@/context/ModalContext";
import { useInstitution } from "@/hooks/usePlatInst";
import { medicalOptions } from "@/static/data/staticData";
import { useSession } from "next-auth/react";

interface FormData {
  name: string;
  foundationDate: string;
  email: string;
  contactNumber: string;
  country: string;
  state: string;
  city: string;
  specialization: string;
  nif: string;
  web: string;
}

export default function InstitutionProfileForm() {
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("");
  const [citySelected, setCitySelected] = useState<string>("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);

  const { data, error, isLoading, mutate } = useInstitution();
  const { data: session } = useSession();
  const { closeModal } = useModal();

  const defaultValues: Partial<FormData> = {
    name: data?.payload?.name || "",
    foundationDate: data?.payload?.established?.slice(0, 10),
    email: session?.user?.email || "",
    web: data?.payload?.website || "",
    contactNumber: data?.payload?.phone || "",
    country: data?.payload?.country || "",
    state: data?.payload?.state || "",
    city: data?.payload?.city || "",
    specialization: data?.payload?.main_speciality || "",
    nif: data?.payload?.company_id || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryList(countries);
  }, []);

  useEffect(() => {
    if (data?.payload) {
      reset(defaultValues);
      setCountrySelected(defaultValues.country || "");
      setStateSelected(defaultValues.state || "");
      setCitySelected(defaultValues.city || "");

      if (defaultValues.country) {
        const states = State.getStatesOfCountry(defaultValues.country);
        setStateList(states);

        if (defaultValues.state) {
          const cities = City.getCitiesOfState(defaultValues.country, defaultValues.state);
          setCityList(cities);
        }
      }
    }
  }, [data, reset]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setCountrySelected(countryCode);
    const states = State.getStatesOfCountry(countryCode);
    setStateList(states);
    setStateSelected("");
    setCityList([]);
    setCitySelected("");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setStateSelected(stateCode);
    const selectedState = State.getStatesOfCountry(countrySelected).find((state) => state.isoCode === stateCode);
    if (selectedState) {
      const cities = City.getCitiesOfState(countrySelected, selectedState.isoCode);
      setCityList(cities);
    } else {
      setCityList([]);
    }
    setCitySelected("");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCitySelected(e.target.value);
  };

  const onSubmit = handleSubmit(async (formData) => {
    const response = await useHandleSubmitText(formData, "/api/platform/institution");
    console.log("response form", response);
    if (response.ok) {
      mutate();
      closeModal();
    }
  });

  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl text-start font-[var(--font-oswald)] mb-4'>Perfil Institucional</h2>
          <form onSubmit={onSubmit}>
            <div className='mb-2'>
              <label htmlFor='name' className='block'>
                Nombre de la Institución
              </label>
              <input type='text' className='input input-bordered w-full max-w-xs' {...register("name", { required: true })} />
              {errors.name && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='foundationDate' className='block'>
                Fecha de Fundación
              </label>
              <input
                type='date'
                className='input input-bordered w-full max-w-xs'
                {...register("foundationDate", { required: true })}
              />
              {errors.foundationDate && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='email' className='block'>
                Email
              </label>
              <input disabled type='email' className='input input-bordered w-full max-w-xs' {...register("email", { required: true })} />
              {errors.email && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='contactNumber' className='block'>
                Número de Contacto
              </label>
              <input type='tel' className='input input-bordered w-full max-w-xs' {...register("contactNumber", { required: true })} />
              {errors.contactNumber && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='web' className='block'>
                web
              </label>
              <input type='web' className='input input-bordered w-full max-w-xs' {...register("web", { required: true })} />
              {errors.web && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='country' className='block'>
                País
              </label>
              <select
                id='country'
                {...register("country", { required: true })}
                value={countrySelected}
                onChange={handleCountryChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione un país</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='state' className='block'>
                Estado
              </label>
              <select
                id='state'
                {...register("state")}
                value={stateSelected}
                onChange={handleStateChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione un estado</option>
                {stateList.map((state, index) => (
                  <option key={index} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='city' className='block'>
                Ciudad
              </label>
              <select
                id='city'
                {...register("city")}
                value={citySelected}
                onChange={handleCityChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione una ciudad</option>
                {cityList.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-2'>
              <label htmlFor='specialization' className='block'>
                Especialización Principal
              </label>
              <select id="specialization" {...register("specialization", { required: true })} className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value=''>Seleccione una especialización</option>
                {medicalOptions.map((option:any, index:number) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              {errors.specialization && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='mb-4'>
              <label htmlFor='nif' className='block'>
                NIF
              </label>
              <input type='text' className='input input-bordered w-full max-w-xs' {...register("nif")} />
              {errors.nif && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
            </div>

            <div className='grid justify-center gap-2 mt-5 items-center align-middle'>
              <button className='btn bg-[var(--soft-arci)]' type='submit'>
                Guardar
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
