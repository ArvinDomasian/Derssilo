import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Dress", slug: "dress" },
    { name: "T-Shirt", slug: "t-shirt" },
    { name: "Shorts", slug: "shorts" },
    { name: "Women's Wear", slug: "womens-wear" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category
    });
  }

  const dress = await prisma.category.findUniqueOrThrow({ where: { slug: "dress" } });
  const tshirt = await prisma.category.findUniqueOrThrow({ where: { slug: "t-shirt" } });
  const shorts = await prisma.category.findUniqueOrThrow({ where: { slug: "shorts" } });
  const womensWear = await prisma.category.findUniqueOrThrow({ where: { slug: "womens-wear" } });

  const products = [
    {
      name: "Summer Floral Dress",
      description: "Lightweight midi dress.",
      price: "49.99",
      stock: 20,
      categoryId: dress.id,
      imageUrl: null
    },
    {
      name: "Classic White Tee",
      description: "Soft cotton t-shirt.",
      price: "19.99",
      stock: 60,
      categoryId: tshirt.id,
      imageUrl: null
    },
    {
      name: "Denim Shorts",
      description: "Casual daily shorts.",
      price: "29.99",
      stock: 35,
      categoryId: shorts.id,
      imageUrl: null
    },
    {
      name: "Powder Blue Coord Set",
      description:
        "Fashion women's wear coord set with a soft blue sleeveless top and wide-leg trousers. Elegant ladies outfit for casual and dressy styling.",
      price: "64.99",
      stock: 18,
      categoryId: womensWear.id,
      imageUrl: "/api/product-image/powder-blue-coord-set"
    },
    {
      name: "Olive Pleated Lounge Set",
      description:
        "Fashion women's wear pleated blouse and matching pants set. Modest ladies outfit with a polished silhouette for everyday styling.",
      price: "72.99",
      stock: 14,
      categoryId: womensWear.id,
      imageUrl: "/api/product-image/olive-pleated-lounge-set"
    },
    {
      name: "Floral Summer Halter Set",
      description:
        "Fashion women's wear floral halter top and shorts set. Lightweight ladies outfit with soft pink tones for warm-weather looks.",
      price: "58.99",
      stock: 22,
      categoryId: womensWear.id,
      imageUrl: "/api/product-image/floral-summer-halter-set"
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `${product.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl
      },
      create: {
        id: `${product.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...product
      }
    });
  }
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
