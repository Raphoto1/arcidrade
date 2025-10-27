export const useHandleSubmitText = async (data: any, url: string) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      // Usar el mensaje específico del servidor si está disponible
      const errorMessage = result.message || result.error || 'Error en la petición o la información proporcionada';
      throw new Error(errorMessage);
    }
    
    return response;
    
  } catch (error) {
    throw error;
  }
};
