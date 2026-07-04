export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="text-base font-bold tracking-tight text-neutral-900">
              CarbonRim Outlet
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              In-stock carbon rims from our North American warehouse. Listed
              items usually ship within 2 business days.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="font-semibold text-neutral-900">Catalog</div>
              <ul className="mt-3 space-y-2 text-neutral-500">
                <li>MTB Rims</li>
                <li>Road &amp; Gravel Rims</li>
                <li>Fat Bike Rims</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-neutral-900">Support</div>
              <ul className="mt-3 space-y-2 text-neutral-500">
                <li>Shipping</li>
                <li>Warranty</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-6 text-xs text-neutral-400">
          © {new Date().getFullYear()} CarbonRim Outlet. Demo storefront —
          specifications for reference only.
        </div>
      </div>
    </footer>
  );
}
