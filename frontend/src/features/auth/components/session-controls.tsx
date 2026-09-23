import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../actions";
import { getViewer } from "../server/dal";

/** Reads the session at request time, so render it inside a <Suspense> boundary. */
export async function SessionControls() {
  const viewer = await getViewer();
  if (!viewer.authEnabled || !viewer.isAuthenticated) return null;

  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut aria-hidden className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
