export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "de", label: "Deutsch" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["value"];

export const LANGUAGE_CODES = LANGUAGES.map((language) => language.value) as [LanguageCode, ...LanguageCode[]];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const MAX_QUESTION_LENGTH = 1000;

/** Oldest messages are dropped beyond this, keeping sessionStorage small. */
export const MAX_STORED_MESSAGES = 50;
