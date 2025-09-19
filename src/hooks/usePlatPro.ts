export const useProfesional = async () => {
    const response = await fetch(`/api/platform/profesional/`);
    const data = await response.json();
    console.log('useProfesional: ',data.payload); 
    return data;
}
