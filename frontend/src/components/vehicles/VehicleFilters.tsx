import type { FormEvent } from "react";
import type { VehicleFilterParams } from "../../api/types";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

interface VehicleFiltersProps {
  filters: VehicleFilterParams;
  setFilters: (filters: VehicleFilterParams) => void;
  mobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
}

export const CATEGORIES = [
  "Sedan",
  "SUV",
  "Truck",
  "Coupe",
  "Electric",
  "Hybrid",
  "Convertible",
  "Luxury",
  "Sports",
  "Hatchback",
];

export const VehicleFilters = ({
  filters,
  setFilters,
  mobileFilterOpen,
  setMobileFilterOpen,
  onSubmit,
  onReset,
}: VehicleFiltersProps) => {
  return (
    <>
      {/* Desktop Filter Panel */}
      <aside className="hidden lg:block lg:col-span-1 bg-white rounded-3xl p-6 border border-border shadow-sm space-y-6 h-fit sticky top-24">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter Inventory</span>
          </h2>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted hover:text-dark font-semibold cursor-pointer underline"
          >
            Reset
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark uppercase mb-1">Make</label>
            <input
              type="text"
              value={filters.make || ""}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              placeholder="e.g. Toyota, BMW"
              className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm focus:outline-none focus:ring-2 focus:ring-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dark uppercase mb-1">Model</label>
            <input
              type="text"
              value={filters.model || ""}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              placeholder="e.g. Camry, M3"
              className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm focus:outline-none focus:ring-2 focus:ring-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dark uppercase mb-1">Category</label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs focus:outline-none focus:ring-2 focus:ring-dark"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-dark uppercase mb-1">Min Price ($)</label>
              <input
                type="number"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="Min"
                className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm focus:outline-none focus:ring-2 focus:ring-dark"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-dark uppercase mb-1">Max Price ($)</label>
              <input
                type="number"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="Max"
                className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm focus:outline-none focus:ring-2 focus:ring-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-dark text-white font-semibold py-2.5 rounded-full hover:bg-dark-hover transition-colors shadow-sm cursor-pointer text-sm mt-2"
          >
            <Search className="w-4 h-4 text-lime" />
            <span>Apply Filters</span>
          </button>
        </form>
      </aside>

      {/* Mobile Collapsible Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden bg-white rounded-3xl p-6 border border-border shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-dark flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Vehicles</span>
            </h2>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="text-slate-400 hover:text-dark cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dark uppercase mb-1">Make</label>
                <input
                  type="text"
                  value={filters.make || ""}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  placeholder="e.g. Toyota"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark uppercase mb-1">Model</label>
                <input
                  type="text"
                  value={filters.model || ""}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                  placeholder="e.g. Camry"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark uppercase mb-1">Category</label>
              <select
                value={filters.categoryId || ""}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-dark uppercase mb-1">Min Price ($)</label>
                <input
                  type="number"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-dark uppercase mb-1">Max Price ($)</label>
                <input
                  type="number"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="100000"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-dark text-white font-semibold py-2.5 rounded-full text-sm shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={onReset}
                className="px-4 bg-mint text-dark font-semibold py-2.5 rounded-full text-sm border border-border cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
