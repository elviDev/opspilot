import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "./session-token";

export async function createSession(): Promise<void> {
  const token = await signSessionToken();
  (await cookies()).set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function readSession(): Promise<SessionPayload | null> {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE_NAME)?.value);
}
