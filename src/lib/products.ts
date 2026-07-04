import inventory from "@/data/inventory.json";

export interface RawProduct {
  model: string;
  series: string;
  discipline: string;
  rimSize: string;
  internalWidth: number;
  externalWidth: number;
  depth: number;
  price: number;
  stock: number;
  image: string;
}

export interface Product extends RawProduct {
  /** URL-safe identifier derived from the model name. */
  id: string;
  /** Available spoke hole counts for this rim. */
  holeCounts: number[];
  /** Available carbon weave / finish options. */
  finishes: string[];
  /** Available decal colour options. */
  decalColors: string[];
}

export const FINISHES = [
  "UD Matte",
  "UD Glossy",
  "3K Matte",
  "3K Glossy",
  "12K Matte",
  "12K Glossy",
];

export const DECAL_COLORS = [
  "Stealth (No Decal)",
  "White",
  "Black",
  "Red",
  "Silver",
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function holeCountsFor(p: RawProduct): number[] {
  const discipline = p.discipline.toLowerCase();
  if (p.rimSize === "700C") return [24, 28];
  if (discipline.includes("fat") || discipline.includes("snow")) return [32];
  if (discipline.includes("downhill")) return [28, 32];
  if (discipline.includes("enduro") || discipline.includes("e-mtb")) return [28, 32];
  return [28, 32];
}

function decorate(raw: RawProduct): Product {
  return {
    ...raw,
    id: slugify(raw.model),
    holeCounts: holeCountsFor(raw),
    finishes: FINISHES,
    decalColors: DECAL_COLORS,
  };
}

const products: Product[] = (inventory as RawProduct[]).map(decorate);

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function stockStatus(stock: number): "in" | "low" | "out" {
  if (stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "in";
}

export function stockLabel(stock: number): string {
  const status = stockStatus(stock);
  if (status === "out") return "Out of stock";
  if (status === "low") return `Low stock (${stock})`;
  return `In stock (${stock})`;
}

/** Distinct, order-preserving list of a given field for building filters. */
export function distinct<K extends keyof RawProduct>(field: K): RawProduct[K][] {
  const seen = new Set<RawProduct[K]>();
  const out: RawProduct[K][] = [];
  for (const p of products) {
    if (!seen.has(p[field])) {
      seen.add(p[field]);
      out.push(p[field]);
    }
  }
  return out;
}
