import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePurchases } from "../hooks/usePurchases";
import { PurchaseCard } from "../components/purchases/PurchaseCard";
import { PurchaseTable } from "../components/purchases/PurchaseTable";
import {
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Package,
} from "lucide-react";

export const PurchasesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { purchases, loading, error } = usePurchases(isAuthenticated);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-dark tracking-tight">
            My Purchased Vehicles
          </h1>
          <p className="text-sm text-muted">
            Track and review all your vehicle orders and transactions.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border">
          <RefreshCw className="w-8 h-8 text-dark animate-spin mb-3" />
          <p className="text-sm font-semibold text-muted">Fetching your purchase history...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-border text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-mint flex items-center justify-center text-dark font-bold">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-dark">No purchases found</h3>
            <p className="text-sm text-muted max-w-md">
              You haven't purchased any vehicles yet. Explore our catalog to find your dream car!
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-dark text-white hover:bg-dark-hover px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-all"
          >
            <span>Explore Vehicles</span>
            <ArrowUpRight className="w-4 h-4 text-lime" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mobile View: Stacked Cards (< 768px) */}
          <div className="md:hidden space-y-4">
            {purchases.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>

          {/* Desktop View: Table (>= 768px) */}
          <PurchaseTable purchases={purchases} />
        </div>
      )}
    </div>
  );
};
