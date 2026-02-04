import useSWR from 'swr';
import { useSession } from 'next-auth/react';

interface UserStats {
  invited: number;
  registered: number;
  active: number;
  deactivated: number;
  total: number;
}

const fetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`Error ${res.status}:`, errorData);
      throw new Error(`HTTP ${res.status}: ${errorData.error || 'Unknown error'}`);
    }
    
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

export const useUserStats = () => {
  const { data: session } = useSession();
  
  // Determinar el endpoint según el área del usuario
  const endpoint = session?.user?.area === 'colab' 
    ? '/api/platform/colab/user-stats'
    : '/api/platform/victor/user-stats';

  const { data, error, isLoading, mutate } = useSWR(
    endpoint,
    fetcher,
    {
      refreshInterval: 30000, // Refrescar cada 30 segundos
      revalidateOnFocus: true,
      dedupingInterval: 30000, // Deduplicar requests en 30 segundos
      errorRetryCount: 2, // Máximo 2 reintentos
      errorRetryInterval: 5000, // 5 segundos entre reintentos
      shouldRetryOnError: true,
      onError: (err) => {
        console.warn('User stats fetch failed:', err.message);
      }
    }
  );

  const userStats: UserStats = {
    invited: data?.payload?.invited || 0,
    registered: data?.payload?.registered || 0,
    active: data?.payload?.active || 0,
    deactivated: data?.payload?.deactivated || 0,
    total: data?.payload?.total || 0,
  };

  return {
    userStats,
    isLoading,
    error: error || (!isLoading && !data?.success && data ? 'Error loading user stats' : null),
    mutate,
    rawData: data?.payload
  };
};

// Hook para obtener el conteo de un status específico
export const useUserCountByStatus = (status: keyof UserStats) => {
  const { userStats, isLoading, error } = useUserStats();
  
  return {
    count: userStats[status] || 0,
    isLoading,
    error
  };
};