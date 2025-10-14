import { getAllProcesses, updateProcessById } from "@/controller/process.controller";
import {
  AddProfesionalToProcessDao,
  createExtraSpecialityDao,
  createProcessDao,
  deleteExtraSpecialityByProcessIdDao,
  deleteProfesionalFromProcessDao,
  deleteProcessByIdDao,
  getProcessByIdDao,
  getProcessesByUserIdDao,
  getProcessesByUserIdFilteredByStatusDao,
  getProcessesFilteredByStatusDao,
  getProfesionalSelectedByProcessIdDao,
  getProfesionalsSelectedByProcessIdDao,
  updateProcessByIdDao,
  getProfesionalSelectedByProfesionalIdDao,
  getAllProcessesDao,
  getProfesionalsByAddedByDao,
  getAllProfesionalAddedToProcessDao,
} from "@/dao/process.dao";

export const createProcessService = async (data: any) => {
  // Simulate a service call to create a process
  console.log("Service received data:", data);
  // Here you would typically interact with your database or other services
  const response = await createProcessDao(data);
  return response;
};

export const createExtraSpecialityService = async (data: any) => {
  // Simulate a service call to create an extra speciality
  console.log("Service received extra speciality data:", data);
  // Here you would typically interact with your database or other services
  const response = await createExtraSpecialityDao(data);
  return response;
};

export const getProcessesByUserIdService = async (userId: string | undefined) => {
  // Simulate a service call to get processes by user ID
  const result = await getProcessesByUserIdDao(userId);
  return result;
};

export const getProcessByIdService = async (processId: number) => {
  // Simulate a service call to get a process by its ID
  const result = await getProcessByIdDao(processId);
  return result;
};

export const getActiveProcessesByUserIdService = async (userId: string | undefined) => {
  // Simulate a service call to get active processes by user ID
  const result = await getProcessesByUserIdFilteredByStatusDao(userId, "active");
  return result;
};

export const getArchivedProcessesByUserIdService = async (userId: string | undefined) => {
  // Simulate a service call to get archived processes by user ID
  const result = await getProcessesByUserIdFilteredByStatusDao(userId, "archived");
  return result;
};

export const getPausedProcessesByUserIdService = async (userId: string | undefined) => {
  // Simulate a service call to get paused processes by user ID
  const result = await getProcessesByUserIdFilteredByStatusDao(userId, "paused");
  return result;
};

export const getPendingProcessesByUserIdService = async (userId: string | undefined) => {
  // Simulate a service call to get pending processes by user ID
  const result = await getProcessesByUserIdFilteredByStatusDao(userId, "pending");
  return result;
};

export const getCompletedProcessesByUserIdService = async (userId: string | undefined) => {
  // Simulate a service call to get completed processes by user ID
  const result = await getProcessesByUserIdFilteredByStatusDao(userId, "completed");
  return result;
};

export const getAllProcessesByStatusService = async (status: string) => {
  // Simulate a service call to get all processes by status
  const result = await getProcessesFilteredByStatusDao(status as any);
  return result;
};

export const getAllProcessesPendingService = async () => {
  const result = await getAllProcessesByStatusService("pending");
  return result;
};

export const deleteExtraSpecialityByProcessIdService = async (id: number) => {
  const result = await deleteExtraSpecialityByProcessIdDao(id);
  return result;
};

export const updateProcessService = async (id: number, data: any) => {
  const result = await updateProcessByIdDao(id, data);
  return result;
};

export const getProfesionalsSelectedByProcessIdService = async (process_id: number) => {
  const result = await getProfesionalsSelectedByProcessIdDao(process_id);
  return result;
};

export const getProfesionalSelectedByProcessIdService = async (process_id: number, profesional_id: string) => {
  const result = await getProfesionalSelectedByProcessIdDao(process_id, profesional_id);
  return result;
};

export const addPProfesionalToProcessService = async (dataPack: any) => {
  const result = await AddProfesionalToProcessDao(dataPack);
  return result;
};

export const deleteProfesionalFromProcessService = async (processId: number, profesionalId: string) => {
  const result = await deleteProfesionalFromProcessDao(processId, profesionalId);
  return result;
};

export const getProfesionalSelectedByProfesionalIdService = async (profesional_id: string) => {
  const result = await getProfesionalSelectedByProfesionalIdDao(profesional_id);
  return result;
};

export const getAllProfesionalAddedByProfesionalService = async () => {
  const result = await getProfesionalsByAddedByDao("profesional");
  return result;
};

export const getAllProfesionalAddedByInstitutionService = async () => {
  const result = await getProfesionalsByAddedByDao("institution");
  return result;
};

export const getAllProfesionalAddedByService = async () => {
  const result = await getAllProfesionalAddedToProcessDao();
  return result;
};

export const deleteProcessByIdService = async (process_id: number) => {
  const result = await deleteProcessByIdDao(process_id);
  return result;
};

export const getAllProcessesService = async () => {
  const result = await getAllProcessesDao();
  return result;
};
