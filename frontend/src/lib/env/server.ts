import "server-only";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_URL: z.url().default("http://localhost:8000"),
  AUTH_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().min(32, "AUTH_SECRET must be at least 32 characters").optional(),
  ),
  DASHBOARD_PASSWORD: z.preprocess(
    emptyToUndefined,
    z.string().min(8, "DASHBOARD_PASSWORD must be at least 8 characters").optional(),
  ),
}).refine((env) => Boolean(env.AUTH_SECRET) === Boolean(env.DASHBOARD_PASSWORD), {
  message: "Set both AUTH_SECRET and DASHBOARD_PASSWORD to enable auth, or neither to run in public mode",
  path: ["AUTH_SECRET"],
});

const parsed = serverEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  // NEXT_PUBLIC_API_URL is accepted for backwards compatibility with older deployments.
  API_URL: emptyToUndefined(process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL),
  AUTH_SECRET: process.env.AUTH_SECRET,
  DASHBOARD_PASSWORD: process.env.DASHBOARD_PASSWORD,
});

if (!parsed.success) {
  throw new Error(`Invalid server environment:\n${z.prettifyError(parsed.error)}`);
}

export const serverEnv = {
  ...parsed.data,
  API_URL: parsed.data.API_URL.replace(/\/+$/, ""),
};
