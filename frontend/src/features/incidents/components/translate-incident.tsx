"use client";

import { Languages } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { LANGUAGES, languageSchema, type LanguageCode } from "@/config/languages";
import { getErrorMessage } from "@/lib/http/api-error";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useTranslateIncident } from "../hooks/use-translate-incident";

export function TranslateIncident({ incidentId }: { incidentId: number }) {
  const preferredLanguage = usePreferencesStore((state) => state.language);
  // null = follow the viewer's preferred language until they pick one here.
  const [picked, setPicked] = useState<LanguageCode | null>(null);
  const language = picked ?? preferredLanguage;
  const translate = useTranslateIncident();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Select
          aria-label="Summary language"
          value={language}
          options={LANGUAGES}
          disabled={translate.isPending}
          onChange={(event) => {
            const parsed = languageSchema.safeParse(event.target.value);
            if (parsed.success) setPicked(parsed.data);
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          isLoading={translate.isPending}
          onClick={() => translate.mutate({ incidentId, language })}
          title="Regenerate the AI summary in the selected language for everyone"
        >
          {!translate.isPending && <Languages aria-hidden className="size-3.5" />}
          {translate.isPending ? "Translating…" : "Translate"}
        </Button>
      </div>
      {translate.isError && (
        <p role="alert" className="text-xs text-danger">
          {getErrorMessage(translate.error, "Translation failed. Try again.")}
        </p>
      )}
    </div>
  );
}
