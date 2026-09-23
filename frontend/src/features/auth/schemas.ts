import { z } from "zod";

/** Only same-origin relative paths are allowed, preventing open redirects. */
export const safeRedirectSchema = z
  .string()
  .refine((path) => path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\"))
  .catch("/");

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required").max(256),
  next: safeRedirectSchema,
});

export type LoginFormState = {
  error?: string;
};
