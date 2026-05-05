import { motion } from "framer-motion";
import { ShoppingCart, FileText } from "lucide-react";
import Button from "./Button";

export const EmptyState = ({
  icon: Icon = ShoppingCart,
  title = "Nothing here",
  message = "Start shopping to add items",
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <Icon size={64} className="text-primary opacity-50" />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
