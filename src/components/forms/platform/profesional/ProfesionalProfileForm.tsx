import "cally";
import React, { useState, useRef, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { useSession } from "next-auth/react";

import { useHandleSubmitText } from "@/hooks/useFetch";

export default function ProfesionalProfileForm() {
  const { data: session } = useSession();
  console.log("session de nav", session);

  const calendarRef = useRef<HTMLElement>(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthYear, setBirthYear] = useState("1990");
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("seleccione un Pais");
  const [citySelected, setCitySelected] = useState<string>("Seleccione un Estado");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);
  const [studyCountry, setStudyCountry] = useState("");
  const [statusSelected, setStatusSelected] = useState<string>("");
  const [email, setEmail] = useState(session?.user.email);

  const optionsTitleStatus = [
    { value: "onGoing", label: "En Proceso" },
    { value: "graduated", label: "Graduado" },
  ];

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
    console.log(e.target.value);
    setStudyCountry(e.target.value);
  };

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log(data);
    try {
      const response = await useHandleSubmitText(data, '/api/platform/profesional')
      console.log(response);
      
    } catch (error) {
      alert(error)
    }
  };

  useEffect(() => {
    //set de cities
    const countryData = Country.getAllCountries();
    setCountryList(countryData);
    //set de calendar
    const calendar = calendarRef.current;
    if (!calendar) return;
    const handleChange = (e: any) => {
      const value = e.target?.value;
      if (value) setBirthDate(value);
    };
    calendar.addEventListener("change", handleChange);
    return () => {
      calendar.removeEventListener("change", handleChange);
    };
  }, []);
  return (
    <div className='flex w-full justify-center items-center'>
      <div className='flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl'>
        <div className='flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center'>
          <h2 className='text-2xl font-bold test-start font-var(--font-oswald)'>Bienvenido a Arcidrade</h2>
          <form onSubmit={handleSubmit} className='form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full'>
            <div className='block'>
              <label htmlFor='name' className='block'>
                Nombre/s
              </label>
              <input type='text' name='name' className='w-xs' />
            </div>
            <div>
              <label htmlFor='last_name' className='block'>
                Apellido/s
              </label>
              <input type='text' name='last_name' className='w-xs' />
            </div>
            <div>
              <label htmlFor='birthDate' className='block'>
                Fecha de nacimiento
              </label>
              <label htmlFor='birthYear' className='text-sm text-center'>
                Año de nacimiento
              </label>
              <select
                id='birthYear'
                value={birthYear}
                onChange={(e) => {
                  const newYear = e.target.value;
                  setBirthYear(newYear);
                  if (calendarRef.current) {
                    calendarRef.current.setAttribute("focused-date", `${newYear}-01-01`);
                  }
                }}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>

              <calendar-date
                ref={calendarRef}
                focused-date={`${birthYear}-01-01`}
                locale='es-ES'
                class='cally bg-base-100 border border-base-300 shadow-lg rounded-box'>
                <calendar-month></calendar-month>
              </calendar-date>

              {birthDate && (
                <p className='text-sm mt-2'>
                  Fecha seleccionada: <strong>{birthDate}</strong>
                </p>
              )}
              <input type='hidden' name='birth_date' value={birthDate} />
            </div>
            <div>
              <label htmlFor='email' className='block'>
                Email
              </label>
              <input type='email' name='email' className='w-xs' value={email} disabled/>
            </div>
            <div>
              <label htmlFor='phone' className='block'>
                Telefono o celular de contacto
              </label>
              <input type='text' name='phone' className='w-xs' />
            </div>
            <div>
              <label htmlFor='country' className='block'>
                Pais de Nacionalidad
              </label>
              <select
                id='country'
                name='country'
                value={countrySelected}
                onChange={handleCountryChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value="">
                  Seleccione Un Pais
                </option>
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
              <select id='state' name='state' value={stateSelected} onChange={handleStateChange} defaultValue={0} className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value="">
                  Seleccione Un Estado
                </option>
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
              <select id='city' name='city' value={citySelected} onChange={handleCityChange} className='select select-bordered w-full max-w-xs mb-2 input'>
                <option value="">
                  Seleccione Una Ciudad
                </option>
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
              <input type='text' name='title' className='w-xs' />
            </div>
            <div>
              <label htmlFor='titleCountry' className='block'>
                Pais del estudio Principal
              </label>
              <select
                id='studyCountry'
                name='studyCountry'
                value={studyCountry}
                onChange={handleStudyCountryChange}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                                <option value="">
                  Seleccione Un Pais
                </option>
                {countryList.map((country, index) => (
                  <option key={index} value={country.isoCode as string}>
                    {country.name as string}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor='titleInstitution' className='block'>
                Institucion que otorga el titulo
              </label>
              <input type='text' name='titleInstitution' className='w-xs' />
            </div>
            <div>
              <label htmlFor='titleStatus' className='block'>
                Estado del titulo
              </label>
              <select
                id='studyStatus'
                name='studyStatus'
                value={statusSelected}
                onChange={handleStatusSelected}
                className='select select-bordered w-full max-w-xs mb-2 input'>
                                <option value="">
                  Seleccione Un Status
                </option>
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
              <button className='btn btn-wide bg-[var(--orange-arci)]'>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
