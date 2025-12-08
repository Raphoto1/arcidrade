import useSWR from "swr";

const fetcher = async (url: string): Promise<Promise<any>> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error en la petición");
  }
  return res.json();
};

export const useCampaignData = () => {
  const { data, error, isLoading, mutate } = useSWR<any>("/api/platform/campaign/", fetcher);
  return { data, error, isLoading, mutate };
};

export const useCampaignLeads = () => {
  const { data, error, isLoading, mutate } = useSWR<any>(`/api/platform/campaign/leads`, fetcher);
  return { data, error, isLoading, mutate };
};
