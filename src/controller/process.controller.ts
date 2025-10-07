import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

import {
  createExtraSpecialityService,
  createProcessService,
  getActiveProcessesByUserIdService,
  getPendingProcessesByUserIdService,
  getProcessByIdService,
  getProcessesByUserIdService,
  deleteExtraSpecialityByProcessIdService,
  updateProcessService,
  getPausedProcessesByUserIdService,
  getArchivedProcessesByUserIdService,
  getCompletedProcessesByUserIdService,
} from "@/service/process.service";
import { getExtraSpecialitiesByProcessIdDao, getProcessesByUserIdFilteredByStatusDao } from "@/dao/process.dao";

export const createProcess = async (data: any) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let pStatus = "pending";
  if (session?.user?.area == "victor") {
    pStatus = "active";
  }
  const mainDataPack = {
    user_id: userId,
    position: data.position,
    main_speciality: data.title_category_0,
    profesional_status: data.titleStatus,
    type: data.processType,
    start_date: new Date(data.start_date),
    description: data.description,
    status: pStatus,
  };
  console.log("Creating main process with data:", mainDataPack);
  const processCreated = await createProcessService(mainDataPack);

  if (data.title_category_1 || data.title_category_2) {
    console.log("Adding additional specialties");
    if (data.title_category_1) {
      const extraSpecialityPack = {
        process_id: processCreated.id,
        speciality: data.title_category_1,
      };
      console.log("Creating extra speciality with data:", extraSpecialityPack);
      await createExtraSpecialityService(extraSpecialityPack);
    }
    if (data.title_category_2) {
      const extraSpecialityPack = {
        process_id: processCreated.id,
        speciality: data.title_category_2,
      };
      console.log("Creating extra speciality with data:", extraSpecialityPack);
      await createExtraSpecialityService(extraSpecialityPack);
    }
  }
  return processCreated;
};

export const getProcessesByUserId = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const result = await getProcessesByUserIdService(userId);
  return result;
};

export const getProcessesByStatus = async (status: string | undefined) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (status === "pending") {
    const result = await getPendingProcessesByUserIdService(userId);
    return result;
  } else if (status === "active") {
    const result = await getActiveProcessesByUserIdService(userId);
    return result;
  }else if (status === "archived") {
    const result = await getArchivedProcessesByUserIdService(userId);
    return result;
  }else if (status === "paused") {
    const result = await getPausedProcessesByUserIdService(userId);
    return result;
  }else if (status === "completed") {
    const result = await getCompletedProcessesByUserIdService(userId);
    return result;
  }
};

export const getProcessById = async (processId: number) => {
  const result = await getProcessByIdService(processId);
  return result;
};

export const updateProcessStatusById = async (processId: number, status: string) => {
  const dataPack = {
    status: status,
  };
  const result = await updateProcessService(processId, dataPack);
  return result;
}

export const updateProcessById = async (processId: number, data: any) => {
  // Actualiza los campos principales del proceso
  const mainDataPack = {
    position: data.position,
    main_speciality: data.title_category_0,
    profesional_status: data.titleStatus,
    type: data.processType,
    start_date: new Date(data.start_date),
    description: data.description,
  };
  await updateProcessService(processId, mainDataPack);

  // Elimina todas las especialidades extras actuales
  await deleteExtraSpecialityByProcessIdService(processId);

  // Crea las nuevas especialidades extras
  if (Array.isArray(data.extra_specialities)) {
    for (const speciality of data.extra_specialities) {
      await createExtraSpecialityService({
        process_id: processId,
        speciality: speciality.speciality,
      });
    }
  }

  return { success: true };
};
