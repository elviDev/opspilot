import { z } from "zod";
import { LANGUAGE_CODES, MAX_QUESTION_LENGTH } from "./constants";

export const languageSchema = z.enum(LANGUAGE_CODES);

export const chatRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Ask a question first")
    .max(MAX_QUESTION_LENGTH, `Keep questions under ${MAX_QUESTION_LENGTH} characters`),
  language: languageSchema,
});

export const chatResponseSchema = z.object({
  answer: z.string(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
