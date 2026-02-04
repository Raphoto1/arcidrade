import useSWR, { SWRConfiguration, mutate as globalMutate } from "swr";
import { fetcher } from "@/utils/fetcher";

type ProfesionalResponse = {
  payload: any; // Idealmente reemplazar con un tipo más preciso
};

// Configuración optimizada de SWR
const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minuto
  focusThrottleInterval: 300000, // 5 minutos
  errorRetryCount: 3,
  errorRetryInterval: 5000, // 5 segundos
  onError: (error) => {
    console.error('[SWR] Error fetching process data:', error.message);
  },
};

export const useProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useActiveProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/active", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useFinishedProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/completed", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
}

export const usePausedProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/paused", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
}

export const useActiveProcessesByUser = (userId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    userId ? `/api/platform/process/status/active/${userId}` : null,
    userId ? fetcher : null,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};

export const usePendingProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/pending", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useArchivedProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/process/status/archived", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProcess = (processId: number | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    processId ? `/api/platform/process/${processId}` : null,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};

export const useProfesionalsListedInProcess = (processId: number | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    processId ? `/api/platform/process/candidates/${processId}` : null,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};

export const useAllProfesionalsPostulatedByAddedBy = (addedBy: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    addedBy ? `/api/platform/process/all/candidates/${addedBy}` : null,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};

export const useAllProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all`,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export const useAllPendingProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all/pending`,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export const useAllActiveProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all/active`,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export const useAllPausedProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all/paused`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export const useAllArchivedProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all/archived`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export const useAllCompletedProcesses= () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/platform/process/all/completed`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

// Hook para obtener procesos públicos (sin autenticación)
export const usePublicActiveProcesses = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    `/api/public/process/active`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

// Función helper para revalidar todos los endpoints de procesos
export const revalidateAllProcesses = async () => {
  // Revalidar solo los endpoints de listas de procesos
  const endpoints = [
    '/api/platform/process/',
    '/api/platform/process/status/active',
    '/api/platform/process/status/pending',
    '/api/platform/process/status/paused',
    '/api/platform/process/status/archived',
    '/api/platform/process/status/completed',
    '/api/platform/process/all',
    '/api/platform/process/all/pending',
    '/api/platform/process/all/active',
    '/api/platform/process/all/paused',
    '/api/platform/process/all/archived',
    '/api/platform/process/all/completed',
  ];

  // Revalidar todos los endpoints en paralelo
  await Promise.all(endpoints.map(endpoint => globalMutate(endpoint)));
};