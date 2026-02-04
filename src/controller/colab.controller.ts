import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { 
  getColabDataService, 
  createColabDataService,
  updateColabDataService 
} from "@/service/colab.service";

export const createColabData = async (data: any) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("No autenticado");
  }

  if (session.user.area !== "colab") {
    throw new Error("No autorizado");
  }

  const result = await createColabDataService(data);
  return result;
};

export const getColabData = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("No autenticado");
  }

  if (session.user.area !== "colab") {
    throw new Error("No autorizado");
  }

  const colabData = await getColabDataService(session.user.id);
  return colabData;
};