/**
 * Retry utility with exponential backoff for database operations
 * Helps handle transient connection failures in production
 * Special handling for Prisma P1001 (connection) errors
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
 * Check if error is a transient Prisma connection error (P1001)
 */
function isTransientConnectionError(error: any): boolean {
  const message = error?.message || '';
  const code = error?.code || '';
  
  // P1001: "failed to connect to upstream database"
  // Also check for common transient errors
  return (
    code === 'P1001' ||
    message.includes('failed to connect to upstream database') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ETIMEDOUT') ||
    message.includes('socket hang up') ||
    message.includes('Connection timeout') ||
    message.includes('EHOSTUNREACH') ||
    message.includes('ENETUNREACH')
  );
}

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
      
      const isTransient = isTransientConnectionError(error);
      
      // Log retry attempt with context
      console.error(`[Retry] Attempt ${attempt}/${opts.maxAttempts} failed:`, {
        message: lastError.message,
        code: (error as any)?.code,
        isTransient: isTransient ? 'YES (will retry)' : 'NO (permanent error)',
        attempt,
        nextRetryIn: attempt < opts.maxAttempts ? delay + 'ms' : 'no more retries'
      });

      // If it's not a transient error, fail immediately
      if (!isTransient && attempt > 1) {
        throw lastError;
      }

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
 * Specifically handles P1001 and other connection errors
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
