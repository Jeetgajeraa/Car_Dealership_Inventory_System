import { useState } from "react";
import { Link as RouterLink, useNavigate as useNav, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Car,
  LogOut,
  User as UserIcon,
  Shield,
  ArrowUpRight,
  Menu,
  X,
  Search,
  ShoppingBag,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNav();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto">
      <nav className="bg-white/95 backdrop-blur-md border border-border rounded-3xl sm:rounded-full px-4 sm:px-6 py-3 shadow-md transition-all">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <RouterLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-dark flex items-center justify-center text-lime font-bold transition-transform group-hover:scale-105 shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-dark">
              auto<span className="text-dark-hover font-normal">.dealership</span>
            </span>
          </RouterLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 font-medium text-sm text-muted">
            { isAuthenticated && (
              <RouterLink
                to="/search"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isActive("/search")
                    ? "bg-mint text-dark font-bold"
                    : "hover:text-dark hover:bg-mint/50"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search Inventory</span>
              </RouterLink>
            )}

            {isAuthenticated && (
              <RouterLink
                to="/purchases"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isActive("/purchases")
                    ? "bg-mint text-dark font-bold"
                    : "hover:text-dark hover:bg-mint/50"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Purchases</span>
              </RouterLink>
            )}

            {isAuthenticated && (
              <RouterLink
                to="/my-vehicles"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isActive("/my-vehicles")
                    ? "bg-mint text-dark font-bold"
                    : "hover:text-dark hover:bg-mint/50"
                }`}
              >
                <Car className="w-4 h-4" />
                <span>My Vehicles</span>
              </RouterLink>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint text-xs font-semibold text-dark border border-border">
                  {isAdmin ? (
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>{user?.name}</span>
                  <span className="bg-dark text-lime px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-dark bg-emerald-50 hover:bg-emerald-100 border border-border/80 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <RouterLink
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-dark hover:text-emerald-800 transition-colors"
                >
                  Sign In
                </RouterLink>

                <RouterLink
                  to="/register"
                  className="inline-flex items-center gap-1.5 bg-dark text-white hover:bg-dark-hover px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all hover:scale-[1.02]"
                >
                  <span>Create Account</span>
                  <div className="w-5 h-5 rounded-full bg-lime text-dark flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </RouterLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-full text-dark hover:bg-mint transition-colors cursor-pointer border border-border/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-border/60 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <RouterLink
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                isActive("/search")
                  ? "bg-dark text-white"
                  : "text-forest hover:bg-mint"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search Inventory</span>
            </RouterLink>

            {isAuthenticated && (
              <RouterLink
                to="/purchases"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive("/purchases")
                    ? "bg-dark text-white"
                    : "text-forest hover:bg-mint"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Purchases</span>
              </RouterLink>
            )}

            {isAuthenticated && (
              <RouterLink
                to="/my-vehicles"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive("/my-vehicles")
                    ? "bg-dark text-white"
                    : "text-forest hover:bg-mint"
                }`}
              >
                <Car className="w-4 h-4" />
                <span>My Vehicles</span>
              </RouterLink>
            )}

            <div className="pt-2 border-t border-border/40">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-mint text-xs font-semibold text-dark">
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <Shield className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-emerald-700" />
                      )}
                      <span>{user?.name}</span>
                    </div>
                    <span className="bg-dark text-lime px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
                      {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <RouterLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-2xl text-sm font-semibold text-dark bg-mint hover:bg-mint-soft transition-colors border border-border"
                  >
                    Sign In
                  </RouterLink>
                  <RouterLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1 bg-dark text-white hover:bg-dark-hover px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    <span>Register</span>
                    <ArrowUpRight className="w-4 h-4 text-lime" />
                  </RouterLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
