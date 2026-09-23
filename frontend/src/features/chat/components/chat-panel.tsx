"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAskQuestion } from "../hooks/use-ask-question";
import { useHydrateChatStores } from "../hooks/use-hydrate-chat-stores";
import { useChatStore } from "../store/chat-store";
import { ChatForm } from "./chat-form";
import { ChatThread } from "./chat-thread";
import { LanguageSelect } from "./language-select";

export function ChatPanel() {
  useHydrateChatStores();
  const messages = useChatStore((state) => state.messages);
  const clear = useChatStore((state) => state.clear);
  const { ask, isPending } = useAskQuestion();

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle>Ask OpsPilot</CardTitle>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clear} disabled={isPending} aria-label="Clear conversation">
              <Trash2 aria-hidden className="size-4" />
            </Button>
          )}
          <LanguageSelect />
        </div>
      </CardHeader>
      <ChatForm onSubmit={ask} isPending={isPending} />
      <ChatThread messages={messages} isPending={isPending} />
    </Card>
  );
}
