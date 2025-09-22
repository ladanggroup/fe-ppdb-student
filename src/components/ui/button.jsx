import clsx from "clsx";

function Button({
  children,
  onClick,
  className = "",
  variant = "default",
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
    className
  );

  return (
    <button onClick={onClick} className={baseStyle} {...props}>
      {children}
    </button>
  );
}

function ButtonLink({ to, children, className = "", ...props }) {
  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
}

export {
  Button,
  ButtonLink
};
