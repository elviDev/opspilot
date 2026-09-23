"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage as ChatMessageModel } from "../store/chat-store";

// The markdown renderer is only needed once there's an answer, so keep it out of the initial bundle.
const Markdown = dynamic(() => import("./markdown"), {
  loading: () => null,
});

export function ChatMessage({ message }: { message: ChatMessageModel }) {
  if (message.role === "user") {
    return (
      <li className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-accent/15 px-3 py-2 text-sm text-foreground">
        {message.content}
      </li>
    );
  }

  return (
    <li
      className={cn(
        "max-w-[95%] rounded-lg rounded-bl-sm border px-3 py-2 text-sm",
        message.role === "error"
          ? "border-danger/30 bg-danger/10 text-danger"
          : "border-border bg-background text-foreground/90",
      )}
    >
      {message.role === "error" ? message.content : <Markdown>{message.content}</Markdown>}
    </li>
  );
}
