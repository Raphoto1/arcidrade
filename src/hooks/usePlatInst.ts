import useSWR, { SWRConfiguration } from "swr";
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
    console.error('[SWR] Error fetching institution data:', error.message);
  },
};

export const useInstitution = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};
export const useInstitutionById = (id: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/${id}` : null, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useInstitutionFullById = (id: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(
    id ? `/api/platform/institution/complete/${id}` : null, 
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export const useInstitutionFull = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/complete", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useInstitutionSpecializations = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/speciality", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useAllInstitutions = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/all", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useAllActiveInstitutions = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/all/active", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useAllPausedInstitutions = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/all/paused", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
}

export const usePaginatedInstitutions = (page: number = 1, limit: number = 9, search?: string, country?: string, specialization?: string) => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const countryParam = country ? `&country=${encodeURIComponent(country)}` : "";
  const specializationParam = specialization ? `&specialization=${encodeURIComponent(specialization)}` : "";
  const { data, error, isLoading, mutate } = useSWR<any>(
    `/api/platform/institution/paginated?page=${page}&limit=${limit}${searchParam}${countryParam}${specializationParam}`,
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};

export const useInstitutionSpeciality = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/speciality/${id}` : null, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useInstitutionCertifications = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/certification", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useInstitutionCertification = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/certification/${id}` : null, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useInstitutionGoals = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/goal", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useInstitutionGoal = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/goal/${id}` : null, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};
