import { useState, useEffect, useCallback } from "react";
import { purchasesApi } from "../api/purchases";
import type { Purchase } from "../api/types";

export const usePurchases = (isAuthenticated: boolean) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await purchasesApi.getUserPurchases();
      setPurchases(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load purchase history.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return { purchases, loading, error, setError, refetchPurchases: fetchPurchases };
};
