import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Nur in Produktion aktiv
  enabled: process.env.NODE_ENV === "production",
  // Sampling: 10% der Transaktionen tracken (Performance-Monitoring)
  tracesSampleRate: 0.1,
  // Replay deaktiviert (kein Session-Recording)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
