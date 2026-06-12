import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getShopItems } from "@/lib/shopStore";

type ShopItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  purchaseLink: string;
};

export default async function ShopPage() {
  const items = await getShopItems();
  const products: ShopItem[] = items;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-6xl w-full self-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">Shop</p>

        {products.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Under development, we'll meet again soon.
          </p>
        ) : (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 md:gap-x-12 lg:gap-x-16">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="border border-neutral-200 p-4 md:p-5 flex flex-col gap-4 bg-white"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={`/images/${product.image}`}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    />
                  </div>

                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-sm font-medium tracking-widest uppercase text-neutral-900">
                      {product.title}
                    </h2>
                    <span className="text-xs tracking-widest uppercase text-neutral-700">
                      {product.price}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-600 leading-6">
                    {product.description}
                  </p>

                  <a
                    href={product.purchaseLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 border border-neutral-900 px-4 py-2 text-xs tracking-widest uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors self-start"
                  >
                    Access the purchasing link
                  </a>
                </article>
              ))}
              <div className="mt-6 sm:mt-0 text-sm md:text-base lg:text-lg text-neutral-600 leading-7 sm:flex sm:items-center sm:justify-end text-center sm:text-right pr-2 sm:-mr-14">
                <p className="tracking-[0.28em] sm:whitespace-nowrap">黑白明信片目前在淘宝有售，请搜索“燕也有小卖部”。</p>
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="w-full py-8 px-6 md:px-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400">
          &copy;2026 ChenYuanzhuo
        </p>
      </footer>
    </div>
  );
}
