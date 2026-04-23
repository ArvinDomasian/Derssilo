import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams?: { category?: string; product?: string };
};

export default async function ShopPage({ searchParams }: PageProps) {
  const selectedCategory = searchParams?.category;
  const selectedProductId = searchParams?.product;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({
    where: selectedCategory ? { category: { slug: selectedCategory } } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
  const featuredProduct =
    products.find((product) => product.id === selectedProductId) ??
    products[0] ??
    null;

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr_300px]">
      <aside className="rounded-xl border border-slate-200 bg-slate-50/80">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-800">Filter</p>
        </div>
        <div className="space-y-6 p-5">
          <section>
            <p className="mb-3 text-sm font-semibold text-slate-800">Categories</p>
            <div className="space-y-2.5 text-sm text-slate-600">
              <Link href="/" className={`flex items-center gap-2 ${!selectedCategory ? "font-medium text-emerald-700" : ""}`}>
                <span className={`h-3.5 w-3.5 rounded border ${!selectedCategory ? "border-emerald-600 bg-emerald-500" : "border-slate-300"}`} />
                All
              </Link>
              {categories.map((cat) => {
                const active = selectedCategory === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.slug}`}
                    className={`flex items-center gap-2 ${active ? "font-medium text-emerald-700" : ""}`}
                  >
                    <span className={`h-3.5 w-3.5 rounded border ${active ? "border-emerald-600 bg-emerald-500" : "border-slate-300"}`} />
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </section>
          <section className="space-y-3 border-t border-slate-200 pt-5">
            <p className="text-sm font-semibold text-slate-800">Price range</p>
            <div className="grid grid-cols-2 gap-2">
              <input value="Min" readOnly className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400" />
              <input value="$400" readOnly className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500" />
            </div>
            <button className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Set price</button>
          </section>
        </div>
      </aside>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
        <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">Search products...</div>
        <p className="text-sm text-slate-500">
          Search result for <span className="font-semibold text-slate-800">"{featuredProduct?.name ?? "Items"}"</span>
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-2 text-slate-500">Sort</span>
          <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-white">Relevance</button>
          <button className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-600">Popular</button>
          <button className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-600">Most New</button>
          <button className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-600">Price</button>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-slate-200 p-4">
              <Link href={`/?category=${selectedCategory ?? ""}&product=${product.id}`} className="block">
                <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    "No image"
                  )}
                </div>
              </Link>
              <h2 className="line-clamp-1 font-semibold text-slate-800">{product.name}</h2>
              <div className="mt-1 text-xs text-amber-500">★★★★★ <span className="text-slate-400">(85)</span></div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-bold text-slate-900">${product.price.toString()}</p>
                <form action="/api/cart" method="post">
                  <input type="hidden" name="productId" value={product.id} />
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700" type="submit">
                    Add to cart
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="rounded-xl border border-slate-200 bg-white p-5">
        {featuredProduct ? (
          <div className="space-y-4">
            <button className="ml-auto block text-slate-400">x</button>
            <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400">
              {featuredProduct.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                "No image"
              )}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="h-10 w-10 rounded-full bg-slate-100" />
              ))}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{featuredProduct.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{featuredProduct.description}</p>
            </div>
            <div className="text-sm text-slate-500">Category: {featuredProduct.category.name}</div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No products available.</p>
        )}
      </aside>
    </div>
  );
}
