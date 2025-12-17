/**
 * Retry utility with exponential backoff for database operations
 * Helps handle transient connection failures in production
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 100,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

/**
 * Execute async function with exponential backoff retry
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log retry attempt
      console.error(`[Retry] Attempt ${attempt}/${opts.maxAttempts} failed:`, {
        message: lastError.message,
        attempt,
        nextRetryIn: delay + 'ms'
      });

      // Don't delay on last attempt
      if (attempt < opts.maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
      }
    }
  }

  throw new Error(
    `Operation failed after ${opts.maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Wrapper for Prisma operations with automatic retry
 */
export async function withPrismaRetry<T>(
  operation: () => Promise<T>
): Promise<T> {
  return withRetry(operation, {
    maxAttempts: 3,
    initialDelayMs: 100,
    maxDelayMs: 3000,
    backoffMultiplier: 2,
  });
}
