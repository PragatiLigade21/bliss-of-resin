import { motion } from "framer-motion";

export const Card = ({
  children,
  className = "",
  variant = "default",
  hover = true,
  ...props
}) => {
  const variants = {
    default: "bg-white rounded-lg shadow-premium border border-gray-100",
    glass: "glass border-white/20",
    elevated: "bg-white rounded-xl shadow-hover border border-gray-200",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" } : {}}
      className={`${variants[variant]} p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
