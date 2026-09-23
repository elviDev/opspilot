import { clientEnv } from "@/lib/env/client";

export const siteConfig = {
  name: "OpsPilot",
  title: "OpsPilot — AI Monitoring Dashboard",
  shortDescription: "Real-time uptime monitoring with AI-generated incident explanations.",
  description:
    "OpsPilot monitors your websites and APIs in real time, tracks uptime and response times, and uses AI to explain incidents in plain language — in your preferred language.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, ""),
  locale: "en_US",
  keywords: [
    "uptime monitoring",
    "incident management",
    "AI incident summaries",
    "status dashboard",
    "API monitoring",
    "website monitoring",
    "SRE tools",
    "observability",
  ],
  author: {
    name: "Ifeanyi Elvis Okeke",
    url: "https://github.com/elviDev",
  },
  repository: "https://github.com/elviDev/opspilot",
  themeColor: "#0b0d10",
} as const;

export type SiteConfig = typeof siteConfig;
