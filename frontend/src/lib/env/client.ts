import { z } from "zod";

// NEXT_PUBLIC_* values are inlined at build time, so each one must be
// referenced literally rather than through a dynamic lookup.
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

// On Vercel, fall back to the production domain it exposes automatically.
const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || vercelProductionUrl,
});
