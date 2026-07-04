# CarbonRim Outlet

A simple, fast outlet storefront for a carbon bicycle rim distribution business,
inspired by the Light Bicycle North American stock list. Built with **Next.js
(App Router)**, **TypeScript**, and **Tailwind CSS**.

The design is intentionally clean and minimal — white background, simple
typography, responsive layout — and easy to scan.

## Features

- **Outlet Inventory** landing page with hero, live search, and filters for
  Series, Discipline, Rim Size, and Stock Status.
- Responsive product grid. Each card shows the image, model, series, discipline,
  rim size, internal/external width, depth, price, stock status, and a
  **View Details** button.
- **Product pages** with a large image, price, stock quantity, full
  specifications table, hole-count dropdown, finish selection, decal-colour
  selection, quantity selector, and **Add to Cart**.
- **Shopping cart** (persisted to `localStorage`) with quantity editing and a
  **Stripe Checkout** flow.
- **All inventory lives in a single JSON file** — `src/data/inventory.json`.
  Products are generated dynamically from it, so adding a product only requires
  editing that file.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stripe checkout

Checkout uses [Stripe Checkout](https://stripe.com/docs/payments/checkout). Set
your secret key before starting the server:

```bash
cp .env.local.example .env.local
# then edit .env.local and add your key
```

```
STRIPE_SECRET_KEY=sk_test_...
```

Without a key the app still runs; the checkout button returns a friendly
"Stripe is not configured" message instead of redirecting.

## Adding or editing products

Edit `src/data/inventory.json`. Each entry uses this schema:

```json
{
  "model": "AM930",
  "series": "RECON PRO",
  "discipline": "All Mountain",
  "rimSize": "29\"",
  "internalWidth": 30,
  "externalWidth": 36,
  "depth": 25,
  "price": 159,
  "stock": 15,
  "image": "/images/recon-pro.svg"
}
```

- `image` points to a file in `public/images/` (per-series rim graphics are
  provided, e.g. `recon.svg`, `recon-pro.svg`, `falcon.svg`, `falcon-pro.svg`,
  `drift.svg`, `helios.svg`).
- Product URLs, filter options, and hole-count options are derived
  automatically from the JSON — no code changes needed to add a rim.

> Specifications are drawn from Light Bicycle's published rim data and are
> provided here for demo/reference purposes.

## Project structure

```
src/
  app/
    page.tsx                 # Outlet inventory (hero + browser)
    product/[id]/page.tsx    # Product detail page
    cart/page.tsx            # Shopping cart + checkout
    checkout/success/page.tsx
    api/checkout/route.ts    # Stripe Checkout session
  components/                # Header, Footer, ProductCard, filters, etc.
  data/inventory.json        # Single source of truth for the catalog
  lib/products.ts            # Types + catalog helpers
  lib/cart.tsx               # Cart context (localStorage)
public/images/               # Per-series rim SVGs
```
