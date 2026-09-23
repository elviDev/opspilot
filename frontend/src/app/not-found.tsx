import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        action={
          <Link href="/" className="text-sm font-medium text-accent hover:underline">
            Back to the dashboard
          </Link>
        }
      >
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </EmptyState>
    </Container>
  );
}
