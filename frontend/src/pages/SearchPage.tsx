import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../hooks/useVehicles";
import { VehicleFilters } from "../components/vehicles/VehicleFilters";
import { VehicleGrid } from "../components/vehicles/VehicleGrid";
import { PurchaseModal } from "../components/vehicles/PurchaseModal";
import { AdminVehicleModal } from "../components/vehicles/AdminVehicleModal";
import { RestockModal } from "../components/vehicles/RestockModal";
import { AdminStatsBanner } from "../components/vehicles/AdminStatsBanner";
import {
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
    sortBy,
    setSortBy,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex-1 inline-flex items-center justify-center gap-2 bg-mint text-dark border border-border px-4 py-3 rounded-full text-sm font-semibold cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters & Sort</span>
        </button>
      </div>

      {/* Admin Dashboard Stats Banner */}
      {isAdmin && <AdminStatsBanner />}

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

      {/* Horizontal Filter & Sort Bar */}
      <VehicleFilters
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        mobileFilterOpen={mobileFilterOpen}
        setMobileFilterOpen={setMobileFilterOpen}
        onSubmit={handleFilterSubmit}
        onReset={handleResetFilters}
      />

      {/* Vehicle Grid (Full width below horizontal filters) */}
      <main className="space-y-6">
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
