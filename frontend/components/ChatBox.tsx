"use client";

import { useState } from "react";
import { askChat } from "@/lib/api";
import ReactMarkdown from "react-markdown";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
];

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("en");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const result = await askChat(question, language);
      setAnswer(result);
    } catch {
      setAnswer("Something went wrong reaching the AI service. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">Ask OpsPilot</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-background border border-border rounded-md text-sm px-2 py-1 text-white"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="e.g. Why did the payments service go down last night?"
          className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-accent text-background font-medium px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="text-sm text-gray-200 leading-relaxed border-t border-border pt-4">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
