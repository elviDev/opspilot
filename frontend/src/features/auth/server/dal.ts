import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { readSession } from "./session";
import { isAuthEnabled } from "./session-token";

export type Viewer = {
  authEnabled: boolean;
  isAuthenticated: boolean;
};

/**
 * Data Access Layer: the authoritative session check. The proxy only does an
 * optimistic redirect; everything that reads data re-verifies here.
 * Memoized per request so multiple callers share one verification.
 */
export const getViewer = cache(async (): Promise<Viewer> => {
  if (!isAuthEnabled()) return { authEnabled: false, isAuthenticated: true };
  const session = await readSession();
  return { authEnabled: true, isAuthenticated: session !== null };
});

/** For Server Components: redirects to the login page when unauthenticated. */
export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer.isAuthenticated) redirect("/login");
  return viewer;
}

/** For Route Handlers: returns a 401 response when unauthenticated, otherwise null. */
export async function unauthorizedResponse(): Promise<Response | null> {
  const viewer = await getViewer();
  return viewer.isAuthenticated ? null : Response.json({ error: "Unauthorized" }, { status: 401 });
}
