import { OutletBrowser } from "@/components/OutletBrowser";
import { getAllProducts, distinct } from "@/lib/products";

export default function Home() {
  const products = getAllProducts();
  const series = distinct("series") as string[];
  const disciplines = distinct("discipline") as string[];
  const rimSizes = distinct("rimSize") as string[];
  const inStock = products.filter((p) => p.stock > 0).length;

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            North American Warehouse
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Outlet Inventory
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            In-stock carbon rims ready to ship. Browse our current selection of
            mountain, road, gravel and fat bike carbon rims — all at outlet
            pricing. Listed items usually ship within 2 business days.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-neutral-600">
            <div>
              <span className="text-2xl font-bold text-neutral-900">
                {products.length}
              </span>
              <span className="ml-2">models listed</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-neutral-900">
                {inStock}
              </span>
              <span className="ml-2">in stock now</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-neutral-900">
                {series.length}
              </span>
              <span className="ml-2">rim series</span>
            </div>
          </div>
        </div>
      </section>

      <div className="py-10">
        <OutletBrowser
          products={products}
          series={series}
          disciplines={disciplines}
          rimSizes={rimSizes}
        />
      </div>
    </div>
  );
}
