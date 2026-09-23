import { connection } from "next/server";
import { getViewer } from "@/features/auth/server/dal";
import { getDashboard } from "@/features/dashboard/server/get-dashboard";
import { errorResponse } from "@/lib/http/route-response";

/**
 * BFF endpoint the client polls. Backend responses are cached server-side by
 * `getDashboard`; in public mode the CDN may also serve it briefly.
 */
export async function GET() {
  await connection();

  const viewer = await getViewer();
  if (!viewer.isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const snapshot = await getDashboard();
    return Response.json(snapshot, {
      headers: {
        "Cache-Control": viewer.authEnabled
          ? "private, no-store"
          : "public, max-age=0, s-maxage=15, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
