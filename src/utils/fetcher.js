/**
 * Fetcher mejorado con:
 * - Manejo de errores robusto
 * - Timeout explícito
 * - Reintentos automáticos en caso de fallo
 * - Mejor logging de errores
 */

const TIMEOUT = 120000; // 2 minutos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetcher = async (url, options = {}) => {
  let lastError;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Manejo de errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      // Success
      const data = await response.json();
      return data;
      
    } catch (error) {
      lastError = error;
      
      // No reintentar si es un error de validación (4xx) excepto timeout/503
      if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
        throw error;
      }
      
      // Si es el último intento, lanzar el error
      if (attempt === MAX_RETRIES - 1) {
        console.error(`[Fetcher] Error después de ${MAX_RETRIES} intentos:`, error);
        throw new Error(
          error.message || `Error fetching ${url} after ${MAX_RETRIES} retries`
        );
      }
      
      // Esperar antes de reintentar (con backoff exponencial)
      const delay = RETRY_DELAY * Math.pow(2, attempt);
      console.warn(
        `[Fetcher] Intento ${attempt + 1}/${MAX_RETRIES} falló. Reintentando en ${delay}ms...`,
        error.message
      );
      
      await sleep(delay);
    }
  }
  
  throw lastError || new Error(`Failed to fetch ${url}`);
}
