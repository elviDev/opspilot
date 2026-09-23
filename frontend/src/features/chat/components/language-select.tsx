"use client";

import { Select } from "@/components/ui/select";
import { LANGUAGES, languageSchema } from "@/config/languages";
import { usePreferencesStore } from "@/stores/preferences-store";

export function LanguageSelect() {
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);

  return (
    <Select
      aria-label="Answer language"
      value={language}
      options={LANGUAGES}
      onChange={(event) => {
        const parsed = languageSchema.safeParse(event.target.value);
        if (parsed.success) setLanguage(parsed.data);
      }}
    />
  );
}
