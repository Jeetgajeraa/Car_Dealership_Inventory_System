import { Car, ShieldCheck, Zap, Sparkles } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl text-center space-y-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-10 rounded-2xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Vite + React + Tailwind CSS Stack Initialized</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
          Car Dealership Inventory System
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Frontend web client setup complete. Ready to connect to backend REST APIs for real-time inventory management, vehicle search, and purchases.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <Car className="w-6 h-6 text-indigo-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Vehicle Inventory</h3>
            <p className="text-sm text-slate-400 mt-1">Browse, search, and filter available cars with real-time stock levels.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="font-semibold text-slate-200">JWT Security & RBAC</h3>
            <p className="text-sm text-slate-400 mt-1">Role-based access for Customers and Dealership Admins.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <Zap className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Instant Purchase</h3>
            <p className="text-sm text-slate-400 mt-1">Atomic stock decrement and customer purchase history tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
