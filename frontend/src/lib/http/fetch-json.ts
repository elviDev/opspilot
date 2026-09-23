import type { z } from "zod";
import { ApiError } from "./api-error";

export type FetchJsonInit = RequestInit & { timeoutMs?: number };

function extractErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const record = body as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (typeof record.detail === "string") return record.detail;
  return undefined;
}

/**
 * Fetches JSON and validates it against a Zod schema, so every response that
 * crosses a network boundary is typed by what was actually received.
 */
export async function fetchJson<TSchema extends z.ZodType>(
  url: string,
  schema: TSchema,
  { timeoutMs = 10_000, headers, signal, ...init }: FetchJsonInit = {},
): Promise<z.output<TSchema>> {
  const timeout = AbortSignal.timeout(timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...headers },
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    if (timeout.aborted) throw new ApiError("The request timed out.", 504);
    throw new ApiError("The service is unreachable.", 503);
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(body) ?? `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError("Received an unexpected response shape.", 502);
  }
  return result.data;
}
