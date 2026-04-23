import { NextRequest, NextResponse } from "next/server";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await requireDbUser();
    const formData = await req.formData();
    const productId = String(formData.get("productId") ?? "");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } }
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: { increment: 1 } }
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: user.id, productId, qty: 1 }
      });
    }

    return NextResponse.redirect(new URL("/checkout", req.url));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
