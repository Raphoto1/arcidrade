import { describe, it, expect, vi } from 'vitest';
import { withRetry, withPrismaRetry } from '@/utils/retryUtils';

describe('withRetry', () => {
  it('retorna el resultado cuando la función tiene éxito al primer intento', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('reintenta y tiene éxito en el segundo intento con error transitorio', async () => {
    const transientError = Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' });
    const fn = vi
      .fn()
      .mockRejectedValueOnce(transientError)
      .mockResolvedValue('ok en el segundo intento');

    const result = await withRetry(fn, { maxAttempts: 3, initialDelayMs: 0 });
    expect(result).toBe('ok en el segundo intento');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('lanza error después del máximo de intentos con errores transitorios', async () => {
    const transientError = Object.assign(new Error('ETIMEDOUT'), { code: 'ETIMEDOUT' });
    const fn = vi.fn().mockRejectedValue(transientError);

    await expect(
      withRetry(fn, { maxAttempts: 3, initialDelayMs: 0 })
    ).rejects.toThrow(/Operation failed after 3 attempts/);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('lanza inmediatamente para errores no transitorios después del primer reintento', async () => {
    const permanentError = new Error('Error de lógica de negocio');
    const fn = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' }))
      .mockRejectedValue(permanentError);

    await expect(
      withRetry(fn, { maxAttempts: 5, initialDelayMs: 0 })
    ).rejects.toThrow('Error de lógica de negocio');
    // Debería detenerse en el segundo intento (el error permanente) sin agotar los 5
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('detecta error P1001 de Prisma como error transitorio', async () => {
    const p1001Error = Object.assign(new Error('failed to connect to upstream database'), {
      code: 'P1001',
    });
    const fn = vi.fn().mockRejectedValue(p1001Error);

    await expect(
      withRetry(fn, { maxAttempts: 2, initialDelayMs: 0 })
    ).rejects.toThrow(/Operation failed after 2 attempts/);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('respeta opciones personalizadas de maxAttempts', async () => {
    const transientError = Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' });
    const fn = vi.fn().mockRejectedValue(transientError);

    await expect(
      withRetry(fn, { maxAttempts: 1, initialDelayMs: 0 })
    ).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('withPrismaRetry', () => {
  it('retorna el resultado cuando la operación tiene éxito', async () => {
    const operation = vi.fn().mockResolvedValue({ id: 1, name: 'Test' });
    const result = await withPrismaRetry(operation);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('reintenta en errores de conexión Prisma P1001', async () => {
    const p1001Error = Object.assign(new Error('failed to connect to upstream database'), {
      code: 'P1001',
    });
    const operation = vi
      .fn()
      .mockRejectedValueOnce(p1001Error)
      .mockResolvedValue('datos');

    const result = await withPrismaRetry(operation);
    expect(result).toBe('datos');
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
