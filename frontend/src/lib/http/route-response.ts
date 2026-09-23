import "server-only";
import { ApiError } from "./api-error";

/** Maps any thrown error to a JSON error response without leaking internals. */
export function errorResponse(error: unknown): Response {
  if (ApiError.isApiError(error)) {
    // Upstream 5xx/timeouts surface as a gateway problem, not our own 500.
    const status = error.status >= 500 ? (error.status === 504 ? 504 : 502) : error.status;
    return Response.json({ error: error.message }, { status });
  }
  console.error(error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
