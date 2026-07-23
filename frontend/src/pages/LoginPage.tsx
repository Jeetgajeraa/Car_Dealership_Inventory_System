import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowUpRight, AlertCircle, Sparkles } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/search");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xl shadow-emerald-900/5 space-y-6 animate-in fade-in duration-300">
        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint text-dark text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
            Sign in
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Access dealership inventory, search vehicles, and place orders.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-mint-soft border border-border text-forest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dark focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-mint-soft border border-border text-forest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dark focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-dark text-white font-semibold py-3.5 px-6 rounded-full hover:bg-dark-hover transition-all duration-200 shadow-md shadow-emerald-950/10 disabled:opacity-50 mt-2 cursor-pointer text-sm"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            {!loading && (
              <div className="w-6 h-6 rounded-full bg-lime text-dark flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2 text-xs sm:text-sm text-muted">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-bold text-dark hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
