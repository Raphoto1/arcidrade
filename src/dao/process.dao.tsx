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

export const updateProcess = async (process_id: number, data: any) => {
  try {
    const updateResponse = await prisma.process.update({
      where: { id: process_id },
      data: data,
    });
    return updateResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error creating extra speciality: ${errorMessage}`);
  }
};
