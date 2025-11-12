import useSWR from "swr";

const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error en la petición");
  }
  return res.json();
};

// Hook para obtener leads de campaña de Victor
export const useVictorCampaignLeads = (type: "recent" | "stats" | "all" = "recent", filters?: {
  status?: string;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set("type", type);
  
  if (filters) {
    if (filters.status) searchParams.set("status", filters.status);
    if (filters.limit) searchParams.set("limit", filters.limit.toString());
  }

  const { data, error, isLoading, mutate } = useSWR<any>(
    `/api/platform/victor/campaign/leads?${searchParams.toString()}`, 
    fetcher
  );
  
  return { data, error, isLoading, mutate };
};

// Hook para obtener estadísticas de leads de campaña
export const useVictorCampaignStats = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    "/api/platform/victor/campaign/leads?type=stats", 
    fetcher
  );
  
  return { data, error, isLoading, mutate };
};

// Hook para obtener información general de campaña
export const useVictorCampaignData = (filters?: {
  area?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  
  if (filters) {
    if (filters.area) searchParams.set("area", filters.area);
    if (filters.status) searchParams.set("status", filters.status);
    if (filters.page) searchParams.set("page", filters.page.toString());
    if (filters.limit) searchParams.set("limit", filters.limit.toString());
  }

  const { data, error, isLoading, mutate } = useSWR<any>(
    `/api/platform/victor/campaign?${searchParams.toString()}`, 
    fetcher
  );
  
  return { data, error, isLoading, mutate };
};