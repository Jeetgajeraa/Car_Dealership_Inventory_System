import type { Vehicle } from "../../api/types";
import { ShoppingBag, X } from "lucide-react";

interface PurchaseModalProps {
  vehicle: Vehicle | null;
  quantity: number;
  setQuantity: (q: number) => void;
  purchasing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PurchaseModal = ({
  vehicle,
  quantity,
  setQuantity,
  purchasing,
  onClose,
  onConfirm,
}: PurchaseModalProps) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-lg font-bold text-dark flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>Confirm Purchase</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-dark cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 bg-mint-soft p-4 rounded-2xl border border-border">
          <div className="font-bold text-dark text-base">
            {vehicle.make} {vehicle.model}
          </div>
          <div className="text-xs text-muted space-y-1">
            <div>Category: <strong className="text-dark">{vehicle.categoryId || "General"}</strong></div>
            <div>Price per unit: <strong className="text-dark">₹{Number(vehicle.price).toLocaleString()}</strong></div>
            <div>Available Stock: <strong>{vehicle.quantity} units</strong></div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-dark uppercase mb-1.5">Quantity</label>
          <input
            type="number"
            min={1}
            max={vehicle.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(vehicle.quantity, Number(e.target.value))))}
            className="w-full px-4 py-2.5 rounded-2xl bg-white border border-border font-bold text-dark focus:outline-none focus:ring-2 focus:ring-dark"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs font-semibold text-muted">Total Price:</span>
          <span className="text-xl font-extrabold text-dark">
            ₹{(Number(vehicle.price) * quantity).toLocaleString()}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-dark hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={purchasing}
            onClick={onConfirm}
            className="flex-1 py-3 rounded-full bg-dark text-white font-semibold text-sm hover:bg-dark-hover disabled:opacity-50 transition-colors shadow-md cursor-pointer"
          >
            {purchasing ? "Processing..." : "Complete Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
