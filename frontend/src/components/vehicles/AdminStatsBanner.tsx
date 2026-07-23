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
    <div className="bg-linear-to-br from-dark to-forest text-white rounded-3xl p-6 sm:p-8 border border-dark-hover shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs uppercase font-bold text-lime tracking-widest block mb-1">
            Admin Inventory Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
            Dealership Analytics & Inventory Stats
          </h2>
        </div>
        <button
          onClick={fetchStats}
          title="Refresh Statistics"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lime cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Car Variety Count */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-lime text-xs font-semibold">
            <Car className="w-4 h-4" />
            <span>Car Varieties</span>
          </div>
          <p className="text-2xl font-extrabold tracking-tight text-white">
            {stats.totalVehicles}
          </p>
          <span className="text-[10px] text-mint/70 block">Unique Car Models</span>
        </div>

        {/* Total Stock Units */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-lime text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Total Units</span>
          </div>
          <p className="text-2xl font-extrabold tracking-tight text-white">
            {stats.totalUnits}
          </p>
          <span className="text-[10px] text-mint/70 block">Units in Stock</span>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-lime text-xs font-semibold">
            <IndianRupee className="w-4 h-4" />
            <span>Inventory Value</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            ₹{stats.totalInventoryValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-mint/70 block">Total Asset Value</span>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Out of Stock</span>
          </div>
          <p className={`text-2xl font-extrabold tracking-tight ${stats.outOfStockCount > 0 ? 'text-rose-400' : 'text-white'}`}>
            {stats.outOfStockCount}
          </p>
          <span className="text-[10px] text-mint/70 block">Requires Restock</span>
        </div>

        {/* Total Revenue */}
        <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-lime text-xs font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Total Revenue</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-lime">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-mint/70 block">{stats.totalPurchases} Completed Purchases</span>
        </div>
      </div>
    </div>
  );
};
