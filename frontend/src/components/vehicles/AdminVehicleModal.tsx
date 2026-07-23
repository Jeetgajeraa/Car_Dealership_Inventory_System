import type { FormEvent } from "react";
import type { Vehicle } from "../../api/types";
import { CATEGORIES } from "./VehicleFilters";
import { Car, X, Lock } from "lucide-react";

export interface VehicleFormState {
  make: string;
  model: string;
  categoryId: string;
  price: string;
  quantity: string;
  description?: string;
}

interface AdminVehicleModalProps {
  isOpen: boolean;
  editingVehicle: Vehicle | null;
  form: VehicleFormState;
  setForm: (form: VehicleFormState) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export const AdminVehicleModal = ({
  isOpen,
  editingVehicle,
  form,
  setForm,
  submitting,
  onClose,
  onSubmit,
}: AdminVehicleModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-border shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-lg font-bold text-dark flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-600" />
            <span>{editingVehicle ? "Edit Vehicle Details" : "Add Vehicle to Inventory"}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-dark cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-dark mb-1">Make *</label>
              <input
                type="text"
                required
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="e.g. Toyota"
                className="w-full px-3.5 py-2.5 rounded-xl bg-mint-soft border border-border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-dark mb-1">Model *</label>
              <input
                type="text"
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="e.g. Corolla"
                className="w-full px-3.5 py-2.5 rounded-xl bg-mint-soft border border-border text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1">Category *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-mint-soft border border-border text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-dark mb-1">Price (₹) *</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={form.price}
                onChange={(e) => {
                  const raw = e.target.value.replace(/^0+(?=\d)/, "");
                  if (raw === "" || /^\d+$/.test(raw)) {
                    setForm({ ...form, price: raw });
                  }
                }}
                placeholder="e.g. 25000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-mint-soft border border-border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-dark mb-1">
                Quantity *
                {editingVehicle && (
                  <span className="ml-1 text-muted normal-case font-normal">(only admin can restoke)</span>
                )}
              </label>
              {editingVehicle ? (
                <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-border text-sm text-muted flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>{form.quantity} units</span>
                </div>
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={form.quantity}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/^0+(?=\d)/, "");
                    if (raw === "" || /^\d+$/.test(raw)) {
                      setForm({ ...form, quantity: raw });
                    }
                  }}
                  placeholder="e.g. 5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-mint-soft border border-border text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-dark mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Vehicle condition, specs, or background details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-mint-soft border border-border text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-dark hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-dark text-white font-semibold text-sm hover:bg-dark-hover disabled:opacity-50 transition-colors shadow-md cursor-pointer"
            >
              {submitting ? "Saving..." : editingVehicle ? "Save Changes" : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
