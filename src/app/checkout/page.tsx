import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/auth";

export default async function CheckoutPage() {
  const { userId } = auth();

  if (!userId) {
    return <p>Please sign in to access checkout.</p>;
  }

  const user = await ensureUserRecord();

  if (!user) {
    return <p>Unable to load user account.</p>;
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true }
  });

  const total = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="rounded-lg border bg-white p-4">
        {cartItems.length === 0 ? (
          <p className="text-sm text-slate-600">
            Your cart is empty. <Link href="/">Go shopping.</Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} x {item.qty}
                </span>
                <span>${(Number(item.product.price) * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 border-t pt-3 font-semibold">Total: ${total.toFixed(2)}</p>
      </div>

      <div className="flex gap-3">
        <form action="/api/orders/cod" method="post">
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
            Place Cash on Delivery
          </button>
        </form>
        <form action="/api/orders/mock-card" method="post">
          <button type="submit" className="rounded border px-4 py-2 text-sm">
            Pay with Card (Mock)
          </button>
        </form>
      </div>
    </div>
  );
}
