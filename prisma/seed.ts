import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Dress", slug: "dress" },
    { name: "T-Shirt", slug: "t-shirt" },
    { name: "Shorts", slug: "shorts" }
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

  const products = [
    { name: "Summer Floral Dress", description: "Lightweight midi dress.", price: "49.99", stock: 20, categoryId: dress.id },
    { name: "Classic White Tee", description: "Soft cotton t-shirt.", price: "19.99", stock: 60, categoryId: tshirt.id },
    { name: "Denim Shorts", description: "Casual daily shorts.", price: "29.99", stock: 35, categoryId: shorts.id }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `${product.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId
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
