import { motion } from "framer-motion";

export const Spinner = ({ size = "md", color = "primary" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const colors = {
    primary: "border-primary",
    white: "border-white",
    secondary: "border-secondary",
  };

  return (
    <motion.div
      className={`${sizes[size]} ${colors[color]} border-4 border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default Spinner;
