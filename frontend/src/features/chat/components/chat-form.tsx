"use client";

import { SendHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_QUESTION_LENGTH } from "../constants";

type ChatFormProps = {
  onSubmit: (question: string) => void;
  isPending: boolean;
};

export function ChatForm({ onSubmit, isPending }: ChatFormProps) {
  const [question, setQuestion] = useState("");
  const canSubmit = question.trim().length > 0 && !isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(question);
    setQuestion("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="chat-question" className="sr-only">
        Ask a question about your incidents
      </label>
      <Input
        id="chat-question"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        maxLength={MAX_QUESTION_LENGTH}
        placeholder="e.g. Why did the payments service go down last night?"
        autoComplete="off"
      />
      <Button type="submit" disabled={!canSubmit} isLoading={isPending} aria-label="Ask">
        {!isPending && <SendHorizontal aria-hidden className="size-4" />}
        <span className="hidden sm:inline">Ask</span>
      </Button>
    </form>
  );
}
