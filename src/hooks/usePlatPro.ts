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

export const useProfesional = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/", fetcher);

  return { data, error, isLoading, mutate };
};

export const useProfesionalFull = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/complete", fetcher);
  return { data, error, isLoading, mutate };
};

export const useProfesionalSpecialities = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/speciality", fetcher);

  return { data, error, isLoading, mutate };
};

export const useProfesionalSpeciality = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/speciality/${id}`, fetcher);

  return { data, error, isLoading, mutate };
};

export const useProfesionalCertifications = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/certification", fetcher);

  return { data, error, isLoading, mutate };
};

export const useProfesionalCertification = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/certification/${id}`, fetcher);

  return { data, error, isLoading, mutate };
};

export const useProfesionalExperiences = () => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>("/api/platform/profesional/experience", fetcher);

  return { data, error, isLoading, mutate };
};

export const useProfesionalExperience = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR<ProfesionalResponse>(`/api/platform/profesional/experience/${id}`, fetcher);

  return { data, error, isLoading, mutate };
};

