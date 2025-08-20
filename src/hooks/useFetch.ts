export const useHandleSubmitText = async (data: any, url: string) => {
    console.log(data);
    
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit text');
  }

  return response.json();
};
