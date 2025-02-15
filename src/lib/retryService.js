class RetryService {
  constructor() {
    this.DEFAULT_MAX_RETRIES = 3;
    this.DEFAULT_TIMEOUT = 30000; // 30 seconds
  }

  async withRetries(operation, options = {}) {
    const {
      maxRetries = this.DEFAULT_MAX_RETRIES,
      timeout = this.DEFAULT_TIMEOUT,
      retryableErrors = ['FunctionsFetchError', 'TypeError', 'FetchError'],
      onRetry = null
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Execute operation with timeout
        const result = await Promise.race([
          operation(attempt),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);

        return result;

      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, {
          attempt,
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack
          }
        });

        // Check if we should retry
        if (this._shouldRetry(error, attempt, maxRetries, retryableErrors)) {
          // Call retry callback if provided
          if (onRetry) {
            await onRetry(attempt, error);
          }

          // Wait with exponential backoff
          await this._wait(attempt);
          continue;
        }

        break;
      }
    }

    throw this._enhanceError(lastError, maxRetries);
  }

  _shouldRetry(error, attempt, maxRetries, retryableErrors) {
    if (attempt >= maxRetries) {
      return false;
    }

    // Retry on specified error types
    if (retryableErrors.includes(error.name)) {
      return true;
    }

    // Retry on timeout
    if (error.message === 'Request timeout') {
      return true;
    }

    // Retry on network errors
    if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return true;
    }

    // Retry on specific HTTP status codes
    if (error.status) {
      return [408, 429, 500, 502, 503, 504].includes(error.status);
    }

    return false;
  }

  async _wait(attempt) {
    const baseDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
    const jitter = Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
  }

  _enhanceError(error, maxRetries) {
    if (!error) {
      return new Error('Operation failed after retries');
    }

    error.retriesExhausted = true;
    error.maxRetries = maxRetries;
    
    if (error.name === 'FunctionsFetchError') {
      error.message = 'Failed to connect to video service after multiple attempts. Please try again later.';
    }

    return error;
  }
}

export const retryService = new RetryService();