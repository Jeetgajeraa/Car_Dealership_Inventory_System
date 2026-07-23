import type { Purchase } from "../../api/types";
import { Car, Calendar, Package } from "lucide-react";

interface PurchaseCardProps {
  purchase: Purchase;
}

export const PurchaseCard = ({ purchase }: PurchaseCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-border shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-mint text-dark flex items-center justify-center font-bold">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-dark text-sm">
              {purchase.vehicle?.make} {purchase.vehicle?.model}
            </h4>
            <p className="text-[11px] text-muted">{purchase.vehicle?.categoryId || "General"}</p>
          </div>
        </div>

        <span className="text-xs font-extrabold bg-dark text-lime px-3 py-1 rounded-full">
          ₹{Number(purchase.totalPrice).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-1.5 bg-mint-soft px-3 py-2 rounded-xl border border-border/60">
          <Package className="w-3.5 h-3.5 text-muted" />
          <span>Qty: {purchase.quantity}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-mint-soft px-3 py-2 rounded-xl border border-border/60">
          <Calendar className="w-3.5 h-3.5 text-muted" />
          <span>{new Date(purchase.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-mono pt-1">
        Order ID: {purchase.id}
      </div>
    </div>
  );
};
