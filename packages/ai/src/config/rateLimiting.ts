export interface RateLimitingConfig {
  requestsPerMinute: number;
  burstLimit: number;
}

export const rateLimiting: RateLimitingConfig = {
  requestsPerMinute: 60,
  burstLimit: 10,
};

export function validateRateLimitingConfig(config: RateLimitingConfig): void {
  if (typeof config.requestsPerMinute !== 'number' || config.requestsPerMinute <= 0) {
    throw new Error('requestsPerMinute must be a positive number');
  }
  if (typeof config.burstLimit !== 'number' || config.burstLimit <= 0) {
    throw new Error('burstLimit must be a positive number');
  }
}
