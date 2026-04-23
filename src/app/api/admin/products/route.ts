import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const priceValue = String(formData.get("price") ?? "").trim();
    const stockValue = String(formData.get("stock") ?? "").trim();
    const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "").trim();

    const price = Number(priceValue);
    const stock = Number(stockValue);
    const imageUrl = imageUrlRaw || null;

    if (!name || !description || !categoryId || Number.isNaN(price) || Number.isNaN(stock)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json({ error: "Price and stock must be non-negative" }, { status: 400 });
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: Math.floor(stock),
        imageUrl,
        categoryId
      }
    });

    return NextResponse.redirect(new URL("/admin/products", req.url));
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
