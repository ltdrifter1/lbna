"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/light-bicycle-logo.svg"
            alt="Light Bicycle"
            width={170}
            height={29}
            priority
            className="h-6 w-auto sm:h-7"
          />
          <span className="hidden rounded border border-neutral-300 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 sm:inline">
            Outlet
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 sm:flex">
          <Link href="/" className="transition-colors hover:text-neutral-900">
            Inventory
          </Link>
          <Link
            href="/#filters"
            className="transition-colors hover:text-neutral-900"
          >
            Browse
          </Link>
          <a
            href="mailto:sales@carbonrim-outlet.example"
            className="transition-colors hover:text-neutral-900"
          >
            Contact
          </a>
        </nav>

        <Link
          href="/cart"
          className="relative inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Cart</span>
          {count > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
