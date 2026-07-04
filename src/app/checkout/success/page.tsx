"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-neutral-900">
        Thank you for your order
      </h1>
      <p className="mt-3 text-neutral-600">
        Your payment was successful. A confirmation email is on its way, and
        your rims will ship from our North American warehouse within 2 business
        days.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
      >
        Back to inventory
      </Link>
    </div>
  );
}
