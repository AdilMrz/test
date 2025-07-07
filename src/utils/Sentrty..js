import * as Sentry from "@sentry/react";
// Import the necessary Sentry integrations
import "@sentry/tracing";
import { createRoot } from "react-dom/client";
import App from "./App"; // Adjust the path if App is located elsewhere

Sentry.init({
  dsn: "https://136fcfceda63cf13fbf595f25a9f2596@o4509628360228864.ingest.de.sentry.io/4509628362063952",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
