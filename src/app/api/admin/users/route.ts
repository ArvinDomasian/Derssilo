import { NextRequest, NextResponse } from "next/server";
import { AccountStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { userId, role, status } = (await req.json()) as {
      userId?: string;
      role?: "USER" | "ADMIN";
      status?: "PENDING" | "APPROVED" | "DECLINED";
    };
    if (!userId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const data: { role?: UserRole; status?: AccountStatus } = {};
    if (role !== undefined) {
      if (!Object.values(UserRole).includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      data.role = role;
    }
    if (status !== undefined) {
      if (!Object.values(AccountStatus).includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = status;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const userId = String(formData.get("userId") ?? "");
    const roleValue = formData.get("role");
    const statusValue = formData.get("status");

    if (!userId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const data: { role?: UserRole; status?: AccountStatus } = {};

    if (typeof roleValue === "string" && roleValue) {
      if (!Object.values(UserRole).includes(roleValue as UserRole)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      data.role = roleValue as UserRole;
    }

    if (typeof statusValue === "string" && statusValue) {
      if (!Object.values(AccountStatus).includes(statusValue as AccountStatus)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = statusValue as AccountStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data
    });

    return NextResponse.redirect(new URL("/admin/users", req.url));
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
