import { getViewer } from "@/features/auth/server/dal";
import { getServiceChecks } from "@/features/checks/server/get-service-checks";
import { serviceIdSchema } from "@/features/services/schemas";
import { errorResponse } from "@/lib/http/route-response";

export async function GET(_request: Request, { params }: RouteContext<"/api/services/[id]/checks">) {
  const viewer = await getViewer();
  if (!viewer.isAuthenticated) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const id = serviceIdSchema.safeParse((await params).id);
  if (!id.success) return Response.json({ error: "Invalid service id" }, { status: 400 });

  try {
    const checks = await getServiceChecks(id.data);
    return Response.json(checks, {
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
