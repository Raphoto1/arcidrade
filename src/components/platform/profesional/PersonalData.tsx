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
import ProfesionalProfileHookForm from "@/components/forms/platform/profesional/ProfesionalProfileHookForm";
import ConfirmDeleteCvForm from "@/components/forms/platform/profesional/ConfirmDeleteCvForm";
import FileCvForm from "@/components/forms/platform/profesional/FileCvForm";
import { useProfesional } from "@/hooks/usePlatPro";

export default function PersonalData() {
  const { data, error, isLoading } = useProfesional();
  const { data: session } = useSession();
  //loaders
  if (isLoading) {
    return <div>Cargando... datos</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error cargando datos</div>;
  }
  //cv link o cv file
  console.log("cv link en front", data?.payload[0].cv_link);
  //adjust birthdate
  const fecha = new Date(data?.payload[0].birth_date);
  const fechaFormateada = fecha.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
  //adjust country
  const countryName: ICountry | undefined = Country.getCountryByCode(data?.payload[0].country);
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
        <div className='controls grid'>
          <ModalForFormsRedBtn title='Eliminar'>
            <ConfirmDeleteCvForm />
          </ModalForFormsRedBtn>

          <ModalForForm title='Modificar'>
            <FileCvForm />
          </ModalForForm>
        </div>
      </div>
      <div className='dataSpace bg-gray-50 w-full rounded-sm p-2 grid mt-2 shadow-xl'>
        <h2 className='text-bold text-xl text-nowrap dataSpaceTitle pl-4'>Datos Personales</h2>
        <div className='w-full'>
          <div className='flex justify-between'>
            <h3 className='font-light'>Nombre</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].name}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Apellido</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].last_name}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='text-light'>Fecha de Nacimiento</h3>
            <p className='text-(--main-arci)'>{fechaFormateada}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Email</h3>
            <p className='text-(--main-arci)'>{session?.user.email}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Numero de Contacto</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].phone}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Pais</h3>
            <p className='text-(--main-arci)'>{countryName?.name}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Ciudad</h3>
            <p className='text-(--main-arci)'>{data?.payload[0].city}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Profesión</h3>
            <p className='text-(--main-arci)'>{data?.payload[1].title}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Institución</h3>
            <p className='text-(--main-arci)'>{data?.payload[1].institution}</p>
          </div>
          <div className='flex justify-between'>
            <h3 className='font-light'>Status</h3>
            <p className='text-(--main-arci)'>{handleStatusName(data?.payload[1].status)}</p>
          </div>
        </div>
        <div className='controles justify-end flex gap-2 mt-4'>
          <button className='btn bg-[var(--soft-arci)] h-7'>Cambiar contraseña</button>
          <ModalForForm title='Modificar'>
            <ProfesionalProfileHookForm />
          </ModalForForm>
        </div>
      </div>
    </div>
  );
}
