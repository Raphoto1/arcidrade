import { createExtraSpecialityDao, createProcessDao, getProcessByIdDao, getProcessesByUserIdDao, getProcessesByUserIdFilteredByStatusDao } from "@/dao/process.dao";

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

export const getProcessesByUserIdService = async (userId: string|undefined) => {
  // Simulate a service call to get processes by user ID
    const result = await getProcessesByUserIdDao(userId);
    return result;
}

export const getProcessByIdService = async (processId: number) => {
  // Simulate a service call to get a process by its ID
    const result = await getProcessByIdDao(processId);
    return result;
}

export const getActiveProcessesByUserIdService = async (userId: string|undefined) => {
  // Simulate a service call to get active processes by user ID
    const result = await getProcessesByUserIdFilteredByStatusDao(userId, "active");
    return result;
}

export const getPendingProcessesByUserIdService = async (userId: string|undefined) => {
  // Simulate a service call to get pending processes by user ID
    const result = await getProcessesByUserIdFilteredByStatusDao(userId, "pending");
    return result;
}