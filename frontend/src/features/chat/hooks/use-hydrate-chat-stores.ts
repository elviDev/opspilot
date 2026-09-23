"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chat-store";
import { usePreferencesStore } from "../store/preferences-store";

/** Loads persisted chat state after hydration to avoid SSR mismatches. */
export function useHydrateChatStores(): void {
  useEffect(() => {
    void usePreferencesStore.persist.rehydrate();
    void useChatStore.persist.rehydrate();
  }, []);
}
