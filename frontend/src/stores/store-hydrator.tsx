"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "./preferences-store";

/**
 * Rehydrates app-wide persisted stores once, after the first client render,
 * so server HTML and the hydration pass always match.
 */
export function StoreHydrator() {
  useEffect(() => {
    void usePreferencesStore.persist.rehydrate();
  }, []);
  return null;
}
