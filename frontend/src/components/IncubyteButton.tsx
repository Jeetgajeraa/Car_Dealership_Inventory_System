import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";

interface IncubyteButtonProps {
  to?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "dark" | "light";
}

export const IncubyteButton = ({
  to,
  onClick,
  children,
  className = "",
  variant = "dark",
}: IncubyteButtonProps) => {
  const isDark = variant === "dark";

  const buttonInner = (
    <div
      className={`group relative inline-flex items-center p-1 rounded-full border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
        isDark ? "bg-white border-border" : "bg-dark border-dark-hover"
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {/* Left Circle Slot (Expands smoothly from 0 width on hover) */}
        <div className="w-0 opacity-0 group-hover:w-7 sm:group-hover:w-8 group-hover:opacity-100 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center shrink-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 scale-75 group-hover:scale-100 ${
              isDark ? "bg-dark text-lime" : "bg-lime text-dark"
            }`}
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Text Label Pill (Always centered, never overlapped) */}
        <span
          className={`px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${
            isDark
              ? "bg-dark text-white group-hover:bg-dark-hover"
              : "bg-mint text-dark group-hover:bg-white"
          }`}
        >
          {children}
        </span>

        {/* Right Circle Slot (Shrinks smoothly to 0 width on hover) */}
        <div className="w-7 sm:w-8 opacity-100 group-hover:w-0 group-hover:opacity-0 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center shrink-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 scale-100 group-hover:scale-75 ${
              isDark ? "bg-lime text-dark" : "bg-dark text-lime"
            }`}
          >
            <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block">
        {buttonInner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" className="inline-block cursor-pointer">
      {buttonInner}
    </button>
  );
};