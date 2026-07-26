//tools to guard admin-only code
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// The logged-in user's profile (with role, team), or null if not signed in.
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  //getClaims() gives the verified user id (sub), 
  // then Prisma looks up their profile to read the role. 
  // the role comes from your database, checked on the server, not from anything the browser sends.
  const userId = data?.claims?.sub;
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
}

// Call this at the top of any admin-only page or route. Non-admins get bounced.
export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "ADMIN") {
    redirect("/");
  }
  return profile;
}