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
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      email,
      name: nameFromEmail(email),
    },
  });
}