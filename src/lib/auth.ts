import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function ensureUserRecord() {
  const session = auth();
  const userId = session.userId;

  if (!userId) {
    return null;
  }

  const existing = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (existing) {
    return existing;
  }

  const clerkUser = await currentUser();

  if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
    return null;
  }

  return prisma.user.create({
    data: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
      status: "PENDING"
    }
  });
}

export async function requireDbUser() {
  const user = await ensureUserRecord();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (user.status !== "APPROVED") {
    throw new Error("Account pending approval");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireDbUser();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}
