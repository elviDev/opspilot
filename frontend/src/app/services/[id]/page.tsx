import { HydrationBoundary } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { requireViewer } from "@/features/auth/server/dal";
import { prefetchServiceChecks } from "@/features/checks/server/prefetch-service-checks";
import { getDashboard } from "@/features/dashboard/server/get-dashboard";
import { prefetchDashboard } from "@/features/dashboard/server/prefetch-dashboard";
import { ServiceDetail } from "@/features/services/components/service-detail";
import { serviceIdSchema } from "@/features/services/schemas";

export const metadata: Metadata = {
  title: "Service details",
  // Per-service pages are operational data, not content worth indexing.
  robots: { index: false, follow: false },
};

export default function ServicePage({ params }: PageProps<"/services/[id]">) {
  return (
    <Container className="py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft aria-hidden className="size-4" />
        All services
      </Link>
      {/* params are request data, so they're read inside the boundary (static shell stays reusable). */}
      <Suspense fallback={<ServiceDetailSkeleton />}>
        <HydratedServiceDetail params={params} />
      </Suspense>
    </Container>
  );
}

async function HydratedServiceDetail({ params }: Pick<PageProps<"/services/[id]">, "params">) {
  await connection();
  await requireViewer();

  const parsedId = serviceIdSchema.safeParse((await params).id);
  if (!parsedId.success) notFound();
  const serviceId = parsedId.data;

  // Uses the shared server cache. If the backend is down we still render and let the client retry.
  const snapshot = await getDashboard().catch(() => null);
  if (snapshot && !snapshot.services.some((service) => service.id === serviceId)) notFound();

  const [dashboardState, checksState] = await Promise.all([
    prefetchDashboard(),
    prefetchServiceChecks(serviceId),
  ]);

  return (
    <HydrationBoundary state={dashboardState}>
      <HydrationBoundary state={checksState}>
        <ServiceDetail serviceId={serviceId} />
      </HydrationBoundary>
    </HydrationBoundary>
  );
}

function ServiceDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading service" className="flex flex-col gap-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
