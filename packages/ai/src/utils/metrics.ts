export const metrics = {
  requestCount: 0,
  successCount: 0,
  errorCount: 0,
  totalResponseTime: 0
};

export const logMetrics = (duration: number, success: boolean) => {
  metrics.requestCount++;
  metrics.totalResponseTime += duration;
  if (success) {
    metrics.successCount++;
  } else {
    metrics.errorCount++;
  }

  console.log(`[Metrics] Request Count: ${metrics.requestCount}`);
  console.log(`[Metrics] Success Count: ${metrics.successCount}`);
  console.log(`[Metrics] Error Count: ${metrics.errorCount}`);
  console.log(`[Metrics] Average Response Time: ${metrics.totalResponseTime / metrics.requestCount}ms`);
};
