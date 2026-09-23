import type { Graph } from "schema-dts";
import { siteConfig } from "@/config/site";

const ids = {
  website: `${siteConfig.url}/#website`,
  app: `${siteConfig.url}/#software`,
  author: `${siteConfig.url}/#author`,
} as const;

/** Site-wide knowledge graph: the website, the product, and its author. */
export function buildSiteGraph(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en",
        publisher: { "@id": ids.author },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ids.app,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Monitoring",
        operatingSystem: "Web",
        featureList: [
          "Real-time uptime and response-time monitoring",
          "AI-generated incident summaries",
          "Multi-language incident explanations",
          "AI chat assistant over incident history",
          "Slack alerts",
        ],
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@id": ids.author },
        sameAs: [siteConfig.repository],
      },
      {
        "@type": "Person",
        "@id": ids.author,
        name: siteConfig.author.name,
        url: siteConfig.author.url,
      },
    ],
  };
}

/** Page-level WebPage node linked into the site graph. */
export function buildWebPage({ path, name, description }: { path: string; name: string; description: string }): Graph {
  const url = `${siteConfig.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.app },
        inLanguage: "en",
      },
    ],
  };
}
