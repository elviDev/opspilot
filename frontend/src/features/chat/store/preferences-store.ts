import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_LANGUAGE, type LanguageCode } from "../constants";
import { languageSchema } from "../schemas";

type PreferencesState = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
};

/** Long-lived user preferences, persisted across visits. */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "opspilot:preferences",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated manually after mount to keep SSR and first client render identical.
      skipHydration: true,
      partialize: ({ language }) => ({ language }),
      merge: (persisted, current) => {
        const language = languageSchema.safeParse((persisted as Partial<PreferencesState>)?.language);
        return { ...current, language: language.success ? language.data : current.language };
      },
    },
  ),
);
