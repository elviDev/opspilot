import "server-only";
import { z } from "zod";
import type { ActionResult } from "@/lib/actions/action-result";
import { ApiError } from "@/lib/http/api-error";
import { getViewer } from "./dal";

/**
 * Shared Server Action pipeline: authorize, validate untrusted input, run,
 * and map failures to a safe ActionResult. Actions are public endpoints, so
 * every one re-checks the session instead of trusting the UI.
 */
export async function runAuthorizedAction<TSchema extends z.ZodType, TResult>(
  schema: TSchema,
  input: unknown,
  handler: (data: z.output<TSchema>) => Promise<TResult>,
): Promise<ActionResult<TResult>> {
  const viewer = await getViewer();
  if (!viewer.isAuthenticated) {
    return { ok: false, error: "Your session has expired. Sign in again." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  try {
    return { ok: true, data: await handler(parsed.data) };
  } catch (error) {
    if (ApiError.isApiError(error)) return { ok: false, error: error.message };
    console.error(error);
    return { ok: false, error: "Something went wrong. Try again." };
  }
}
