export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
  retryDelayMs: number
): Promise<T> => {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    if (maxRetries > 0 && 
        error instanceof Error && 
        typeof error === 'object' &&
        'status' in error &&
        typeof error.status === 'number' &&
        error.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      return withRetry(fn, maxRetries - 1, retryDelayMs);
    }
    throw error;
  }
};
