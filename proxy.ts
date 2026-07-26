//This runs on every request, refreshes the session, and (via the lib/supabase/proxy.ts)
//  redirects anyone not logged in to /login. The matcher skips static files so it doesn't waste work on images.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};