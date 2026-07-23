import type { FormEvent } from "react";
import type { VehicleFilterParams } from "../../api/types";
import { Filter, Search, SlidersHorizontal, ArrowUpDown, RotateCcw, X } from "lucide-react";

interface VehicleFiltersProps {
  filters: VehicleFilterParams;
  setFilters: (filters: VehicleFilterParams) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
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
  sortBy,
  setSortBy,
  mobileFilterOpen,
  setMobileFilterOpen,
  onSubmit,
  onReset,
}: VehicleFiltersProps) => {
  return (
    <div className="w-full space-y-4">
      {/* Desktop Horizontal Filter Bar */}
      <div className="hidden lg:block bg-white rounded-3xl p-5 border border-border shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2 text-dark font-bold text-base">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filter & Sort Vehicles</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint-soft border border-border text-xs font-semibold text-muted hover:text-dark hover:bg-mint transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-dark text-white font-semibold px-5 py-1.5 rounded-full hover:bg-dark-hover transition-colors shadow-sm text-xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-lime" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Horizontal Inputs Grid */}
          <div className="grid grid-cols-12 gap-3 items-end">
            {/* Make */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-dark uppercase tracking-wider mb-1">
                Make
              </label>
              <input
                type="text"
                value={filters.make || ""}
                onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                placeholder="e.g. Toyota"
                className="w-full px-3.5 py-2 rounded-xl bg-mint-soft border border-border text-xs font-medium text-dark focus:outline-none focus:ring-2 focus:ring-dark"
              />
            </div>

            {/* Model */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-dark uppercase tracking-wider mb-1">
                Model
              </label>
              <input
                type="text"
                value={filters.model || ""}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                placeholder="e.g. Camry"
                className="w-full px-3.5 py-2 rounded-xl bg-mint-soft border border-border text-xs font-medium text-dark focus:outline-none focus:ring-2 focus:ring-dark"
              />
            </div>

            {/* Category */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-dark uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={filters.categoryId || ""}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs font-medium text-dark focus:outline-none focus:ring-2 focus:ring-dark cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range (Min / Max) */}
            <div className="col-span-3">
              <label className="block text-[11px] font-bold text-dark uppercase tracking-wider mb-1">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="Min Price"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs font-medium text-dark focus:outline-none focus:ring-2 focus:ring-dark"
                />
                <input
                  type="number"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="Max Price"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs font-medium text-dark focus:outline-none focus:ring-2 focus:ring-dark"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="col-span-3">
              <label className="block text-[11px] font-bold text-dark uppercase tracking-wider mb-1 items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-emerald-700" />
                <span>Sort By</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-mint-soft border border-border text-xs font-semibold text-dark focus:outline-none focus:ring-2 focus:ring-dark cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="make-asc">Make: A - Z</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Collapsible Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden bg-white rounded-3xl p-6 border border-border shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-dark flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter & Sort Vehicles</span>
            </h2>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="text-slate-400 hover:text-dark cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dark uppercase mb-1">Make</label>
                <input
                  type="text"
                  value={filters.make || ""}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  placeholder="e.g. Toyota"
                  className="w-full px-3.5 py-2 rounded-xl bg-mint-soft border border-border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark uppercase mb-1">Model</label>
                <input
                  type="text"
                  value={filters.model || ""}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                  placeholder="e.g. Camry"
                  className="w-full px-3.5 py-2 rounded-xl bg-mint-soft border border-border text-xs"
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
                <label className="block text-[11px] font-bold text-dark uppercase mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="Min"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-dark uppercase mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="Max"
                  className="w-full px-3 py-2 rounded-xl bg-mint-soft border border-border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark uppercase mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-mint-soft border border-border text-xs font-semibold text-dark"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="make-asc">Make: A - Z</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-dark text-white font-semibold py-2.5 rounded-full text-xs shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={onReset}
                className="px-4 bg-mint text-dark font-semibold py-2.5 rounded-full text-xs border border-border cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
