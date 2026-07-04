"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCart } from "@/lib/cart";

function CartContents() {
  const { items, subtotal, updateQuantity, removeItem, keyFor } = useCart();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            holeCount: i.holeCount,
            finish: i.finish,
            decalColor: i.decalColor,
            quantity: i.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Unable to start checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900">Your cart</h1>
        {canceled && (
          <p className="mt-3 text-sm text-amber-700">
            Checkout was canceled. Your cart is still here.
          </p>
        )}
        <p className="mt-4 text-neutral-500">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Browse inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Your cart</h1>
      {canceled && (
        <p className="mt-3 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-700">
          Checkout was canceled. Your cart is still here.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
            {items.map((item) => {
              const key = keyFor(item);
              return (
                <li key={key} className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                    <Image
                      src={item.image}
                      alt={item.model}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          className="font-semibold text-neutral-900 hover:underline"
                        >
                          {item.model}
                        </Link>
                        <p className="text-xs text-neutral-500">{item.series}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {[
                            item.holeCount ? `${item.holeCount}H` : null,
                            item.finish,
                            item.decalColor,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-neutral-900">
                        ${item.price * item.quantity}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-md border border-neutral-300">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(key, item.quantity - 1)
                          }
                          className="h-8 w-8 text-neutral-600 hover:bg-neutral-100"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(key, item.quantity + 1)
                          }
                          className="h-8 w-8 text-neutral-600 hover:bg-neutral-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="text-sm text-neutral-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-neutral-200 p-5">
            <h2 className="text-sm font-semibold text-neutral-900">
              Order summary
            </h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-semibold text-neutral-900">
                ${subtotal}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-neutral-500">Shipping</span>
              <span className="text-neutral-500">Calculated at checkout</span>
            </div>
            <div className="mt-4 border-t border-neutral-200 pt-4">
              <button
                type="button"
                onClick={checkout}
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Checkout with Stripe"}
              </button>
              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}
              <Link
                href="/"
                className="mt-3 block text-center text-sm text-neutral-500 hover:text-neutral-900"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-neutral-500">Loading cart…</div>}>
      <CartContents />
    </Suspense>
  );
}
