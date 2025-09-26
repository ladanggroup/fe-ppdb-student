import clsx from "clsx";
import { Link } from "react-router";

function Button({
  children,
  onClick,
  className = "",
  variant = "default",
  disabled = false,
  ...props
}) {
  const baseStyle = clsx(
    "px-4 py-2 rounded-md font-medium transition duration-200",
    {
      primary: "border border-orange-500 text-orange-500 hover:bg-orange-100",
      secondary: "bg-sky-400 text-white hover:bg-sky-500",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      default: "bg-orange-soft-800 text-white hover:bg-orange-soft-700",
    }[variant],
    disabled && "opacity-50 cursor-not-allowed", // tambahkan style disable
    className
  );

  return (
    <button
      onClick={onClick}
      className={baseStyle}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

function ButtonLink({ to, children, className = "", variant = "primary", ...props }) {
  const baseStyle = clsx(
    "px-4 py-2 rounded-md font-medium transition duration-200 inline-block",
    {
      primary: "border border-orange-500 text-orange-500 hover:bg-orange-100",
      secondary: "bg-sky-400 text-white hover:bg-sky-500",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      default: "bg-orange-soft-800 text-white hover:bg-orange-soft-700",
    }[variant],
    className
  );

  return (
    <Link to={to} className={baseStyle} {...props}>
      {children}
    </Link>
  );
}

export { Button, ButtonLink };
