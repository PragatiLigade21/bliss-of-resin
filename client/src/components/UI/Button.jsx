import { motion } from "framer-motion";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-hover hover:scale-105",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-hover",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  const finalClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  }`;

  return (
    <motion.button
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={finalClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
