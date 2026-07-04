import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductById } from "@/lib/products";
import { StockBadge } from "@/components/StockBadge";
import { PurchasePanel } from "@/components/PurchasePanel";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Rim not found | Outlet" };
  return {
    title: `${product.model} — ${product.series} | Outlet`,
    description: `${product.model} ${product.series} carbon rim. ${product.discipline}, ${product.rimSize}, ${product.internalWidth}mm internal width. In stock at outlet pricing.`,
  };
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-2.5 text-sm">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900">
          Outlet Inventory
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{product.series}</span>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{product.model}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
            <Image
              src={product.image}
              alt={`${product.model} carbon rim`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
            <span className="absolute left-4 top-4 rounded bg-neutral-900 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {product.series}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            {product.model}
          </h1>
          <p className="mt-1 text-neutral-500">
            {product.series} · {product.discipline} · {product.rimSize}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-neutral-900">
              ${product.price}
            </span>
            <span className="text-sm text-neutral-400">per rim</span>
          </div>

          <div className="mt-3">
            <StockBadge stock={product.stock} />
            {product.stock > 0 && (
              <span className="ml-3 text-sm text-neutral-500">
                {product.stock} in the North American warehouse
              </span>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-neutral-200 p-5">
            <PurchasePanel product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Specifications</h2>
          <dl className="mt-3">
            <SpecRow label="Model" value={product.model} />
            <SpecRow label="Series" value={product.series} />
            <SpecRow label="Discipline" value={product.discipline} />
            <SpecRow label="Rim size" value={product.rimSize} />
            <SpecRow
              label="Internal width"
              value={`${product.internalWidth} mm`}
            />
            <SpecRow
              label="External width"
              value={`${product.externalWidth} mm`}
            />
            <SpecRow label="Depth" value={`${product.depth} mm`} />
            <SpecRow
              label="Available drillings"
              value={product.holeCounts.map((h) => `${h}H`).join(" / ")}
            />
            <SpecRow label="Material" value="Toray T700 / T800 carbon fiber" />
            <SpecRow label="Tubeless" value="Tubeless compatible" />
          </dl>
        </div>

        <div>
          <h2 className="text-lg font-bold text-neutral-900">About this rim</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            The {product.model} is part of our {product.series} series, built
            for {product.discipline.toLowerCase()} riding on {product.rimSize}{" "}
            wheels. With a {product.internalWidth}mm internal width and{" "}
            {product.depth}mm depth, it offers a well-balanced platform that is
            tubeless compatible and hand-inspected before it leaves the
            warehouse.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Choose your hole count, carbon finish and decal colour above. Outlet
            items ship from our North American warehouse, typically within 2
            business days.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block text-sm font-semibold text-neutral-900 underline underline-offset-2"
          >
            ← Back to inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
