import ModalForPreview from "@/components/modals/ModalForPreview";
import ProcessDetail from "@/components/platform/process/ProcessDetail";
import { useInstitutionById } from "@/hooks/usePlatInst";
import { formatDateToString } from "@/hooks/useUtils";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmActivateProcessForm from "@/components/forms/platform/process/ConfirmActivateProcessForm";
import ModalForFormsYellowBtn from "@/components/modals/ModalForFormsYellowBtn";
import ConfirmPauseProcessForm from "@/components/forms/platform/process/ConfirmPauseProcessForm";
import React from "react";
import ModalForForms from "@/components/modals/ModalForForms";

export default function ProcessPill(props: any) {
  const process = props.process;
  const { data: institutionPack } = useInstitutionById(process?.user_id);
  const institutionData = institutionPack?.payload;

  
  return (
    <div className='w-full h-auto bg-white rounded-md flex flex-col'>
      <div className='w-full h-auto flex'>
        <div className='flex flex-col align-middle justify-center w-1/2 p-1'>
          <h3 className='text-(--main-arci) text-bold text-wrap font-bold'>{institutionData?.name || "Institución"}</h3>
          <p className='text-sm text-gray-600 w-100 capitalize'>{process?.position || "Cargo"}</p>
          <p className='font-light'>{formatDateToString(process?.start_date) || "No date"}</p>
        </div>
        <div className='w-1/2 p-1'>
          <ModalForPreview title="Detalle">
            <ProcessDetail processData={{ ...process }} />
          </ModalForPreview>
          {process?.status == "archived" ? null : (
                        <ModalForFormsRedBtn title={"Eliminar Proceso"}>
                          <ConfirmArchiveProcessForm id={process?.id} />
                        </ModalForFormsRedBtn>
                      )}
                      {process?.status == "pending" && (
                        <ModalForFormsGreenBtn title={"Aceptar Proceso"}>
                          <ConfirmActivateProcessForm id={process?.id} />
                        </ModalForFormsGreenBtn>
                      )}
                      {process?.status == "active" && (
                        <>
                          <ModalForFormsYellowBtn title={"Pausar Proceso"}>
                            <ConfirmPauseProcessForm id={process?.id} />
                          </ModalForFormsYellowBtn>
                          <ModalForForms title={"Extender Plazo"}>
                            <div>En desarrollo</div>
                          </ModalForForms>
                        </>
                      )}
                      {process?.status == "paused" && (
                        <>
                          <ModalForFormsGreenBtn title={"Reactivar Proceso"}>
                            <ConfirmActivateProcessForm id={process?.id} />
                          </ModalForFormsGreenBtn>
                          <ModalForForms title={"Extender Plazo"}>
                            <div>En desarrollo</div>
                          </ModalForForms>
                        </>
                      )}
                      {process?.status == "archived" && (
                        <>
                          <ModalForFormsGreenBtn title={"Reactivar Proceso"}>
                            <ConfirmActivateProcessForm id={process?.id} />
                          </ModalForFormsGreenBtn>
                          <ModalForForms title={"Extender Plazo"}>
                            <div>En desarrollo</div>
                          </ModalForForms>
                          <ModalForFormsRedBtn title={"Eliminar Proceso de Base de Datos"}>
                            <div>En desarrollo</div>
                          </ModalForFormsRedBtn>
                        </>
                      )}
          {/* <button className='btn bg-[var(--orange-arci)] w-full text-white h-auto '>Eliminar</button>
          <button className='btn bg-success w-full text-white h-auto '>Aceptar</button>
          <button className='btn bg-warning w-full text-white h-auto '>Solicitar Contacto</button> */}
        </div>
      </div>
        <div className="w-full flex justify-center">
        <span className="fontArci text-[var(--orange-arci)]">{ process?.type ==='arcidrade' ? 'Proceso Arcidrade' : null }</span>
        </div>
    </div>
  );
}
