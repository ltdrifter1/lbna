"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { stockStatus } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  products: Product[];
  series: string[];
  disciplines: string[];
  rimSizes: string[];
}

const ALL = "All";

const STOCK_OPTIONS = [
  { value: ALL, label: "All" },
  { value: "in", label: "In stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none transition-colors focus:border-neutral-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function OutletBrowser({
  products,
  series,
  disciplines,
  rimSizes,
}: Props) {
  const [query, setQuery] = useState("");
  const [seriesFilter, setSeriesFilter] = useState(ALL);
  const [disciplineFilter, setDisciplineFilter] = useState(ALL);
  const [rimSizeFilter, setRimSizeFilter] = useState(ALL);
  const [stockFilter, setStockFilter] = useState(ALL);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (seriesFilter !== ALL && p.series !== seriesFilter) return false;
      if (disciplineFilter !== ALL && p.discipline !== disciplineFilter)
        return false;
      if (rimSizeFilter !== ALL && p.rimSize !== rimSizeFilter) return false;
      if (stockFilter !== ALL && stockStatus(p.stock) !== stockFilter)
        return false;
      if (q) {
        const haystack =
          `${p.model} ${p.series} ${p.discipline} ${p.rimSize}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [products, query, seriesFilter, disciplineFilter, rimSizeFilter, stockFilter]);

  const resetAll = () => {
    setQuery("");
    setSeriesFilter(ALL);
    setDisciplineFilter(ALL);
    setRimSizeFilter(ALL);
    setStockFilter(ALL);
  };

  const toOptions = (values: string[]) => [
    { value: ALL, label: "All" },
    ...values.map((v) => ({ value: v, label: v })),
  ];

  return (
    <section id="filters" className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by model, series or discipline (e.g. AM930, Falcon, Enduro)"
          className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select
          label="Series"
          value={seriesFilter}
          options={toOptions(series)}
          onChange={setSeriesFilter}
        />
        <Select
          label="Discipline"
          value={disciplineFilter}
          options={toOptions(disciplines)}
          onChange={setDisciplineFilter}
        />
        <Select
          label="Rim Size"
          value={rimSizeFilter}
          options={toOptions(rimSizes)}
          onChange={setRimSizeFilter}
        />
        <Select
          label="Stock Status"
          value={stockFilter}
          options={STOCK_OPTIONS}
          onChange={setStockFilter}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Showing <span className="font-semibold text-neutral-900">{filtered.length}</span>{" "}
          of {products.length} rims
        </p>
        <button
          type="button"
          onClick={resetAll}
          className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
        >
          Reset filters
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-600">No rims match your filters.</p>
          <button
            type="button"
            onClick={resetAll}
            className="mt-3 text-sm font-semibold text-neutral-900 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
