import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { userId, role } = (await req.json()) as { userId?: string; role?: "USER" | "ADMIN" };
    if (!userId || !role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
