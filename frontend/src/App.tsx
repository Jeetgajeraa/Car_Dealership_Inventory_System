import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchPage } from "./pages/SearchPage";
import { PurchasesPage } from "./pages/PurchasesPage";
import { MyVehiclesPage } from "./pages/MyVehiclesPage";
import { Search, ShieldCheck, Zap, Layers, ArrowUpRight } from "lucide-react";

function HomePage() {
  const { isAuthenticated } = useAuth();

  // If user is logged in, immediately show live vehicle inventory catalog
  if (isAuthenticated) {
    return <SearchPage />;
  }

  // If user is not logged in, show welcome landing page
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 sm:space-y-16">
      {/* Hero Banner for Visitors */}
      <div className="text-center space-y-6 pt-4 sm:pt-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border shadow-xs text-xs sm:text-sm font-semibold text-dark">
          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
          <span>Real-time Dealership Management</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold text-dark tracking-tight leading-tight">
          Your Complete Car Inventory,<br />
          <span className="text-emerald-700"> Simplified & Streamlined.</span>
        </h1>

        <p className="text-sm sm:text-lg text-muted max-w-2xl mx-auto font-normal leading-relaxed">
          Explore our live car inventory, filter by make, model, price, or specifications, and purchase vehicles seamlessly with instant order processing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-dark text-white hover:bg-dark-hover px-7 py-4 rounded-full font-semibold shadow-md transition-all hover:scale-105"
          >
            <span>Get Started & Create Account</span>
            <div className="w-6 h-6 rounded-full bg-lime text-dark flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-dark hover:bg-mint-soft px-7 py-4 rounded-full font-semibold border border-border shadow-xs transition-all"
          >
            <span>Sign In to Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-mint text-forest flex flex-col justify-between">
          <div>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/my-vehicles" element={<MyVehiclesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
          </div>

          <footer className="py-8 px-4 text-center text-xs text-muted border-t border-border/40 mt-12">
            © {new Date().getFullYear()} auto.dealership Inventory System. All rights reserved.
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
