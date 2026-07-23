import { useState } from "react";
import type { Vehicle } from "../../api/types";
import { VehicleDetailModal } from "./VehicleDetailModal";
import { Car, ShoppingBag, Edit2, Package, Trash2, Tag, Info } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onPurchase: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
  onDelete: (id: string, name: string) => void;
}

export const VehicleCard = ({
  vehicle,
  isAuthenticated,
  isAdmin,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
}: VehicleCardProps) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const isAvailable = vehicle.quantity > 0;

  const MAX_DESC_LENGTH = 65;
  const isLongDesc = (vehicle.description?.length || 0) > MAX_DESC_LENGTH;
  const truncatedDesc = isLongDesc
    ? `${vehicle.description?.slice(0, MAX_DESC_LENGTH).trim()}...`
    : vehicle.description;

  return (
    <>
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          {/* Card Header Illustration */}
          <div className="relative h-40 bg-linear-to-br from-mint to-mint-soft flex items-center justify-center overflow-hidden border-b border-border/40">
            <div className="flex flex-col items-center gap-2 text-dark/70 group-hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-dark">
                <Car className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {vehicle.make}
              </span>
            </div>

            {/* Stock Availability Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs ${
                  isAvailable
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                }`}
              >
                {isAvailable ? "In Stock" : "Sold Out"}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute bottom-3 right-3 bg-dark text-lime font-extrabold px-4 py-1.5 rounded-full text-base sm:text-lg shadow-md">
              ₹{Number(vehicle.price).toLocaleString()}
            </div>
          </div>

          {/* Content Details */}
          <div className="p-6 space-y-3.5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{vehicle.categoryId || "General"}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-dark group-hover:text-emerald-800 transition-colors font-heading">
                {vehicle.make} {vehicle.model}
              </h3>
            </div>

            {vehicle.description ? (
              <div className="text-sm text-slate-600 leading-relaxed">
                <span>{truncatedDesc}</span>
                {isLongDesc && (
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(true)}
                    className="ml-1.5 text-emerald-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 text-xs sm:text-sm"
                  >
                    <span>more</span>
                    <Info className="w-3.5 h-3.5 inline stroke-[2.5]" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No description provided.</p>
            )}

            {/* Quantity in Stock */}
            <div className="text-sm font-bold text-muted flex items-center justify-between pt-3 border-t border-border/40">
              <span>Quantity in Stock:</span>
              <span
                className={`font-extrabold text-base ${
                  isAvailable ? "text-dark" : "text-rose-600"
                }`}
              >
                {vehicle.quantity} {vehicle.quantity === 1 ? "unit" : "units"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 pt-0 space-y-2.5">
          {/* Purchase Button */}
          {isAuthenticated ? (
            <button
              disabled={!isAvailable}
              onClick={() => onPurchase(vehicle)}
              className="w-full flex items-center justify-center gap-2 bg-dark text-white font-bold py-3.5 rounded-full hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-lime" />
              <span>{isAvailable ? "Purchase Vehicle" : "Sold Out"}</span>
            </button>
          ) : (
            <p className="text-xs sm:text-sm text-center text-muted font-bold bg-mint-soft py-2.5 rounded-2xl border border-border">
              Sign in to purchase vehicle
            </p>
          )}

          {/* Admin Only: Edit, Restock, Delete */}
          {isAdmin && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <button
                onClick={() => onEdit(vehicle)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-dark text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Restock</span>
              </button>
              <button
                onClick={() => onDelete(vehicle.id, `${vehicle.make} ${vehicle.model}`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal for Full Car Info */}
      <VehicleDetailModal
        vehicle={vehicle}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onPurchase={onPurchase}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};
