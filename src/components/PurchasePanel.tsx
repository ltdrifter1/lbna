"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-neutral-700">{label}</div>
      {children}
    </div>
  );
}

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const soldOut = product.stock <= 0;

  const [holeCount, setHoleCount] = useState<number>(product.holeCounts[0]);
  const [finish, setFinish] = useState<string>(product.finishes[0]);
  const [decalColor, setDecalColor] = useState<string>(product.decalColors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const maxQty = Math.max(1, product.stock);

  const handleAdd = () => {
    if (soldOut) return;
    addItem({
      id: product.id,
      model: product.model,
      series: product.series,
      price: product.price,
      image: product.image,
      holeCount: product.holeCounts.length ? holeCount : null,
      finish,
      decalColor,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  const selectClass =
    "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900";

  return (
    <div className="space-y-5">
      {product.holeCounts.length > 0 && (
        <OptionGroup label="Hole count">
          <select
            value={holeCount}
            onChange={(e) => setHoleCount(Number(e.target.value))}
            className={selectClass}
          >
            {product.holeCounts.map((h) => (
              <option key={h} value={h}>
                {h}H
              </option>
            ))}
          </select>
        </OptionGroup>
      )}

      <OptionGroup label="Finish">
        <div className="flex flex-wrap gap-2">
          {product.finishes.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFinish(f)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                finish === f
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </OptionGroup>

      <OptionGroup label="Decal colour">
        <select
          value={decalColor}
          onChange={(e) => setDecalColor(e.target.value)}
          className={selectClass}
        >
          {product.decalColors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </OptionGroup>

      <OptionGroup label="Quantity">
        <div className="inline-flex items-center rounded-md border border-neutral-300">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={soldOut}
            className="h-10 w-10 text-lg text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-semibold text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={soldOut}
            className="h-10 w-10 text-lg text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
          {!soldOut && (
            <span className="pl-3 pr-3 text-xs text-neutral-400">
              {product.stock} available
            </span>
          )}
        </div>
      </OptionGroup>

      <div className="border-t border-neutral-200 pt-5">
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={`inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-colors ${
            soldOut
              ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
              : "bg-neutral-900 text-white hover:bg-neutral-700"
          }`}
        >
          {soldOut ? "Out of stock" : `Add to Cart — $${product.price * quantity}`}
        </button>

        {added && (
          <div className="mt-3 flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            <span>Added to cart.</span>
            <Link href="/cart" className="font-semibold underline">
              View cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
