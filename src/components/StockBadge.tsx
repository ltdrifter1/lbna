import { stockLabel, stockStatus } from "@/lib/products";

const STYLES: Record<string, string> = {
  in: "bg-green-50 text-green-700 ring-green-600/20",
  low: "bg-amber-50 text-amber-700 ring-amber-600/20",
  out: "bg-neutral-100 text-neutral-500 ring-neutral-500/20",
};

export function StockBadge({ stock }: { stock: number }) {
  const status = stockStatus(stock);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "in"
            ? "bg-green-600"
            : status === "low"
              ? "bg-amber-500"
              : "bg-neutral-400"
        }`}
      />
      {stockLabel(stock)}
    </span>
  );
}
