"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chat-store";

/** Loads the persisted conversation after hydration to avoid SSR mismatches. */
export function useHydrateChatStores(): void {
  useEffect(() => {
    void useChatStore.persist.rehydrate();
  }, []);
}
