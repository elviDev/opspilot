import { siteConfig } from "@/config/site";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <Container className="flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.shortDescription}</p>
        <nav aria-label="Footer" className="flex gap-4">
          <a href={siteConfig.repository} className="hover:text-foreground" rel="noopener noreferrer" target="_blank">
            Source on GitHub
          </a>
          <a href="/llms.txt" className="hover:text-foreground">
            llms.txt
          </a>
        </nav>
      </Container>
    </footer>
  );
}
