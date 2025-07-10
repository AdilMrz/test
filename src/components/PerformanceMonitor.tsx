import { useEffect } from "react";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

/**
 * Performance monitoring component that tracks Core Web Vitals
 * and reports them for optimization purposes
 */
export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production or when explicitly enabled
    const shouldMonitor = 
      import.meta.env.PROD || 
      import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === "true";

    if (!shouldMonitor) return;

    const metrics: PerformanceMetrics = {};

    // Function to report metrics
    const reportMetric = (name: string, value: number) => {
      metrics[name as keyof PerformanceMetrics] = value;
      
      // Log to console in development
      if (import.meta.env.DEV) {
        console.log(`🚀 Performance Metric - ${name}:`, value);
      }

      // In production, you could send to analytics service
      // Example: analytics.track('performance_metric', { name, value });
    };

    // Largest Contentful Paint (LCP)
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              reportMetric('LCP', lastEntry.startTime);
            }
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          console.warn('LCP observation failed:', error);
        }
      }
    };

    // First Input Delay (FID)
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-input') {
                reportMetric('FID', (entry as any).processingStart - entry.startTime);
              }
            });
          });
          observer.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          console.warn('FID observation failed:', error);
        }
      }
    };

    // Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            });
            reportMetric('CLS', clsValue);
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('CLS observation failed:', error);
        }
      }
    };

    // First Contentful Paint (FCP)
    const observeFCP = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                reportMetric('FCP', entry.startTime);
              }
            });
          });
          observer.observe({ entryTypes: ['paint'] });
        } catch (error) {
          console.warn('FCP observation failed:', error);
        }
      }
    };

    // Time to First Byte (TTFB)
    const observeTTFB = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'navigation') {
                const navEntry = entry as PerformanceNavigationTiming;
                const ttfb = navEntry.responseStart - navEntry.requestStart;
                reportMetric('TTFB', ttfb);
              }
            });
          });
          observer.observe({ entryTypes: ['navigation'] });
        } catch (error) {
          console.warn('TTFB observation failed:', error);
        }
      }
    };

    // Start observing all metrics
    observeLCP();
    observeFID();
    observeCLS();
    observeFCP();
    observeTTFB();

    // Report bundle size information
    if (import.meta.env.DEV) {
      setTimeout(() => {
        const scripts = document.querySelectorAll('script[src]');
        let totalSize = 0;
        
        scripts.forEach((script) => {
          const src = (script as HTMLScriptElement).src;
          if (src.includes('index') || src.includes('vendor')) {
            // Estimate size based on typical bundle sizes
            console.log(`📦 Script loaded: ${src.split('/').pop()}`);
          }
        });

        console.log('🎯 Performance Tips:');
        console.log('- LCP should be < 2.5s');
        console.log('- FID should be < 100ms');
        console.log('- CLS should be < 0.1');
        console.log('- Check Network tab for bundle sizes');
      }, 2000);
    }

    // Cleanup function
    return () => {
      // PerformanceObserver cleanup is handled automatically
    };
  }, []);

  // This component doesn't render anything
  return null;
};

// Hook for manual performance tracking
export const usePerformanceTracking = () => {
  const trackCustomMetric = (name: string, value: number) => {
    if (import.meta.env.DEV) {
      console.log(`📊 Custom Metric - ${name}:`, value);
    }
    
    // In production, send to analytics
    // analytics.track('custom_performance_metric', { name, value });
  };

  const trackPageLoad = (pageName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      trackCustomMetric(`page_load_${pageName}`, loadTime);
    };
  };

  return {
    trackCustomMetric,
    trackPageLoad,
  };
};
