import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PageHeader, SectionHeading } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { ChatPanel } from "@/features/chat/components/chat-panel";
import { HydratedDashboard } from "@/features/dashboard/components/hydrated-dashboard";
import { LiveIndicator } from "@/features/dashboard/components/live-indicator";
import { LiveIncidents, LiveServices } from "@/features/dashboard/components/live-sections";
import { IncidentListSkeleton, ServiceGridSkeleton } from "@/features/dashboard/components/skeletons";
import { buildWebPage } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  alternates: { canonical: "/" },
};

/*
 * Headings, layout and the chat panel are static and prerendered into the
 * shell; each live section streams in behind its own Suspense boundary.
 */
export default function DashboardPage() {
  return (
    <Container className="py-10">
      <JsonLd data={buildWebPage({ path: "/", name: siteConfig.title, description: siteConfig.description })} />

      <PageHeader
        title="Service status"
        description={siteConfig.shortDescription}
        actions={
          <Suspense fallback={null}>
            <HydratedDashboard>
              <LiveIndicator />
            </HydratedDashboard>
          </Suspense>
        }
      />

      <section aria-labelledby="services-heading" className="mb-10">
        <SectionHeading id="services-heading">Services</SectionHeading>
        <Suspense fallback={<ServiceGridSkeleton />}>
          <HydratedDashboard>
            <LiveServices />
          </HydratedDashboard>
        </Suspense>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section aria-labelledby="incidents-heading">
          <SectionHeading id="incidents-heading">Incidents</SectionHeading>
          <Suspense fallback={<IncidentListSkeleton />}>
            <HydratedDashboard>
              <LiveIncidents />
            </HydratedDashboard>
          </Suspense>
        </section>

        <section aria-labelledby="assistant-heading">
          <SectionHeading id="assistant-heading">AI Assistant</SectionHeading>
          <ChatPanel />
        </section>
      </div>
    </Container>
  );
}
