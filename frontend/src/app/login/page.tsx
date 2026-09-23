import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";
import { safeRedirectSchema } from "@/features/auth/schemas";
import { isAuthEnabled } from "@/features/auth/server/session-token";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Container className="flex max-w-sm flex-col py-20">
      <Card className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Enter the dashboard password to continue.</p>
        </div>
        <Suspense fallback={<LoginForm next="/" />}>
          <LoginFormWithRedirect searchParams={searchParams} />
        </Suspense>
      </Card>
    </Container>
  );
}

async function LoginFormWithRedirect({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next } = await searchParams;
  if (!isAuthEnabled()) redirect("/");
  return <LoginForm next={safeRedirectSchema.parse(typeof next === "string" ? next : "/")} />;
}
