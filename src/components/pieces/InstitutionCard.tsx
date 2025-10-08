import React from "react";
import { CiMedal } from "react-icons/ci";
import Image from "next/image";
import { useInstitutionById } from "@/hooks/usePlatInst";
import ModalForPreviewTextLink from "../modals/ModalForPreviewTextLink";
import UserDescription from "../platform/pieces/UserDescription";
import ModalForPreview from "../modals/ModalForPreview";
import InstitutionDetailById from "../platform/pieces/institutionDetailById";
import InstitutionDetailFullById from "../platform/pieces/InstitutionDetailFullById";

export default function InstitutionCard(props: any) {
  const isFake = props.isFake;
  const { data, error, isLoading } = useInstitutionById(props.userId);
  const institutionData = data ? data.payload : {};
  console.log("institution data Card", data);
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar la institucion</div>;
  return (
    <div className='card w-96 bg-base-100 card-sm shadow-sm max-w-80'>
      <div className='topHat bg-[var(--orange-arci)] w-full h-20 flex align-middle items-center justify-between rounded-t-lg'>
        {props.btnActive ? (
          <div className='buttons w-15 h-15 ml-2 grid flex-col content-between'>
            <button className='btn btn-xs'>Responsive</button>
            <button className='btn btn-xs'>Responsive</button>
          </div>
        ) : (
          <div></div>
        )}
        {/* <div className='Badge w-15 h-15 ml-2 flex justify-center align-middle items-center'>
          <div className='badge badge-success badge-xs'>
            <CiMedal />
            Seleccionado
          </div>
        </div> */}
        <div className='relative w-15 h-15'>
          {institutionData.avatar ? (
            <Image src={institutionData.avatar} className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          ) : (
            <Image src='/logos/Logo Arcidrade Cond.png' className='w-full h-full rounded-full object-cover' width={500} height={500} alt='fillImage' />
          )}
        </div>
      </div>

      <div className='card-body'>
        <h2 className='card-title font-oswald text-xl text-(--main-arci)'>{isFake ? institutionData.fake_name : institutionData.name || "noname"}</h2>

        <p className='description h-10 font-roboto-condensed line-clamp-2'>{institutionData.description || "Sin descripción"}</p>
        {isFake ? (
          <div></div>
        ) : institutionData.description ? (
          <ModalForPreviewTextLink title='Ver Más...'>
            <UserDescription description={institutionData.description} />
          </ModalForPreviewTextLink>
        ) : (
          <div className='h-5'> </div>
        )}
        <div className='flex justify-between card-actions items-end'>
          <div className='extraInfo font-roboto-condensed text-red-700'>
            <p>{institutionData.main_speciality || "Sin especialización"}</p>
          </div>
          <div className='rightActions flex flex-col justify-end font-roboto-condensed'>
            {/* <p>state</p> */}
            {isFake ? (
              <ModalForPreview title={"Ver Detalle"}>
                <InstitutionDetailById userId={institutionData.user_id} />
              </ModalForPreview>
            ) : (
              <ModalForPreview title={"Ver Detalle"}>
                <InstitutionDetailFullById userId={institutionData.user_id} />
              </ModalForPreview>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
