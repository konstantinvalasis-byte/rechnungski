import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  // Sentry-Projekt-Slug (Vercel-Integration liest SENTRY_AUTH_TOKEN automatisch)
  silent: true,
  disableLogger: true,
  sourcemaps: { disable: true },
});
