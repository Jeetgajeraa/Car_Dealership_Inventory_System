import type { Vehicle } from "../../api/types";
import { Car, X, Tag, ShoppingBag, CheckCircle, AlertTriangle } from "lucide-react";

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (vehicle: Vehicle) => void;
  isAuthenticated?: boolean;
}

export const VehicleDetailModal = ({
  vehicle,
  isOpen,
  onClose,
  onPurchase,
  isAuthenticated,
}: VehicleDetailModalProps) => {
  if (!isOpen || !vehicle) return null;

  const isAvailable = vehicle.quantity > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-border shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-dark text-lime flex items-center justify-center font-bold">
              <Car className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark leading-tight">
                {vehicle.make} {vehicle.model}
              </h3>
              <span className="text-xs text-muted font-medium">Vehicle Overview & Specs</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-dark cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Banner */}
        <div className="relative h-44 rounded-2xl bg-linear-to-br from-mint to-mint-soft flex items-center justify-center overflow-hidden border border-border/60 shadow-inner">
          <div className="flex flex-col items-center gap-2 text-dark/70">
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-dark">
              <Car className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {vehicle.make} Specifications
            </span>
          </div>

          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs inline-flex items-center gap-1 ${
                isAvailable ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}
            >
              {isAvailable ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>In Stock</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Sold Out</span>
                </>
              )}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-dark text-lime font-extrabold px-4 py-1.5 rounded-full text-base shadow-md">
            ₹{Number(vehicle.price).toLocaleString()}
          </div>
        </div>

        {/* Specs Table */}
        <div className="grid grid-cols-2 gap-3 bg-mint-soft p-4 rounded-2xl border border-border text-xs">
          <div>
            <span className="text-muted font-semibold block text-[10px] uppercase">Make</span>
            <span className="font-bold text-dark text-sm">{vehicle.make}</span>
          </div>

          <div>
            <span className="text-muted font-semibold block text-[10px] uppercase">Model</span>
            <span className="font-bold text-dark text-sm">{vehicle.model}</span>
          </div>

          <div>
            <span className="text-muted font-semibold block text-[10px] uppercase">Category</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
              <Tag className="w-3 h-3" />
              <span>{vehicle.categoryId || "General"}</span>
            </span>
          </div>

          <div>
            <span className="text-muted font-semibold block text-[10px] uppercase">Stock Available</span>
            <span className={`font-extrabold text-sm ${isAvailable ? "text-dark" : "text-rose-600"}`}>
              {vehicle.quantity} {vehicle.quantity === 1 ? "unit" : "units"}
            </span>
          </div>
        </div>

        {/* Full Description Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-dark uppercase tracking-wider">
            Full Description
          </h4>
          <div className="p-4 rounded-2xl bg-white border border-border text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
            {vehicle.description ? (
              <p className="whitespace-pre-wrap">{vehicle.description}</p>
            ) : (
              <p className="text-slate-400 italic">No description provided for this vehicle.</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-dark hover:bg-slate-50 transition-colors cursor-pointer text-center"
          >
            Close
          </button>

          {onPurchase && (
            <button
              type="button"
              disabled={!isAvailable || !isAuthenticated}
              onClick={() => {
                onClose();
                onPurchase(vehicle);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-dark text-white font-semibold py-3 rounded-full hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-lime" />
              <span>{isAvailable ? "Purchase Vehicle" : "Sold Out"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
