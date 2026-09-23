import { unauthorizedResponse } from "@/features/auth/server/dal";
import { chatRequestSchema } from "@/features/chat/schemas";
import { askBackend } from "@/features/chat/server/ask-backend";
import { errorResponse } from "@/lib/http/route-response";

export async function POST(request: Request) {
  const denied = await unauthorizedResponse();
  if (denied) return denied;

  // Requiring JSON forces a CORS preflight for cross-site callers.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Expected application/json" }, { status: 415 });
  }

  const parsed = chatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  try {
    const response = await askBackend(parsed.data, request.signal);
    return Response.json(response, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
