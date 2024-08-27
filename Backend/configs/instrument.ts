import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://a36f950fcc8557c9e377e56f0bab1b9f@o4507815562903552.ingest.us.sentry.io/4507815649869824",
    integrations: [nodeProfilingIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions

    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});
