"use client";

import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/http/api-error";
import { usePreferencesStore } from "@/stores/preferences-store";
import { askQuestion } from "../api/ask-question";
import { useChatStore } from "../store/chat-store";

export function useAskQuestion() {
  const addMessage = useChatStore((state) => state.addMessage);
  const language = usePreferencesStore((state) => state.language);

  const mutation = useMutation({
    mutationKey: ["chat", "ask"],
    mutationFn: askQuestion,
    onMutate: ({ question }) => addMessage("user", question),
    onSuccess: ({ answer }) => addMessage("assistant", answer),
    onError: (error) =>
      addMessage("error", getErrorMessage(error, "Couldn't reach the AI service. Try again in a moment.")),
  });

  return {
    ask: (question: string) => mutation.mutate({ question: question.trim(), language }),
    isPending: mutation.isPending,
  };
}
