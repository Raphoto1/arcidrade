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
  deleteProcessByIdService,
  updateProcessService,
  getPausedProcessesByUserIdService,
  getArchivedProcessesByUserIdService,
  getCompletedProcessesByUserIdService,
  getAllProcessesByStatusService,
  getProfesionalsSelectedByProcessIdService,
  getProfesionalSelectedByProcessIdService,
  addPProfesionalToProcessService,
  deleteProfesionalFromProcessService,
  getProfesionalSelectedByProfesionalIdService,
  getAllProcessesService,
  getAllProfesionalAddedByProfesionalService,
  getAllProfesionalAddedByInstitutionService,
  getAllProfesionalAddedByService,
} from "@/service/process.service";
import { getUserDataService } from "@/service/userData.service";
import { getProfesionalsByAddedByDao } from "@/dao/process.dao";

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
  } else if (status === "archived") {
    const result = await getArchivedProcessesByUserIdService(userId);
    return result;
  } else if (status === "paused") {
    const result = await getPausedProcessesByUserIdService(userId);
    return result;
  } else if (status === "completed") {
    const result = await getCompletedProcessesByUserIdService(userId);
    return result;
  }
};

export const getAllActiveProcesses = async (status: string) => {
  const result = await getAllProcessesByStatusService(status);
  return result;
};

export const getAllPendingProcesses = async () => {
  const result = await getAllProcessesByStatusService("pending");
  return result;
}

export const getProccessesActiveByUserId = async (userId: string | undefined) => {
  const result = await getActiveProcessesByUserIdService(userId);
  return result;
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
};

export const updateProcessStatusByManagerById = async (processId: number, status: string) => {
  const dataPack = {
    status: status,
    approval_date: new Date(),
  };
  const result = await updateProcessService(processId, dataPack);
  return result;
};

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

export const getProfesionalsSelectedByProcessId = async (process_id: number) => {
  const result = await getProfesionalsSelectedByProcessIdService(process_id);
  return result;
};

export const getProfesionalSelectedByUserIdAndProcessId = async (process_id: number, profesional_id: string) => {
  const result = await getProfesionalSelectedByProcessIdService(process_id, profesional_id);
  return result;
};

export const addProfesionalToProcess = async (processId: number, professionalId: string, status?: string, is_arcidrade?: boolean, added_by?: string) => {
  try {
    const process = await getProcessByIdService(processId);
    if (!process) {
      throw new Error(`Process with ID ${processId} not found`);
    }
    const profesional = await getUserDataService(professionalId);
    if (!profesional) {
      throw new Error(`Professional with ID ${professionalId} not found`);
    }
    //revisar si ya esta en el proceso
    const chk = await getProfesionalSelectedByUserIdAndProcessId(processId, professionalId);
    if (chk) {
      throw new Error(`Professional with ID ${professionalId} is already added to process ID ${processId}`);
    } else {
      const dataPack = {
        process_id: processId,
        profesional_id: professionalId,
        process_status: status,
        is_arcidrade: is_arcidrade,
        added_by: added_by,
      };
      const result = await addPProfesionalToProcessService(dataPack);
      return result;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error adding professional to process: ${errorMessage}`);
  }
};

export const deleteProfesionalFromProcess = async (processId: number, professionalId: string) => {
  try {
    const process = await getProcessByIdService(processId);
    if (!process) {
      throw new Error(`Process with ID ${processId} not found`);
    }
    // Revisar si el profesional ya está en el proceso
    const chk = await getProfesionalSelectedByUserIdAndProcessId(processId, professionalId);
    if (!chk) {
      throw new Error(`Professional with ID ${professionalId} is not part of process ID ${processId}`);
    }
    const result = await deleteProfesionalFromProcessService(processId, professionalId);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error removing professional from process: ${errorMessage}`);
  }
};

//encontrar todos los procesos donde el profesional este enlistado
export const getProcessesWhereProfesionalIsListed = async (professionalId: string) => {
  try {
    const result = await getProfesionalSelectedByProfesionalIdService(professionalId);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching processes for professional ID ${professionalId}: ${errorMessage}`);
  }
};

export const updateProfesionalFromProcess = async (processId: number, professionalId: string, data: any) => {};

export const deleteProcessById = async (processId: number) => {
  try {
    const result = await deleteProcessByIdService(processId);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error deleting process with ID ${processId}: ${errorMessage}`);
  }
};

export const getAllProcesses = async() => {
  const result = await getAllProcessesService()
  return result;
}

export const getAllProfesionalsPostulatedByAddedBy = async (addedBy: string | null) => {
  switch (addedBy) {
    case 'profesional':
      return await getAllProfesionalAddedByProfesionalService();
    case 'institution':
      return await getAllProfesionalAddedByInstitutionService();
        case null:
      return await getAllProfesionalAddedByService();
    default:
      throw new Error(`Invalid addedBy value: ${addedBy}`);
  }
}