//derives the name and upserts the profile
import { prisma } from "@/lib/prisma";

// "hande.kavas@tufts.edu" -> "Hande Kavas"
export function nameFromEmail(email: string): string {
  const handle = email.split("@")[0];
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Create the profile if it doesn't exist yet; leave it alone if it does.
export async function upsertUserProfile(id: string, email: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (existing) return existing;

  try {
    return await prisma.user.create({
      data: { id, email, name: nameFromEmail(email) },
    });
  } catch (e: unknown) {
    // Another profile already uses this email (e.g. seeded data).
    // Don't block login; just skip creating a duplicate.
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return null;
    }
    throw e;
  }
}