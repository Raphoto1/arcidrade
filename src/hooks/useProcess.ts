import useSWR from "swr";

type ProfesionalResponse = {
  payload: any; // Idealmente reemplazar con un tipo más preciso
};

const fetcher = async (url: string): Promise<ProfesionalResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error en la petición");
  }
  return res.json();
};

export const useProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/", fetcher);
  return { data, error, isLoading, mutate };
};