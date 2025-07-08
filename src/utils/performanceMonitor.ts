/**
 * Performance monitoring utilities for tracking data provider operations
 */

interface PerformanceMetric {
  operation: string;
  resource: string;
  duration: number;
  timestamp: number;
  cacheHit?: boolean;
  dbCalls?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  startTimer(operation: string, resource: string): () => PerformanceMetric {
    const startTime = performance.now();

    return (cacheHit?: boolean, dbCalls?: number): PerformanceMetric => {
      const duration = performance.now() - startTime;
      const metric: PerformanceMetric = {
        operation,
        resource,
        duration,
        timestamp: Date.now(),
        cacheHit,
        dbCalls,
      };

      this.addMetric(metric);

      if (import.meta.env.MODE === "development") {
        console.log(
          `🚀 Performance: ${operation}(${resource}) took ${duration.toFixed(2)}ms`,
          {
            cacheHit: cacheHit ? "✅ Cache Hit" : "❌ Cache Miss",
            dbCalls: dbCalls ? `${dbCalls} DB calls` : "Unknown DB calls",
          },
        );
      }

      return metric;
    };
  }

  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only the last N metrics to prevent memory leaks
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(operation?: string, resource?: string): PerformanceMetric[] {
    return this.metrics.filter((metric) => {
      if (operation && metric.operation !== operation) return false;
      if (resource && metric.resource !== resource) return false;
      return true;
    });
  }

  getAverageTime(operation?: string, resource?: string): number {
    const filteredMetrics = this.getMetrics(operation, resource);
    if (filteredMetrics.length === 0) return 0;

    const totalTime = filteredMetrics.reduce(
      (sum, metric) => sum + metric.duration,
      0,
    );
    return totalTime / filteredMetrics.length;
  }

  getCacheHitRate(): number {
    const metricsWithCache = this.metrics.filter(
      (m) => m.cacheHit !== undefined,
    );
    if (metricsWithCache.length === 0) return 0;

    const hits = metricsWithCache.filter((m) => m.cacheHit).length;
    return (hits / metricsWithCache.length) * 100;
  }

  getPerformanceReport(): {
    totalOperations: number;
    averageTime: number;
    cacheHitRate: number;
    operationBreakdown: Record<string, { count: number; avgTime: number }>;
    slowestOperations: PerformanceMetric[];
  } {
    const operationBreakdown: Record<
      string,
      { count: number; avgTime: number }
    > = {};

    // Group by operation
    this.metrics.forEach((metric) => {
      const key = `${metric.operation}(${metric.resource})`;
      if (!operationBreakdown[key]) {
        operationBreakdown[key] = { count: 0, avgTime: 0 };
      }
      operationBreakdown[key].count++;
    });

    // Calculate averages
    Object.keys(operationBreakdown).forEach((key) => {
      const [operation, resource] = key.split("(");
      const cleanResource = resource?.replace(")", "");
      operationBreakdown[key].avgTime = this.getAverageTime(
        operation,
        cleanResource,
      );
    });

    // Get slowest operations
    const slowestOperations = [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    return {
      totalOperations: this.metrics.length,
      averageTime: this.getAverageTime(),
      cacheHitRate: this.getCacheHitRate(),
      operationBreakdown,
      slowestOperations,
    };
  }

  logPerformanceReport(): void {
    const report = this.getPerformanceReport();

    console.group("📊 Performance Report");
    console.log(`Total Operations: ${report.totalOperations}`);
    console.log(`Average Time: ${report.averageTime.toFixed(2)}ms`);
    console.log(`Cache Hit Rate: ${report.cacheHitRate.toFixed(1)}%`);

    console.group("Operation Breakdown:");
    Object.entries(report.operationBreakdown).forEach(([operation, stats]) => {
      console.log(
        `${operation}: ${stats.count} calls, ${stats.avgTime.toFixed(2)}ms avg`,
      );
    });
    console.groupEnd();

    if (report.slowestOperations.length > 0) {
      console.group("Slowest Operations:");
      report.slowestOperations.forEach((metric, index) => {
        console.log(
          `${index + 1}. ${metric.operation}(${metric.resource}): ${metric.duration.toFixed(2)}ms`,
        );
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  clear(): void {
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function to measure async operations
export const measureAsync = async <T>(
  operation: string,
  resource: string,
  fn: () => Promise<T>,
  cacheHit?: boolean,
  dbCalls?: number,
): Promise<T> => {
  const endTimer: (cacheHit?: boolean, dbCalls?: number) => PerformanceMetric =
    performanceMonitor.startTimer(operation, resource);

  try {
    const result = await fn();
    endTimer(cacheHit, dbCalls);
    return result;
  } catch (error) {
    endTimer(cacheHit, dbCalls);
    throw error;
  }
};

// Development helper to log performance report periodically
if (import.meta.env.MODE === "development") {
  // Log performance report every 30 seconds
  setInterval(() => {
    if (performanceMonitor.getMetrics().length > 0) {
      performanceMonitor.logPerformanceReport();
    }
  }, 30000);
}
