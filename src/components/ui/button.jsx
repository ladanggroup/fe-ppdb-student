import clsx from 'clsx';

export function Button({
  children,
  onClick,
  className = '',
  variant = 'default',
  ...props
}) {
  const baseStyle = clsx(
    'px-4 py-2 rounded-md font-medium transition duration-200',
    variant === 'outline'
      ? 'border border-orange-soft-500 text-orange-500 hover:bg-orange-soft-100'
      : 'bg-orange-soft-800 text-white hover:bg-orange-soft-700',
    className
  );

  return (
    <button onClick={onClick} className={baseStyle} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ to, children, className = '', ...props }) {
  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
}

export default Button;