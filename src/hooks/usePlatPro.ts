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
    console.error('[SWR] Error fetching professional data:', error.message);
  },
};

export const useProfesional = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalById = (id: string) => { 
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/${id}`, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalFull = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/complete", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalSpecialities = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/speciality", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalSpeciality = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/speciality/${id}`, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalCertifications = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/certification", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalCertification = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/certification/${id}`, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalExperiences = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/experience", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const useProfesionalExperience = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/experience/${id}`, fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};


export const useAllProfesionals = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/all", fetcher, swrConfig);
  return { data, error, isLoading, mutate };
};

export const usePaginatedProfesionals = (page: number = 1, limit: number = 9, search?: string, speciality?: string, subArea?: string, status: string = 'active') => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const specialityParam = speciality ? `&speciality=${encodeURIComponent(speciality)}` : '';
  const subAreaParam = subArea ? `&subArea=${encodeURIComponent(subArea)}` : '';
  const statusParam = status ? `&status=${encodeURIComponent(status)}` : '';
  const { data, error, isLoading, mutate } = useSWR<any>(
    `/api/platform/profesional/paginated?page=${page}&limit=${limit}${searchParam}${specialityParam}${subAreaParam}${statusParam}`, 
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};
