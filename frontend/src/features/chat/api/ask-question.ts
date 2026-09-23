import { fetchJson } from "@/lib/http/fetch-json";
import { chatResponseSchema, type ChatRequest, type ChatResponse } from "../schemas";

export function askQuestion(request: ChatRequest): Promise<ChatResponse> {
  return fetchJson("/api/chat", chatResponseSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    timeoutMs: 60_000,
  });
}
