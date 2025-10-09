import { process_status } from "@/generated/prisma";
import prisma from "@/utils/db";

export const getProcessByIdDao = async (process_id: number) => {
  try {
    const process = await prisma.process.findUnique({
      where: { id: process_id },
      include: { extra_specialities: true, profesionals_listed: true },
    });
    return process;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching process with ID ${process_id}: ${errorMessage}`);
  }
};

export const getAllProcessesDao = async () => {
  try {
    const processes = await prisma.process.findMany();
    return processes;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching all processes: ${errorMessage}`);
  }
};

export const getProcessesByUserIdDao = async (user_id: string | undefined) => {
  try {
    const processes = await prisma.process.findMany({
      where: { user_id },
      include: { extra_specialities: true, profesionals_listed: true },
    });
    return processes;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching processes for user ID ${user_id}: ${errorMessage}`);
  }
};

export const getActiveProcessesByUserIdDao = async (user_id: string | undefined) => {
  try {
    const activeProcesses = await prisma.process.findMany({
      where: { status: "active", user_id },
    });
    return activeProcesses;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching active processes: ${errorMessage}`);
  }
};

export const getProcessesByUserIdFilteredByStatusDao = async (user_id: string | undefined, status: process_status) => {
  try {
    const filteredProcesses = await prisma.process.findMany({
      where: { status: status, user_id },
    });
    return filteredProcesses;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching filtered processes: ${errorMessage}`);
  }
};

export const getProcessesFilteredByStatusDao = async (status: process_status) => {
  try {
    const filteredProcesses = await prisma.process.findMany({
      where: { status: status },
    });
    return filteredProcesses;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching filtered processes: ${errorMessage}`);
  }
};

export const createProcessDao = async (data: any) => {
  try {
    const newProcess = await prisma.process.create({
      data,
    });
    return newProcess;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error creating process: ${errorMessage}`);
  }
};

export const getExtraSpecialitiesByProcessIdDao = async (process_id: number) => {
  try {
    const extraSpecialities = await prisma.extra_specialities.findMany({
      where: { process_id },
    });
    return extraSpecialities;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching extra specialities for process ID ${process_id}: ${errorMessage}`);
  }
};

export const deleteExtraSpecialityByProcessIdDao = async (process_id: number) => {
  try {
    const deletedExtraSpeciality = await prisma.extra_specialities.deleteMany({
      where: { process_id },
    });
    return deletedExtraSpeciality;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error deleting extra specialities for process ID ${process_id}: ${errorMessage}`);
  }
};

export const createExtraSpecialityDao = async (data: any) => {
  try {
    const newExtraSpeciality = await prisma.extra_specialities.create({
      data,
    });
    return newExtraSpeciality;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error creating extra speciality: ${errorMessage}`);
  }
};

export const updateProcessByIdDao = async (process_id: number, data: any) => {
  try {
    const updateResponse = await prisma.process.update({
      where: { id: process_id },
      data: data,
    });
    return updateResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error updating process: ${errorMessage}`);
  }
};

export const getProfesionalsSelectedByProcessIdDao = async (process_id: number) => {
  const result = await prisma.profesionals_listed.findMany({
    where: { process_id },
  });
  return result;
}

export const getProfesionalSelectedByProcessIdDao = async (process_id: number, profesional_id: string) => {
  const result = await prisma.profesionals_listed.findFirst({
    where: { process_id, profesional_id },
  });
  return result;
}

export const AddProfesionalToProcessDao = async (data:any) => {
  try {
    const create = await prisma.profesionals_listed.create({
      data: data,
    });
    return create;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error adding professional to process: ${errorMessage}`);
  }
};

export const deleteProfesionalFromProcessDao = async (process_id: number, profesional_id: string) => {
  try {
    const deletedProfesional = await prisma.profesionals_listed.deleteMany({
      where: { process_id, profesional_id },
    });
    return deletedProfesional;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error deleting professional from process: ${errorMessage}`);
  }
};
