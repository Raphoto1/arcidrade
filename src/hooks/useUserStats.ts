import useSWR from 'swr';

interface UserStats {
  invited: number;
  registered: number;
  active: number;
  deactivated: number;
  total: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    console.error(`Error ${res.status}:`, errorData);
    throw new Error(`HTTP ${res.status}: ${errorData.error || 'Unknown error'}`);
  }
  return res.json();
};

export const useUserStats = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/platform/victor/user-stats',
    fetcher,
    {
      refreshInterval: 30000, // Refrescar cada 30 segundos
      revalidateOnFocus: true,
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
    error: error || (!isLoading && !data?.success ? 'Error loading user stats' : null),
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