import type { Vehicle } from "../../api/types";
import { Package, X } from "lucide-react";

interface RestockModalProps {
  vehicle: Vehicle | null;
  quantity: number;
  setQuantity: (q: number) => void;
  restocking: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RestockModal = ({
  vehicle,
  quantity,
  setQuantity,
  restocking,
  onClose,
  onConfirm,
}: RestockModalProps) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-dark flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Restock Inventory</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-dark cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted">
          Add additional inventory stock for <strong>{vehicle.make} {vehicle.model}</strong>.
        </p>

        <div>
          <label className="block text-xs font-bold uppercase text-dark mb-1">Additional Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-2.5 rounded-2xl bg-mint-soft border border-border text-dark font-bold"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-border text-xs font-semibold text-dark cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={restocking}
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-dark text-white text-xs font-semibold hover:bg-dark-hover cursor-pointer"
          >
            {restocking ? "Updating..." : "Add Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};
