export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full font-semibold ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
