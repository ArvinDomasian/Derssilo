import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams?: { category?: string };
};

export default async function ShopPage({ searchParams }: PageProps) {
  const selectedCategory = searchParams?.category;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({
    where: selectedCategory ? { category: { slug: selectedCategory } } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Shop Clothing</h1>
        <p className="text-slate-600">Browse dresses, t-shirts, shorts, and more.</p>
      </section>

      <section className="flex flex-wrap gap-2">
        <Link href="/" className="rounded border px-3 py-1 text-sm">
          All
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/?category=${cat.slug}`} className="rounded border px-3 py-1 text-sm">
            {cat.name}
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{product.category.name}</p>
            <h2 className="font-semibold">{product.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{product.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-bold">${product.price.toString()}</p>
              <form action="/api/cart" method="post">
                <input type="hidden" name="productId" value={product.id} />
                <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" type="submit">
                  Add to cart
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
