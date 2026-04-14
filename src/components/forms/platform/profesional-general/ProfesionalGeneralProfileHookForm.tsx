"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { mutate as globalMutate } from "swr";

import { useHandleSubmitText } from "@/hooks/useFetch";
import { useProfesionalGeneral } from "@/hooks/usePlatPro";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { optionsTitleStatus } from "@/static/data/staticData";

// Códigos ISO de países miembros de la Unión Europea
const EU_COUNTRY_CODES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI",
  "FR","GR","HR","HU","IE","IT","LT","LU","LV","MT",
  "NL","PL","PT","RO","SE","SI","SK",
]);

export default function ProfesionalGeneralProfileHookForm() {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useProfesionalGeneral();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      birthDate: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      hasEuropeanDocs: false,
      needsSponsor: false,
      sub_area: "general",
      title: "",
      studyCountry: "",
      titleInstitution: "",
      titleStatus: "",
      isHomologated: false,
    },
  });

  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("");
  const [citySelected, setCitySelected] = useState<string>("");
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [stateList, setStateList] = useState<IState[]>([]);
  const [cityList, setCityList] = useState<ICity[]>([]);
  const [statusSelected, setStatusSelected] = useState("");
  const [studyCountry, setStudyCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isOutsideEU = countrySelected !== "" && !EU_COUNTRY_CODES.has(countrySelected);
  const hasValidCountrySelected = countryList.some((c) => c.isoCode === countrySelected);

  // Cargar países al montar
  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  // Precargar datos básicos
  useEffect(() => {
    if (data?.payload && data.payload[0]) {
      const userData = data.payload[0];
      const mainStudy = data.payload[1];
      const extraData = data.payload[2];

      let formattedBirthDate = "";
      if (userData.birth_date) {
        formattedBirthDate = new Date(userData.birth_date).toISOString().split("T")[0];
      }

      reset({
        name: userData.name || "",
        last_name: userData.last_name || "",
        birthDate: formattedBirthDate,
        phone: userData.phone || "",
        country: userData.country || "",
        state: userData.state || "",
        city: userData.city || "",
        hasEuropeanDocs: Boolean(extraData?.has_european_docs),
        needsSponsor: Boolean(extraData?.needs_sponsor),
        sub_area: "general",
        title: mainStudy?.title || "",
        studyCountry: mainStudy?.country || "",
        titleInstitution: mainStudy?.institution || "",
        titleStatus: mainStudy?.status || "",
        isHomologated: Boolean(mainStudy?.isHomologated),
      });

      if (userData.country) setCountrySelected(userData.country);
      setStatusSelected(mainStudy?.status || "");
      setStudyCountry(mainStudy?.country || "");
    }
  }, [data, reset]);

  // Cargar estados/ciudades cuando el listado de países ya esté y haya un país seleccionado
  useEffect(() => {
    if (data?.payload?.[0]?.country && countryList.length > 0) {
      const userData = data.payload[0];
      const states = State.getStatesOfCountry(userData.country);
      setStateList(states);

      if (userData.state) {
        setStateSelected(userData.state);
        const cities = City.getCitiesOfState(userData.country, userData.state);
        setCityList(cities);
        if (userData.city) setCitySelected(userData.city);
      }
    }
  }, [data, countryList]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountrySelected(code);
    setValue("country", code);
    setStateSelected("");
    setValue("state", "");
    setCitySelected("");
    setValue("city", "");
    setCityList([]);
    setStateList(State.getStatesOfCountry(code));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setStateSelected(code);
    setValue("state", code);
    setCitySelected("");
    setValue("city", "");
    setCityList(City.getCitiesOfState(countrySelected, code));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCitySelected(e.target.value);
    setValue("city", e.target.value);
  };

  const handleStatusSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSelected(e.target.value);
    setValue("titleStatus", e.target.value);
  };

  const handleStudyCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudyCountry(e.target.value);
    setValue("studyCountry", e.target.value);
  };

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await useHandleSubmitText(formData, "/api/platform/profesional-general");

      if (response.ok) {
        await Promise.all([
          mutate(),
          globalMutate("/api/platform/profesional-general/"),
        ]);
        setSubmitSuccess(true);
        showToast("Datos personales actualizados correctamente", "success");
        setTimeout(() => closeModal(), 1500);
      } else {
        const errorData = await response.json();
        const msg = errorData.details
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || "Error al guardar los datos.";
        setSubmitError(msg);
        showToast(msg, "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? `Error: ${err.message}` : "Error de conexión.";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error m-4">
        <p>Error al cargar los datos del perfil</p>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex justify-center items-center h-1/2 p-2 min-w-xl md:min-w-xl">
        <div className="flex-col justify-start h-full bg-gray-200 w-2/3 align-middle items-center rounded-sm p-4 md:justify-center relative">
          {isSubmitting && (
            <div className="absolute top-0 left-0 right-0 bg-blue-500 h-1 animate-pulse rounded-t-sm z-10" />
          )}

          <h2 className="text-2xl font-bold text-start">Datos Personales</h2>

          {submitSuccess && (
            <div className="w-full bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700 font-medium">¡Datos guardados exitosamente!</span>
            </div>
          )}

          {submitError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 font-medium">Error al guardar</p>
                  <p className="text-red-600 text-sm mt-1">{submitError}</p>
                </div>
                <button onClick={() => setSubmitError(null)} className="text-red-400 hover:text-red-600 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {isSubmitting && (
            <div className="w-full bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-center gap-2">
              <span className="loading loading-spinner loading-sm text-blue-600"></span>
              <span className="text-blue-700 font-medium">Guardando datos personales...</span>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className={`form justify-center align-middle pl-2 min-w-full md:grid md:min-w-full ${isSubmitting ? "opacity-75 pointer-events-none" : ""}`}
          >
            {/* sub_area hardcodeado como 'general' — no se muestra al usuario */}
            <input type="hidden" {...register("sub_area")} value="general" />

            {/* --- Campos obligatorios --- */}
            <div className="block">
              <label htmlFor="name" className="block">Nombre/s *</label>
              <input type="text" className="w-xs" {...register("name", { required: true })} />
            </div>
            {errors.name && <span className="text-red-500 text-sm">Nombre es requerido</span>}

            {/* --- Campos opcionales colapsables --- */}
            <div className="mt-6 border-t pt-4">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>Datos adicionales opcionales</span>
                <span className={`transform transition-transform ${showOptionalFields ? "rotate-180" : ""}`}>▼</span>
              </button>
            </div>

            {showOptionalFields && (
              <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                <div>
                  <label htmlFor="last_name" className="block">Apellido/s</label>
                  <input type="text" {...register("last_name")} className="w-xs" />
                </div>

                <div>
                  <label htmlFor="birthDate" className="block">Fecha de nacimiento</label>
                  <input type="date" {...register("birthDate")} className="w-xs" />
                </div>

                <div>
                  <label className="block">Email</label>
                  <input type="email" className="w-xs" disabled value={session?.user?.email || ""} />
                </div>

                <div>
                  <label htmlFor="phone" className="block">Teléfono o celular de contacto</label>
                  <input type="text" {...register("phone")} className="w-xs" />
                </div>

                {/* País */}
                <div>
                  <label htmlFor="country" className="block">País de residencia</label>
                  <select
                    id="country"
                    {...register("country")}
                    value={countrySelected}
                    onChange={handleCountryChange}
                    className="select select-bordered w-full max-w-xs mb-2 input"
                  >
                    <option value="">Seleccione un país</option>
                    {countryList.map((c, i) => (
                      <option key={i} value={c.isoCode}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Estado y ciudad */}
                {hasValidCountrySelected && (
                  <>
                    <div>
                      <label htmlFor="state" className="block">Estado / Provincia (Opcional)</label>
                      <select
                        id="state"
                        {...register("state")}
                        value={stateSelected}
                        onChange={handleStateChange}
                        className="select select-bordered w-full max-w-xs mb-2 input"
                      >
                        <option value="">Seleccione un estado</option>
                        {stateList.map((s, i) => (
                          <option key={i} value={s.isoCode}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="city" className="block">Ciudad (Opcional)</label>
                      <select
                        id="city"
                        {...register("city")}
                        value={citySelected}
                        onChange={handleCityChange}
                        className="select select-bordered w-full max-w-xs mb-2 input"
                      >
                        <option value="">{stateSelected ? "Seleccione una ciudad" : "Primero seleccione un estado"}</option>
                        {cityList.map((c, i) => (
                          <option key={i} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Estudio principal */}
                <div>
                  <label htmlFor="title" className="block">Estudio Principal</label>
                  <input type="text" {...register("title")} className="w-xs" />
                </div>

                <div>
                  <label htmlFor="studyCountry" className="block">País del estudio principal</label>
                  <select
                    id="studyCountry"
                    {...register("studyCountry")}
                    value={studyCountry}
                    onChange={handleStudyCountryChange}
                    className="select select-bordered w-full max-w-xs mb-2 input"
                  >
                    <option value="">Seleccione un país</option>
                    {countryList.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="titleInstitution" className="block">Institución que otorga el título</label>
                  <input type="text" {...register("titleInstitution")} className="w-xs" />
                </div>

                <div>
                  <label htmlFor="titleStatus" className="block">Estado del título</label>
                  <select
                    id="titleStatus"
                    {...register("titleStatus")}
                    value={statusSelected}
                    onChange={handleStatusSelected}
                    className="select select-bordered w-full max-w-xs mb-2 input"
                  >
                    <option value="">Seleccione un estado</option>
                    {optionsTitleStatus.map((s, i) => (
                      <option key={i} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between max-w-xs rounded-md border border-gray-300 px-3 py-2">
                    <span className="text-sm font-medium">Título Homologado para Unión Europea</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">No</span>
                      <input type="checkbox" className="toggle toggle-success toggle-lg" {...register("isHomologated")} />
                      <span className="text-xs text-green-700 font-semibold">Sí</span>
                    </div>
                  </label>
                </div>

                {/* Campos EU — solo visibles si está fuera de la UE */}
                {isOutsideEU && (
                  <>
                    <div>
                      <label className="flex items-center justify-between max-w-xs rounded-md border border-gray-300 px-3 py-2">
                        <span className="text-sm font-medium">¿Tiene documentos europeos?</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">No</span>
                          <input type="checkbox" className="toggle toggle-success toggle-lg" {...register("hasEuropeanDocs")} />
                          <span className="text-xs text-green-700 font-semibold">Sí</span>
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center justify-between max-w-xs rounded-md border border-gray-300 px-3 py-2">
                        <span className="text-sm font-medium">¿Necesita sponsor?</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">No</span>
                          <input type="checkbox" className="toggle toggle-success toggle-lg" {...register("needsSponsor")} />
                          <span className="text-xs text-green-700 font-semibold">Sí</span>
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="grid justify-center gap-2 mt-5 items-center align-middle">
              <button className="btn bg-(--soft-arci)" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </>
                ) : (
                  "Confirmar datos personales"
                )}
              </button>
            </div>
          </form>

          <div className="grid justify-center gap-2 mt-5 items-center align-middle">
            <button className="btn btn-wide bg-(--orange-arci)" onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
