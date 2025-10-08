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

export const useInstitution = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/", fetcher);

  return { data, error, isLoading, mutate };
};
export const useInstitutionById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/institution/${id}`, fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionFullById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/institution/complete/${id}`, fetcher);
  return { data, error, isLoading, mutate };
}

export const useInstitutionFull = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/complete", fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionSpecializations = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/speciality", fetcher);
  return { data, error, isLoading, mutate };
};

export const useAllInstitutions = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/all", fetcher);
  return { data, error, isLoading, mutate };
};

export const usePaginatedInstitutions = (page: number = 1, limit: number = 9, search?: string, country?: string, specialization?: string) => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const countryParam = country ? `&country=${encodeURIComponent(country)}` : "";
  const specializationParam = specialization ? `&specialization=${encodeURIComponent(specialization)}` : "";
  const { data, error, isLoading, mutate } = useSWR<any>(
    `/api/platform/institution/paginated?page=${page}&limit=${limit}${searchParam}${countryParam}${specializationParam}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};

export const useInstitutionSpeciality = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/speciality/${id}` : null, fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionCertifications = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/certification", fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionCertification = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/certification/${id}` : null, fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionGoals = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/institution/goal", fetcher);
  return { data, error, isLoading, mutate };
};

export const useInstitutionGoal = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(id ? `/api/platform/institution/goal/${id}` : null, fetcher);
  return { data, error, isLoading, mutate };
};
