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

export const useActiveProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/active", fetcher);
  return { data, error, isLoading, mutate };
};

export const useActiveProcessesByUser = (userId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    userId ? `/api/platform/process/status/active/${userId}` : null,
    userId ? fetcher : null
  );
  return { data, error, isLoading, mutate };
};

export const usePendingProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/pending", fetcher);
  return { data, error, isLoading, mutate };
};

export const useArchivedProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/archived", fetcher);
  return { data, error, isLoading, mutate };
};

export const useProcess = (processId: number | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    processId ? `/api/platform/process/${processId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};

export const useProfesionalsListedInProcess = (processId: number | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    processId ? `/api/platform/process/candidates/${processId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};

export const useAllProfesionalsPostulatedByAddedBy = (addedBy: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    addedBy ? `/api/platform/process/all/candidates/${addedBy}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};

export const useAllProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export const useAllPendingProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all/pending`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}