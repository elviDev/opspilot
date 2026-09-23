import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";
import { serverEnv } from "@/lib/env/server";

/*
 * Runtime-agnostic session primitives (no `next/headers`), shared by the
 * proxy (request/response cookies) and Server Components/Actions.
 */

export const SESSION_COOKIE_NAME = "opspilot_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
/** Sliding expiry: re-issue the token once it is older than this. */
const SESSION_REFRESH_AFTER_SECONDS = 60 * 60 * 24; // 1 day

const sessionPayloadSchema = z.object({
  sid: z.string().min(1),
  sub: z.literal("admin"),
  iat: z.number(),
  exp: z.number(),
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

export function isAuthEnabled(): boolean {
  return Boolean(serverEnv.AUTH_SECRET && serverEnv.DASHBOARD_PASSWORD);
}

function getSecretKey(): Uint8Array {
  if (!serverEnv.AUTH_SECRET) throw new Error("AUTH_SECRET is not configured");
  return new TextEncoder().encode(serverEnv.AUTH_SECRET);
}

export async function signSessionToken(sid: string = crypto.randomUUID()): Promise<string> {
  return new SignJWT({ sid })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    const parsed = sessionPayloadSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function shouldRefreshSession(session: SessionPayload): boolean {
  return Date.now() / 1000 - session.iat > SESSION_REFRESH_AFTER_SECONDS;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: serverEnv.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  } as const;
}
