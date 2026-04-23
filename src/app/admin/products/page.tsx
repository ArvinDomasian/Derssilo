import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProductsPage() {
  try {
    await requireAdmin();
  } catch {
    return <p>Admin access only.</p>;
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin: Products</h1>

      <form action="/api/admin/products" method="post" className="space-y-3 rounded border bg-white p-4">
        <h2 className="font-semibold">Add product</h2>
        <input name="name" placeholder="Product name" className="w-full rounded border px-3 py-2 text-sm" required />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full rounded border px-3 py-2 text-sm"
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            className="w-full rounded border px-3 py-2 text-sm"
            required
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            className="w-full rounded border px-3 py-2 text-sm"
            required
          />
        </div>
        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <select name="categoryId" className="w-full rounded border px-3 py-2 text-sm" required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
          Add Product
        </button>
      </form>

      <div className="rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category.name}</td>
                <td className="p-3">${product.price.toString()}</td>
                <td className="p-3">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
