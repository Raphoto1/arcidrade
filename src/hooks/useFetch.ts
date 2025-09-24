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
    const result = await response.json();
    console.log(result);
    
    return response
    
  } catch (error) {
    throw error
  }

};
