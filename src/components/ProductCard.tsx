import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { StockBadge } from "@/components/StockBadge";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-1 last:border-0">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-neutral-50"
      >
        <Image
          src={product.image}
          alt={`${product.model} carbon rim`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          {product.series}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              {product.model}
            </h3>
            <p className="text-sm text-neutral-500">
              {product.discipline} · {product.rimSize}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-neutral-900">
              ${product.price}
            </div>
            <div className="text-[11px] text-neutral-400">per rim</div>
          </div>
        </div>

        <dl className="mt-3 space-y-0 text-xs">
          <Spec label="Internal width" value={`${product.internalWidth} mm`} />
          <Spec label="External width" value={`${product.externalWidth} mm`} />
          <Spec label="Depth" value={`${product.depth} mm`} />
        </dl>

        <div className="mt-4 flex items-center justify-between">
          <StockBadge stock={product.stock} />
        </div>

        <Link
          href={`/product/${product.id}`}
          className={`mt-4 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            soldOut
              ? "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              : "bg-neutral-900 text-white hover:bg-neutral-700"
          }`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
