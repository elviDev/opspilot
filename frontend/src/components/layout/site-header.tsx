import { Activity } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { SessionControls } from "@/features/auth/components/session-controls";
import { Container } from "./container";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-14 items-center justify-between">
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
