export const useHandleSubmitText = async (data: any, url: string) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error en la peticion o la informacion proporcionada');
    }
    return response.json();
    
  } catch (error) {
    throw error
  }

};
