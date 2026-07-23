import type { Purchase } from "../../api/types";
import { Car } from "lucide-react";

interface PurchaseTableProps {
  purchases: Purchase[];
}

export const PurchaseTable = ({ purchases }: PurchaseTableProps) => {
  return (
    <div className="hidden md:block bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-mint-soft border-b border-border text-xs uppercase font-bold text-dark">
            <th className="py-4 px-6">Vehicle</th>
            <th className="py-4 px-6">Category</th>
            <th className="py-4 px-6">Quantity</th>
            <th className="py-4 px-6">Total Price</th>
            <th className="py-4 px-6">Date</th>
            <th className="py-4 px-6 text-right">Order Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 font-medium text-forest">
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="hover:bg-mint/30 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-mint text-dark flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-dark">
                      {purchase.vehicle?.make} {purchase.vehicle?.model}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {purchase.vehicle?.categoryId || "General"}
                </span>
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-mint-soft text-dark text-xs font-semibold border border-border">
                  {purchase.quantity} units
                </span>
              </td>
              <td className="py-4 px-6">
                <span className="font-extrabold text-dark text-base">
                  ₹{Number(purchase.totalPrice).toLocaleString()}
                </span>
              </td>
              <td className="py-4 px-6 text-xs text-slate-600">
                {new Date(purchase.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-4 px-6 text-right font-mono text-xs text-slate-400">
                {purchase.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
