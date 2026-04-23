import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";
import { chargeMockCard } from "@/lib/mock-payment";

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

    const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0).toFixed(2);
    const charge = await chargeMockCard({ amount: total, currency: "USD" });

    if (!charge.success) {
      return NextResponse.json({ error: "Mock card charge failed" }, { status: 400 });
    }

    await prisma.order.create({
      data: {
        userId: user.id,
        total,
        paymentMethod: PaymentMethod.MOCK_CARD,
        paymentState: charge.status,
        paymentRef: charge.transactionId,
        status: OrderStatus.PAID,
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
    return NextResponse.json({ error: "Unable to process mock payment" }, { status: 500 });
  }
}
