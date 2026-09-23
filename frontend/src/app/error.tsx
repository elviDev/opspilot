"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <Alert
        title="Something went wrong"
        action={
          <Button variant="secondary" size="sm" onClick={retry}>
            Try again
          </Button>
        }
      >
        An unexpected error occurred while rendering this page.
        {error.digest && <span className="mt-1 block font-mono text-xs">Reference: {error.digest}</span>}
      </Alert>
    </Container>
  );
}
