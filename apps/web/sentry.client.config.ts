import * as Sentry from "@sentry/nextjs";

/**
 * Sentry client config — error tracking no navegador.
 *
 * Ativo apenas se SENTRY_DSN estiver configurado.
 * Em desenvolvimento, não envia eventos.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: !!process.env.SENTRY_DSN,
});
