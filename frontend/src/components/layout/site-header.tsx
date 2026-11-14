import { Activity } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { SessionControls } from "@/features/auth/components/session-controls";
import { Container } from "./container";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/70 backdrop-blur-xl">
      <Container className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Activity aria-hidden className="size-5 text-accent" />
          {siteConfig.name}
        </Link>
        {/* Session is request-time data; the rest of the header stays in the static shell. */}
        <Suspense fallback={null}>
          <SessionControls />
        </Suspense>
      </Container>
    </header>
  );
}
