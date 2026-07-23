import { useState, useEffect, useCallback, useMemo, type FormEvent } from "react";
import { vehiclesApi } from "../api/vehicles";
import type { Vehicle, VehicleFilterParams } from "../api/types";
import type { VehicleFormState } from "../components/vehicles/AdminVehicleModal";
import { useAuth } from "../context/AuthContext";

export const useVehicles = () => {
  const { user, isAdmin } = useAuth();
  const [rawVehicles, setRawVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters state aligned with backend searchVehicleSchema
  const [filters, setFilters] = useState<VehicleFilterParams>({
    make: "",
    model: "",
    categoryId: "",
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [sortBy, setSortBy] = useState<string>("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Purchase modal state
  const [selectedVehicleForPurchase, setSelectedVehicleForPurchase] = useState<Vehicle | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  // Admin create/edit modal state — price/quantity stored as strings to avoid leading-zero bug
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [adminForm, setAdminForm] = useState<VehicleFormState>({
    make: "",
    model: "",
    categoryId: "Sedan",
    price: "25000",
    quantity: "1",
    description: "",
  });
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // Restock modal state
  const [restockVehicle, setRestockVehicle] = useState<Vehicle | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [restocking, setRestocking] = useState(false);

  const fetchVehicles = useCallback(async (overrideFilters?: VehicleFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const targetFilters = overrideFilters || filters;
      const data = await vehiclesApi.searchVehicles(targetFilters);
      // Non-admins don't see their own vehicles in search (they use "My Vehicles" for that)
      const filtered = isAdmin
        ? data
        : data.filter((v) => v.createdById !== user?.id);
      setRawVehicles(filtered);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin, user?.id]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Apply client-side sorting
  const vehicles = useMemo(() => {
    const list = [...rawVehicles];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case "make-asc":
        return list.sort((a, b) => a.make.localeCompare(b.make));
      case "oldest":
        return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "newest":
      default:
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [rawVehicles, sortBy]);

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchVehicles();
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters: VehicleFilterParams = {
      make: "",
      model: "",
      categoryId: "",
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilters(emptyFilters);
    setSortBy("newest");
    fetchVehicles(emptyFilters);
    setMobileFilterOpen(false);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedVehicleForPurchase) return;
    setPurchasing(true);
    setError(null);
    try {
      await vehiclesApi.purchaseVehicle(
        selectedVehicleForPurchase.id,
        purchaseQuantity
      );
      setSuccessMsg(
        `Successfully purchased ${purchaseQuantity} x ${selectedVehicleForPurchase.make} ${selectedVehicleForPurchase.model}!`
      );
      setSelectedVehicleForPurchase(null);
      setPurchaseQuantity(1);
      fetchVehicles();
    } catch (err: any) {
      setError(err.response?.data?.message || "Purchase failed.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleOpenAdminModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setAdminForm({
        make: vehicle.make,
        model: vehicle.model,
        categoryId: vehicle.categoryId || "Sedan",
        price: String(vehicle.price),
        quantity: String(vehicle.quantity),
        description: vehicle.description || "",
      });
    } else {
      setEditingVehicle(null);
      setAdminForm({
        make: "",
        model: "",
        categoryId: "Sedan",
        price: "25000",
        quantity: "1",
        description: "",
      });
    }
    setAdminModalOpen(true);
  };

  const handleAdminFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAdminSubmitting(true);
    setError(null);
    try {
      // Convert string fields to numbers on submit
      const payload = {
        make: adminForm.make,
        model: adminForm.model,
        categoryId: adminForm.categoryId,
        price: Number(adminForm.price),
        quantity: Number(adminForm.quantity),
        description: adminForm.description,
      };

      if (editingVehicle) {
        await vehiclesApi.updateVehicle(editingVehicle.id, payload);
        setSuccessMsg(`Vehicle ${adminForm.make} ${adminForm.model} updated successfully!`);
      } else {
        await vehiclesApi.createVehicle(payload);
        setSuccessMsg(`Vehicle ${adminForm.make} ${adminForm.model} added to inventory!`);
      }
      setAdminModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await vehiclesApi.deleteVehicle(id);
      setSuccessMsg(`Vehicle deleted successfully.`);
      fetchVehicles();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const handleRestock = async () => {
    if (!restockVehicle) return;
    setRestocking(true);
    try {
      await vehiclesApi.restockVehicle(restockVehicle.id, restockQuantity);
      setSuccessMsg(`Restocked ${restockQuantity} units for ${restockVehicle.make} ${restockVehicle.model}.`);
      setRestockVehicle(null);
      setRestockQuantity(1);
      fetchVehicles();
    } catch (err: any) {
      setError(err.response?.data?.message || "Restock failed.");
    } finally {
      setRestocking(false);
    }
  };

  return {
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
    fetchVehicles,
    handleFilterSubmit,
    handleResetFilters,
    handleConfirmPurchase,
    handleOpenAdminModal,
    handleAdminFormSubmit,
    handleDeleteVehicle,
    handleRestock,
  };
};
