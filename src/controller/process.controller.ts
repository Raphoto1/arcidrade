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
  updateProfesionalListedByProcessIdAndAddedByService,
  deleteProfesionalListedByProcessIdAndAddedByService,
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
    area: data.subArea,
  };

  const processCreated = await createProcessService(mainDataPack);

  if (data.title_category_1 || data.title_category_2) {
    if (data.title_category_1) {
      const extraSpecialityPack = {
        process_id: processCreated.id,
        speciality: data.title_category_1,
      };

      await createExtraSpecialityService(extraSpecialityPack);
    }
    if (data.title_category_2) {
      const extraSpecialityPack = {
        process_id: processCreated.id,
        speciality: data.title_category_2,
      };

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

export const getAllActiveProcesses = async () => {
  const result = await getAllProcessesByStatusService("active");
  return result;
};

export const getAllPendingProcesses = async () => {
  const result = await getAllProcessesByStatusService("pending");
  return result;
};

export const getAllPausedProcesses = async () => {
  const result = await getAllProcessesByStatusService("paused");
  return result;
};

export const getAllArchivedProcesses = async () => {
  const result = await getAllProcessesByStatusService("archived");
  return result;
};

export const getAllCompletedProcesses = async () => {
  const result = await getAllProcessesByStatusService("completed");
  return result;
};

export const getProccessesActiveByUserId = async (userId: string | undefined) => {
  const result = await getActiveProcessesByUserIdService(userId);
  return result;
};

export const getProcessById = async (processId: number) => {
  const result = await getProcessByIdService(processId);
  return result;
};

export const updateProcessStatusById = async (processId: number, status: string) => {
  if (status === "completed") {
    const dataPack = {
      status: status,
      end_date: new Date(),
    };
    const result = await updateProcessService(processId, dataPack);
    return result;
  } else {
    const dataPack = {
      status: status,
    };
    const result = await updateProcessService(processId, dataPack);
    return result;
  }
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
    area: data.subArea,
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

    // Obtener todas las postulaciones del profesional en este proceso
    const existingEntries = await getProfesionalsSelectedByProcessIdService(processId);

    // Filtrar las entradas que corresponden a este profesional
    const professionalEntries = existingEntries.filter((entry: any) => entry.profesional_id === professionalId);

    // Verificar si ya existe una entrada con el mismo added_by
    const duplicateEntry = professionalEntries.find((entry: any) => entry.added_by === added_by);

    if (duplicateEntry) {
      throw new Error(`Professional with ID ${professionalId} is already added to process ID ${processId} by ${added_by}`);
    }

    // Verificar que no exceda el límite de 3 postulaciones por proceso
    if (professionalEntries.length >= 3) {
      throw new Error(`Professional with ID ${professionalId} has already reached the maximum number of applications (3) for process ID ${processId}`);
    }

    // Validar que added_by sea uno de los valores permitidos
    const allowedAddedByValues = ["profesional", "institution", "arcidrade"];
    if (added_by && !allowedAddedByValues.includes(added_by)) {
      throw new Error(`Invalid added_by value: ${added_by}. Allowed values are: ${allowedAddedByValues.join(", ")}`);
    }

    const dataPack = {
      process_id: processId,
      profesional_id: professionalId,
      process_status: status,
      is_arcidrade: is_arcidrade,
      added_by: added_by,
    };

    const result = await addPProfesionalToProcessService(dataPack);
    return result;
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

export const updateProfesionalFromProcessVictor = async (processId: number, data: any) => {
  try {
    const { profesional_id, is_arci, added_by, process_status, feedback } = data;

    // Verificar que el proceso existe
    const process = await getProcessByIdService(processId);
    if (!process) {
      throw new Error(`Process with ID ${processId} not found`);
    }

    // Verificar que el profesional existe
    const profesional = await getUserDataService(profesional_id);
    if (!profesional) {
      throw new Error(`Professional with ID ${profesional_id} not found`);
    }

    // Preparar los datos para actualizar - corregir el nombre del campo
    const updateData: any = {
      updated_at: new Date(),
    };

    // Solo incluir campos que están definidos y tienen valores válidos
    if (is_arci !== undefined) {
      updateData.is_arcidrade = Boolean(is_arci); // Corregir nombre del campo
    }

    if (process_status !== undefined) {
      updateData.process_status = process_status;
    }

    if (feedback !== undefined) {
      updateData.feedback = feedback;
    }

    // Actualizar el registro
    const result = await updateProfesionalListedByProcessIdAndAddedByService(processId, profesional_id, added_by, updateData);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error updating professional in process: ${errorMessage}`);
  }
};
//PENDIENTE ASNTES DE HAACER PR
export const updateProfesionalFromProcessInstitution = async (processId: number, profesional_id: string, added_by: string, data: any) => {
  try {
    // Filtrar solo los campos que se pueden actualizar
    const updateData: any = {
      updated_at: new Date(),
    };

    // Solo incluir campos válidos para actualizar
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.is_arcidrade !== undefined) {
      updateData.is_arcidrade = data.is_arcidrade;
    }
    if (data.process_status !== undefined) {
      updateData.process_status = data.process_status;
    }
    if (data.feedback !== undefined) {
      updateData.feedback = data.feedback;
    }

    // Actualizar el registro
    const result = await updateProfesionalListedByProcessIdAndAddedByService(processId, profesional_id, added_by, updateData);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error updating professional in process: ${errorMessage}`);
  }
};

export const deleteProcessById = async (processId: number) => {
  try {
    const result = await deleteProcessByIdService(processId);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error deleting process with ID ${processId}: ${errorMessage}`);
  }
};

export const getAllProcesses = async () => {
  const result = await getAllProcessesService();
  return result;
};

export const getAllProfesionalsPostulatedByAddedBy = async (addedBy: string | null) => {
  switch (addedBy) {
    case "profesional":
      return await getAllProfesionalAddedByProfesionalService();
    case "institution":
      return await getAllProfesionalAddedByInstitutionService();
    case null:
      return await getAllProfesionalAddedByService();
    default:
      throw new Error(`Invalid addedBy value: ${addedBy}`);
  }
};

export const deleteProfesionalFromProcessVictor = async (processId: number, data: any) => {
  try {
    const { profesional_id, added_by } = data;
    const result = await deleteProfesionalListedByProcessIdAndAddedByService(processId, profesional_id, added_by);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error removing professional from process: ${errorMessage}`);
  }
};

export const updatePeriodOfProcessById = async (processId: number, data: any) => {
  try {
    const { extensionDays } = data;

    // Validar que extensionDays sea un número válido
    if (!extensionDays || isNaN(Number(extensionDays))) {
      throw new Error("extensionDays must be a valid number");
    }

    // Obtener el proceso actual
    const currentProcess = await getProcessByIdService(processId);
    if (!currentProcess) {
      throw new Error(`Process with ID ${processId} not found`);
    }

    // Validar que el proceso tenga una fecha de inicio
    if (!currentProcess.start_date) {
      throw new Error(`Process with ID ${processId} does not have a start_date`);
    }

    // Calcular la nueva fecha sumando los días de extensión al start_date
    const currentStartDate = new Date(currentProcess.start_date);
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(currentStartDate.getDate() + Number(extensionDays));

    // Preparar los datos para la actualización
    const updatePack: any = {
      extended: true,
      start_date: newStartDate,
      updated_at: new Date(),
    };

    // Actualizar el período del proceso
    const result = await updateProcessService(processId, updatePack);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error updating process period: ${errorMessage}`);
  }
};

export const updateTypeOfProcessById = async (processId: number, type: any) => {
  const response = await updateProcessService(processId, { type: type });
  return response;
};
