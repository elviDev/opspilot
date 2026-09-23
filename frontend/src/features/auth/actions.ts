"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { serverEnv } from "@/lib/env/server";
import { loginSchema, type LoginFormState } from "./schemas";
import { createSession, deleteSession } from "./server/session";
import { isAuthEnabled } from "./server/session-token";

function passwordsMatch(candidate: string, expected: string): boolean {
  // Hash first so both buffers have equal length, then compare in constant time.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(candidate), digest(expected));
}

export async function login(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  if (!isAuthEnabled() || !serverEnv.DASHBOARD_PASSWORD) redirect("/");

  const parsed = loginSchema.safeParse({
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (!passwordsMatch(parsed.data.password, serverEnv.DASHBOARD_PASSWORD)) {
    return { error: "Incorrect password" };
  }

  await createSession();
  redirect(parsed.data.next);
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
