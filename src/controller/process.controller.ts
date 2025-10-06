import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

import { createExtraSpecialityService, createProcessService, getProcessesByUserIdService } from "@/service/process.service";

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
}
