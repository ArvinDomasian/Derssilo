import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireDbUser();
    const cart = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    if (cart.length === 0) {
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    }

    const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0);

    await prisma.order.create({
      data: {
        userId: user.id,
        total,
        paymentMethod: PaymentMethod.COD,
        paymentState: "pending_cod",
        items: {
          create: cart.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            unitPrice: item.product.price
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    return NextResponse.redirect(new URL("/checkout", req.url));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
