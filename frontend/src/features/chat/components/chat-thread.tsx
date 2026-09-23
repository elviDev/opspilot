"use client";

import { useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { ChatMessage as ChatMessageModel } from "../store/chat-store";
import { ChatMessage } from "./chat-message";

type ChatThreadProps = {
  messages: ChatMessageModel[];
  isPending: boolean;
};

export function ChatThread({ messages, isPending }: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, isPending]);

  if (messages.length === 0 && !isPending) return null;

  return (
    <div className="max-h-96 overflow-y-auto border-t border-border pt-4">
      <ol aria-live="polite" aria-label="Conversation" className="flex flex-col gap-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isPending && (
          <li className="flex items-center gap-2 text-sm text-muted">
            <Spinner /> Thinking…
          </li>
        )}
      </ol>
      <div ref={endRef} />
    </div>
  );
}
