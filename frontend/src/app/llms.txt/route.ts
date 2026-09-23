import { siteConfig } from "@/config/site";

/**
 * llms.txt (https://llmstxt.org): a concise, Markdown-formatted guide to the
 * site for LLMs and AI agents. Static, so it's prerendered at build time.
 */
function buildLlmsTxt(): string {
  return `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is an AI-powered monitoring dashboard. It runs scheduled health checks against a list of URLs and APIs, records status codes and response times, opens an incident when a service keeps failing, and asks an LLM to explain the likely cause in plain language.

## Features

- Real-time monitoring: uptime percentage and average response time per service, refreshed automatically.
- AI incident summaries: each incident includes a plain-language explanation of what likely broke and what to check next.
- Multi-language answers: English, Spanish, French, Portuguese and German.
- AI assistant: answers questions such as "why did the payments service go down last night?" using real incident history.
- Slack alerts when a service goes down or recovers.

## Pages

- [Service status dashboard](${siteConfig.url}/): live service health, incident history and the AI assistant.

## Source

- [GitHub repository](${siteConfig.repository}): Next.js frontend and FastAPI backend source code.

## Optional

- [Sitemap](${siteConfig.url}/sitemap.xml)
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
