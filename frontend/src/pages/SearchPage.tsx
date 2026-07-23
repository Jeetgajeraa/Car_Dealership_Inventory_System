import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../hooks/useVehicles";
import { VehicleFilters } from "../components/vehicles/VehicleFilters";
import { VehicleGrid } from "../components/vehicles/VehicleGrid";
import { PurchaseModal } from "../components/vehicles/PurchaseModal";
import { AdminVehicleModal } from "../components/vehicles/AdminVehicleModal";
import { RestockModal } from "../components/vehicles/RestockModal";
import {
  Sparkles,
  Plus,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const SearchPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const {
    vehicles,
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    filters,
    setFilters,
    mobileFilterOpen,
    setMobileFilterOpen,
    selectedVehicleForPurchase,
    setSelectedVehicleForPurchase,
    purchaseQuantity,
    setPurchaseQuantity,
    purchasing,
    adminModalOpen,
    setAdminModalOpen,
    editingVehicle,
    adminForm,
    setAdminForm,
    adminSubmitting,
    restockVehicle,
    setRestockVehicle,
    restockQuantity,
    setRestockQuantity,
    restocking,
    handleFilterSubmit,
    handleResetFilters,
    handleConfirmPurchase,
    handleOpenAdminModal,
    handleAdminFormSubmit,
    handleDeleteVehicle,
    handleRestock,
  } = useVehicles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-dark text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Dealership Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Vehicle Catalog & Inventory
          </h1>
          <p className="text-sm text-muted">
            Search, filter specs, and purchase vehicles directly from live inventory stock.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isAuthenticated && (
            <button
              onClick={() => handleOpenAdminModal()}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-dark text-white hover:bg-dark-hover px-5 py-3 rounded-full text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-lime" />
              <span>Add New Vehicle</span>
            </button>
          )}

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex-1 inline-flex items-center justify-center gap-2 bg-mint text-dark border border-border px-4 py-3 rounded-full text-sm font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
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

      {/* Error Notification */}
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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <VehicleFilters
          filters={filters}
          setFilters={setFilters}
          mobileFilterOpen={mobileFilterOpen}
          setMobileFilterOpen={setMobileFilterOpen}
          onSubmit={handleFilterSubmit}
          onReset={handleResetFilters}
        />

        <main className="lg:col-span-3 space-y-6">
          <VehicleGrid
            vehicles={vehicles}
            loading={loading}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            onResetFilters={handleResetFilters}
            onPurchase={(v) => {
              setSelectedVehicleForPurchase(v);
              setPurchaseQuantity(1);
            }}
            onEdit={(v) => handleOpenAdminModal(v)}
            onRestock={(v) => {
              setRestockVehicle(v);
              setRestockQuantity(1);
            }}
            onDelete={handleDeleteVehicle}
          />
        </main>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        vehicle={selectedVehicleForPurchase}
        quantity={purchaseQuantity}
        setQuantity={setPurchaseQuantity}
        purchasing={purchasing}
        onClose={() => setSelectedVehicleForPurchase(null)}
        onConfirm={handleConfirmPurchase}
      />

      {/* Create / Edit Vehicle Modal */}
      <AdminVehicleModal
        isOpen={adminModalOpen}
        editingVehicle={editingVehicle}
        form={adminForm}
        setForm={setAdminForm}
        submitting={adminSubmitting}
        isAdmin={isAdmin}
        onClose={() => setAdminModalOpen(false)}
        onSubmit={handleAdminFormSubmit}
      />

      {/* Restock Modal */}
      <RestockModal
        vehicle={restockVehicle}
        quantity={restockQuantity}
        setQuantity={setRestockQuantity}
        restocking={restocking}
        onClose={() => setRestockVehicle(null)}
        onConfirm={handleRestock}
      />
    </div>
  );
};
