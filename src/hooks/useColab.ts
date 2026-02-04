import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "@/utils/fetcher";

type ColabResponse = {
  payload: any;
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
    console.error('[SWR] Error fetching colab data:', error.message);
  },
};

export const useColab = () => {
  const { data, error, isLoading, mutate } = useSWR<ColabResponse>(
    "/api/platform/colab",
    fetcher,
    swrConfig
  );
  return { data, error, isLoading, mutate };
};
