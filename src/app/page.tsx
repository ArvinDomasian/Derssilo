import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams?: { category?: string; product?: string; sort?: string; special?: string; sub?: string; child?: string };
};

export default async function ShopPage({ searchParams }: PageProps) {
  const selectedCategory = searchParams?.category;
  const selectedProductId = searchParams?.product;
  const selectedSpecial = searchParams?.special;
  const selectedSub = searchParams?.sub;
  const selectedChild = searchParams?.child;
  const selectedSort = searchParams?.sort ?? "relevance";
  const sortKey =
    selectedSort === "popular" || selectedSort === "most-new" || selectedSort === "price" || selectedSort === "relevance"
      ? selectedSort
      : "relevance";
  const nextSort =
    sortKey === "relevance"
      ? "popular"
      : sortKey === "popular"
        ? "most-new"
        : sortKey === "most-new"
          ? "price"
          : "relevance";

  const specialCategories = [
    { key: "mobiles-gadgets", label: "Mobiles & Gadgets", keywords: ["mobile", "phone", "gadget", "electronics", "tech"] },
    { key: "health-personal-care", label: "Health & Personal Care", keywords: ["health", "care", "personal", "wellness", "beauty"] },
    { key: "home-living", label: "Home & Living", keywords: ["home", "living", "kitchen", "furniture", "decor"] },
    { key: "fashion", label: "Fashion", keywords: ["fashion", "dress", "shirt", "clothing", "apparel"] },
    { key: "groceries", label: "Groceries", keywords: ["grocery", "food", "snack", "drink", "fresh"] }
  ] as const;
  const mobileSubCategories = [
    { key: "phone", label: "Phone", keywords: ["phone", "mobile", "smartphone", "iphone", "android"] },
    { key: "tablet", label: "Tablet", keywords: ["tablet", "ipad", "tab"] },
    { key: "pc", label: "PC", keywords: ["pc", "laptop", "desktop", "computer", "notebook"] },
    { key: "monitor", label: "Monitor", keywords: ["monitor", "display", "screen"] },
    { key: "accessories", label: "Accessories", keywords: ["accessory", "charger", "cable", "earbuds", "headphone"] }
  ] as const;
  const healthSubCategories = [
    { key: "bath-body", label: "Bath & Body", keywords: ["bath", "body wash", "soap", "lotion", "shower"] },
    { key: "oral-care", label: "Oral Care", keywords: ["oral", "tooth", "toothpaste", "mouthwash", "dental"] },
    { key: "hair-care", label: "Hair Care", keywords: ["hair", "shampoo", "conditioner", "serum", "scalp"] },
    { key: "sun-care", label: "Sun Care", keywords: ["sun care", "sunscreen", "spf", "uv"] },
    { key: "whitening", label: "Whitening", keywords: ["whitening", "brightening", "tone", "lightening"] },
    { key: "facial-products", label: "Facial Products", keywords: ["facial", "face wash", "cleanser", "moisturizer", "serum"] }
  ] as const;
  const homeSubCategories = [
    { key: "storage", label: "Storage", keywords: ["storage", "organizer", "cabinet", "shelf", "container"] },
    { key: "dining", label: "Dining", keywords: ["dining", "tableware", "plate", "cutlery", "kitchen"] },
    { key: "office", label: "Office", keywords: ["office", "desk", "chair", "workspace", "stationery"] }
  ] as const;
  const fashionSubCategories = [
    { key: "mens-wear", label: "Men's wear", keywords: ["men", "mens", "male", "gent"] },
    { key: "womens-wear", label: "Women's wear", keywords: ["women", "womens", "female", "ladies"] },
    { key: "kids-wear", label: "Kids' wear", keywords: ["kids", "children", "child", "baby", "infant"] },
    { key: "footwear", label: "Footwear", keywords: ["shoe", "footwear", "sneaker", "sandal", "boot", "heel", "flat"] }
  ] as const;
  const mensWearChildCategories = [
    { key: "shirts", label: "Shirts", keywords: ["shirt", "t-shirt", "tee", "polo"] },
    { key: "trousers", label: "Trousers", keywords: ["trouser", "pants", "slacks", "chino"] },
    { key: "suits", label: "Suits", keywords: ["suit", "blazer", "formal"] },
    { key: "jackets", label: "Jackets", keywords: ["jacket", "coat", "outerwear"] }
  ] as const;
  const womensWearChildCategories = [
    { key: "dresses", label: "Dresses", keywords: ["dress", "gown"] },
    { key: "tops", label: "Tops", keywords: ["top", "blouse", "tee"] },
    { key: "skirts", label: "Skirts", keywords: ["skirt"] },
    { key: "jeans", label: "Jeans", keywords: ["jeans", "denim"] }
  ] as const;
  const kidsWearChildCategories = [
    { key: "children", label: "Children", keywords: ["children", "child", "kid", "boy", "girl"] },
    { key: "babies", label: "Babies", keywords: ["baby", "babies", "infant", "newborn", "toddler"] }
  ] as const;
  const footwearChildCategories = [
    { key: "sneakers", label: "Sneakers", keywords: ["sneaker", "trainer", "running shoe"] },
    { key: "sandals", label: "Sandals", keywords: ["sandal", "slipper"] },
    { key: "boots", label: "Boots", keywords: ["boot"] },
    { key: "heels", label: "Heels", keywords: ["heel", "stiletto", "pump"] },
    { key: "flats-casual-shoes", label: "Flats / Casual shoes", keywords: ["flat", "casual shoe", "loafer", "slip-on"] }
  ] as const;

  const getShopHref = (next: {
    category?: string;
    product?: string;
    sort?: string;
    special?: string;
    sub?: string;
    child?: string;
  }) => {
    const category = next.category ?? selectedCategory;
    const product = next.product ?? selectedProductId;
    const sort = next.sort ?? sortKey;
    const special = next.special ?? selectedSpecial;
    const sub = next.sub ?? selectedSub;
    const child = next.child ?? selectedChild;
    const query: Record<string, string> = {};

    if (category) query.category = category;
    if (product) query.product = product;
    if (sort && sort !== "relevance") query.sort = sort;
    if (special) query.special = special;
    if (sub) query.sub = sub;
    if (child) query.child = child;

    return { pathname: "/", query };
  };

  const categoryCardClass =
    "group flex items-center gap-3 rounded-2xl border border-transparent bg-white px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-emerald-100 hover:bg-emerald-50 hover:shadow-lg";
  const nestedCategoryCardClass =
    "block rounded-xl border border-transparent bg-white px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-emerald-100 hover:bg-white hover:shadow-md";
  const categoryDotClass = (active: boolean) =>
    `h-3.5 w-3.5 rounded-full border transition-colors duration-200 ${
      active ? "border-emerald-600 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-emerald-400"
    }`;
  const categoryLinkStateClass = (active: boolean) =>
    active ? "border-emerald-200 bg-emerald-50 font-medium text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900";
  const nestedCategoryLinkStateClass = (active: boolean) =>
    active ? "border-emerald-200 bg-emerald-50 font-semibold text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800";

  const orderBy =
    sortKey === "price"
      ? { price: "asc" as const }
      : sortKey === "popular"
        ? { stock: "desc" as const }
        : { createdAt: "desc" as const };

  const allProducts = await prisma.product.findMany({
    where: selectedCategory ? { category: { slug: selectedCategory } } : undefined,
    include: { category: true },
    orderBy
  });
  const activeSpecial = specialCategories.find((item) => item.key === selectedSpecial) ?? null;
  const activeMobileSub = mobileSubCategories.find((item) => item.key === selectedSub) ?? null;
  const activeHealthSub = healthSubCategories.find((item) => item.key === selectedSub) ?? null;
  const activeHomeSub = homeSubCategories.find((item) => item.key === selectedSub) ?? null;
  const activeFashionSub = fashionSubCategories.find((item) => item.key === selectedSub) ?? null;
  const activeMensWearChild = mensWearChildCategories.find((item) => item.key === selectedChild) ?? null;
  const activeWomensWearChild = womensWearChildCategories.find((item) => item.key === selectedChild) ?? null;
  const activeKidsWearChild = kidsWearChildCategories.find((item) => item.key === selectedChild) ?? null;
  const activeFootwearChild = footwearChildCategories.find((item) => item.key === selectedChild) ?? null;
  const products = activeSpecial
    ? allProducts.filter((product) => {
        const searchableText = `${product.name} ${product.description} ${product.category.name}`.toLowerCase();
        if (!activeSpecial.keywords.some((keyword) => searchableText.includes(keyword))) {
          return false;
        }
        if (activeSpecial.key === "mobiles-gadgets" && activeMobileSub) {
          return activeMobileSub.keywords.some((keyword) => searchableText.includes(keyword));
        }
        if (activeSpecial.key === "health-personal-care" && activeHealthSub) {
          return activeHealthSub.keywords.some((keyword) => searchableText.includes(keyword));
        }
        if (activeSpecial.key === "home-living" && activeHomeSub) {
          return activeHomeSub.keywords.some((keyword) => searchableText.includes(keyword));
        }
        if (activeSpecial.key === "fashion" && activeFashionSub) {
          const parentMatches = activeFashionSub.keywords.some((keyword) => searchableText.includes(keyword));
          if (!parentMatches) {
            return false;
          }
          if (activeFashionSub.key === "mens-wear" && activeMensWearChild) {
            return activeMensWearChild.keywords.some((keyword) => searchableText.includes(keyword));
          }
          if (activeFashionSub.key === "womens-wear" && activeWomensWearChild) {
            return activeWomensWearChild.keywords.some((keyword) => searchableText.includes(keyword));
          }
          if (activeFashionSub.key === "kids-wear" && activeKidsWearChild) {
            return activeKidsWearChild.keywords.some((keyword) => searchableText.includes(keyword));
          }
          if (activeFashionSub.key === "footwear" && activeFootwearChild) {
            return activeFootwearChild.keywords.some((keyword) => searchableText.includes(keyword));
          }
        }
        return true;
      })
    : allProducts;
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
            <div className="space-y-3 text-sm text-slate-600">
              <Link
                href={{ pathname: "/", query: sortKey === "relevance" ? {} : { sort: sortKey } }}
                className={`${categoryCardClass} ${categoryLinkStateClass(!selectedCategory && !selectedSpecial)}`}
              >
                <span className={categoryDotClass(!selectedCategory && !selectedSpecial)} />
                All
              </Link>
              {specialCategories.map((item) => {
                const active = selectedSpecial === item.key;
                return (
                  <div key={item.key} className="space-y-2.5">
                    <Link
                      href={getShopHref({
                        special: item.key,
                        sub:
                          item.key === "mobiles-gadgets"
                            ? selectedSub
                            : item.key === "health-personal-care"
                              ? selectedSub
                              : item.key === "home-living"
                                ? selectedSub
                                : item.key === "fashion"
                                  ? selectedSub
                              : "",
                        child: item.key === "fashion" ? selectedChild : "",
                        product: ""
                      })}
                      className={`${categoryCardClass} ${categoryLinkStateClass(active)}`}
                    >
                      <span className={categoryDotClass(active)} />
                      {item.label}
                    </Link>
                    {item.key === "mobiles-gadgets" && active && (
                      <div className="ml-4 space-y-2 border-l border-slate-200 pl-4 text-xs">
                        {mobileSubCategories.map((subItem) => {
                          const subActive = selectedSub === subItem.key;
                          return (
                            <Link
                              key={subItem.key}
                              href={getShopHref({ special: "mobiles-gadgets", sub: subItem.key, product: "" })}
                              className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(subActive)}`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {item.key === "health-personal-care" && active && (
                      <div className="ml-4 space-y-2 border-l border-slate-200 pl-4 text-xs">
                        {healthSubCategories.map((subItem) => {
                          const subActive = selectedSub === subItem.key;
                          return (
                            <Link
                              key={subItem.key}
                              href={getShopHref({ special: "health-personal-care", sub: subItem.key, product: "" })}
                              className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(subActive)}`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {item.key === "home-living" && active && (
                      <div className="ml-4 space-y-2 border-l border-slate-200 pl-4 text-xs">
                        {homeSubCategories.map((subItem) => {
                          const subActive = selectedSub === subItem.key;
                          return (
                            <Link
                              key={subItem.key}
                              href={getShopHref({ special: "home-living", sub: subItem.key, product: "" })}
                              className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(subActive)}`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {item.key === "fashion" && active && (
                      <div className="ml-4 space-y-2 border-l border-slate-200 pl-4 text-xs">
                        {fashionSubCategories.map((subItem) => {
                          const subActive = selectedSub === subItem.key;
                          return (
                            <div key={subItem.key} className="space-y-2">
                              <Link
                                href={getShopHref({ special: "fashion", sub: subItem.key, child: "", product: "" })}
                                className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(subActive)}`}
                              >
                                {subItem.label}
                              </Link>
                              {subItem.key === "mens-wear" && subActive && (
                                <div className="ml-4 space-y-2 border-l border-slate-200 pl-4">
                                  {mensWearChildCategories.map((childItem) => {
                                    const childActive = selectedChild === childItem.key;
                                    return (
                                      <Link
                                        key={childItem.key}
                                        href={getShopHref({
                                          special: "fashion",
                                          sub: "mens-wear",
                                          child: childItem.key,
                                          product: ""
                                        })}
                                        className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(childActive)}`}
                                      >
                                        {childItem.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                              {subItem.key === "womens-wear" && subActive && (
                                <div className="ml-4 space-y-2 border-l border-slate-200 pl-4">
                                  {womensWearChildCategories.map((childItem) => {
                                    const childActive = selectedChild === childItem.key;
                                    return (
                                      <Link
                                        key={childItem.key}
                                        href={getShopHref({
                                          special: "fashion",
                                          sub: "womens-wear",
                                          child: childItem.key,
                                          product: ""
                                        })}
                                        className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(childActive)}`}
                                      >
                                        {childItem.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                              {subItem.key === "kids-wear" && subActive && (
                                <div className="ml-4 space-y-2 border-l border-slate-200 pl-4">
                                  {kidsWearChildCategories.map((childItem) => {
                                    const childActive = selectedChild === childItem.key;
                                    return (
                                      <Link
                                        key={childItem.key}
                                        href={getShopHref({
                                          special: "fashion",
                                          sub: "kids-wear",
                                          child: childItem.key,
                                          product: ""
                                        })}
                                        className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(childActive)}`}
                                      >
                                        {childItem.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                              {subItem.key === "footwear" && subActive && (
                                <div className="ml-4 space-y-2 border-l border-slate-200 pl-4">
                                  {footwearChildCategories.map((childItem) => {
                                    const childActive = selectedChild === childItem.key;
                                    return (
                                      <Link
                                        key={childItem.key}
                                        href={getShopHref({
                                          special: "fashion",
                                          sub: "footwear",
                                          child: childItem.key,
                                          product: ""
                                        })}
                                        className={`${nestedCategoryCardClass} ${nestedCategoryLinkStateClass(childActive)}`}
                                      >
                                        {childItem.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
          <Link
            href={getShopHref({ sort: nextSort, product: "" })}
            className="mr-2 rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50"
            title={`Switch sort to ${nextSort}`}
          >
            Sort: {sortKey.replace("-", " ")}
          </Link>
          <Link
            href={getShopHref({ sort: "relevance", product: "" })}
            className={`rounded-full px-4 py-1.5 ${
              sortKey === "relevance" ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600"
            }`}
          >
            Relevance
          </Link>
          <Link
            href={getShopHref({ sort: "popular", product: "" })}
            className={`rounded-full px-4 py-1.5 ${
              sortKey === "popular" ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600"
            }`}
          >
            Popular
          </Link>
          <Link
            href={getShopHref({ sort: "most-new", product: "" })}
            className={`rounded-full px-4 py-1.5 ${
              sortKey === "most-new" ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600"
            }`}
          >
            Most New
          </Link>
          <Link
            href={getShopHref({ sort: "price", product: "" })}
            className={`rounded-full px-4 py-1.5 ${
              sortKey === "price" ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600"
            }`}
          >
            Price
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={getShopHref({ product: product.id })} className="block">
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
                    Checkout
                  </button>
                </form>
              </div>

              <div className="pointer-events-none absolute left-1/2 top-4 z-20 hidden w-[320px] -translate-x-1/2 rounded-[28px] border border-emerald-100 bg-white p-5 opacity-0 shadow-2xl transition-all duration-300 group-hover:pointer-events-auto group-hover:-translate-y-3 group-hover:opacity-100 lg:block">
                <div className="space-y-4">
                  <div className="flex h-52 items-center justify-center rounded-[24px] bg-slate-50 p-4 shadow-inner">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-white">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-[20px] border border-dashed border-slate-200 text-sm text-slate-400">
                          Product image
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50"
                      >
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={`${product.name} preview ${index}`} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400">Img</span>
                        )}
                      </div>
                    ))}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-semibold text-white">
                      +5
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">{product.category.name}</p>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight text-slate-900">{product.name}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Price</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">${product.price.toString()}</p>
                    </div>
                    <div className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200">
                      View item
                    </div>
                  </div>
                </div>
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
