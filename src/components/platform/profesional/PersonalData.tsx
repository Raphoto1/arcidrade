//imports de app
import { useEffect } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import Link from "next/link";
//immports propios
import ModalForForm from "../../modals/ModalForForms";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import ProfesionalProfileHookForm from "@/components/forms/platform/profesional/ProfesionalProfileHookForm";
import ConfirmDeleteCvForm from "@/components/forms/platform/profesional/ConfirmDeleteCvForm";
import FileCvForm from "@/components/forms/platform/profesional/FileCvForm";
import FileMainStudyForm from "@/components/forms/platform/profesional/FileMainStudyForm";
import ConfirmDeleteMainStudyForm from "@/components/forms/platform/profesional/ConfirmDeleteMainStudyForm";
import { useProfesional } from "@/hooks/usePlatPro";

export default function PersonalData() {
  const { data, error, isLoading } = useProfesional();
  const { data: session } = useSession();
  console.log("data en personalData", data);

  //loaders
  if (isLoading) {
    return <div>Cargando... datos</div>;
  }

  //adjust birthdate
  const fecha = new Date(data?.payload[0].birth_date);
  const fechaFormateada = fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
  //adjust country
  const countryName: ICountry | undefined = data?.payload[0]
    ? Country.getCountryByCode(data?.payload[0].country)
    : undefined;
  //adjust status
  const handleStatusName = (status: string | undefined) => {
    if (status === "inProcess") {
      return "En Proceso";
    } else if (status === "graduated") {
      return "Graduado";
    } else {
      return "No Registrado";
    }
  };

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-1 md:justify-center md:h-auto'>
      <div className='pb-1'>
        {data?.payload[0].name == null ? (
          <div>
            <h1 className='text-2xl font-extrabold capitalize fontArci text-center text-(--main-arci)'>
              Inicie AQUÍ Completando sus Datos Personales Para que pueda ser encontrado en la plataforma
            </h1>
          </div>
        ) : null}
        <h1 className='text-2xl fontArci text-center'>Curriculum</h1>
      </div>
      <div className='fileSpace bg-gray-50 w-full rounded-sm p-2 grid grid-cols-3 gap-2 shadow-xl'>
        <div className='flex max-w-xs flex-shrink-0 justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-2'>
          <IoDocumentAttachOutline size={36} />
        </div>
        <div>
          {data?.payload[0].cv_link ? (
            <div className='flex flex-col'>
              <span>Link</span>
              <a className='link text-blue-300' href={data?.payload[0].cv_link} target='_blank'>
                Previsualizar
              </a>
            </div>
          ) : data?.payload[0].cv_file ? (
            <div className='flex flex-col'>
              <span>Archivo</span>
              <a className='link text-blue-300' href={data?.payload[0].cv_file} target='_blank'>
                Previsualizar
              </a>
            </div>
          ) : (
            <span>Aún no existe CV registrada.</span>
          )}
        </div>
        {data?.payload[0].name != null ? (
          <div className='controls grid'>
            {data?.payload[0].cv_link || data?.payload[0].cv_file ? (
              <ModalForFormsRedBtn title='Eliminar'>
                <ConfirmDeleteCvForm />
              </ModalForFormsRedBtn>
            ) : null}
            <ModalForFormsSoftBlue title='Modificar'>
              <FileCvForm />
            </ModalForFormsSoftBlue>
          </div>
        ) : null}
      </div>
      <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
        <div className='w-full'>
          <div className='flex justify-between'>
            <h3 className='font-light'>Nombre</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Apellido</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].last_name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='text-light'>Fecha de Nacimiento</h3>
            <p className='text-(--main-arci)'>{fechaFormateada || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Email</h3>
            <p className='text-(--main-arci)'>{session?.user.email || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Numero de Contacto</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].phone || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Pais</h3>
            <p className='text-(--main-arci)'>{countryName?.name || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Ciudad</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].city || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Profesión</h3>
            <p className='text-(--main-arci)'>{data?.payload[1].title || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Institución</h3>
            <p className='text-(--main-arci)'>{data?.payload[1].institution || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Status</h3>
            <p className='text-(--main-arci)'>{handleStatusName(data?.payload[1].status) || "No Registra Información"}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Respaldo</h3>
            {data?.payload[1].link ? (
              <a href={data?.payload[1].link} target='_blank' className='text-(--main-arci) link'>
                Previsualizar Link
              </a>
            ) : null}
            {data?.payload[1].file ? (
              <a href={data?.payload[1].file} target='_blank' className='text-(--main-arci) link'>
                Previsualizar Archivo
              </a>
            ) : null}
            {!data?.payload[1].link && !data?.payload[1].file && <p className='text-(--main-arci)'>No Cargado</p>}
          </div>
        </div>
        <div className='controles justify-end flex gap-2 mt-4'>
          {/* <button className='btn bg-[var(--soft-arci)] h-auto w-auto'>Cambiar contraseña</button> */}
          {/* --------------------------------------------------agregar Eliminar Titulo------------------------------- */}
          {data?.payload[1].status == "graduated" ? (
            <div className="flex gap-2">
              <ModalForFormsRedBtn title='Eliminar Título'>
                <ConfirmDeleteMainStudyForm />
              </ModalForFormsRedBtn>
              <ModalForForm title={data?.payload[1].link || data.payload[1].file ? "Actualizar Título" : "Agregar Título"}>
                <FileMainStudyForm />
              </ModalForForm>
            </div>
          ) : null}

          <ModalForForm title={data?.payload[0].name == null ? "Agregar Información" : "Modificar"}>
            <ProfesionalProfileHookForm />
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
