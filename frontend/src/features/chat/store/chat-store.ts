import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MAX_STORED_MESSAGES } from "../constants";

const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "error"]),
  content: z.string(),
  createdAt: z.string(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRole = ChatMessage["role"];

type ChatState = {
  messages: ChatMessage[];
  addMessage: (role: ChatRole, content: string) => void;
  clear: () => void;
};

/**
 * The conversation for this browser session. Stored in sessionStorage, so it
 * survives reloads but not closing the tab.
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: crypto.randomUUID(), role, content, createdAt: new Date().toISOString() },
          ].slice(-MAX_STORED_MESSAGES),
        })),
      clear: () => set({ messages: [] }),
    }),
    {
      name: "opspilot:chat",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: ({ messages }) => ({ messages }),
      merge: (persisted, current) => {
        const messages = z.array(chatMessageSchema).safeParse((persisted as Partial<ChatState>)?.messages);
        return { ...current, messages: messages.success ? messages.data : [] };
      },
    },
  ),
);
