import { useEffect, useState } from "react";
import { vehiclesApi } from "../../api/vehicles";
import type { VehicleStats } from "../../api/types";
import {
  Car,
  Layers,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export const AdminStatsBanner = () => {
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehiclesApi.getVehicleStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrencyCompact = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} L`;
    }
    if (amount >= 10000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatNumberCompact = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (num >= 10000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center justify-center gap-3 text-muted">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" />
        <span className="text-sm font-semibold">Loading Admin Inventory Metrics...</span>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  return (
    <div className="bg-linear-to-br from-dark to-forest text-white rounded-3xl p-6 sm:p-8 border border-dark-hover shadow-lg space-y-5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs sm:text-sm uppercase font-extrabold text-lime tracking-widest block mb-1">
            Admin Inventory Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Dealership Analytics & Inventory Stats
          </h2>
        </div>
        <button
          onClick={fetchStats}
          title="Refresh Statistics"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lime cursor-pointer shrink-0"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Car Variety Count */}
        <div
          title={`${stats.totalVehicles.toLocaleString()} Unique Car Models`}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1.5 min-w-0"
        >
          <div className="flex items-center gap-2 text-lime text-xs sm:text-sm font-bold truncate">
            <Car className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="truncate">Car Varieties</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-heading truncate">
            {formatNumberCompact(stats.totalVehicles)}
          </p>
          <span className="text-xs text-mint/80 block font-medium truncate">Unique Models</span>
        </div>

        {/* Total Stock Units */}
        <div
          title={`${stats.totalUnits.toLocaleString()} Stock Units`}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1.5 min-w-0"
        >
          <div className="flex items-center gap-2 text-lime text-xs sm:text-sm font-bold truncate">
            <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="truncate">Total Units</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-heading truncate">
            {formatNumberCompact(stats.totalUnits)}
          </p>
          <span className="text-xs text-mint/80 block font-medium truncate">Units in Stock</span>
        </div>

        {/* Total Inventory Value */}
        <div
          title={`Exact Total Asset Value: ₹${stats.totalInventoryValue.toLocaleString()}`}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1.5 min-w-0"
        >
          <div className="flex items-center gap-2 text-lime text-xs sm:text-sm font-bold truncate">
            <IndianRupee className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="truncate">Inventory Value</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-heading truncate">
            {formatCurrencyCompact(stats.totalInventoryValue)}
          </p>
          <span className="text-xs text-mint/80 block font-medium truncate">Total Asset Value</span>
        </div>

        {/* Out of Stock Alert */}
        <div
          title={`${stats.outOfStockCount} Out of Stock Models`}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1.5 min-w-0"
        >
          <div className="flex items-center gap-2 text-rose-300 text-xs sm:text-sm font-bold truncate">
            <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="truncate">Out of Stock</span>
          </div>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading truncate ${stats.outOfStockCount > 0 ? 'text-rose-400' : 'text-white'}`}>
            {formatNumberCompact(stats.outOfStockCount)}
          </p>
          <span className="text-xs text-mint/80 block font-medium truncate">Requires Restock</span>
        </div>

        {/* Total Revenue */}
        <div
          title={`Exact Revenue: ₹${stats.totalRevenue.toLocaleString()} (${stats.totalPurchases} purchases)`}
          className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1.5 min-w-0"
        >
          <div className="flex items-center gap-2 text-lime text-xs sm:text-sm font-bold truncate">
            <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="truncate">Total Revenue</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-lime font-heading truncate">
            {formatCurrencyCompact(stats.totalRevenue)}
          </p>
          <span className="text-xs text-mint/80 block font-medium truncate">{stats.totalPurchases} Orders</span>
        </div>
      </div>
    </div>
  );
};
