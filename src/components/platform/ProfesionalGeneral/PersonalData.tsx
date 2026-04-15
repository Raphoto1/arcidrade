"use client";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Country } from "country-state-city";
import Link from "next/link";

import { useProfesionalGeneral } from "@/hooks/usePlatPro";
import ModalForForm from "@/components/modals/ModalForForms";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import ProfesionalGeneralProfileHookForm from "@/components/forms/platform/profesional-general/ProfesionalGeneralProfileHookForm";
import FileCvFormGeneral from "@/components/forms/platform/profesional-general/FileCvForm";
import ConfirmDeleteCvFormGeneral from "@/components/forms/platform/profesional-general/ConfirmDeleteCvForm";
import FileMainStudyFormGeneral from "@/components/forms/platform/profesional-general/FileMainStudyForm";
import FilePreviewModal from "@/components/platform/pieces/FilePreviewModal";
import ConfirmDeleteMainStudyFormGeneral from "@/components/forms/platform/profesional-general/ConfirmDeleteMainStudyForm";
import Loader from "@/components/pieces/Loader";
import { useHandleStatusName } from "@/hooks/useUtils";

// Códigos ISO de países miembros de la Unión Europea
const EU_COUNTRY_CODES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI",
  "FR","GR","HR","HU","IE","IT","LT","LU","LV","MT",
  "NL","PL","PT","RO","SE","SI","SK",
]);

export default function PersonalData() {
  const { data, error, isLoading } = useProfesionalGeneral();
  const { data: session } = useSession();

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader size="md" text="Cargando datos personales..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error al cargar datos: {error.message}</div>;
  }

  if (!data?.payload || !Array.isArray(data.payload)) {
    return <div className="text-yellow-600">No hay datos disponibles</div>;
  }

  const personalData = data.payload[0] || {};
  const studyData = data.payload[1] || {};
  const extraData = data.payload[2] || {};

  // --- lógica UE ---
  const hasCountry = Boolean(personalData.country);
  const isOutsideEU = hasCountry && !EU_COUNTRY_CODES.has(personalData.country);

  const countryName = personalData.country
    ? Country.getCountryByCode(personalData.country)?.name
    : undefined;

  const formatBirthDate = () => {
    if (!personalData?.birth_date) return "No Registra Información";
    const fecha = new Date(personalData.birth_date);
    if (isNaN(fecha.getTime())) return "Fecha inválida";
    return fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  return (
    <div className="flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:h-auto">
      {/* --- encabezado --- */}
      <div className="pb-1">
        {personalData.name == null ? (
          <h1 className="text-2xl font-extrabold capitalize fontArci text-center text-(--main-arci)">
            Inicie AQUÍ Completando sus Datos Personales Para que pueda ser encontrado en la plataforma
          </h1>
        ) : null}
        <h1 className="text-2xl fontArci text-center">Curriculum</h1>
      </div>

      {/* --- sección CV --- */}
      <div className="fileSpace bg-gray-50 w-full rounded-sm p-2 grid grid-cols-3 gap-2 shadow-xl">
        <div className="flex max-w-xs shrink-0 justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2">
          <IoDocumentAttachOutline size={36} />
        </div>

        <div>
          {personalData.cv_link ? (
            <div className="flex flex-col">
              <span>Link</span>
              <a className="link text-blue-300" href={personalData.cv_link} target="_blank" rel="noopener noreferrer">
                Previsualizar
              </a>
            </div>
          ) : personalData.cv_file ? (
            <div className="flex flex-col">
              <span>Archivo</span>
              <FilePreviewModal url={personalData.cv_file} label="Ver CV" btnClassName="link text-blue-300 btn btn-sm btn-ghost p-0 h-auto min-h-0 font-normal" />
            </div>
          ) : (
            <span>Aún no existe CV registrada.</span>
          )}
        </div>

        {personalData.name != null ? (
          <div className="controls grid gap-1">
            {personalData?.cv_link || personalData?.cv_file ? (
              <ModalForFormsRedBtn title='Eliminar'>
                <ConfirmDeleteCvFormGeneral />
              </ModalForFormsRedBtn>
            ) : null}
            <ModalForFormsSoftBlue title={personalData?.cv_link || personalData?.cv_file ? 'Modificar' : 'Agregar'}>
              <FileCvFormGeneral />
            </ModalForFormsSoftBlue>
          </div>
        ) : null}
      </div>

      {/* --- sección Datos Personales --- */}
      <div className="dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl">
        <h2 className="text-bold text-xl text-nowrap dataSpaceTitle pl-4">Datos Personales</h2>

        <div className="w-full">
          <div className="flex justify-between">
            <h3 className="font-light">Nombre:</h3>
            <p className="text-(--main-arci)">{personalData.name || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Apellido:</h3>
            <p className="text-(--main-arci)">{personalData.last_name || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Fecha de Nacimiento:</h3>
            <p className="text-(--main-arci) text-end">{formatBirthDate()}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Email:</h3>
            <p className="text-(--main-arci)">{session?.user?.email || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Numero de Contacto:</h3>
            <p className="text-(--main-arci) text-end">{personalData.phone || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">País:</h3>
            <p className="text-(--main-arci)">{countryName || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Ciudad:</h3>
            <p className="text-(--main-arci)">{personalData.city || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Categoría de Profesión:</h3>
            <p className="text-(--main-arci) text-end">General</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Profesión:</h3>
            <p className="text-(--main-arci)">{studyData?.title || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Institución:</h3>
            <p className="text-(--main-arci)">{studyData?.institution || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Status:</h3>
            <p className="text-(--main-arci)">{useHandleStatusName(studyData?.status) || "No Registra Información"}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-light">Título Homologado para Unión Europea:</h3>
            {Boolean(studyData?.isHomologated) ? (
              <FaCheckCircle className="text-green-600 text-lg" title="Homologado" aria-label="Homologado" />
            ) : (
              <FaTimesCircle className="text-red-500 text-lg" title="No homologado" aria-label="No homologado" />
            )}
          </div>
          <div className="flex justify-between">
            <h3 className="font-light">Respaldo:</h3>
            {studyData?.link ? (
              <a href={studyData.link} target="_blank" rel="noopener noreferrer" className="text-(--main-arci) link">Previsualizar Link</a>
            ) : null}
            {studyData?.file ? (
              <a href={studyData.file} target="_blank" rel="noopener noreferrer" className="text-(--main-arci) link">Previsualizar Archivo</a>
            ) : null}
            {!studyData?.link && !studyData?.file && <p className="text-(--main-arci)">No Cargado</p>}
          </div>

          {/* --- Documentos europeos --- */}
          {isOutsideEU ? (
            <div className="flex justify-between items-center">
              <h3 className="font-light">¿Tiene documentos europeos?</h3>
              {extraData.has_european_docs ? (
                <FaCheckCircle className="text-green-600 text-lg" aria-label="Sí" />
              ) : (
                <FaTimesCircle className="text-red-500 text-lg" aria-label="No" />
              )}
            </div>
          ) : !hasCountry ? (
            <div className="flex justify-between items-center opacity-40">
              <h3 className="font-light flex items-center gap-1">
                ¿Tiene documentos europeos?
                <span
                  className="tooltip tooltip-right cursor-help"
                  data-tip="Este campo solo aplica para profesionales registrados fuera de la Unión Europea. Registra tu país primero para activarlo."
                >
                  <FaInfoCircle className="text-gray-400 text-sm" />
                </span>
              </h3>
              <FaTimesCircle className="text-gray-400 text-lg" aria-label="No disponible" />
            </div>
          ) : null}

          {/* --- Necesita sponsor --- */}
          {isOutsideEU ? (
            <div className="flex justify-between items-center">
              <h3 className="font-light">¿Necesita sponsor?</h3>
              {extraData.needs_sponsor ? (
                <FaCheckCircle className="text-green-600 text-lg" aria-label="Sí" />
              ) : (
                <FaTimesCircle className="text-red-500 text-lg" aria-label="No" />
              )}
            </div>
          ) : !hasCountry ? (
            <div className="flex justify-between items-center opacity-40">
              <h3 className="font-light flex items-center gap-1">
                ¿Necesita sponsor?
                <span
                  className="tooltip tooltip-right cursor-help"
                  data-tip="Un sponsor es una empresa o persona dentro de la UE que patrocina tu proceso migratorio. Este campo solo aplica para profesionales fuera de la Unión Europea."
                >
                  <FaInfoCircle className="text-gray-400 text-sm" />
                </span>
              </h3>
              <FaTimesCircle className="text-gray-400 text-lg" aria-label="No disponible" />
            </div>
          ) : null}
        </div>

        {/* --- controles --- */}
        <div className="controles justify-center flex gap-2 mt-4">
          {studyData?.status === "graduated" && (studyData?.link || studyData?.file) ? (
            <ModalForFormsRedBtn title='Eliminar Título'>
              <ConfirmDeleteMainStudyFormGeneral />
            </ModalForFormsRedBtn>
          ) : null}
          {studyData?.status === "graduated" ? (
            <ModalForForm title={studyData?.link || studyData?.file ? "Actualizar Título" : "Agregar Título"}>
              <FileMainStudyFormGeneral />
            </ModalForForm>
          ) : null}
          <ModalForForm title={personalData.name == null ? "Agregar Información" : "Modificar Perfil"}>
            <ProfesionalGeneralProfileHookForm />
          </ModalForForm>
        </div>

        <ModalForForm title="Cambiar Contraseña">
          <div className="flex flex-col gap-4">
            <Link href={`/resetPassword/${session?.user?.id}`} className="btn bg-(--soft-arci) text-white hover:bg-(--main-arci)">
              Cambiar Contraseña
            </Link>
          </div>
        </ModalForForm>
      </div>
    </div>
  );
}

