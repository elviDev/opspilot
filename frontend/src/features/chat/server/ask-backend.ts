import "server-only";
import { backendFetch } from "@/lib/backend/client";
import { chatResponseSchema, type ChatRequest, type ChatResponse } from "../schemas";

/** LLM calls are slow; give them far more headroom than regular reads. */
const CHAT_TIMEOUT_MS = 45_000;

export function askBackend(request: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
  return backendFetch("/chat/", chatResponseSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    cache: "no-store",
    timeoutMs: CHAT_TIMEOUT_MS,
    signal,
  });
}
