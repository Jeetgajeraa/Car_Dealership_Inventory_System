import { useState, useEffect, type FormEvent } from "react";
import { vehiclesApi } from "../api/vehicles";
import type { Vehicle } from "../api/types";
import type { VehicleFormState } from "../components/vehicles/AdminVehicleModal";
import { AdminVehicleModal } from "../components/vehicles/AdminVehicleModal";
import { useAuth } from "../context/AuthContext";
import {
  Car,
  Edit2,
  Tag,
  CheckCircle,
  AlertCircle,
  Inbox,
  Loader2,
} from "lucide-react";

export const MyVehiclesPage = () => {
  const { user, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<VehicleFormState>({
    make: "",
    model: "",
    categoryId: "Sedan",
    price: "25000",
    quantity: "1",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMyVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehiclesApi.getMyVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load your vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const handleOpenEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      categoryId: vehicle.categoryId || "Sedan",
      price: String(vehicle.price),
      quantity: String(vehicle.quantity),
      description: vehicle.description || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setSubmitting(true);
    setError(null);
    try {
      await vehiclesApi.updateVehicle(editingVehicle.id, {
        make: form.make,
        model: form.model,
        categoryId: form.categoryId,
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description,
      });
      setSuccessMsg(`${form.make} ${form.model} updated successfully!`);
      setModalOpen(false);
      fetchMyVehicles();
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-dark text-xs font-semibold">
              <Car className="w-3.5 h-3.5" />
              <span>My Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-dark tracking-tight">
              My Vehicles
            </h1>
            <p className="text-sm text-muted">
              Vehicles you've added to the dealership inventory. Only you and admins can edit these.
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-sm font-medium">Loading your vehicles...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && vehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-mint flex items-center justify-center">
            <Inbox className="w-10 h-10 text-emerald-700" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-dark">No vehicles yet</h2>
            <p className="text-sm text-muted max-w-sm">
              You haven't added any vehicles to the inventory yet. Head to the{" "}
              <a href="/search" className="text-emerald-700 font-semibold hover:underline">
                Search Inventory
              </a>{" "}
              page and click "Add New Vehicle".
            </p>
          </div>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && vehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const isAvailable = vehicle.quantity > 0;
            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Card Illustration */}
                <div className="relative h-40 bg-gradient-to-br from-mint to-mint-soft flex items-center justify-center overflow-hidden border-b border-border/40">
                  <div className="flex flex-col items-center gap-2 text-dark/70 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-dark">
                      <Car className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      {vehicle.make}
                    </span>
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                        isAvailable ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      }`}
                    >
                      {isAvailable ? "In Stock" : "Sold Out"}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3 bg-dark text-lime font-extrabold px-3 py-1 rounded-full text-sm shadow-md">
                    ₹{Number(vehicle.price).toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1">
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                      <Tag className="w-3 h-3" />
                      <span>{vehicle.categoryId || "General"}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-dark group-hover:text-emerald-800 transition-colors">
                      {vehicle.make} {vehicle.model}
                    </h3>
                  </div>

                  {vehicle.description ? (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {vehicle.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No description provided.</p>
                  )}

                  <div className="text-xs font-semibold text-muted flex items-center justify-between pt-2 border-t border-border/40">
                    <span>Quantity in Stock:</span>
                    <span className={`font-extrabold text-sm ${isAvailable ? "text-dark" : "text-rose-600"}`}>
                      {vehicle.quantity} {vehicle.quantity === 1 ? "unit" : "units"}
                    </span>
                  </div>
                </div>

                {/* Edit Footer */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleOpenEdit(vehicle)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-dark text-white text-sm font-semibold hover:bg-dark-hover transition-colors shadow-sm cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 text-lime" />
                    <span>Edit Vehicle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <AdminVehicleModal
        isOpen={modalOpen}
        editingVehicle={editingVehicle}
        form={form}
        setForm={setForm}
        submitting={submitting}
        isAdmin={isAdmin}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
