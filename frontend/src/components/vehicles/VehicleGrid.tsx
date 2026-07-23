import type { Vehicle } from "../../api/types";
import { VehicleCard } from "./VehicleCard";
import { RefreshCw, Car } from "lucide-react";

interface VehicleGridProps {
  vehicles: Vehicle[];
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onResetFilters: () => void;
  onPurchase: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
  onDelete: (id: string, name: string) => void;
}

export const VehicleGrid = ({
  vehicles,
  loading,
  isAuthenticated,
  isAdmin,
  onResetFilters,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
}: VehicleGridProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border">
        <RefreshCw className="w-8 h-8 text-dark animate-spin mb-3" />
        <p className="text-sm font-semibold text-muted">Loading dealership inventory...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-border text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center text-dark font-bold">
          <Car className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-dark">No vehicles matched your search</h3>
        <p className="text-sm text-muted max-w-md">
          Try clearing or loosening your filters to discover available vehicles in stock.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-2 px-5 py-2.5 rounded-full bg-dark text-white text-xs font-semibold cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
